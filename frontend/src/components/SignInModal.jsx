import { useEffect, useState } from "react";
import "./SignInModal.css";
import axios from "axios";

function SignInModal({ isOpen, onClose, onLogin }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    function handleEsc(event) {
      if (event.key === "Escape") {
        clearError();
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

  if (!isOpen) {
    return null;
  }
  async function handleSignIn(event) {
    event.preventDefault();

    const formData = new FormData(event.target);

    const account = formData.get("identifier");
    const password = formData.get("password");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/login`,
        {
          account,
          password,
        },
        {
          headers: { "Content-Type": "application/json" },
        },
      );

      // Authentication is handled with the JWT in App.jsx
      // Storing the full user object in sessionStorage is not currently needed.
      /* const userData = response.data;
      setUser(userData);
      sessionStorage.setItem("user", JSON.stringify(userData)); */

      onLogin(response.data)

      onClose();
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Virheellinen käyttäjänimi tai salasana.");
      } else {
        setError("Virhe kirjautumisessa. Tarkista tiedot.");
        console.error(err);
      }
      console.log(err);
    } finally {
      setLoading(false);
    }
  }
  function clearError() {
    setError("");
  }

  //Itse etusivu näkymä
  return (
    <div className="overlay-modal">
      <section className="SignUp-modal" role="dialog">
        {/*Sulkemis näppäin*/}
        <button
          type="button"
          className="close-button"
          onClick={onClose}
          aria-label="X"
        >
          &times;
        </button>
        <h2>Sisäänkirjautuminen</h2>
        <form onSubmit={handleSignIn}>
          {/*Kohdat mihin kirjoitetaan email ja salasana rajoituksineen*/}
          <label htmlFor="signin-identifier">Sähköposti / Käyttäjänimi</label>
          <input
            id="signin-identifier"
            name="identifier"
            type="text"
            placeholder="Sähköposti / Käyttäjänimi"
            onFocus={clearError}
            required
          />
          <label htmlFor="signin-password">Salasana</label>
          <input
            id="signin-password"
            name="password"
            type="password"
            placeholder="********"
            required
          />
          <button type="submit" className="submit">
            Kirjaudu sisään
          </button>
          {error && <p className="error">{error}</p>}
        </form>
      </section>
    </div>
  );
}
export default SignInModal;

