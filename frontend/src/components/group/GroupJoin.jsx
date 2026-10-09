import { useState } from "react";
import axios from "../api/authAxios.js";
import "./Groups.css";

//const token = localStorage.getItem("token")

const Join_Request = ({ idgroup }) => {
  const [message, setMessage] = useState("");

  const sendRequest = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/groups/${idgroup}/join-requests`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      setMessage("Liittymispyyntö lähetetty");
      console.log(response.data);
    } catch (err) {
      setMessage(
        err.response?.data?.error?.message || "Liittymispyyntö epäonnistui",
      );
    }
  };

  return (
    <div onClick={(event) => event.stopPropagation()}>
      <button type="button" className="join_button" onClick={sendRequest}>
        Liity
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Join_Request;
