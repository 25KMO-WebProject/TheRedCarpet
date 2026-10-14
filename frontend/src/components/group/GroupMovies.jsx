import axios from "../api/authAxios.js"
import { useEffect, useState } from "react"

function GroupMovies({ groupId }) {
    const [movies, setMovies] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!groupId) return

        async function loadMovies() {
            setLoading(true)
            setMovies([])

            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/groups/${groupId}/movies`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );

                setMovies(response.data)
            } catch (err) {
                console.error("Fetching movies failed..",err)
            } finally {
                setLoading(false)
            }
        };

        loadMovies()
    }, [groupId]);

    if (loading) return <p>Ladataan elokuvia.</p>;
    if (movies.length === 0) {
        return <p>Ryhmässä ei ole vielä elokuvia. Voit lisätä elokuvia Hakemalla ne hakukentästä ryhmä sivun sisällä.</p>
    }

    console.log("Movies:", movies)

    return (
        <ul className="movies-list">
            {movies.map((movie) => (
                <li key={movie.tmdb_id}>{movie.tmdb_id}</li>
            ))}
        </ul>
    )
}

export default GroupMovies;