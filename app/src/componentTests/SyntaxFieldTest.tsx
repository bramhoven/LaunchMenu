import React, {FC} from "react";
import {TextField} from "../textFields/TextField";
import {KeyHandlerStack} from "../stacks/keyHandlerStack/KeyHandlerStack";
import {KeyHandler} from "../stacks/keyHandlerStack/KeyHandler";
import {createTextFieldKeyHandler} from "../textFields/interaction/keyHandler.ts/createTextFieldKeyHandler";
import {parser} from "../textFields/syntax/test";
import {FillBox} from "../components/FillBox";
import {Box} from "../styling/box/Box";
import {SyntaxField} from "../components/fields/syntaxField/SyntaxField";

const inputStack = new KeyHandlerStack(new KeyHandler(window));
const textField = new TextField("I like trains.");
inputStack.push(createTextFieldKeyHandler(textField, true));

export const SyntaxFieldTest: FC = () => {
    return (
        <FillBox background="bgPrimary">
            <Box css={{fontSize: 30, paddingLeft: 30}}>
                <SyntaxField highlighter={parser} field={textField} />
            </Box>
        </FillBox>
    );
};
