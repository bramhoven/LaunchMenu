import React, {memo} from "react";
import {ICategory} from "../actions/types/category/_types/ICategory";
import {MenuItemFrame} from "../../components/items/MenuItemFrame";
import {MenuItemLayout} from "../../components/items/MenuItemLayout";

/**
 * Creates a new context menu category, based on the number of items that have the action in this category
 * @param count The number of items that has the actions in this category
 * @param totalCount The total number of items for the context menu
 * @returns The context menu category
 */
export function createContextCategory(count: number, totalCount: number): ICategory {
    return {
        name: `Context menu category ${count}/${totalCount}`,
        description:
            "The category for context menu items indicating how many are correct",
        item: {
            view: memo(props => (
                <MenuItemFrame {...props}>
                    <MenuItemLayout
                        content={
                            <>
                                {count}/{totalCount}
                            </>
                        }
                    />
                </MenuItemFrame>
            )),
            actionBindings: [],
        },
    };
}

const cached: {[count: number]: {[totalCount: number]: ICategory}} = {};
/**
 * Creates a new context menu category for the given params if not present yet, or returns it from the cache otherwise
 * @param count The number of items that has the actions in this category
 * @param totalCount The total number of items for the context menu
 * @returns The context menu category
 */
export function getContextCategory(count: number, totalCount: number): ICategory {
    // Try to retrieve the category from the cache
    const fromCache = cached[count]?.[totalCount];
    if (fromCache) return fromCache;

    // Create the new category and add it to the cache
    const newCategory = createContextCategory(count, totalCount);
    if (!cached[count]) cached[count] = {};
    cached[count][totalCount] = newCategory;

    // Return the new category
    return newCategory;
}
