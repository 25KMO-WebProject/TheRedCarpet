import { useEffect } from "react";
import "./SignUpModal.css"

function SignUpModal({ isOpen, onClose }) {
    useEffect(() => {
        function handleEsc(event) {
            if (event.key === "Escape") {
                onClose()
            }
        }

        if (isOpen) {
            document.addEventListener("keydown", handleEsc)
            document.body.style.overflow = "hidden"
        }

        return () => {
            document.removeEventListener("keydown", handleEsc)
            document.body.style.overflow = ""
        }
    }, [isOpen, onClose])

    if (!isOpen) {
        return null
    }

    function handleSignUp(event) {
        event.preventDefault();

        const formData = new FormData(event.target)

        const username = formData.get("username")
        const email = formData.get("email")
        const password = formData.get("password")
    }

    function handleOverlayClick(event) {
        if (event.target == event.currentTarget) {
            onClose()
        }
    }
    //Itse etusivu näkymä
    return (
        <div className="overlay-modal"
        onClick={handleOverlayClick}
        >
            <section 
             className="SignUp-modal"
             role="dialog"
             >
                /*Sulkemis näppäin*/
                <button
                    type="button"
                    className="close-button"
                    onClick={onClose}
                    aria-label="X"
                    >
                        &times;
                    </button>

                    <h2>Title</h2>
                    <form onSubmit={handleSignUp}>
                        <label htmlFor="username">
                            Username
                        </label>
                        <input
                        id="username"
                        name="username"
                        type="text"
                        placeholder="test"
                        maxLength={64}
                        required
                        />
                        /*Kohdat mihin kirjoitetaan email ja salasana rajoituksineen*/
                        <label htmlFor="email">
                            email
                        </label>
                        <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="test@foo.com"
                        maxLength={64}
                        required
                        />

                        <label htmlFor="password">
                            password
                        </label>
                        <input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="password"
                        minLength={8}
                        maxLength={64}
                        pattern="(?=.*[A-Z])(?=.*[0-9]).{8,64}"
                        /*Tähän voisi lisätä titlen niin käyttäjä huomaa vaatimukset*/
                        required
                        />
                        <button 
                        type="submit"
                        className="submit"
                        >
                            Register
                        </button>
                    </form>
            </section>
        </div>
    )
}
export default SignUpModal