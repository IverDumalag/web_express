import React from "react";
import GuestNavBar from "../components/GuestNavBar";

const HomePage = () => {
   return (
      <>
         <style>{`
            .container {
               max-width: 90%;
               width: 100%;
               margin: 8% auto 0 auto;
               padding: 0 2%;
               font-size: 1.2em;
            }
            @media (max-width: 600px) {
               .container {
                  max-width: 98%;
                  margin: 16% auto 0 auto;
                  font-size: 1em;
               }
            }
         `}</style>
         <GuestNavBar />
         <div className="container">
            <p>
               <strong>exPress</strong> is a modern web platform designed to streamline your online experience.
               Enjoy fast, secure, and user-friendly features whether you're browsing on desktop or mobile.
            </p>
         </div>
      </>
   );
};

export default HomePage;