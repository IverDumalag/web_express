import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
         <style>{`
            .navbar {
               display: flex;
               justify-content: space-between;
               align-items: center;
               background: #ffffff;
               padding: 1rem 2rem;
               box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
               border-bottom: 1px solid #e0e0e0;
               position: sticky;
               top: 0;
               z-index: 100;
               font-family: 'Segoe UI', sans-serif;
            }

            .brand-link {
               display: flex;
               align-items: center;
               font-weight: 700;
               font-size: 1.6em;
               color: #333;
               text-decoration: none;
               cursor: pointer;
            }

            .download-link {
               margin-left: 1.5rem;
               color: #007bff;
               text-decoration: none;
               font-weight: 500;
               font-size: 1em;
            }

            .account-container {
               position: relative;
               margin-left: 1rem;
            }

            .account-icon {
               font-size: 1.8em;
               cursor: pointer;
               color: #333;
            }

            .dropdown {
               display: none;
               position: absolute;
               right: 0;
               top: 130%;
               background: #ffffff;
               box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
               border-radius: 8px;
               min-width: 140px;
               z-index: 100;
            }

            .dropdown a {
               display: block;
               padding: 0.75rem 1rem;
               color: #333;
               text-decoration: none;
            }

            .dropdown a:hover {
               background: #f5f5f5;
            }

            .show {
               display: block;
            }

            @media (max-width: 768px) {
               .nav-links {
                  display: none;
               }
            }
         `}</style>

         <nav className="navbar">
            <span className="brand-link" onClick={() => navigate("/")}>
               exPress
            </span>

            <div style={{ display: "flex", alignItems: "center" }}>
               <a
                  className="download-link"
                  href="https://drive.google.com/file/d/1D4QseDYlB9_3zezrNINM8eWWB3At1kVN/view?usp=sharing"
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
