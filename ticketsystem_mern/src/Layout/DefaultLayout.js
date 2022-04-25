import React from "react";
import Header from "./Partials/Header.component";
import Footer from "./Partials/Footer.component";

const DefaultLayout = ({children}) => {
  return (
    <div className="default-layout">
      <header className="header mb-2" >
        <Header />
      </header>
      <main className="main">{children}</main>
      <footer className="footer">
        <Footer />
      </footer>
    </div>
  );
};

export default DefaultLayout;
