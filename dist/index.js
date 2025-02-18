var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, Fragment, useCallback, useContext, useEffect, useMemo, useRef, useState, } from "react";
import { Animated, BackHandler, Pressable, StyleSheet, View, } from "react-native";
export const DialogContext = createContext({
    dialogs: [],
    closeAll() { },
    closeLast() { },
    add() { },
});
function DialogContextProvider({ children }) {
    const [dialogs, setDialogs] = useState([]);
    const lastIndex = dialogs.length === 0 ? 0 : dialogs.length - 1;
    // useEffect(() => {
    //   console.log({ dialogs });
    // }, [dialogs]);
    function closeAll() {
        setDialogs([]);
    }
    function add(d) {
        // console.log("adding");
        setDialogs((old) => [...old, d]);
        // console.log(dialogs.length, d, "prov");
    }
    function closeLast() {
        setDialogs((old) => {
            old.pop();
            const newDialogs = [...old];
            // console.log(old[0]?.toString());
            return newDialogs;
            // return [];
        });
        // console.log("closed last");
    }
    return (_jsx(DialogContext.Provider, { value: {
            dialogs,
            closeAll,
            closeLast,
            add,
        }, children: children }));
}
const FadeInUpView = (_a) => {
    var { children } = _a, props = __rest(_a, ["children"]);
    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(60)).current; // Starts 20px below
    useEffect(() => {
        Animated.timing(opacity, {
            toValue: 1,
            duration: 20,
            useNativeDriver: true,
        }).start();
        Animated.timing(translateY, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, []);
    return (_jsx(Animated.View, Object.assign({}, props, { style: [{ opacity, transform: [{ translateY }] }, props.style], children: children })));
};
export default function DialogProvider({ children }) {
    return (_jsx(DialogContextProvider, { children: _jsx(_DialogProvider, { children: children }) }));
}
function _DialogProvider({ children }) {
    const { dialogs } = useContext(DialogContext);
    // console.log(ctx.dialogs.length);
    useEffect(() => {
        // console.log({ dialogsEf: dialogs });
    }, [dialogs]);
    return (_jsxs(_Fragment, { children: [dialogs.length > 0 && (_jsx(_Fragment, { children: _jsx(View, { style: styles.wrapper, children: dialogs.map((d, i) => (_jsx(Fragment, { children: d }, i))) }) })), children] }));
}
function Root(_a) {
    var { children, closeOnOutsidePress, closeOnAndroidBack = true, controller } = _a, props = __rest(_a, ["children", "closeOnOutsidePress", "closeOnAndroidBack", "controller"]);
    useEffect(() => {
        const backAction = () => {
            if (controller.isOpen && closeOnAndroidBack) {
                controller.close();
                return true;
            }
            else {
                return false;
            }
        };
        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
        return () => backHandler.remove(); // Cleanup
    }, [controller, closeOnAndroidBack]);
    return (_jsxs(View, Object.assign({}, props, { style: [styles.root, props.style], children: [_jsx(Pressable, { onPress: () => {
                    if (closeOnOutsidePress)
                        controller.close();
                }, style: styles.backdrop }), children] })));
}
function Content(_a) {
    var { children } = _a, props = __rest(_a, ["children"]);
    return (_jsx(FadeInUpView, Object.assign({}, props, { style: [props.style, styles.content], children: children })));
}
export const Dialog = {
    Root,
    Content,
};
export function useDialog(dialog) {
    const [isOpen, setOpen] = useState(false);
    const ctx = useContext(DialogContext);
    const open = useCallback(() => {
        ctx.add(dialog({ open, close, isOpen: true }));
        setOpen(true);
    }, [ctx, dialog]);
    const close = useCallback(() => {
        ctx.closeLast();
        setOpen(false);
    }, [ctx]);
    const controller = useMemo(() => ({ isOpen, open, close }), [isOpen]);
    return controller;
}
const styles = StyleSheet.create({
    wrapper: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 30,
    },
    root: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 30,
        flexDirection: "row",
        justifyContent: "center",
    },
    backdrop: {
        position: "absolute",
        height: "100%",
        width: "100%",
        zIndex: 1,
        backgroundColor: "#00000044",
    },
    content: {
        position: "absolute",
        alignSelf: "center",
        margin: "auto",
        zIndex: 2,
    },
});
//# sourceMappingURL=index.js.map