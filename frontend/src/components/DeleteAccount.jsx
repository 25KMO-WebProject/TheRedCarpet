import { useState } from "react";
import axios from "./api/tokenHandler.js";
import ConfirmCredentialsModal from "./ConfirmCredentialsModal.jsx";

const DeleteAccountButton = ({ account, onLogout }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const deleteAccount = async (identifier, password) => {
    try {
      await axios.delete(`/accounts/id/${account.id}`, {
        data: {
          account: identifier,
          password,
        },
      });

      alert("Tili poistettu");
      onLogout();
    } catch (error) {
      console.error("Tilin poistaminen epäonnistui:", error);
      throw new Error("Tilin poistaminen epäonnistui", {
        cause: error,
      });
    }
  };

  return (
    <>
      <button
        type="button"
        className="delete-account"
        onClick={() => setConfirmOpen(true)}
      >
        Poista tili
      </button>

      <ConfirmCredentialsModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={deleteAccount}
        title="Vahvista tilin poisto"
        message="Syötä kirjautumistietosi ennen tilin poistamista."
        submitText="Poista tili"
      />
    </>
  );
};

export default DeleteAccountButton;
