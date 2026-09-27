import { useEffect } from "react";
import "./SignUpModal.css";

function SignUpModal({ isOpen, onClose }) {
  useEffect(() => {
    function handleEsc(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }
        //Kuuntelee, mitä näppäimiä painetaan, esim tuleeko se Esc-näppäin
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

    //Käsittelee Rekistöröitymisen
    async function handleSignUp(event) {
        event.preventDefault();

        const formData = new FormData(event.target);

        const username = formData.get("username");
        const email = formData.get("email");
        const password = formData.get("password");

        try{
            const reponse = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            });
            const data = await reponse.json();
            if (!reponse.ok) { throw new Error(data.message || 'Rekisteröinti ei onnisunut'); }
            console.log('Rekisteröinti onnistui:', data);
            event.target.reset();
            onClose();
        }
        catch (error) {console.error('Rekisteröinti epäonnistui:', error); alert(error.message);}}

  if (!isOpen) {
    return null;
  }
  

  function handleOverlayClick(event) {
    if (event.target == event.currentTarget) {
      onClose();
    }
  }
  //Itse etusivu näkymä
  return (
    <div className="overlay-modal" onClick={handleOverlayClick}>
      <section className="SignUp-modal" role="dialog">
        {/* Sulkemis näppäin */}
        <button
          type="button"
          className="close-button"
          onClick={onClose}
          aria-label="X"
        >
          &times;
        </button>
        <h2>Rekistöröityminen</h2>
        <form onSubmit={handleSignUp}>
          <label htmlFor="username">Käyttäjänimi</label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="test"
            maxLength={64}
            required
          />
          {/* Kohdat mihin kirjoitetaan email ja salasana rajoituksineen */}
          <label htmlFor="email">Sähköposti</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="test@foo.com"
            maxLength={64}
            required
          />
          <label htmlFor="password">Salasana</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="********"
            minLength={8}
            maxLength={64}
            pattern="(?=.*[A-Z])(?=.*[0-9]).{8,64}"
            /*Tähän voisi lisätä titlen niin käyttäjä huomaa vaatimukset*/
            required
          />
          <button type="submit" className="submit">
            Rekisteröidy
          </button>
        </form>
      </section>
    </div>
  );
}
export default SignUpModal;

