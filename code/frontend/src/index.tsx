import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { initializeIcons } from "@fluentui/react";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";

import "./index.css";
import "./prontoStyles.css";

import Layout from "./pages/layout/Layout";
import NoPage from "./pages/NoPage";
import Chat from "./pages/chat/Chat";
import LogIn from "./pages/login/LogIn";

initializeIcons();

export default function App() {
  const [userLoggedIn, setUserLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    if (localStorage.getItem("loggedIn") === null) {
      // console.log("User is not logged in, should reRoute to login");
      setUserLoggedIn(false);
    } else {
      // console.log("User is logged in, should display chat");
      setUserLoggedIn(true);
    }
  });

  return (
    <BrowserRouter>
      <Routes>
        {userLoggedIn ? (
          <Route path="/" element={<Layout />}>
            <Route index element={<Chat />} />
            <Route path="/thread/:threadId" element={<Chat />} />
            <Route path="*" element={<NoPage />} />
          </Route>
        ) : (
          <Route path="/" element={<LogIn />}></Route>
        )}
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <FluentProvider theme={webLightTheme}>
      <App />
    </FluentProvider>
  </React.StrictMode>
);
