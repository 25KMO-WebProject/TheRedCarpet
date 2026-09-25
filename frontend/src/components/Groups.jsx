import { useEffect, useState } from "react"
import axios from "axios";
import "./Groups.css"

export default function Groups() {
    
    const [groups, setGroups] = useState([]);
    
    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/groups`)
        .then((response) => {
            setGroups(response.data);
        }).catch((error) => {
            console.error("Finding groups has failed: ", error)
    })
    }, [])

    const ownGroups = groups.filter(
        (group) => group.status = "accpeted"
    )

    const otherGroups = groups.filter(
        (group) => group.status != "accpted"
    )






    return (
        <section>
            <h1>Omat ryhmät:</h1>
            {groups.map((group) => (
            <article key={group.id}className="group">
                <img
                alt={`Ryhmän ${group.group_name} kuva`}
                />
                <div className="group-content">
                    <h2>{group.group_name}</h2>
                    <p>{group.group_descr}</p>
                    <span>jäsentä</span>
                </div>
            </article>
            ))}
            
            <h1> Katso muita ryhmiä: </h1>
        </section>
    )
}