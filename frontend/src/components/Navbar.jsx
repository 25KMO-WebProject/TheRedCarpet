import "./Navbar.css"
import SearchBar from './search/SearchBar'

export default function Navbar({
  onSignupClick,
  onFavoritesClick,
  onHomeClick,
  ...searchProps
}) {
  return (
    <nav>
      <div className="nav-left">
        <button
          type="button"
          className="brand-button"
          onClick={onHomeClick}
        >
          <h1>
            The<br />RedCarpet
          </h1>
        </button>

        <SearchBar {...searchProps} />
      </div>

      <ul>
        <li><a href="#">Ryhmäsivu</a></li>
        <li><a href="#">Arvostelut</a></li>
        <li>
          <a
            href="#"
            onClick={(event) => {
              event.preventDefault()
              onFavoritesClick()
            }}
          >
            Suosikit
          </a>
        </li>
        <li><button type="button" className="signup" onClick={onSignupClick}>Rekisteröidy</button></li>
        <li><button className="signin">Kirjaudu</button></li>
      </ul>
    </nav>
  )
}