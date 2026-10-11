import { useState } from "react";
import axios from "../api/authAxios.js";
import "./Groups.css";

const LeaveGroupButton = ({ groupId }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const leaveGroup = async () => {
    try {
      setLoading(true);
      setMessage("");

      await axios.delete(
        `${import.meta.env.VITE_API_URL}/groups/${groupId}/leave`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      setMessage("Poistuit ryhmästä onnistuneesti");
      window.location.reload();
    } catch (err) {
      setMessage(
        err.response?.data?.error?.message ||
          "Ryhmästä poistuminen epäonnistui",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={leaveGroup}
        disabled={loading}
        className="Leave-group"
      >
        Poistu ryhmästä
      </button>
    </div>
  );
};

export default LeaveGroupButton;
