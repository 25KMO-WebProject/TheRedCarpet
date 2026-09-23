import DeleteAccountButton from "./DeleteAccount"
import "./Navbar.css"
import SearchBar from './search/SearchBar'
import { useState } from "react"


export default function Navbar({
  onSignUpClick,
  onSignInClick,
  onFavoritesClick,
  onHomeClick,
  account,
  onLogout,
  ...searchProps
}) {
  const [menuOpen, setMenu] = useState(false)
  console.log("Navbar ac: ", account)
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
        {!account && ( 
        <>
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
        </>
        )}
        {account && (
          <li>
            <button type="button" className="profile" onClick={() => setMenu(!menuOpen)}>
              Profiili
            </button>
            {menuOpen && (
              <div className="dropdown">
                <button type="button" onClick={onLogout}>
                  Kirjaudu ulos
                </button>
                <DeleteAccountButton account={account} />
              </div>
            )}
          </li>
        )}
      </ul>
    </nav>
  )
}
