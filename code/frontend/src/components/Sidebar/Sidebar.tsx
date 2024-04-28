import * as React from "react";
import { useEffect } from "react";
import {
  InlineDrawer,
  Menu,
  MenuTrigger,
  MenuPopover,
} from "@fluentui/react-components";
import styles from "./Sidebar.module.css";

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

  const createNewThread = () => {
    alert("Threads coming soon 🎉");
  };

  const threadClicked = (threadId: number) => {
    alert("Will soon load thread: " + threadId);
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
                        onClick={(e) => e.stopPropagation()}
                      >
                        <img src="../../ellipsesIconBlue.png" />
                      </div>
                    </MenuTrigger>

                    <MenuPopover style={{ padding: "0px" }}>
                      <ul
                        className={`${styles.headerMenu} menuListContainer`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <li className={`menuListItem disabled`}>
                          <div className={`listItemLabel`}>
                            <img src="../../shareLinkIcon_blue.png" />
                            <span>Share Thread</span>
                          </div>
                        </li>
                        <li className={`menuListItem disabled`}>
                          <div className={`listItemLabel`}>
                            <img src="../../editIcon.png" />
                            <span>Rename</span>
                          </div>
                        </li>
                        <li className={`menuListItem disabled`}>
                          <div className={`listItemLabel`}>
                            <img src="../../deleteIcon.png" />
                            <span>Delete Thread</span>
                          </div>
                        </li>
                      </ul>
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
    </div>
  );
};
