import { useState } from "react";
import axios from "axios";
import "./Groups.css"

const Join_Request = ({ idgroup }) => {
    const [message, setMessage] = useState("");
    const [requestSent, setrequestSent] = useState(false);

    const sendRequest = async () => {
        try { 
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/groups/${idgroup}/join-requests`,
                {},
                {
                  headers: { "Content-Type": "application/json", 
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },  
    );

        setMessage("Liittymispyyntö lähetetty")
        setrequestSent(true)
        console.log(response.data)
    } catch (err) {
        if (err.response?.status === 409) {
            setMessage("Liittymispyyntö on jo lähetetty")
            setrequestSent(true)
        } else {
        setMessage(
         err.response?.data?.error?.message ||
         "Liittymispyyntö epäonnistui"
         )
        }
      }
    }

    return (
        <div onClick={(event) => event.stopPropagation()}>
            <button type="button" className="join_button" onClick={sendRequest} disabled={requestSent}>
               {requestSent ? "Pyyntö lähetetty" : "Liity"}
            </button>
            {message && <p>{message}</p>}
        </div>
    )
}

export default Join_Request