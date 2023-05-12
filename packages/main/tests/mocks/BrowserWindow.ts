// https://github.com/electron/fiddle/blob/fbb7e3389bef926ce9e0063451943b6bb596cdaf/tests/mocks/browser-window.ts

import { EventEmitter } from "events";

import { WebContentsMock } from "./WebContents";
import { vi } from "vitest";

export class BrowserWindowMock extends EventEmitter {
  public static getAllWindows = vi.fn();
  public static getFocusedWindow = vi.fn();
  public static fromWebContents = vi.fn();
  public static fromId = vi.fn();
  public static addDevToolsExtension = vi.fn();
  public static removeDevToolsExtension = vi.fn();
  public static getDevToolsExtension = vi.fn();

  public blur = vi.fn();
  public blurWebView = vi.fn();
  public capturePage = vi.fn();
  public center = vi.fn();
  public close = vi.fn();
  public closeFilePreview = vi.fn();
  public destroy = vi.fn();
  public flashFrame = vi.fn();
  public focus = vi.fn();
  public focusOnWebView = vi.fn();
  public getAspectRatio = vi.fn();
  public getBrowserView = vi.fn();
  public getChildWindows = vi.fn();
  public getContentBounds = vi.fn();
  public getContentSize = vi.fn();
  public getMaximumSize = vi.fn();
  public getMinimumSize = vi.fn();
  public getNativeWindowHandle = vi.fn();
  public getParentWindow = vi.fn();
  public getPosition = vi.fn();
  public getRepresentedFilename = vi.fn();
  public getSize = vi.fn();
  public getTitle = vi.fn();
  public hasShadow = vi.fn();
  public hide = vi.fn();
  public hookWindowMessage = vi.fn();
  public isAlwaysOnTop = vi.fn();
  public isClosable = vi.fn();
  public isDestroyed = vi.fn();
  public isDocumentEdited = vi.fn();
  public isFullScreen = vi.fn();
  public isFullScreenable = vi.fn();
  public isHidden = vi.fn();
  public isKiosk = vi.fn();
  public isFocused = vi.fn();
  public isMaximizable = vi.fn();
  public isMaximized = vi.fn();
  public isMenuBarAutoHide = vi.fn();
  public isMenuBarVisible = vi.fn();
  public isMinimized = vi.fn();
  public isMinimizable = vi.fn();
  public isModal = vi.fn();
  public isMovable = vi.fn();
  public isResizable = vi.fn();
  public isVisible = vi.fn(() => true);
  public isVisibleOnAllWorkspaces = vi.fn();
  public isWindowMessageHooked = vi.fn();
  public loadURL = vi.fn();
  public loadFile = vi.fn();
  public loadURl = vi.fn();
  public maximize = vi.fn();
  public minimize = vi.fn();
  public previewFile = vi.fn();
  public reload = vi.fn();
  public restore = vi.fn();
  public setBounds = vi.fn();
  public setAlwaysOnTop = vi.fn();
  public setAppDetails = vi.fn();
  public setAspectRatio = vi.fn();
  public setAutoHideMenuBar = vi.fn();
  public setAutoHideCursor = vi.fn();
  public setBrowserView = vi.fn();
  public setClosable = vi.fn();
  public setContentBounds = vi.fn();
  public setContentProtection = vi.fn();
  public setContentSize = vi.fn();
  public setDocumentEdited = vi.fn();
  public setFocusable = vi.fn();
  public setFullScreen = vi.fn();
  public setFullScreenable = vi.fn();
  public setHasShadow = vi.fn();
  public setIcon = vi.fn();
  public setIgnoreMouseEvents = vi.fn();
  public setKiosk = vi.fn();
  public setMaximizable = vi.fn();
  public setMenu = vi.fn();
  public setMenuBarVisibility = vi.fn();
  public setMenuBarAutoHide = vi.fn();
  public setMaximumSize = vi.fn();
  public setMinimumSize = vi.fn();
  public setMinimizable = vi.fn();
  public setPosition = vi.fn();
  public setSize = vi.fn();
  public setMovable = vi.fn();
  public setOverlayIcon = vi.fn();
  public setParentWindow = vi.fn();
  public setProgressBar = vi.fn();
  public setRepresentedFilename = vi.fn();
  public setResizable = vi.fn();
  public setSheetOffset = vi.fn();
  public setSkipTaskbar = vi.fn();
  public setThumbarButtons = vi.fn();
  public setThumbnailClip = vi.fn();
  public setThumbnailToolTip = vi.fn();
  public setTitle = vi.fn();
  public setVibrancy = vi.fn();
  public setVisibleOnAllWorkspaces = vi.fn();
  public show = vi.fn();
  public showDefinitionForSelection = vi.fn();
  public showInactive = vi.fn();
  public unhookWindowMessage = vi.fn();
  public unhookAllWindowMessages = vi.fn();
  public unmaximize = vi.fn();

  public getBounds = vi.fn(() => {
    return { x: 0, y: 0, width: 1920, height: 1080 };
  });

  public webContents = new WebContentsMock();
  public id = 1;

  constructor() {
    super();
  }
}
