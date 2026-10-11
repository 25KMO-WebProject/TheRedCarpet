import axios from "../api/authAxios.js";
import { useEffect, useState } from "react";
import "./Groups.css";

function CreategroupModal({ isOpen, onClose, onCreated }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [nameTooLong, setNameTooLong] = useState(false);
  const [descrTooLong, setDescrTooLong] = useState(false);
  const token = localStorage.getItem("token");

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

  // Follow if user writes too long description
  function handleGroupDescrChange(event) {
    const groupDescr = event.target.value;
    const tooLong = groupDescr.length > 255;

    setDescrTooLong(tooLong);

    if (tooLong) {
      setError("Ryhmän kuvailu voi olla enintään 255 merkkiä!");
    } else {
      clearError();
    }
  }

  // Follow if user writes too long group name
  function handleGroupNameChange(event) {
    const groupName = event.target.value;
    const tooLong = groupName.length > 64;

    setNameTooLong(tooLong);

    if (tooLong) {
      setError("Ryhmän nimi voi olla enintään 64 merkkiä!");
    } else {
      clearError();
    }
  }

  async function handleCreategroup(event) {
    event.preventDefault();

    const formData = new FormData(event.target);

    const groupName = formData.get("group_name");
    const groupDesc = formData.get("group_descr");

    // Validate actively group name length
    if (groupName.length > 64) {
      setError("Ryhmän nimi max 64!");
      return; // stop execution until value is changed
    }
    // Clear previous errors
    clearError();

    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/groups`,
        {
          group_name: groupName,
          group_descr: groupDesc,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      onCreated(response.data);

      onClose();
    } catch (err) {
      setError("Ryhmän luominen epäonnistui!");
      console.log(err.response?.data);
      console.log(err.message);
      console.log(err);
    } finally {
      setLoading(false);
    }
  }
  function clearError() {
    setError("");
  }

  return (
    <div className="overlay-modal">
      <section className="creategroup-modal" role="dialog">
        {/*Sulkemis näppäin*/}
        <button
          type="button"
          className="close-button"
          onClick={onClose}
          aria-label="X"
        >
          &times;
        </button>
        <h2>Luo ryhmä</h2>
        <form onSubmit={handleCreategroup}>
          {/*Kohdat mihin kirjoitetaan email ja salasana rajoituksineen*/}
          <label htmlFor="group-name">Ryhmän nimi</label>
          <input
            id="group-name"
            name="group_name"
            type="text"
            placeholder="Ryhmän nimi"
            className={nameTooLong ? "input-error" : ""}
            onChange={handleGroupNameChange}
            onFocus={clearError}
            required
          />
          <label htmlFor="group_desc">Ryhmän kuvaus</label>
          <textarea
            id="group_desc"
            name="group_descr"
            type="text"
            placeholder="Ryhmän kuvaus"
            className={descrTooLong ? "input-error" : ""}
            onChange={handleGroupDescrChange}
            onFocus={clearError}
            rows="4"
            required
          />
          <button type="submit" className="submit">
            Luo ryhmä
          </button>
          {error && <p className="error">{error}</p>}
        </form>
      </section>
    </div>
  );
}

export default CreategroupModal;
