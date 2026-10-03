import { useState } from "react";
import axios from "axios";

const JoinRequest = ({ idaccount, groupId, handleRequest}) => {
    const [loading, setLoading] = useState(false);

    const approveRequest = async () => {
        try {
            setLoading(true);
            await axios.patch(
                `${import.meta.env.VITE_API_URL}/groups/${groupId}/join-requests/${idaccount}/approve`,
            )

            handleRequest(idaccount)
        } catch (err) {
            console.error("Approving failed:", err)
        } finally {
            setLoading(false)
        }
    };

    const rejectRequest = async () => {
        try {
            setLoading(true)
                 await axios.patch(
                `${import.meta.env.VITE_API_URL}/groups/${groupId}/join-requests/${idaccount}/reject`,
            )

            handleRequest(idaccount)
        } catch (err) {
            console.error("Rejecting failed:", err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <button
                type="button"
                onClick={approveRequest}
                disabled={loading}
                >
                    Hyväksy
                </button>

                <button
                    type="button"
                    onClick={rejectRequest}
                    disabled={loading}
                >
                    Hylkää
                </button>

        </div>
    )
}

export default JoinRequest