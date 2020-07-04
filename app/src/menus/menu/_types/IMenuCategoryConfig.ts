import {IMenuItem} from "../../_types/IMenuItem";
import {ICategory} from "../../category/_types/ICategory";

/**
 * Configuration for the categories in a menu
 */
export type IMenuCategoryConfig = {
    /**
     * Retrieves a category menu item
     * @param item The item to obtain the category of
     * @returns The category to group this item under, if any
     */
    readonly getCategory?: (item: IMenuItem) => ICategory | undefined;

    /**
     * Retrieves the order of the categories
     * @param categories The categories to sort with relevant data
     * @returns The order of the categories
     */
    readonly sortCategories?: (
        categories: {
            /** The category */
            category: ICategory | undefined;
            /** The items in this category */
            items: IMenuItem[];
        }[]
    ) => (undefined | ICategory)[];

    /**
     * The maximum number of items per category
     */
    readonly maxCategoryItemCount?: number;
};
