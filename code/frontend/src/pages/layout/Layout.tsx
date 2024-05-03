import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import styles from "./Layout.module.css";
import { Header } from "../../components/Header";

const Layout = () => {
  const [pageAnimOn, setPageAnimOn] = useState<boolean>(false);
  // const [pageAnimOff, setPageAnimOff] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => {
      setPageAnimOn(true);
    }, 150);
  });

  return (
    <div
      className={`
      ${styles.layout}
      ${pageAnimOn ? styles.pageAnimOn : ""}
    `}
    >
      <Header></Header>

      {/* ↓ page content */}
      <Outlet />
    </div>
  );
};

export default Layout;
