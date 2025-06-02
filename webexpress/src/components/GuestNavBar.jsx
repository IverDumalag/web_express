import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../CSS/GuestNavBar.css';

const GuestNavBar = () => {
   const [dropdownOpen, setDropdownOpen] = useState(false);
   const accountRef = useRef(null);
   const dropdownRef = useRef(null);
   const navigate = useNavigate();

   useEffect(() => {
      const handleClick = (event) => {
         if (accountRef.current && accountRef.current.contains(event.target)) {
            setDropdownOpen((open) => !open);
         } else if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target)
         ) {
            setDropdownOpen(false);
         }
      };
      document.addEventListener("click", handleClick);
      return () => document.removeEventListener("click", handleClick);
   }, []);

   return (
      <>
         <nav className="navbar">
            <div style={{ display: "flex", alignItems: "center", gap: "2.5rem" }}>
               <span className="brand-link" onClick={() => navigate("/")}>exPress</span>
               <a className="nav-link" href="#about">ABOUT</a>
               <a className="nav-link" href="#features">FEATURES</a>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
                  <a
                  className="download-link"
                  href="https://drive.google.com/uc?export=download&id=1D4QseDYlB9_3zezrNINM8eWWB3At1kVN"
                  target="_blank"
                  rel="noopener noreferrer"
                  >
                  Download App
                  </a>
               <div className="account-container" ref={accountRef}>
                  <span className="account-icon" role="img" aria-label="account">
                     &#128100;
                  </span>
                  <div
                     className={`dropdown${dropdownOpen ? " show" : ""}`}
                     ref={dropdownRef}
                  >
                     <a href="#" onClick={(e) => { e.preventDefault(); navigate("/login"); }}>Login</a>
                     <a href="#" onClick={(e) => { e.preventDefault(); navigate("/register"); }}>Register</a>
                  </div>
               </div>
            </div>
         </nav>
      </>
   );
};

export default GuestNavBar;
