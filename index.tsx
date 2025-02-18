import {
  createContext,
  Fragment,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Animated,
  BackHandler,
  Pressable,
  StyleSheet,
  View,
  ViewProps,
} from "react-native";

type DialogContextType = {
  dialogs: ReactNode[];
  closeAll: () => void;
  closeLast: () => void;
  add: (dialog: ReactNode) => void;
};

export const DialogContext = createContext<DialogContextType>({
  dialogs: [],
  closeAll() {},
  closeLast() {},
  add() {},
});

function DialogContextProvider({ children }: { children: ReactNode }) {
  const [dialogs, setDialogs] = useState<DialogContextType["dialogs"]>([]);
  const lastIndex = dialogs.length === 0 ? 0 : dialogs.length - 1;

  // useEffect(() => {
  //   console.log({ dialogs });
  // }, [dialogs]);

  function closeAll() {
    setDialogs([]);
  }

  function add(d: ReactNode) {
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

  return (
    <DialogContext.Provider
      value={{
        dialogs,
        closeAll,
        closeLast,
        add,
      }}
    >
      {children}
    </DialogContext.Provider>
  );
}

const FadeInUpView = ({ children, ...props }: ViewProps) => {
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

  return (
    <Animated.View
      {...props}
      style={[{ opacity, transform: [{ translateY }] }, props.style]}
    >
      {children}
    </Animated.View>
  );
};

export default function DialogProvider({ children }: { children: ReactNode }) {
  return (
    <DialogContextProvider>
      <_DialogProvider>{children}</_DialogProvider>
    </DialogContextProvider>
  );
}
function _DialogProvider({ children }: { children: ReactNode }) {
  const { dialogs } = useContext(DialogContext);
  // console.log(ctx.dialogs.length);

  useEffect(() => {
    // console.log({ dialogsEf: dialogs });
  }, [dialogs]);

  return (
    <>
      {dialogs.length > 0 && (
        <>
          <View style={styles.wrapper}>
            {dialogs.map((d, i) => (
              <Fragment key={i}>{d}</Fragment>
            ))}
          </View>
        </>
      )}
      {children}
    </>
  );
}

export type DialogBaseProps = {
  closeOnOutsidePress?: boolean;
  closeOnAndroidBack?: boolean;
  controller: DialogController;
};

function Root({
  children,
  closeOnOutsidePress,
  closeOnAndroidBack = true,
  controller,
  ...props
}: ViewProps & DialogBaseProps) {
  useEffect(() => {
    const backAction = () => {
      if (controller.isOpen && closeOnAndroidBack) {
        controller.close();
        return true;
      } else {
        return false;
      }
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove(); // Cleanup
  }, [controller, closeOnAndroidBack]);

  return (
    <View {...props} style={[styles.root, props.style]}>
      <Pressable
        onPress={() => {
          if (closeOnOutsidePress) controller.close();
        }}
        style={styles.backdrop}
      />
      {/* <FadeInUpView className="bg-black h-50 w-50"> */}
      {children}
      {/* </FadeInUpView> */}
    </View>
  );
}

function Content({ children, ...props }: ViewProps) {
  return (
    <FadeInUpView {...props} style={[props.style, styles.content]}>
      {children}
    </FadeInUpView>
  );
}

export const Dialog = {
  Root,
  Content,
};

export type DialogController = {
  open: () => void;
  close: () => void;
  isOpen: boolean;
};

export function useDialog(
  dialog: (d: DialogController) => ReactNode
): DialogController {
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
