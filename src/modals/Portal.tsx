import { useState, useLayoutEffect } from "react";
import { createPortal } from "react-dom";

import modalWrapper from "../utils/modalWrapper";

type Props = {
    children: JSX.Element;
    wrapperId: string;
}

const ReactPortal: React.FC<Props> = ({children, wrapperId}) => {
    const [wrapperElement, setWrapperElement] = useState<HTMLElement | null>(null);
    // adding this flag so we never cleanup dom elements not created dynamically in code
    let systemCreated = false;

    useLayoutEffect(() => {
        let modalElement = document.getElementById(wrapperId);
        if (!modalElement) {
            modalElement = modalWrapper(wrapperId);
        }
    
        setWrapperElement(modalElement);

        () => {
            if (systemCreated && modalElement?.parentNode) {
                modalElement.parentNode.removeChild(modalElement);
            }
        }
    }, [wrapperId, systemCreated]); // Ignoring the warning here because we don't want to re-run this effect if the systemCreated flag changes
    
    if (!wrapperElement) {
        systemCreated = true;
        return null;
    }

    return createPortal(children, wrapperElement);
}

export default ReactPortal;