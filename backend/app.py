from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from youtube_transcript_api import YouTubeTranscriptApi
import re
import os
from dotenv import load_dotenv
import sqlite3
from datetime import datetime

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["https://blogaiback.vercel.app"]}})


# Database setup
def get_db_connection():
    conn = sqlite3.connect('/tmp/ip_tracking.db')
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    # Ensure the table exists
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS ip_tracking (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ip_address TEXT NOT NULL,
            conversion_count INTEGER DEFAULT 0,
            last_conversion_date TEXT NOT NULL
        )
    ''')
    conn.commit()

    return conn


# Middleware to get user's IP
def get_user_ip():
    if request.environ.get('HTTP_X_FORWARDED_FOR') is None:
        return request.environ['REMOTE_ADDR']
    else:
        return request.environ['HTTP_X_FORWARDED_FOR']

# Check conversion limits for a given IP
def check_conversion_limit(ip):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Get today's date
    today = datetime.now().date()
    
    # Check if the IP exists in the database
    cursor.execute("SELECT * FROM `ip_tracking` WHERE ip_address = ?", (ip,))
    row = cursor.fetchone()
    
    if row:
        conversion_count = row["conversion_count"]
        last_conversion_date = datetime.strptime(row["last_conversion_date"], "%Y-%m-%d").date()
        
        # Reset the count if the last conversion was on a previous day
        if last_conversion_date < today:
            cursor.execute("UPDATE ip_tracking SET conversion_count = 0, last_conversion_date = ? WHERE ip_address = ?", (today, ip))
            conn.commit()
            conversion_count = 0
        
        # If conversions exceed the limit, return False
        if conversion_count >= 5:
            conn.close()
            return False, 0  # No remaining conversions
        
        remaining = 5 - conversion_count
        conn.close()
        return True, remaining
    
    else:
        # If IP doesn't exist, insert a new record
        cursor.execute("INSERT INTO ip_tracking (ip_address, conversion_count, last_conversion_date) VALUES (?, 0, ?)", (ip, today))
        conn.commit()
        conn.close()
        return True, 5  # Initially, all 5 conversions are available

# Update conversion count for an IP
def increment_conversion_count(ip):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE ip_tracking SET conversion_count = conversion_count + 1 WHERE ip_address = ?", (ip,))
    conn.commit()

# Set your Gemini API key
genai.configure(api_key=os.environ["GEMINI_API_KEY"])

# Helper function to extract video ID from YouTube URL
def extract_video_id(url):
    video_id_match = re.search(r"(?:v=|\/)([0-9A-Za-z_-]{11}).*", url)
    return video_id_match.group(1) if video_id_match else None

# Function to fetch subtitles from YouTube
def fetch_youtube_subtitles(video_id):
    try:
        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        subtitles = " ".join([entry['text'] for entry in transcript])
        return subtitles
    except Exception as e:
        print(f"Error fetching subtitles: {e}")
        return None
def fetch_gen_subtitles(video_id):
    try:
        transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
        transcript = transcript_list.find_generated_transcript(['en'])
        subtitles = " ".join([entry['text'] for entry in transcript])
        return subtitles
    except Exception as e:
        print(f"Error fetching subtitles: {e}")
        return None

# Set generation configuration for Gemini API
generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
}

model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config=generation_config,
)

@app.route('/generate_blog', methods=['POST'])
def generate_blog():
    ip = get_user_ip()
    
    # Check the conversion limit for this IP
    is_allowed, remaining_conversions = check_conversion_limit(ip)
    
    if not is_allowed:
        return jsonify({'error': 'Daily limit of 5 conversions reached.', 'remaining': 0}), 429

    data = request.json
    video_url = data.get('video_url')
    
    # Extract the video ID from the URL
    video_id = extract_video_id(video_url)
    if not video_id:
        return jsonify({'error': 'Invalid YouTube URL'}), 400
    
    # Fetch subtitles for the given video ID
    transcription = fetch_youtube_subtitles(video_id)
    if not transcription:
        transcription = fetch_gen_subtitles(video_id)
    elif not transcription:
        return jsonify({'error': 'Could not fetch subtitles'}), 500

    # Extra prompt to make the blog more SEO-friendly
    seo_prompt = (
        '''Create an SEO-Optimized Blog Post from YouTube Video Content
        Using the provided YouTube video transcription, 
        generate a compelling, SEO-friendly blog post. 
        Structure the content with clear headings and subheadings, 
        include a meta description (150-160 characters) with relevant long tail keywords, and ensure the multiple use of focus keywords throughout. 
        The content should be engaging, informative, and adhere to best SEO practices, including readability, and proper grammar. 
        Make sure the final post is unique and matches the video’s tone, make the total words are atleast 1000.'''
        "Transcription: \n\n"
        f"{transcription}"
    )

    # Generate blog content using Google Gemini API
    chat_session = model.start_chat(history=[])
    response = chat_session.send_message(seo_prompt)

    blog_content = response.text
    # Increment the conversion count for the user's IP
    increment_conversion_count(ip)

    return jsonify({'blog_content': blog_content, 'remaining': remaining_conversions - 1})

if __name__ == '__main__':
    app.run(debug=True)
