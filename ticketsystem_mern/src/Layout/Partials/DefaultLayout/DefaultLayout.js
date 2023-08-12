import React from "react";
import { Headers } from "../Header/Header.component";
import { Footers } from "../Footer/Footer.component";
import "./DefaultLayout.css";

const DefaultLayout = ({ children }) => {
  return (
    <div className="default-layout">
      <header className="header mb-2">
        <Headers />
      </header>
      <main className="main"> {children} </main>
      <footer className="footer">
        <Footers />
      </footer>
    </div>
  );
};

export default DefaultLayout;
