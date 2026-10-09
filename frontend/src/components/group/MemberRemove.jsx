import axios from "../api/authAxios.js";
import "./Groups.css";

const RemoveMemberButton = ({ idgroup, idaccount, setMembers }) => {
  const removeMember = async () => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/groups/${idgroup}/members/${idaccount}/remove`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      setMembers((members) =>
        members.filter(
          (member) => String(member.id_account) !== String(idaccount),
        ),
      );

      onRemoved();
    } catch (error) {
      console.error("Jäsenen poistaminen epäoonsitui:", error);
    }
  };

  return (
    <button
      type="button"
      className="Remove-member-button"
      onClick={removeMember}
    >
      Poista
    </button>
  );
};

export default RemoveMemberButton;
