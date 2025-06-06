import React from "react";
import { useNavigate } from "react-router-dom";
import '../CSS/UserBottomNavbar.css';

const navs = [
  { label: "Home", path: "/userhome" },
  { label: "Cards", path: "/usercards" },
  { label: "Settings", path: "/usersettings" },
];

const UserBottomNavBar = () => {
  const navigate = useNavigate();
  const location = window.location.pathname;
  const [cardsActive, setCardsActive] = React.useState(false);

  React.useEffect(() => {
    setCardsActive(location === "/usercards");
  }, [location]);

  const handleNavClick = (nav) => {
    navigate(nav.path);
  };

  return (
    <nav
      className="guest-navbar"
      style={{
        width: '100%',
        background: '#1C2E4A',
        minHeight: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        fontFamily: 'Inder, monospace',
        fontSize: '1.3em',
        color: '#fff',
      }}
    >
      <div
        className="guest-navbar-links"
        style={{ display: 'flex', gap: '3vw', alignItems: 'center', height: '60px' }}
      >
        {navs.map((nav) => {
          let isActive = false;
          if (nav.label === "Cards") {
            isActive = cardsActive;
          } else {
            isActive = location === nav.path && !cardsActive;
          }
          return (
            <span
              key={nav.path}
              className={`guest-navbar-link${isActive ? ' active' : ''}`}
              style={{
                cursor: 'pointer',
                padding: '0 1vw',
                borderBottom: isActive ? '3px solid #fff' : 'none',
              }}
              onClick={() => handleNavClick(nav)}
            >
              {nav.label}
            </span>
          );
        })}
      </div>
    </nav>
  );
};

export default UserBottomNavBar;