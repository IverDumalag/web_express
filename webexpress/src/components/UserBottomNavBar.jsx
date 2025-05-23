import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const navs = [
  { label: "Home", path: "/userhome" },
  { label: "Settings", path: "/usersettings" },
  { label: "Profile", path: "/userprofile" },
];

const UserBottomNavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <style>{`
        .user-bottom-nav {
          position: fixed;
          left: 0;
          bottom: 0;
          width: 100vw;
          height: 9vh;
          min-height: 48px;
          max-height: 70px;
          background: rgba(255,255,255,0.0);
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding: 0 4vw;
          z-index: 100;
          box-sizing: border-box;
        }
        .user-bottom-nav .nav-group {
          display: flex;
          align-items: center;
          gap: 6vw;
        }
        .user-bottom-nav .nav-item {
          color: #007bff;
          font-size: 1.1em;
          font-weight: 500;
          background: none;
          border: none;
          cursor: pointer;
          padding: 1vh 2vw 0.5vh 2vw;
          border-radius: 2vw 2vw 0 0;
          transition: background 0.2s;
          position: relative;
          outline: none;
        }
        .user-bottom-nav .nav-item:hover {
          background: rgba(182, 169, 226, 0.10);
        }
        .user-bottom-nav .nav-item.active::after {
          content: "";
          display: block;
          position: absolute;
          left: 20%;
          right: 20%;
          bottom: 0;
          height: 4px;
          border-radius: 2px 2px 0 0;
          background: #007bff;
        }
        .user-bottom-nav .owlets {
          color: #222;
          font-weight: bold;
          font-size: 1.2em;
          letter-spacing: 2px;
          margin-left: 6vw;
        }
        @media (max-width: 600px) {
          .user-bottom-nav {
            height: 8vh;
            min-height: 40px;
            padding: 0 2vw;
          }
          .user-bottom-nav .nav-group {
            gap: 4vw;
          }
          .user-bottom-nav .nav-item {
            font-size: 1em;
            padding: 1vh 3vw 0.5vh 3vw;
          }
          .user-bottom-nav .owlets {
            font-size: 1em;
            margin-left: 4vw;
          }
        }
      `}</style>
      <nav className="user-bottom-nav">
        <div className="nav-group">
          {navs.map(nav => (
            <button
              key={nav.path}
              className={`nav-item${location.pathname === nav.path ? " active" : ""}`}
              onClick={() => navigate(nav.path)}
            >
              {nav.label}
            </button>
          ))}
        </div>
        <span className="owlets">OWLETS</span>
      </nav>
    </>
  );
};

export default UserBottomNavBar;