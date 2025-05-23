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
               background: rgb(182, 169, 226);
               padding: 2% 4%;
               width: 100%;
               box-sizing: border-box;
            }
            .navbar-left {
               display: flex;
               align-items: center;
            }
            .brand-link {
               font-weight: bold;
               font-size: 1.5em;
               color: #333;
               text-decoration: none;
               cursor: pointer;
               margin-right: 2vw;
               letter-spacing: 1px;
            }
            .download-link {
               margin-right: 5%;
               color: #007bff;
               text-decoration: none;
               cursor: pointer;
               font-weight: 500;
               font-size: 1.1em;
            }
            .account-container {
               position: relative;
            }
            .account-icon {
               font-size: 2em;
               cursor: pointer;
            }
            .dropdown {
               display: none;
               position: absolute;
               right: 0;
               top: 120%;
               background: #fff;
               box-shadow: 0 2px 8px rgba(0,0,0,0.15);
               border-radius: 4px;
               min-width: 120px;
               z-index: 10;
            }
            .dropdown a {
               display: block;
               padding: 8% 12%;
               color: #333;
               text-decoration: none;
               font-size: 1em;
            }
            .dropdown a:hover {
               background: #f0f0f0;
            }
            .show {
               display: block;
            }
            @media (max-width: 600px) {
               .navbar {
                  padding: 4% 2%;
               }
               .brand-link {
                  font-size: 1.1em;
                  margin-right: 1vw;
               }
               .download-link {
                  margin-right: 3%;
                  font-size: 1em;
               }
               .account-icon {
                  font-size: 1.5em;
               }
               .dropdown a {
                  font-size: 0.95em;
                  padding: 10% 10%;
               }
            }
         `}</style>
         <nav className="navbar">
            <div className="navbar-left">
               <span
                  className="brand-link"
                  onClick={() => navigate("/")}
               >
                  exPress
               </span>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
               <a
                  className="download-link"
                  href="https://drive.google.com/file/d/1D4QseDYlB9_3zezrNINM8eWWB3At1kVN/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
               >
                  Download our mobile app
               </a>
               <div className="account-container" ref={accountRef}>
                  <span className="account-icon" role="img" aria-label="account">
                     &#128100;
                  </span>
                  <div
                     className={`dropdown${dropdownOpen ? " show" : ""}`}
                     ref={dropdownRef}
                  >
                     <a
                        href="#"
                        onClick={e => {
                           e.preventDefault();
                           setDropdownOpen(false);
                           navigate("/login");
                        }}
                     >
                        Login
                     </a>
                     <a
                        href="#"
                        onClick={e => {
                           e.preventDefault();
                           setDropdownOpen(false);
                           navigate("/register");
                        }}
                     >
                        Register
                     </a>
                  </div>
               </div>
            </div>
         </nav>
      </>
   );
};

export default GuestNavBar;