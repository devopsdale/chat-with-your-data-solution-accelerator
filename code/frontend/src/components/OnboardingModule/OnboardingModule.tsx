import * as React from "react";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogTrigger,
  Button,
  // useRestoreFocusTarget,
} from "@fluentui/react-components";
import styles from "./OnboardingModule.module.css";

// ↓ mocking Threads list until API is ready
/* const threads = [
  {
    title: "Thread 01",
    id: 10000001, // will be generated ThreadID
  },
  {
    title: "Thread 02",
    id: 10000002, // will be generated ThreadID
  },
  {
    title: "Thread 03",
    id: 10000003, // will be generated ThreadID
  },
]; */

interface OnboardingModuleProps {
  isOpen: boolean;
  closeNotice: (closeModal: boolean) => void;
}

export const OnboardingModule = ({
  isOpen,
  closeNotice,
}: OnboardingModuleProps) => {
  const [isOpenLocal, setIsOpenLocal] = React.useState(true);

  const closeNoticeTrigger = (close: boolean) => {
    closeNotice(close);
  };

  /*  useEffect(() => {
    console.log('got update from parent');
    setIsOpenLocal(isOpen);
  }, [isOpen]); */

  return (
    <div className={styles.onboardingModuleContainer}>
      <Dialog
        open={isOpen}
        onOpenChange={(event, data) => {
          closeNoticeTrigger(data.open);
        }}
      >
        <DialogSurface className={`${styles.onboardingModal} prontoModal`}>
          <DialogBody>
            {/* <DialogTitle>Onboarding</DialogTitle> */}
            <div
              tabIndex={1}
              className={`ghostIconBtn closeModalBtn`}
              onClick={() => closeNoticeTrigger(false)}
            >
              <img src="../../closeIconBlue.png" />
            </div>
            <DialogContent>
              <div className={`${styles.onboardingContent}`}>
                <div className={`${styles.leftContentContainer}`}>
                  <div className={`${styles.copyContainer}`}>
                    {/* text slider content will go here */}
                  </div>
                  <div className={`${styles.onboardingSlideControls}`}>
                    {/* slider content controls will go here */}
                  </div>
                </div>
                <div className={`${styles.rightContentContainer}`}>
                  <ul className={`${styles.mediaContainer}`}>
                    {/* images/media supporting copy will go here */}
                  </ul>
                  <img
                    className={`${styles.mediaContainerSizer}`}
                    src="../../onboarding/overviewSlide.png"
                    alt=""
                  />
                </div>
              </div>
            </DialogContent>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </div>
  );
};
