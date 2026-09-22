import axios from 'axios'

const DeleteAccountButton = ({ account }) => {
  const deleteAccount = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/accounts/id/${account.id}`,
        {
          headers: {
            Authorization: `Bearer ${account.token}`,
          },
        }
      );

      alert("Tili poistettu");
    } catch (error) {
      alert(error.response?.data?.error?.message || error.message);
    }
  };      

return (
     <button type="button" className="delete-account" onClick={deleteAccount}>Poista tili</button>
    )
}
export default DeleteAccountButton