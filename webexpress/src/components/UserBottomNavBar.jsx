import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";
import '../CSS/UserBottomNavbar.css';

const navs = [
  { label: "HOME", path: "/userhome" },
  { label: "SETTINGS", path: "/usersettings" },
  { label: "PROFILE", path: "/userprofile" },
];

const UserBottomNavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openIndex, setOpenIndex] = React.useState(null);

  const handleNavClick = (idx, path) => {
    setOpenIndex(idx === openIndex ? null : idx);
    navigate(path);
  };

  return (
    <>
      <nav className="user-bottom-nav">
        <div className="nav-group">
          {navs.map((nav, idx) => (
            <button
              key={nav.path}
              className={`nav-item${location.pathname === nav.path ? " active" : ""}`}
              onClick={() => handleNavClick(idx, nav.path)}
              onBlur={() => setOpenIndex(null)}
            >
              <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                {openIndex === idx && (
                  <FaChevronDown
                    className="nav-arrow"
                    style={{
                      marginBottom: 2,
                      transition: 'transform 0.2s',
                      transform: location.pathname === nav.path ? 'rotate(180deg)' : 'rotate(0deg)',
                      color: location.pathname === nav.path ? '#007bff' : '#888',
                      fontSize: '1em',
                    }}
                  />
                )}
                {nav.label}
              </span>
            </button>
          ))}
        </div>
        <span className="owlets">OWLETS</span>
      </nav>
    </>
  );
};

export default UserBottomNavBar;