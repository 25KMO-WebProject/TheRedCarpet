import { useEffect, useState } from "react";
import "./SignUpModal.css";

function SignUpModal({ isOpen, onClose, onSuccess }) {
  const [error, setError] = useState("");
  const [usernameTooLong, setUsernameTooLong] = useState(false);
  const [emailTooLong, setEmailTooLong] = useState(false);
  const [passwordTooLong, setPasswordTooLong] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    // When window isn't open, reset the form. (This is because password value used to stay in the input field..)

    if (!isOpen) {
      resetForm();
      return;
    }

    function handleEsc(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  function resetForm() {
    setPassword("");
    setError("");
    setUsernameTooLong(false);
    setEmailTooLong(false);
    setPasswordTooLong(false);
  }

  function handlePasswordTooLong(event) {
    const password = event.target.value;
    const tooLong = password.length > 64;

    if (tooLong) {
      setError("Salasana saa olla enintään 64 merkkiä!");
    } else {
      clearError();
    }
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  const checks = {
    length: password.length >= 8 && password.length <= 64,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9\s]/.test(password),
  };

  const isValid = Object.values(checks).every(Boolean);

  // Check if username is too long
  function handleUsernameChange(event) {
    const username = event.target.value;
    const tooLong = username.length > 32;

    setUsernameTooLong(tooLong);

    if (tooLong) {
      setError("Käyttäjänimi voi olla enintään 32 merkkiä!");
    } else {
      clearError();
    }
  }

  // Check if email is too long
  function handleEmailChange(event) {
    const email = event.target.value;
    const tooLong = email.length > 64;

    setEmailTooLong(tooLong);

    if (tooLong) {
      setError("Sähköposti saa olla enintään 64 merkkiä!");
    } else {
      clearError();
    }
  }

  function clearError() {
    setError("");
  }

  //Käsittelee Rekistöröitymisen
  async function handleSignUp(event) {
    event.preventDefault();

    const formData = new FormData(event.target);

    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const reponse = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await reponse.json();
      if (!reponse.ok) {
        throw new Error(data.message || "Rekisteröinti ei onnistunut");
      }
      console.log("Rekisteröinti onnistui:", data);
      event.target.reset();

      if (onSuccess) {
        onSuccess();
      } else {
        onClose();
      }
    } catch (error) {
      console.error("Rekisteröinti epäonnistui:", error);
      alert(error.message);
    }
  }

  if (!isOpen) {
    return null;
  }

  //Itse etusivu näkymä
  return (
    <div className="overlay-modal">
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
        <h2>Rekisteröityminen</h2>
        <form onSubmit={handleSignUp}>
          <label htmlFor="username">Käyttäjänimi</label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Käyttäjänimi, jolla muut käyttäjät näkevät sinut!"
            className={usernameTooLong ? "input-error" : ""}
            onChange={handleUsernameChange}
            required
          />
          <small>Enintään 32 merkkiä.</small>
          {/* Kohdat mihin kirjoitetaan email ja salasana rajoituksineen */}
          <label htmlFor="email">Sähköposti</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="email@esimerkki.com"
            className={emailTooLong ? "input-error" : ""}
            onChange={handleEmailChange}
            maxLength={65}
            required
          />
          <small>Anna voimassa oleva sähköpostiosoite.</small>
          <label htmlFor="password">Salasana</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="********"
            value={password}
            onChange={handlePasswordChange}
            minLength={8}
            maxLength={65}
            className={password.length > 0 && !isValid ? "input-error" : ""}
            /*Tähän voisi lisätä titlen niin käyttäjä huomaa vaatimukset*/
            required
          />
          <small>
            Vähintään 8 merkkiä, yksi iso kirjain, yksi numero ja yksi
            erikoismerkki.
          </small>
          <div className="error-helper">
            {error && <p className="error">{error}</p>}
          </div>
          {password.length > 0 && (
            <div className="helper">
              <ul>
                <li>8–64 merkkiä: {checks.length ? "   ✅" : "❌"}</li>
                <li>Iso kirjain: {checks.uppercase ? "   ✅" : "❌"}</li>
                <li>Pieni kirjain: {checks.lowercase ? "   ✅" : "❌"}</li>
                <li>Numero: {checks.number ? "   ✅" : "❌"}</li>
                <li>Erikoismerkki: {checks.special ? "   ✅" : "❌"}</li>
              </ul>
            </div>
          )}

          <button
            type="submit"
            className="submit"
            hidden={!isValid || usernameTooLong || emailTooLong}
          >
            Rekisteröidy
          </button>
        </form>
      </section>
    </div>
  );
}
export default SignUpModal;
