import React, { useState } from 'react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleNavbar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="navbar">
            {/* Mobile toggle button */}
            <div className="navbar-toggle" onClick={toggleNavbar}>
                &#9776;
            </div>

            {/* Navbar links */}
            <ul className={isOpen ? 'active' : ''}>
                <li><a href="/">Home</a></li>
                {/* <li><a href="#login">Login/Signup</a></li> */}
                <li><a href="#faq">FAQ</a></li>
                <li><a href="#privacy">Privacy Policy</a></li>
                <li><a href="#terms">Terms & Conditions</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#pricing">Pricing</a></li>
                {/* <li><a href="#use-api">Use Your Own API</a></li> */}
            </ul>
        </nav>
    );
};

export default Navbar;
