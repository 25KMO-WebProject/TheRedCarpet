import axios from 'axios'
import { deleteAccount } from '../../../api/models/accountModel';

const DeleteAccountButton = ({ apiUrl, user}) => {
const deleteAccount = () => {
    const headers = {
        headers: {
            Authorization: `Bearer ${user.token}`
        }
    };

    axios.delete(`${apiUrl}/accounts`, headers)
    .catch(error => {
        alert(error.response ? error.response.data.error.message : error)
      })
    }


return (
     <button type="button" className="delete-account" onClick={deleteAccount}>Poista tili</button>
    )
}
export default DeleteAccountButton