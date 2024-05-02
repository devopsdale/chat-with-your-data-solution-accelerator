import { useState, useEffect } from "react";

import styles from "./LogIn.module.css";
import { Input, Label, useId } from "@fluentui/react-components";
import type { InputProps } from "@fluentui/react-components";
import { ArrowEnterFilled } from "@fluentui/react-icons";

const LogIn = (props: InputProps) => {
  const inputId = useId("input");
  const [liveRecognizedText, setLiveRecognizedText] = useState<string>("");
  const [isWrongPW, setIsWrongPW] = useState<boolean>(false);
  const [animOn, setAnimOn] = useState<boolean>(false);
  const [animOff, setAnimOff] = useState<boolean>(false);

  const submitLogInField = (passwordEntered: string) => {
    if (passwordEntered.trim() === import.meta.env.VITE_TEMP_PW) {
      localStorage.setItem("loggedIn", "true");
      setAnimOff(true);
      setTimeout(() => {
        location.reload();
      }, 1500);
    } else {
      setLiveRecognizedText("");
      setIsWrongPW(true);
      setTimeout(() => {
        setIsWrongPW(false);
      }, 150);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setAnimOn(true);
    }, 1000);
  });

  return (
    <div
      className={`
        ${styles.container}
        ${animOn? styles.animOn : ""}
        ${animOff ? styles.animOff : ""}
      `}
    >
      <img
        className={styles.prontoAvatar}
        src="../../pronto-avatar-anim-white-bg.gif"
        alt="pronto avatar animated"
      />
      <div className={styles.logInHolder}>
        <div className={styles.logInInner}>
          <Label htmlFor={inputId}>Welcome to Pronto, please log in!</Label>
          <Input
            className={isWrongPW ? styles.shake : ""}
            id={inputId}
            {...props}
            type="password"
            placeholder={"Enter Password"}
            contentAfter={
              <ArrowEnterFilled
                aria-label="Enter with password"
                onClick={(e) => submitLogInField(liveRecognizedText)}
              />
            }
            onChange={(e, newValue) => {
              if (newValue !== undefined) {
                setLiveRecognizedText(newValue.value);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                submitLogInField(liveRecognizedText);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default LogIn;
