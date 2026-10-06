import axios from "axios"
import { useEffect, useState } from "react";
import "./Groups.css"
import JoinRequest from "./JoinRequests";
import DeleteGroupButton from "./GroupDelete";

function GroupPageModal({ isOpen, onClose, groupId, groupName, joinRequest, ownerId, onDeleted}) {


    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [members, setMembers] = useState([])
    const [currentJoinRequests, setJoinrequests] = useState(joinRequest || [])

    //Suodatetaan vanhat ja uudet liittymispyynnöt
    const handleRequests = (idaccount) => {
      setJoinrequests((oldRequests) =>
      oldRequests.filter(
        (request) => request.id_account !== idaccount
      ))
    }
  
  // Modal sulketuuu esc-näppäimestä tai X:sttä
  useEffect(() => {
    function handleEsc(event) {
      if (event.key === "Escape") {
        setError("")
        onClose();
      }
    }
    //Kuuntelee, mitä näppäimiä painetaan, esim tuleeko se Esc-näppäin
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen || !groupId) {
        return
    }

  async function handleGroupPage() {
    setLoading(true)
    setError("")

    //Jäsen lista
    try {
        const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/groups/members/id/${groupId}`,
        
      );
      setMembers(response.data)
    } catch(err) {
        console.error("Finding members has failed: ", err)
        setError("Jäsenten hakeminen epäonnistui")
    }

    //Liittymispyynnöt
    try {
      const joinRequestsResponse = await axios.get(
      `${import.meta.env.VITE_API_URL}/groups/${groupId}/join-requests`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      } 
      )
      setJoinrequests(joinRequestsResponse.data)
    } catch (err) {
        console.error("Group infromation has failed: ", err)
        setJoinrequests([])
        setError("Ryhmän tietojen hakeminen epäonnistui")
    } finally {
        setLoading(false);
    }
  }

    handleGroupPage();
  }, [isOpen, groupId]);

  if (!isOpen) {
    return null;
  }

  //stop.Propagation estää muitten modaaliesn aukeamisen
  //ownerid === piilotetaan ryhmänjäseniltä ryhmän omistajalle kuuluvat napit
   return (
  <div className="overlay-modal" onClick={onClose}>
    <div
      className="groupPage-modal"
      onClick={(event) => event.stopPropagation()}
    >
      <button
        type="button"
        className="close-button"
        onClick={onClose}
        aria-label="Sulje"
      >
        X
      </button>

      <div className="groupPage-content">
        <div className="group-info">
          <h2>{groupName}</h2>
          
          {ownerId === ownerId && (
            <DeleteGroupButton
              idgroup={groupId}
              idowner={ownerId}
              token={localStorage.getItem("token")}
              onDeleted={onDeleted}
              />
          )}
        </div>

                <div className="sections-groupPage">
                    <section className="group-members">
                        <h3>Ryhmän jäsenet:</h3>

                         {members.length === 0 ? (
                          <p>Ryhmässä ei ole vielä jäseniä</p>
                        ) : (
                        <ul>
                            {members.map((member) => (
                                <li key={member.id_account}>{member.username}</li>
                         ))}
                        </ul>
                     )}
                    </section>

                    <section className="join-requests">
                        <h3>Liittymispyynnöt:</h3>
                        {currentJoinRequests.length === 0 ? (
                          <p>Ei liittymispyyntöjä</p>
                        ) : ( 
                          <ul>
                            {currentJoinRequests.map(
                              (request) => (
                                <JoinRequest
                                key={request.id_account}
                                idaccount={request.id_account}
                                groupId={groupId}
                                username={request.username}
                                handleRequest={handleRequests}
                                  />
                                )
                              )}
                          </ul>
                        )}
                    </section>
                </div>
            </div>
        </div>
    </div>
    );
}

export default GroupPageModal