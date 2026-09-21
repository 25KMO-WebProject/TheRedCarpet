import "./Navbar.css"
import SearchBar from './search/SearchBar'
import { useState } from "react"
import DeleteAccountButton from "./DeleteAccount"

export default function Navbar({ onSignUpClick, onSignInClick, account, props}) {

export default function Navbar({
  onSignUpClick,
  onSignInClick,
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
        <li>
          <a href="#">Ryhmäsivu</a>
        </li>

        <li>
          <a href="#">Arvostelut</a>
        </li>

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

        <li>
          <button
            type="button"
            className="signup"
            onClick={onSignUpClick}
          >
            Rekisteröidy
          </button>
        </li>

        <li>
          <button
            type="button"
            className="signin"
            onClick={onSignInClick}
          >
            Kirjaudu
          </button>
        </li>
      </ul>
    </nav>
  )
}