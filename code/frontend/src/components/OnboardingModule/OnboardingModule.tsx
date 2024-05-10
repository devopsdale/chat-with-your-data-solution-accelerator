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

// ↓ data for Onboarding slides
const onboardingSlides = [
  {
    title: "Title",
    mainCopy: "Lorem Ipsum",
    ctas: [
      {
        title: "CTA",
        url: "#",
        icon: "☻",
      },
    ],
    mediaContent: {
      imgUrl: "../../onboarding/overviewSlide.png",
    },
  },
  {
    title: "Title",
    mainCopy: "Lorem Ipsum",
    ctas: [
      {
        title: "CTA",
        url: "#",
        icon: "☻",
      },
    ],
    mediaContent: {
      imgUrl: "../../onboarding/overviewSlide.png",
    },
  },
];

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
              <img src="../../closeIconWhite.png" />
            </div>
            <DialogContent>
              <div className={`${styles.onboardingContent}`}>
                <div className={`${styles.leftContentContainer}`}>
                  <ul className={`${styles.copyContainer}`}>
                    {/* text slider content */}
                    {onboardingSlides?.map((slide, index) => (
                      <li key={index}>{slide.title}</li>
                    ))}
                  </ul>
                  <div className={`${styles.onboardingSlideControls}`}>
                    {/* slider content controls will go here */}
                  </div>
                </div>
                <div className={`${styles.rightContentContainer}`}>
                  <ul className={`${styles.mediaContainer}`}>
                    {/* images/media */}
                    {onboardingSlides?.map((slide, index) => (
                      <li key={index}>
                        <img src={slide.mediaContent?.imgUrl} />
                      </li>
                    ))}
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
