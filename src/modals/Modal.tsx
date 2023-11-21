import { useEffect } from 'react';
import { RiCloseFill } from "react-icons/ri";

import Portal from './Portal';

type Props = {
    children: JSX.Element;
    isOpen: boolean;
    onClose: () => void;
    onRefresh?: () => void;
}

const Modal: React.FC<Props> = ({ children, isOpen, onClose, onRefresh }) => {
    useEffect(() => {
        const closeOnEscapeKey = (e: KeyboardEvent) => {
            e.key === 'Escape' ? onClose() : null;
            if (onRefresh != null){
                e.key === 'Escape' ? onRefresh() : null;
            }
        }
        document.body.addEventListener('keydown', closeOnEscapeKey);

        return () => document.body.removeEventListener('keydown', closeOnEscapeKey);
    }, [onClose, onRefresh]);

    if (!isOpen) {
        return null;
    }

    const handleClose = ()=>{
        onClose();
        if (onRefresh != null){
            onRefresh();
        }
    }

    return (
        <Portal wrapperId='company-form'>
            <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
                <div className="relative w-1/3 pb-10 rounded-md border shadow-lg shadow-slate-600 bg-white flex flex-col justify-center items-center h-fit mt-2">
                    <button className="absolute text-white top-4 right-4" onClick={handleClose}>
                        <RiCloseFill color='black' size='2rem' />
                    </button>
                    {children}
                </div>
            </div>
        </Portal>
    );
}

export default Modal;