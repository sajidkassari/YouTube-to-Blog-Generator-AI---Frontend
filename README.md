# YouTube to Blog Generator Using AI

Welcome to the YouTube to Blog Generator AI project, a comprehensive solution for converting YouTube video content into SEO-friendly blog posts. This project is divided into two main components: the **backend** and the **frontend**. 

## Overview

- **Backend**: Handles API requests for converting YouTube video subtitles into blog posts using the Google Gemini API and YouTube Transcript API. 
- **Frontend**: A single-page application that provides a user interface for inputting YouTube video URLs, choosing options, and displaying the generated blog posts.

## Features

### Backend

- Accepts YouTube video URLs
- Fetches subtitles using YouTube Transcript API
- Generates blog posts with Google Gemini API
- Limits to 5 conversions per unique IP per day

### Frontend

- Input YouTube video URLs
- Choose between subtitle extraction and other options
- Generate blog posts with SEO optimization
- Display the generated blog post

## Technologies Used

### Backend

- Flask
- SQLite for IP tracking and conversion limits
- Google Gemini API
- YouTube Transcript API
- Vercel for deployment

### Frontend

- React.js
- Tailwind CSS
- Vercel for deployment

## Setup

1. **Clone the Repository**

   ```bash
   git clone https://github.com/sajidkassari/YouTube-to-Blog-Generator-Using-AI.git
   
2. **Install Dependencies**

    ```bash
    cd YouTube-to-Blog-Generator-Using-AI
    npm install
    
3. **Run the Application**

    ```bash
    npm start
The application will run on http://localhost:3000 by default.

**Deployment**
The frontend is deployed on **Vercel**.

## Backend Setup

1. **Clone the Repository**

   ```bash
   already done in frontend
   
2. **Install Dependencies**

   ```bash
   pip install -r requirements.txt
   
3. **Set Up Environment Variables**

Create a .env file in the root directory and add your environment variables:

   ```bash
   GEMINI_API_KEY=your_gemini_api_key
```
4. **Initialize the Database**
Run the following command to set up the SQLite database:

   ```bash
   python init_db.py
   
5. **Run the Application**

   ```bash
   python app.py
   
The backend will run on http://localhost:5000 by default.

**Deployment**
The backend is deployed on Vercel. You can access the live API at Vercel URL.

API Endpoints
POST /generate_blog: Generates a blog post from a YouTube video URL.
