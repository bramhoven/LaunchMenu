import {nativeImage} from "electron";
import Path from "path";

/** The icon to show in the tray */
export const trayIcon = nativeImage.createFromPath(
    Path.join(__dirname, "..", "..", "images", "trayIcon.png")
);

/** The icon to show in the taskbar */
export const windowIcon = nativeImage.createFromPath(
    Path.join(__dirname, "..", "..", "images", "windowIcon.png")
);
