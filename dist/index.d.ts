import { type ReactNode } from "react";
import { type ViewProps } from "react-native";
type DialogContextType = {
    dialogs: ReactNode[];
    closeAll: () => void;
    closeLast: () => void;
    add: (dialog: ReactNode) => void;
};
export declare const DialogContext: import("react").Context<DialogContextType>;
export default function DialogProvider({ children }: {
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export type DialogBaseProps = {
    closeOnOutsidePress?: boolean;
    closeOnAndroidBack?: boolean;
    controller: DialogController;
};
declare function Root({ children, closeOnOutsidePress, closeOnAndroidBack, controller, ...props }: ViewProps & DialogBaseProps): import("react/jsx-runtime").JSX.Element;
declare function Content({ children, ...props }: ViewProps): import("react/jsx-runtime").JSX.Element;
export declare const Dialog: {
    Root: typeof Root;
    Content: typeof Content;
};
export type DialogController = {
    open: () => void;
    close: () => void;
    isOpen: boolean;
};
export declare function useDialog(dialog: (d: DialogController) => ReactNode): DialogController;
export {};
//# sourceMappingURL=index.d.ts.map