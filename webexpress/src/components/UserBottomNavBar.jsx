import React from "react";
import { useNavigate } from "react-router-dom";
import '../CSS/UserBottomNavbar.css';

const navs = [
  { label: "Home", path: "/userhome" },
  { label: "Cards", path: "/usercards" }, // Cards handled specially
  { label: "Settings", path: "/usersettings" },
];

const isAtCardsSection = () => {
  if (window.location.pathname !== "/userhome") return false;
  const section = document.getElementById("sign-language-cards-section");
  if (!section) return false;
  const rect = section.getBoundingClientRect();
  // Consider 'active' if the section is near the top of the viewport
  return rect.top <= 80 && rect.bottom > 80;
};

const UserBottomNavBar = () => {
  const navigate = useNavigate();
  const location = window.location.pathname;
  const [cardsActive, setCardsActive] = React.useState(false);

  React.useEffect(() => {
    if (location === "/userhome") {
      const onScroll = () => setCardsActive(isAtCardsSection());
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
      return () => window.removeEventListener('scroll', onScroll);
    } else {
      setCardsActive(false);
    }
  }, [location]);

  const handleNavClick = (nav) => {
    if (nav.label === "Cards") {
      if (location === "/userhome") {
        const section = document.getElementById("sign-language-cards-section");
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        navigate("/userhome");
        setTimeout(() => {
          const section = document.getElementById("sign-language-cards-section");
          if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
          }
        }, 400);
      }
    } else {
      navigate(nav.path);
    }
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