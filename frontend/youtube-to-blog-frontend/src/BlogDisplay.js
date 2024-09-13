import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import './BlogDisplay.css'; // Optional CSS for styling

const BlogDisplay = ({ blogContent }) => {
    const [copied, setCopied] = useState(false);
    const htmlRef = useRef(null);

    const handleCopy = () => {
        // Get the HTML content from the ref
        const htmlContent = htmlRef.current.innerHTML;

        // Copy the HTML content to the clipboard
        navigator.clipboard.writeText(htmlContent)
            .then(() => setCopied(true))
            .catch(err => console.error('Failed to copy text: ', err));
    };

    return (
        <div className="blog-container">
            <div className="copy-button-container">
                <button className="copy-button" onClick={handleCopy}>
                    {copied ? "Copied!" : "Copy HTML to clipboard"}
                </button>
            </div>
            <div className="blog-content" ref={htmlRef}>
                <ReactMarkdown>{blogContent}</ReactMarkdown>
            </div>
        </div>
    );
};

export default BlogDisplay;
