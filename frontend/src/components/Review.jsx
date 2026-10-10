import { useEffect, useState } from "react";
import axios from "./api/authAxios.js";
import "./Review.css";

export default function Reviews({ item, isAuthenticated, token }) {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);

  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [sending, setSending] = useState(false);

  const movieId = item?.id;

  // Haetaan elokuvan arvostelut backendistä
  useEffect(() => {
    if (!movieId) {
      return;
    }

    const fetchReviews = async () => {
      setError(null);

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/reviews/${movieId}`,
        );

        if (!response.ok) {
          throw new Error(
            "Arvostelujen haku epäonnistui (tarkista että elokuva on lisätty tietokantaan)",
          );
        }

        const data = await response.json();

        setReviews(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    fetchReviews();
  }, [movieId]);

  // Lähetetään uusi arvostelu backendille
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!token) {
      return;
    }

    if (rating < 1 || rating > 5) {
      setError("Valitse tähdet 1-5.");
      return;
    }

    if (!description.trim()) {
      setError("Kirjoita arvostelu.");
      return;
    }

    setSending(true);
    setError(null);

    try {
      // Protected POST request using authAxios.js
      await axios.post("/reviews", {
        movieId,
        rating,
        description,
      });

      // Tyhjennetään lomake onnistuneen lähetyksen jälkeen
      setDescription("");
      setRating(0);
      setShowForm(false);

      // Public GET request to refresh reviews
      const reviewsResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/reviews/${movieId}`,
      );

      if (!reviewsResponse.ok) {
        throw new Error("Arvostelujen haku epäonnistui");
      }

      const data = await reviewsResponse.json();

      setReviews(data);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.error?.message ||
          err.message ||
          "Arvostelun lähettäminen epäonnistui",
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="reviews">
      <h3>Käyttäjien arvostelut</h3>

      {error && <p>{error}</p>}

      {/* Pitää olla kirjautunut että voi antaa arvostelun */}
      {isAuthenticated && (
        <div className="review-form-section">
          {!showForm ? (
            <button type="button" onClick={() => setShowForm(true)}>
              Arvostele
            </button>
          ) : (
            <form onSubmit={handleSubmit}>
              <h4>Arvostele elokuva</h4>

              {/* Tähtiarvio */}
              <div>
                <p>Tähdet:</p>

                <div className="rating-input">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      aria-label={`${star} tähteä`}
                    >
                      {star <= rating ? "★" : "☆"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Arvosteluteksti */}
              <label>
                Arvostelu:
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  maxLength={512}
                  placeholder="Kirjoita arvostelu... MAX 512 merkkiä"
                  required
                />
                <small>{description.length} / 512</small>
              </label>

              <div>
                <button type="submit" disabled={sending}>
                  {sending ? "Lähetetään..." : "Lisää arvostelu"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setRating(0);
                    setDescription("");
                    setError(null);
                  }}
                >
                  Peruuta
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {reviews.length === 0 && <p>Arvosteluja ei ole vielä annettu.</p>}

      {reviews.map((review, index) => (
        <article key={index} className="review">
          {/* Arvostelun tähdet */}
          <div className="review-rating">
            {"★".repeat(review.rating)}
            {"☆".repeat(5 - review.rating)}
          </div>

          {/* Käyttäjänimi */}
          <strong>{review.username}</strong>

          {/* Arvostelun teksti */}
          <p>{review.description}</p>

          {/* Päivämäärä suomeksi */}
          <small>{new Date(review.date).toLocaleString("fi-FI")}</small>
        </article>
      ))}
    </section>
  );
}
