import { useState, useEffect, useMemo } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import axios from "./api/authAxios.js";
import "./NowPlaying.css";

function NowPlaying({ onMediaSelect }) {
  const [movies, setMovies] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  // tarkistetaan käytetäänkö mobiilin vai tietokoneen asettelua.
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 900px)");

    const updateScreenSize = () => {
      setIsMobile(mediaQuery.matches);
    };

    updateScreenSize();
    mediaQuery.addEventListener("change", updateScreenSize);

    return () => {
      mediaQuery.removeEventListener("change", updateScreenSize);
    };
  }, []);

  // embla automaattinen karuselli elokuvakorteille
  // asetukset
  const autoScroll = useMemo(
    () =>
      AutoScroll({
        speed: 0.5,
        startDelay: 1000,
        direction: "forward",
        playOnInit: true,
        stopOnInteraction: false,
        stopOnMouseEnter: false,
        stopOnFocusIn: true,
      }),
    []
  );

  // Karusellin suunta riippuen onko mobiilinäkymä.
  // automaattien liike käytössä tällä hetkellä vain tietokoneella.
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      axis: isMobile ? "y" : "x",
      loop: true,
      align: "start",
      containScroll: false,
      dragFree: true,
      watchSlides: true,
    },
    isMobile ? [] : [autoScroll]
  );

  // Pysäytetään liike kun käyttäjä tarttuu karuselliin.
  useEffect(() => {
    if (!emblaApi || isMobile) return;

    const stopAutoScroll = () => {
      autoScroll.stop();
    };

    emblaApi.on("pointerDown", stopAutoScroll);

    return () => {
      emblaApi.off("pointerDown", stopAutoScroll);
    };
  }, [emblaApi, autoScroll, isMobile]);

  // Haetaan elokuvateattereissa olevat elokuvat.
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/nowplaying`).then((response) => {
      setMovies(response.data);
    });
  }, []);

  // Nappi vasemmalle
  const scrollPrev = () => {
    if (!emblaApi) return;

    if (!isMobile) autoScroll.stop();
    emblaApi.scrollPrev();
    if (!isMobile) autoScroll.play();
  };

  // Nappi oikealle
  const scrollNext = () => {
    if (!emblaApi) return;

    if (!isMobile) autoScroll.stop();
    emblaApi.scrollNext();
    if (!isMobile) autoScroll.play();
  };

  return (
    <main>
      <h1>Nyt elokuvateattereissa</h1>

      <div className={`nowplaying-carousel ${isMobile ? "is-mobile" : ""}`}>
        {/* edellisen elokuvan nappi */}
        <button
          type="button"
          className="carousel-button"
          onClick={scrollPrev}
          aria-label={
            isMobile ? "Edelliset elokuvat ylös" : "Edelliset elokuvat"
          }
        >
          {isMobile ? "↑" : "←"}
        </button>

        {/* embla karuselli näkymä. */}
        <div className="movie-carousel-viewport" ref={emblaRef}>
          {/* Elokuvakortit joita voi selata karusellissa. */}
          <div className="movie-grid">
            {movies.map((movie) => (
              <div
                className="movie-card"
                key={movie.id}
                onClick={() => onMediaSelect(movie)}
              >
                {/* Elokuvan juliste tai virhe jos sitä ei löydy */}
                {movie.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    draggable={false}
                  />
                ) : (
                  <div className="no-poster">No poster</div>
                )}

                {/* Elokuvan nimi, arvosana, julkaisupäivä ja lajityypit. */}
                <div className="movie-card-details">
                  <h2>{movie.title}</h2>

                  <p>⭐ {(movie.vote_average / 2).toFixed(1)} / 5</p>

                  <p>{movie.release_date}</p>

                  <p>{movie.genres.join(", ")}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* seuraavan elokuvan nappi */}
        <button
          type="button"
          className="carousel-button"
          onClick={scrollNext}
          aria-label={
            isMobile ? "Seuraavat elokuvat alas" : "Seuraavat elokuvat"
          }
        >
          {isMobile ? "↓" : "→"}
        </button>
      </div>
    </main>
  );
}

export default NowPlaying;
