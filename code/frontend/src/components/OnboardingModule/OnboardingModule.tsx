import * as React from "react";
import {
  Dialog,
  DialogSurface,
  DialogBody,
  DialogContent,
} from "@fluentui/react-components";
import styles from "./OnboardingModule.module.css";

// ↓ data for Onboarding slides
const onboardingSlides = [
  {
    title: "🤖 Welcome to Pronto",
    mainCopy:
      "Pronto helps combine and analyze information about the aviation market. Pronto will help you by reducing the time spent reading, analyzing and synthesizing different market intelligence sources. It is not able to understand overarching trends and is dependent on the data it has access to for its responses.",
    ctas: [],
    mediaContent: {
      imgUrl: "../../onboarding/overviewSlide.png",
    },
  },
  {
    title: "📚 Adding Sources to Pronto",
    mainCopy: `Over time, Pronto will change to become more relevant to your needs. You can help it get better by adding relevant market intelligence sources (links, text or PDFs).<br>To start, you can add new <b>publicly available</b> sources you find to Pronto's knowledge set.`,
    ctas: [
      {
        title: "Add a source",
        url: "https://web-5cmvhl67t5ruq-admin.azurewebsites.net/Ingest_Data",
        action: null,
        iconPath: "../../addSourceTooltipIcon.png",
        iconPos: "left",
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
    ctas: [],
    mediaContent: {
      imgUrl: "../../onboarding/promptingPronto.png",
    },
  },
  {
    title: "🦾 Benefits",
    mainCopy:
      "Skip the SEO and advertisements to get right into synthesizing the relevant market intelligence and thinking about how it might impact Airbus. Use Pronto to help distill your message based on the audience you are serving.",
    ctas: [],
    mediaContent: {
      imgUrl: "../../onboarding/benefits.png",
    },
  },
  {
    title: "🏁 Get Started",
    mainCopy: `
      Try one of these sample prompts or dive in with your own!
      `,
    specialContent: `getStartedLinks`,
    ctas: [
      {
        title: "Get Started",
        url: null,
        action: `closeNoticeTrigger(false)`,
        iconPath: "../../arrowRightWhite.png",
        iconPos: "right",
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
  searchTerm: (term: string) => void;
}

export const OnboardingModule = ({
  isOpen,
  closeNotice,
  searchTerm,
}: OnboardingModuleProps) => {
  const [slideNumber, setSlideNumber] = React.useState(0);
  let curSlide = slideNumber;

  const closeNoticeTrigger = (close: boolean) => {
    closeNotice(close);
    setSlideNumber(0); // reset slider to first frame
  };

  const triggerSearch = (term: string) => {
    alert("functionality coming soon!");
    // closeNoticeTrigger(false);
    // searchTerm(term);
  };

  const moveSlide = (dir: string) => {
    if (dir === "forward") {
      curSlide++;
    } else {
      curSlide--;
    }
    setSlideNumber(curSlide);
  };

  const getStartedLinks = (
    <ul className={`${styles.getStartedLinks}`}>
      <li
        className={`listItemLabel disabled`}
        onClick={(e) =>
          triggerSearch("What is an STC? Explain it to me like I’m 5.")
        }
      >
        <img src="../../threadIconFilled.png" />
        <span>What is an STC? Explain it to me like I’m 5.</span>
      </li>
      <li
        className={`listItemLabel disabled`}
        onClick={(e) => triggerSearch("What’s the latest news on SAF?")}
      >
        <img src="../../threadIconFilled.png" />
        <span>What’s the latest news on SAF?</span>
      </li>
      <li
        className={`listItemLabel disabled`}
        onClick={(e) => triggerSearch("Can you summarize this text for me?:")}
      >
        <img src="../../threadIconFilled.png" />
        <span>Can you summarize this text for me?:</span>
      </li>
    </ul>
  );

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
                        <p
                          dangerouslySetInnerHTML={{ __html: slide.mainCopy }}
                        ></p>
                        {slide.specialContent && eval(slide.specialContent)}
                      </li>
                    ))}
                  </ul>

                  {onboardingSlides?.map((slide, i) => (
                    <div
                      key={i}
                      className={`
                      ${styles.ctaContainer}
                      ${i < slideNumber ? styles.offLeft : styles.offRight}
                      ${i === slideNumber ? styles.active : ""}
                    `}
                    >
                      {slide.ctas?.map((cta, ii) => (
                        <div
                          key={ii}
                          className={`
                            ${styles.onboardingCTA}
                            ${cta.iconPos === "right" ? styles.iconRight : styles.iconLeft}
                            listItemLabel
                          `}
                          onClick={(e) => {
                            if (cta.url) {
                              window.open(cta.url, "_blank");
                            }
                            if (cta.action) {
                              eval(cta.action);
                            }
                          }}
                        >
                          <img src={cta.iconPath} />
                          <span>{cta.title}</span>
                        </div>
                      ))}
                    </div>
                  ))}

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
