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
    title: "🤖 Welcome to Pronto",
    mainCopy:
      "Pronto helps combine and analyze information about the aviation market. Pronto will help you by reducing the time spent reading, analyzing and synthesizing different market intelligence sources. It is not able to understand overarching trends and is dependent on the data it has access to for its responses.",
    mediaContent: {
      imgUrl: "../../onboarding/overviewSlide.png",
    },
  },
  {
    title: "📚 Adding Sources to Pronto",
    mainCopy: `Over time, Pronto will change to become more relevant to your needs. You can help it get better by adding relevant market intelligence sources (links, text or PDFs).
To start, you can add new publicly available sources you find to Pronto's knowledge set.`,
    ctas: [
      {
        title: "Add a source",
        url: "#",
        icon: "☻",
      },
    ],
    mediaContent: {
      imgUrl: "../../onboarding/addingSources.png",
    },
  },
  {
    title: "💬 Prompting Pronto",
    mainCopy:
      "Next, you can prompt Pronto with key questions about your market area of interest",
    mediaContent: {
      imgUrl: "../../onboarding/promptingPronto.png",
    },
  },
  {
    title: "🦾 Benefits",
    mainCopy:
      "Skip the SEO and advertisements to get right into synthesizing the relevant market intelligence and thinking about how it might impact Airbus. Use Pronto to help distill your message based on the audience you are serving.",
    mediaContent: {
      imgUrl: "../../onboarding/benefits.png",
    },
  },
  {
    title: "🏁 Get Started",
    mainCopy: `Try one of these sample prompts or dive in with your own!`,
    ctas: [
      {
        title: "Get Started",
        url: "#",
        icon: "☻",
      },
    ],
    mediaContent: {
      imgUrl: "../../onboarding/getStarted.png",
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
  const [slideNumber, setSlideNumber] = React.useState(0);
  let curSlide = slideNumber;

  const closeNoticeTrigger = (close: boolean) => {
    closeNotice(close);
  };

  const moveSlide = (dir: string) => {
    if (dir === "forward") {
      curSlide++;
    } else {
      curSlide--;
    }
    setSlideNumber(curSlide);
  };

  /*  useEffect(() => {

  }); */

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
                      <li
                        key={index}
                        className={`
                          ${index < slideNumber ? styles.offLeft : styles.offRight}
                          ${index === slideNumber ? styles.active : ""}
                        `}
                      >
                        <h5>{slide.title}</h5>
                        <p>{slide.mainCopy}</p>
                      </li>
                    ))}
                  </ul>
                  <div className={`${styles.onboardingSlideControls}`}>
                    {/* slider content controls */}
                    <button
                      className={`${slideNumber === 0 ? styles.blockAction : ""} ${styles.slideLeftBtn} ghostIconBtn`}
                      onClick={(e) => moveSlide("backward")}
                    >
                      <img src="../../arrowLeftBlue.png" alt="" />
                    </button>
                    <ul>
                      {onboardingSlides?.map((slide, index) => (
                        <li
                          key={index}
                          className={`${index === slideNumber ? styles.active : ""}`}
                        ></li>
                      ))}
                    </ul>
                    <button
                      className={`${slideNumber === onboardingSlides.length - 1 ? styles.blockAction : ""} ${styles.slideRightBtn} ghostIconBtn`}
                      onClick={(e) => moveSlide("forward")}
                    >
                      <img src="../../arrowRightBlue.png" alt="" />
                    </button>
                  </div>
                </div>
                <div className={`${styles.rightContentContainer}`}>
                  <ul className={`${styles.mediaContainer}`}>
                    {/* images/media */}
                    {onboardingSlides?.map((slide, index) => (
                      <li
                        key={index}
                        className={`
                          ${index < slideNumber ? styles.offLeft : styles.offRight}
                          ${index === slideNumber ? styles.active : ""}
                        `}
                      >
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
