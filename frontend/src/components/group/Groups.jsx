import { useEffect, useState } from "react"
import axios from "axios";
import "./Groups.css"
import CreategroupModal from "./GroupCreate";

export default function Groups() {
    
    const [groups, setGroups] = useState([]);
    
    const [isCreateGroupOpen, setCreateGroup] = useState(false)

    async function getGroups() {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/groups`)
            setGroups(response.data);
        } catch(error) {
            console.error("Finding groups has failed: ", error)
        }
    }

    useEffect(() => {
        getGroups()
    }, [])

    async function handleGroupCreated() {
        await getGroups()
        setCreateGroup(false)
    }

    // const ownGroups = groups.filter(
    //     (group) => group.status === "accepeted"
    // )

    // const otherGroups = groups.filter(
    //     (group) => group.status !== "accepeted"
    // )






    return (
        <section>
            <button type="button" className="Create_Group" onClick={() => setCreateGroup(true)}>Luo ryhmä +</button>
            <CreategroupModal
            isOpen={isCreateGroupOpen}
            onClose={() => setCreateGroup(false)}
            onCreated={handleGroupCreated}
            />
            <h1>Omat ryhmät:</h1>
            {groups.map((group) => (
            <article key={group.id} className="group">
                <img
                alt={`Ryhmän ${group.group_name} kuva`}
                />
                <div className="group-content">
                    <h2>{group.group_name}</h2>
                    <p>{group.group_descr}</p>
                    <span>Jäseniä: {group.member_count}</span>
                    <button type="button" className="join_button">Liity</button>
                </div>
            </article>
            ))}
            
            <h1> Katso muita ryhmiä: </h1>
        </section>
    )
}