import axios from 'axios'
import "./Groups.css"

const DeleteGroupButton = ({ idgroup, idowner, token, onDeleted }) => {
  const deleteGroup = async () => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/groups/id/${idgroup}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: {
            idowner,
          },
        }
      );

      console.log("Deleting group:", response.data)
      alert("Ryhmä poistettu");
      onDeleted();
    } catch (error) {
      alert(error.response?.data?.error?.message || error.message);
    }
  };      

return (
     <button type="button" className="delete-group-button" onClick={deleteGroup}>Poista ryhmä</button>
    )
}
export default DeleteGroupButton