import React from "react";
import GuestNavBar from "../components/GuestNavBar";
import backgroundImage from "../assets/home.png"; 

const HomePage = () => {
   return (
      <>
         <style>{`
            .page-background {
               background-image: url(${backgroundImage});
               background-size: cover;
               background-position: center;
               min-height: 100vh;
               width: 100%;
            }

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

         <div className="page-background">
            <GuestNavBar />
            <div className="container">
               {}
            </div>
         </div>
      </>
   );
};

export default HomePage;
