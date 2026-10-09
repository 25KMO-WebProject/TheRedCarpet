import { useState } from "react";
import axios from "../api/authAxios.js";

const JoinRequest = ({ idaccount, groupId, username, handleRequest }) => {
  const [loading, setLoading] = useState(false);

  const approveRequest = async () => {
    try {
      setLoading(true);
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/groups/${groupId}/join-requests/${idaccount}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      handleRequest(idaccount);
    } catch (err) {
      console.error("Approving failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const rejectRequest = async () => {
    try {
      setLoading(true);
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/groups/${groupId}/join-requests/${idaccount}/reject`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      handleRequest(idaccount);
    } catch (err) {
      console.error("Rejecting failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <li className="join-request-content">
      <span>{username}</span>
      <div className="join-request-buttons">
        <button type="button" onClick={approveRequest} disabled={loading}>
          Hyväksy
        </button>

        <button type="button" onClick={rejectRequest} disabled={loading}>
          Hylkää
        </button>
      </div>
    </li>
  );
};

export default JoinRequest;
