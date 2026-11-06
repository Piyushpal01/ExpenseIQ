// A reusable dark-themed Modal wrapper that renders any content inside a popup overlay.

import { useEffect, useRef } from "react"
import gsap from 'gsap'

const Modal = ({ isOpen, onClose, children }) => {
    const modalRef = useRef()
    const overlayRef = useRef()

    useEffect(() => {
        // Animate and reveal elements if the modal is actively opened
        if (isOpen) {
            gsap.fromTo(overlayRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.3, ease: 'power2.out' }
            );
            gsap.fromTo(modalRef.current,
                { y: 50, opacity: 0, scale: 0.95 },
                { y: 0, opacity: 1, duration: 0.4, ease: 'back.out(1.2)' }
            );
        }
    }, [isOpen])

    // if modal is not opened, do not render
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Background Overlay: modal closed on Click */}
            <div
                ref={overlayRef}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Modal Content Container */}
            <div
                ref={modalRef}
                className="relative z-10 w-full max-w-md"
            >
                {children}
            </div>
        </div>
    )
}
export default Modal