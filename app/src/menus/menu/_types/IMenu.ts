import {IDataHook} from "model-react";
import {IMenuItem} from "../../_types/IMenuItem";

export type IMenu = {
    /**
     * Retrieves all items in the menu
     * @param hook The hook to subscribe to changes
     * @returns All items including category items in the correct sequence
     */
    getItems(hook: IDataHook): IMenuItem[];

    /**
     * Retrieves the currently selected items of the menu
     * @param hook The hook to subscribe to changes
     * @returns The selected menu items
     */
    getSelected(hook: IDataHook): IMenuItem[];

    /**
     * Retrieves the item that's currently at the cursor of the menu
     * @param hook The hook to subscribe to changes
     * @returns The cursor item
     */
    getCursor(hook: IDataHook): IMenuItem | null;
};
