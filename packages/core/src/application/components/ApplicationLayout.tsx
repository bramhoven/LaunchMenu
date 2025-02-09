import {IDataHook} from "model-react";
import React, {useLayoutEffect, useRef, useState} from "react";
import {useResizeDetector} from "react-resize-detector";
import {UIPathView} from "../../components/context/paths/UIPathView";
import {StackView} from "../../components/context/stacks/StackView";
import {InstantChangeTransition} from "../../components/context/stacks/transitions/change/InstantChangeTransition";
import {SlideUpChangeTransition} from "../../components/context/stacks/transitions/change/slideChange/slideChangeDirectionts";
import {
    SlideRightCloseTransition,
    SlideUpCloseTransition,
} from "../../components/context/stacks/transitions/close/slideClose/slideCloseDirections";
import {
    SlideLeftOpenTransition,
    SlideDownOpenTransition,
} from "../../components/context/stacks/transitions/open/slideOpen/slideOpenDirectionts";
import {FillBox} from "../../components/FillBox";
import {IOContextProvider} from "../../context/react/IOContextContext";
import {getContextContentStack} from "../../context/uiExtracters/getContextContentStack";
import {getContextFieldStack} from "../../context/uiExtracters/getContextFieldStack";
import {getContextMenuStack} from "../../context/uiExtracters/getContextMenuStack";
import {Box} from "../../styling/box/Box";
import {useWindowSize} from "../../utils/hooks/useWindowSize";
import {LFC} from "../../_types/LFC";
import {usePaneIsVisible} from "../hooks/usePaneIsVisible";
import {IApplicationLayoutProps} from "./_types/IApplicationLayoutProps";

/**
 * A component to make up the application layout and handle opening an closing of panes
 */
export const ApplicationLayout: LFC<IApplicationLayoutProps> = ({
    context,
    menuWidthFraction = 0.4,
    fieldHeight = 60,
    defaultTransitionDuration = 200,
}) => {
    const fieldStackGetter = (h?: IDataHook) => getContextFieldStack(context, h);
    const fieldState = usePaneIsVisible(fieldStackGetter, defaultTransitionDuration);
    const menuStackGetter = (h?: IDataHook) => getContextMenuStack(context, h);
    const menuState = usePaneIsVisible(menuStackGetter, defaultTransitionDuration);
    const contentStackGetter = (h?: IDataHook) => getContextContentStack(context, h);
    const contentState = usePaneIsVisible(contentStackGetter, defaultTransitionDuration);

    // Combine the menu and content states
    const bottomDivisionState = useRef({
        leftOpen: true,
        rightOpen: true,
        duration: defaultTransitionDuration,
    }).current;
    const bottomSectionState = useRef({
        open: true,
        animating: false,
        duration: defaultTransitionDuration,
    }).current;
    if (
        menuState.open != menuState.prevOpen ||
        contentState.open != contentState.prevOpen
    ) {
        const bothClosed = !menuState.open && !contentState.open;
        if (bothClosed) {
            // If both left and right are closed, close the whole bottom
            bottomSectionState.open = false;
            // Copy the appropriate duration
            bottomSectionState.duration = menuState.prevOpen
                ? menuState.duration
                : contentState.duration;
        } else {
            const changeDuration =
                menuState.prevOpen != menuState.open
                    ? menuState.duration
                    : contentState.duration;
            // Update the left and right open states
            bottomDivisionState.leftOpen = menuState.open;
            bottomDivisionState.rightOpen = contentState.open;
            bottomDivisionState.duration = changeDuration;

            // Open the bottom section if it isn't already
            if (!bottomSectionState.open) {
                bottomSectionState.open = true;
                bottomSectionState.duration = changeDuration;

                // If the bottom section is about to open (and isn't still closing) instantly open the left and or right section
                if (!bottomSectionState.animating) bottomDivisionState.duration = 0;
            }
        }
    }

    // Obtain the layout size for animation calculations
    const [animating, setAnimating] = useState(false); // Skip animating on first render
    const layoutRef = useRef<HTMLElement>();
    const [size, setSize] = useState({width: 0, height: 0});

    const [sizeID, triggerSizeChange] = useState(0);
    const {ref: resizeRef} = useResizeDetector({
        onResize: () => triggerSizeChange(s => s + 1),
    });
    useLayoutEffect(() => {
        if (layoutRef.current) setSize(layoutRef.current.getBoundingClientRect());
        setTimeout(() => setAnimating(true));
    }, [layoutRef.current, sizeID]);

    // Return the layout with transition animations
    const horizontalDivision =
        (bottomDivisionState.leftOpen
            ? bottomDivisionState.rightOpen
                ? menuWidthFraction
                : 1
            : 0) * size.width;
    return (
        <IOContextProvider value={context}>
            <FillBox
                className="frame"
                elRef={[layoutRef, resizeRef]}
                display="flex"
                flexDirection="column"
                overflow="hidden">
                <Box
                    className="searchSection"
                    position="relative"
                    elevation="medium"
                    zIndex={1}
                    height={fieldState.open ? fieldHeight : 0}
                    transition={`${fieldState.duration}ms height`}>
                    <StackView
                        OpenTransitionComp={SlideDownOpenTransition}
                        ChangeTransitionComp={SlideUpChangeTransition}
                        CloseTransitionComp={SlideUpCloseTransition}
                        stackGetter={fieldStackGetter}
                    />
                </Box>
                <Box className="pathSection" background="bgPrimary">
                    <UIPathView
                        context={context}
                        pathTransitionDuration={defaultTransitionDuration}
                        heightTransitionDuration={defaultTransitionDuration}
                    />
                </Box>
                <Box
                    position="relative"
                    overflow="hidden"
                    flexGrow={bottomSectionState.open ? 1 : 0}
                    transition={
                        animating
                            ? `${bottomSectionState.duration}ms flex-grow`
                            : undefined
                    }>
                    <Box
                        position="absolute"
                        bottom="none"
                        height="100%"
                        width="100%"
                        // minHeight={size.height - fieldHeight}
                        display="flex">
                        <Box
                            position="relative"
                            background="bgTertiary"
                            flexShrink={0}
                            onAnimationStart={() => (bottomSectionState.animating = true)}
                            onAnimationEnd={() => (bottomSectionState.animating = false)}
                            transition={
                                animating
                                    ? `${bottomDivisionState.duration}ms width`
                                    : undefined
                            }
                            width={horizontalDivision}>
                            <Box
                                className="menuSection"
                                minWidth={size.width * menuWidthFraction}
                                width="100%"
                                height="100%"
                                right="none"
                                position="absolute">
                                <StackView
                                    OpenTransitionComp={SlideLeftOpenTransition}
                                    CloseTransitionComp={SlideRightCloseTransition}
                                    stackGetter={menuStackGetter}
                                />
                            </Box>
                        </Box>
                        <Box
                            position="relative"
                            flexGrow={1}
                            flexShrink={1}
                            background="bgSecondary">
                            <Box className="contentSection" width="100%" height="100%">
                                <StackView
                                    ChangeTransitionComp={InstantChangeTransition}
                                    stackGetter={contentStackGetter}
                                />
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </FillBox>
        </IOContextProvider>
    );
};
