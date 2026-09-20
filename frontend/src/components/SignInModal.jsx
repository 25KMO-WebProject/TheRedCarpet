import { useEffect } from "react";
import "./SignUpModal.css"

function SignInModal({ isOpen, onClose }) {
    useEffect(() => {
        function handleEsc(event) {
            if (event.key === "Escape") {
                onClose()
            }
        }
        //Kuuntelee, mitä näppäimiä painetaan, esim tuleeko se Esc-näppäin
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
    function handleSignIn(event) {
        event.preventDefault();

        const formData = new FormData(event.target)

        const identifier = formData.get("identifier") 
        const password = formData.get("password")
    }
    //Käsitelle mitä käyttäjä painaa
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

                    <h2>Title-Kirjaudu</h2>
                    <form onSubmit={handleSignIn}>
                        /*Kohdat mihin kirjoitetaan email ja salasana rajoituksineen*/
                        <label htmlFor="signin-identifier">
                            email
                        </label>
                        <input
                        id="signin-identifier"
                        name="identifier"
                        type="text"
                        placeholder="email/username"
                        required
                        />

                        <label htmlFor="signin-password">
                            password
                        </label>
                        <input
                        id="signin-password"
                        name="password"
                        type="password"
                        placeholder="password"
                        required
                        />
                        <button 
                        type="submit"
                        className="submit"
                        >
                            SignIn
                        </button>
                    </form>
            </section>
        </div>
    )
}
export default SignInModal