import axios from "../api/authAxios.js"
import { useState } from "react"


function AddGroupMovies({ groupId, tmdbId, mediaType }) {
    const [AddedMovie, setAddedMovie] = useState(false)
    const [error, setError] = useState("")

    const addMovie = async () => {
        setError("")

        try {
             await axios.post (
                `${import.meta.env.VITE_API_URL}/groups/${groupId}/movies`,
                { tmdbId, mediaType},
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    }
                }
            )

            setAddedMovie(true)
        } catch (err) {
            setError(
                err.response?.data?.message || "Elokuvan lisääminen epäonnistui"
            )
        }
    }

    return (
        <div>
            <button 
            className="add-movie"
            type="button" 
            onClick={addMovie} 
            disabled={addMovie}
            >
                {AddedMovie ? "Lisätty ryhmään" : "+"}
            </button>
        </div>
    )
}

export default AddGroupMovies;