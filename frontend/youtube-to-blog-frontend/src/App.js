import React, { useState, useEffect } from "react";
import BlogDisplay from './BlogDisplay';
import axios from "axios";
import './App.css';
import Navbar from "./navbar";

function App() {
  const [videoUrl, setVideoUrl] = useState("");
  const [option, setOption] = useState("subtitles");
  const [blogContent, setBlogContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showScroll, setShowScroll] = useState(false);
  const [remaining, setRemaining] = useState(5);  // Start with 5 conversions
  const backendUrl = "https://blogaiback.vercel.app/generate_blog"

  const handleGenerateBlog = async () => {
    setLoading(true);
    setError("");
    setBlogContent("");

    try {
      const response = await axios.post(backendUrl, {
        video_url: videoUrl,
        option: option,
      });

      if (response.data.blog_content) {
        setBlogContent(response.data.blog_content);
        setRemaining(response.data.remaining);  // Update remaining conversions
      } else {
        setError("Failed to generate blog content.");
      }
    } catch (err) {
      setError("Error occurred while generating blog content.");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle scrolling
  const handleScroll = () => {
    if (window.scrollY > 300) {
      setShowScroll(true);
    } else {
      setShowScroll(false);
    }
  };

  // Function to scroll to the top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


  return (
    <div className="App">
      <Navbar />
      <Section id="home">
        <h1>YouTube to Blog Generator AI</h1>
        <section id="form">
          <input
            type="text"
            placeholder="Paste YouTube Video URL"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
          <select value={option} onChange={(e) => setOption(e.target.value)}>
            <option value="subtitles">Use Subtitles to Generate Blog</option>
            <option >Use Transcription to Generate Blog (coming soon...)</option>
            {/* Add more options like transcription if implemented */}
          </select>
          <button onClick={handleGenerateBlog} disabled={loading}>
            {loading ? "Generating..." : "Generate Blog"}
          </button>
        </section>
        {error && <div className="error">{error}</div>}
        {loading && !blogContent && (
          <div className="loading">Loading...</div> // Display loading text or animation
        )}
        <div className="remaining-conversions">
          {remaining > 0
            ? `Generations Remaining : ${remaining}`
            : "Daily limit reached. Please try again after 11:59 PM."}
        </div>
        {blogContent && (
          <div className="blog-content-container">
            <h2>Your Blog Post has been Generated! 👇</h2>
            <BlogDisplay blogContent={blogContent} />
          </div>
        )}
        {blogContent && (
          <div className="blog-content-container">
            <h2>Your Blog Post has been Generated! 👆</h2>
          </div>
        )}
      </Section>
      {/* Scroll to Top Button */}
      {showScroll && (
        <button className="scroll-to-top" onClick={scrollToTop}>↑</button>
      )}
      {/* <Section id="login" title="Login/Signup">
        <p>Welcome to the <b>YouTube Video to Blog Generator AI</b> platform!</p>
        <p><b>Sign up </b>to unlock advanced features that make converting your favorite YouTube videos into well-crafted, SEO-optimized blogs easier than ever.</p>
        <p>Already have an account? <b>Log in</b> to Start your journey to effortless blog creation with just a few clicks!</p>
        <button>Sign Up</button><br />
        <button>Log In</button>
      </Section> */}
      <section id="faq">
        <h2>Frequently Asked Questions</h2>

        <div class="faq-item">
          <h3>Which video platforms are supported?</h3>
          <p>Our Web-App supports YouTube. These kinds of YouTube video URLs are accepted by our converter:</p>
          <ul>
            <li>youtube.com/watch?v=videold</li>
            <li>youtu.be/videold</li>
            <li>youtube.com/shorts/videold</li>
          </ul>
        </div>

        <div class="faq-item">
          <h3>Which formats are supported?</h3>
          <p>You can convert a YouTube video with any format, we first fetch subtitles and then use those subtitles to create Plagiarism free Blog post.</p>
        </div>

        <div class="faq-item">
          <h3>Is there a maximum supported video length?</h3>
          <p>Yes. Our service supports YouTube videos with a maximum length of 30 minutes. While you can experiment with longer videos.</p>
        </div>

        <div class="faq-item">
          <h3>Where is the file saved after the download?</h3>
          <p>Check your browser settings for the download directory. The file will be saved in the default download location specified there.</p>
        </div>

        <div class="faq-item">
          <h3>The conversion does not start.</h3>
          <p>Please clear your browser cache and reload the site. If the conversion still does not start, send us a message using our contact email.</p>
        </div>

        <div class="faq-item">
          <h3>An error occurred.</h3>
          <p>Ensure you are not trying a YouTube video that is a:</p>
          <ul>
            <li>Livestream</li>
            <li>Longer than 30 minutes</li>
            <li>Private</li>
          </ul>
          <p>If your video does not match any of these criteria and you still receive an error, please report it using our contact email.</p>
        </div>
      </section>
      <section id="pricing">
        <h2>Pricing</h2>
        <div class="pricing-container">
          <div class="pricing-plan">
            <h3>Basic Plan</h3>
            <p>₹0/month</p>
            <ul>
              <li>Access to all features</li>
              <li>Limited to 5 video conversions per day</li>
              <li>Standard support</li>
            </ul>
          </div>
          <div class="pricing-plan">
            <h3>Pro Plan</h3>
            <p>₹/month</p>
            <ul>
              <li>Unlimited video conversions</li>
              <li>Priority support</li>
              <li>Access to advanced features</li>
            </ul>
          </div>
          <div class="pricing-plan">
            <h3>Enterprise Plan</h3>
            <a href="mailto:reignsempire25@gmail.com"><p>Contact us</p></a>
            <ul>
              <li>Custom solutions</li>
              <li>24/7 support</li>
            </ul>
          </div>
        </div>
      </section>
      <section id="about">
        <h2>About Us</h2>
        <p>YouTube Video to Blog Generator AI is a cutting-edge tool designed to simplify the process of converting YouTube videos into SEO-friendly blogs. Our platform leverages the latest AI technology to generate high-quality content that can boost your online presence and drive more traffic to your website.</p>

        <p>Whether you are a content creator, marketer, or blogger, our tool provides an efficient way to repurpose video content into written blogs that are optimized for search engines. With YouTube Video to Blog Generator AI, you can save time and effort while ensuring that your content remains engaging, informative, and relevant to your audience.</p>

        <p>Our mission is to empower users with the tools they need to create impactful content that stands out in the digital landscape. We are committed to providing a user-friendly platform that combines advanced technology with seamless functionality. Start transforming your YouTube videos into powerful blog posts today!</p>
      </section>

      <section id="use-api">
        <h2>Coming soon.... (Use Your Own API)</h2>
        <p>YouTube Video to Blog Generator AI offers the flexibility to use your own API key for content generation. This feature is ideal for users who want more control over their content and access to additional customization options.</p>

        <p>By using your API key, you can enhance the quality of your blog posts, leverage advanced AI models, and ensure that the generated content aligns perfectly with your brand's voice and style. Get started today by integrating your API key and unlocking the full potential of our platform.</p>
      </section>

      <section id="privacy">
        <h2>Privacy Policy</h2>
        <p>We at YouTube Video to Blog Generator AI take your privacy seriously. This Privacy Policy outlines the types of personal information we collect and how we use, disclose, and protect that information.</p>

        <h3>Information We Collect</h3>
        <p>When you sign up for our service, we collect your name, email address, and other relevant information. We may also collect data on how you use our website to improve our services.</p>

        <h3>How We Use Your Information</h3>
        <p>Your personal information is used to create and manage your account, provide customer support, and improve our services. We also use your data to generate personalized content and recommendations tailored to your needs.</p>

        <h3>Sharing Your Information</h3>
        <p>We do not share your personal information with third parties, except when required by law or necessary to provide our services. Your data is securely stored and protected using industry-standard security measures.</p>

        <h3>Your Rights</h3>
        <p>You have the right to access, modify, or delete your personal information at any time. If you have any questions or concerns about our Privacy Policy, please contact us.</p>

        <h3>Changes to This Policy</h3>
        <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page, so please check back regularly.</p>

        <p>By using our service, you agree to the terms outlined in this Privacy Policy. Thank you for trusting YouTube Video to Blog Generator AI with your personal information.</p>
      </section>


      <section id="terms">
        <h2>Terms & Conditions</h2>
        <p>Welcome to YouTube Video to Blog Generator AI. These Terms & Conditions govern your use of our website and services. By accessing or using our platform, you agree to be bound by these terms.</p>

        <h3>Use of Service</h3>
        <p>You must be at least 18 years old to use our service. You agree to use our platform in compliance with all applicable laws and not to engage in any illegal or harmful activities while using our service.</p>

        <h3>Account Responsibility</h3>
        <p>You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. Notify us immediately of any unauthorized use of your account.</p>

        <h3>Content Ownership</h3>
        <p>All content generated by our platform using YouTube videos is owned by the respective content creators. Our service only provides tools to convert video content into blogs, and we do not claim any ownership over the original content.</p>

        <h3>Service Availability</h3>
        <p>We strive to keep our service available at all times, but we do not guarantee uninterrupted access. We reserve the right to modify, suspend, or discontinue our service at any time without notice.</p>

        <h3>Limitation of Liability</h3>
        <p>We are not liable for any damages resulting from the use of our service. Your use of the platform is at your own risk, and we provide our service "as is" without any warranties.</p>

        <h3>Changes to Terms</h3>
        <p>We may update these Terms & Conditions from time to time. Any changes will be effective immediately upon posting on our website. Continued use of our service after such changes constitutes your acceptance of the new terms.</p>

        <p>Thank you for using YouTube Video to Blog Generator AI. Please review these terms regularly to stay informed of any updates.</p>
      </section>
      <Section>
        <Footer></Footer>
      </Section>
    </div >
  );
}


const Footer = () => (
  <footer className="footer">
    <div className="footer-content">
      <div className="footer-section">
        <h4>Contact Us</h4>
        <p>Email: reignsempire25@gmail.com</p>
      </div>
      <div className="footer-section">
        <h4>Useful Links</h4>
        <p><a href="#privacy">Privacy Policy</a></p>
        <p><a href="#terms">Terms & Conditions</a></p>
        <p><a href="#faq">FAQ</a></p>
      </div>
    </div>
    <div className="footer-bottom">
      <p>&copy; 2024 YouTube to Blog Generator AI. All Rights Reserved.</p>
    </div>
  </footer>
);

const Section = ({ id, title, children }) => (
  <div id={id} className="section">
    <h2>{title}</h2>
    {children}
  </div>
);

export default App;
