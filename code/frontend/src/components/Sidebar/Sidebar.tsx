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
  MenuProps,
  // useRestoreFocusTarget,
} from "@fluentui/react-components";
import styles from "./Sidebar.module.css";
import { EditFilled } from "@fluentui/react-icons";

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

  const [threadListMenuOpen, setThreadListMenuOpen] = React.useState(false);
  const [threadListMenuSelected, setThreadListMenuSelected] = React.useState(0);
  const onThreadOpenChange: MenuProps["onOpenChange"] = (e, data) => {
    setThreadListMenuOpen(data.open);
  };

  const [copiedThreadNotice, setCopiedThreadNotice] = React.useState(false);

  const createNewThread = () => {
    alert("Threads coming soon 🎉");
  };

  const threadClicked = (threadId: number) => {
    alert("Will soon load thread: " + threadId);
  };

  const handleCopyClick = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopyClicked(true);
    setCopiedThreadNotice(true);
    resetCopyClick();
  };

  const resetCopyClick = () => {
    setTimeout(() => {
      setCopyClicked(false);
      setCopiedThreadNotice(false);
    }, 2000);
  };

  const detectKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case "[":
        setIsOpen(false);
        break;

      case "]":
        setIsOpen(true);
        break;

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
      setRenameThreadModalOpen(false);
    }
  };

  const deleteCurrentThread = () => {
    // this is where we can hit the API to delete the thread
    // can use `currentThread` to get threadId until routes established
    alert("🚮 Will soon delete thread id: " + currentThread.id);
    setDeleteThreadModalOpen(false);
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
          overflow: "initial"
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
                  className={`
                    ${styles.threadMenuItem} ${index === 0 ? "activeListItem" : ""} menuListItem
                  `}
                  onClick={(e) => threadClicked(thread.id)}
                >
                  <div className={`listItemLabel`}>
                    <img src="../../threadIcon.png" />
                    <span>{thread.title}</span>
                  </div>
                  <Menu onOpenChange={onThreadOpenChange}>
                    <MenuTrigger disableButtonEnhancement>
                      <div
                        className={`
                        ${threadListMenuOpen && threadListMenuSelected === index ? styles.threadMenuOpen : ""}
                        ${styles.threadMenu} ghostIconBtn`}
                        onClick={(e) => {
                          setThreadListMenuSelected(index);
                          e.stopPropagation();
                        }}
                      >
                        <img src="../../ellipsesIconBlue.png" />
                      </div>
                    </MenuTrigger>

                    <MenuPopover
                      className={styles.threadMenuContainer}
                      style={{ padding: "0px" }}
                    >
                      <div className={styles.trianglePointer}></div>
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
                            setLiveRecognizedText("");
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
                            setCurrentThread(thread);
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
                  <div className={`
                    ${styles.copiedToClipboard}
                    ${copiedThreadNotice  && threadListMenuSelected === index ? styles.showThreadCopiedNotice : ''}
                  `}>
                    <div className={styles.sideTriangle}></div>
                    <img
                      src="../../copiedIcon.png"
                      alt="Pronto link copied to clipboard"
                    />
                    <span>Link copied to clipboard!</span>
                  </div>
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
                placeholder={"Type a new thread name"}
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
                <Button className={`secondary`}>Cancel</Button>
              </DialogTrigger>
              <Button
                className={`${liveRecognizedText.length > 0 ? "" : "disabledBtn"} primary`}
                onClick={(e) => renameCurrentThread(liveRecognizedText)}
              >
                <EditFilled />
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
        <DialogSurface className={`${styles.deleteThreadModal} prontoModal`}>
          <DialogBody>
            <DialogTitle>Delete Thread?</DialogTitle>
            <div
              className={`ghostIconBtn closeModalBtn`}
              onClick={() => setDeleteThreadModalOpen(false)}
            >
              <img src="../../closeIconBlue.png" />
            </div>
            <DialogContent>
              Please confirm you are ready to delete this thread.
            </DialogContent>

            <DialogActions>
              <DialogTrigger disableButtonEnhancement>
                <Button className={`secondary`}>Cancel</Button>
              </DialogTrigger>
              <Button
                className={`error`}
                onClick={(e) => deleteCurrentThread()}
              >
                <img src="../../deleteIconWhite.png" />
                Delete
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </div>
  );
};
