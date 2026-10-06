import { useState } from "react";
import axios from "axios";
import ConfirmCredentialsModal from "./ConfirmCredentialsModal.jsx";

const DeleteAccountButton = ({ account, onLogout }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const deleteAccount = async (identifier, password) => {
    await axios.delete(
      `${import.meta.env.VITE_API_URL}/accounts/id/${account.id}`,
      {
        headers: {
          Authorization: `Bearer ${account.token}`,
        },

        // Axios DELETE request can also contain a request body.
        // The backend verifies these credentials before deleting the account.
        data: {
          account: identifier,
          password,
        },
      }
    );

    alert("Tili poistettu");
    onLogout();
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