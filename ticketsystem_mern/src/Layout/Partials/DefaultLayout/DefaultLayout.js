import React from "react";
import { Headers } from "../Header/Header.component";

const DefaultLayout = ({ children }) => {
  return (
    <div className="default-layout">
      <Headers />
      <main className="lux-shell lux-rise">{children}</main>
    </div>
  );
};

export default DefaultLayout;
