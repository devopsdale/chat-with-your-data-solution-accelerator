import * as React from "react";
import { useEffect } from "react";
import {
  InlineDrawer,
  Menu,
  MenuTrigger,
  MenuPopover,
  // MenuProps,
  MenuList,
  MenuItem,
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogTrigger,
  Button,
  useId,
  Input,
  // useRestoreFocusTarget,
} from "@fluentui/react-components";
import styles from "./Sidebar.module.css";

// ↓ mocking Threads list until API is ready
const threads = [
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
];

export const Sidebar = () => {
  const [isOpen, setIsOpen] = React.useState(true);
  const [copyClicked, setCopyClicked] = React.useState<boolean>(false);

  const [renameThreadModalOpen, setRenameThreadModalOpen] =
    React.useState(false);
  const [deleteThreadModalOpen, setDeleteThreadModalOpen] =
    React.useState(false);

  const [currentThread, setCurrentThread] = React.useState<any>({});
  const inputId = useId("input");
  const [liveRecognizedText, setLiveRecognizedText] =
    React.useState<string>("");

  const createNewThread = () => {
    alert("Threads coming soon 🎉");
  };

  const threadClicked = (threadId: number) => {
    alert("Will soon load thread: " + threadId);
  };

  const handleCopyClick = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopyClicked(true);
  };

  const resetCopyClick = () => {
    setTimeout(() => {
      setCopyClicked(false);
    }, 500);
  };

  const detectKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case "[":
        setIsOpen(false);
        break;

      case "]":
        setIsOpen(true);
        break;

      /* case "[":
        setIsOpen(false);
        break; */

      default:
        break;
    }
  };

  const detectKeyUp = (e: KeyboardEvent) => {
    /* if (e.key === "Shift" || e.key === "Control") {
      // console.log("Control un-clicked");
    } */
  };

  const renameCurrentThread = (newName: string) => {
    if (newName.length > 0) {
      // this is where we can hit the API to rename the thread
      // can use `currentThread` to get threadId until routes established
      alert("✏ Will soon rename this Thread to '" + newName + "'");
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", detectKeyDown, true);
    document.addEventListener("keyup", detectKeyUp, true);

    return () => {
      document.removeEventListener("keydown", detectKeyDown, true);
      document.removeEventListener("keyup", detectKeyUp, true);
    };
  }, []);

  return (
    <div className={styles.sidebar}>
      <InlineDrawer
        open={isOpen}
        // onOpenChange={(_, { open }) => setIsOpen(open)}
        style={{
          width: "auto",
          borderRight: "1px solid #D4D4D4",
          boxShadow: "0px 1px 4px 0px #0000003D",
        }}
      >
        <div className={styles.sidebarMain}>
          <div className={styles.sidebarHeader}>
            <div
              className={styles.newThreadActions}
              onClick={(e) => createNewThread()}
            >
              <div className={styles.newThreadBtn}>
                <img src="../../plusIcon.png" />
                <span>New Thread</span>
              </div>
              <div className={styles.newThreadHotkeyIcons}>
                <img src="../../Cntrl_key_icon.png" />
                <img src="../../K_key_icon.png" />
              </div>
            </div>

            <div
              className={`${styles.closeSideBarBtn} ghostIconBtn`}
              onClick={() => setIsOpen(false)}
            >
              <img src="../../dock_to_right.png" alt="close side bar button" />
            </div>
          </div>

          <div className={styles.sidebarBody}>
            <span className={styles.threadsHeader}>Threads</span>
            <ul className={`menuListContainer`}>
              {threads.map((thread, index) => (
                <li
                  key={index}
                  // ↓ testing 'activeListItem' style on first <li>, should be driven by url
                  className={`${styles.threadMenuItem} ${index === 0 ? "activeListItem" : ""} menuListItem`}
                  onClick={(e) => threadClicked(thread.id)}
                >
                  <div className={`listItemLabel`}>
                    <img src="../../threadIcon.png" />
                    <span>{thread.title}</span>
                  </div>
                  <Menu>
                    <MenuTrigger disableButtonEnhancement>
                      <div
                        className={`${styles.threadMenu} ghostIconBtn`}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <img src="../../ellipsesIconBlue.png" />
                      </div>
                      {/*  <div className={styles.copiedToClipboard}>
                          <img
                            src="../../copiedIcon.png"
                            alt="Pronto link copied to clipbaord"
                          />
                          <span>Link copied to clipboard!</span>
                        </div> */}
                    </MenuTrigger>

                    <MenuPopover style={{ padding: "0px" }}>
                      <MenuList
                        className={`${styles.headerMenu} menuListContainer`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MenuItem
                          className={`${styles.threadLink} menuListItem`}
                          onClick={handleCopyClick}
                        >
                          <div
                            className={`${styles.threadItemLabel} listItemLabel`}
                          >
                            <img src="../../shareLinkIcon_blue.png" />
                            <span>Share Thread</span>
                          </div>
                        </MenuItem>
                        <MenuItem
                          className={`${styles.threadLink} menuListItem`}
                          onClick={() => {
                            setCurrentThread(thread);
                            setRenameThreadModalOpen(true);
                          }}
                        >
                          <div
                            className={`${styles.threadItemLabel} listItemLabel`}
                          >
                            <img src="../../editIcon.png" />
                            <span>Rename</span>
                          </div>
                        </MenuItem>
                        <MenuItem
                          className={`${styles.threadLink} menuListItem`}
                          onClick={() => {
                            // it is the user responsibility to open the dialog
                            setDeleteThreadModalOpen(true);
                          }}
                        >
                          <div
                            className={`${styles.threadItemLabel} listItemLabel`}
                          >
                            <img src="../../deleteIcon.png" />
                            <span>Delete Thread</span>
                          </div>
                        </MenuItem>
                      </MenuList>
                    </MenuPopover>
                  </Menu>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </InlineDrawer>

      <div
        className={`${styles.openSideMenuBtn} ghostIconBtn`}
        onClick={() => setIsOpen(true)}
      >
        <img src="../../dock_to_right_outline.png" />
      </div>

      {/* ↓ Dialog for renaming a Thread */}
      <Dialog
        open={renameThreadModalOpen}
        onOpenChange={(event, data) => {
          setRenameThreadModalOpen(data.open);
        }}
      >
        <DialogSurface className={`${styles.renameThreadModal} prontoModal`}>
          <DialogBody>
            <DialogTitle>Rename Thread</DialogTitle>
            <div
              className={`ghostIconBtn closeModalBtn`}
              onClick={() => setRenameThreadModalOpen(false)}
            >
              <img src="../../closeIconBlue.png" />
            </div>
            <DialogContent>
              <div className={`${styles.renameInfo}`}>
                Rename the <b>{currentThread.title || "current"}</b> thread
              </div>
              <Input
                className={"prontoInput"}
                id={inputId}
                // {...props}
                placeholder={"Type a new thread name"}
                /*contentAfter={
                  {
                     <ArrowEnterFilled
                    aria-label="Enter with password"
                    onClick={(e) => submitLogInField(liveRecognizedText)}
                  />
                  }
                }*/
                onChange={(e, newValue) => {
                  if (newValue !== undefined) {
                    setLiveRecognizedText(newValue.value);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    renameCurrentThread(liveRecognizedText);
                  }
                }}
              />
            </DialogContent>

            <DialogActions>
              <DialogTrigger disableButtonEnhancement>
                <Button appearance="secondary">Cancel</Button>
              </DialogTrigger>
              <Button
                appearance="primary"
                className={`${liveRecognizedText.length > 0 ? "" : "disabled"}`}
                onClick={(e) => renameCurrentThread(liveRecognizedText)}
              >
                Rename
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>

      {/* ↓ Dialog for deleting a Thread */}
      <Dialog
        open={deleteThreadModalOpen}
        onOpenChange={(event, data) => {
          setDeleteThreadModalOpen(data.open);
        }}
      >
        <DialogSurface>
          <DialogBody>
            <DialogTitle>Delete Thread</DialogTitle>
            <DialogContent>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
              exercitationem cumque repellendus eaque est dolor eius expedita
              nulla ullam? Tenetur reprehenderit aut voluptatum impedit
              voluptates in natus iure cumque eaque?
            </DialogContent>

            <DialogActions>
              <DialogTrigger disableButtonEnhancement>
                <Button appearance="secondary">Cancel</Button>
              </DialogTrigger>
              <Button appearance="primary">Delete</Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </div>
  );
};
