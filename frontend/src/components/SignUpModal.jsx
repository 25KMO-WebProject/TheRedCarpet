import { useEffect } from "react";
import "./SignUpModal.css"

function SignUpModal({ isOpen, onClose }) {
    useEffect(() => {
        function handleEsc(event) {
            if (event.key === "Escape") {
                onClose()
            }
        }
    })
}