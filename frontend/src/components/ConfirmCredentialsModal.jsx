import { useEffect, useState } from "react";
import "./SignInModal.css";

function ConfirmCredentialsModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Vahvista toiminto",
  message = "Syötä kirjautumistietosi jatkaaksesi.",
  submitText = "Vahvista",
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    function handleEsc(event) {
      if (event.key === "Escape") {
        setError("");
        onClose();
      }
    }

    if (isOpen) {
      setError("");
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

  async function handleConfirm(event) {
    event.preventDefault();

    const formData = new FormData(event.target);

    const account = formData.get("identifier");
    const password = formData.get("password");

    setLoading(true);
    setError("");

    try {
      // The parent component decides what action is confirmed.
      // This makes the modal reusable for other actions.
      await onConfirm(account, password);

      setError("");
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        err.message ||
        "Tunnusten vahvistaminen epäonnistui."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="overlay-modal">
      <section className="SignUp-modal" role="dialog">
        <button
          type="button"
          className="close-button"
          onClick={onClose}
          aria-label="X"
        >
          &times;
        </button>

        <h2>{title}</h2>

        <p>{message}</p>

        <form onSubmit={handleConfirm}>
          <label htmlFor="confirm-identifier">
            Sähköposti / Käyttäjänimi
          </label>

          <input
            id="confirm-identifier"
            name="identifier"
            type="text"
            placeholder="Sähköposti / Käyttäjänimi"
            required
          />

          <label htmlFor="confirm-password">
            Salasana
          </label>

          <input
            id="confirm-password"
            name="password"
            type="password"
            placeholder="********"
            required
          />

          <button
            type="submit"
            className="submit"
            disabled={loading}
          >
            {loading ? "Vahvistetaan..." : submitText}
          </button>

          {error && (
            <p className="error">
              {error}
            </p>
          )}
        </form>
      </section>
    </div>
  );
}

export default ConfirmCredentialsModal;