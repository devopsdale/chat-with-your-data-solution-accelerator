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

export const OnboardingModule = ({ isOpen, closeNotice }: OnboardingModuleProps) => {
  const [isOpenLocal, setIsOpenLocal] = React.useState(true);

  const closeNoticeTrigger = (close: boolean) => {
    closeNotice(close);
  }

 /*  useEffect(() => {
    console.log('got update from parent');
    setIsOpenLocal(isOpen);
  }, [isOpen]); */

  return (
    <div>
      <Dialog
        open={isOpen}
        onOpenChange={(event, data) => {
          closeNoticeTrigger(data.open);
        }}
      >
        <DialogSurface className={`${styles.deleteThreadModal} prontoModal`}>
          <DialogBody>
            <DialogTitle>Onboarding</DialogTitle>
            <div
              className={`ghostIconBtn closeModalBtn`}
              onClick={() => closeNoticeTrigger(false)}
            >
              <img src="../../closeIconBlue.png" />
            </div>
            <DialogContent>
              Coming soon!
            </DialogContent>

            {/* <DialogActions>
              <DialogTrigger disableButtonEnhancement>
                <Button className={`secondary`}>Cancel</Button>
              </DialogTrigger>
              <Button
                className={`error`}
                onClick={(e) => console.log('test')}
              >
                <img src="../../deleteIconWhite.png" />
                Delete
              </Button>
            </DialogActions> */}
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </div>
  );
};
