import DeleteAccountButton from "./DeleteAccount"
import "./Navbar.css"
import SearchBar from './search/SearchBar'
import { useState } from "react"
import { Link } from 'react-router-dom'


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
<<<<<<< HEAD

  console.log("Navbar ac: ", account)

=======
>>>>>>> origin/main
  return (
    <nav>
      <div className="nav-left">
        <Link
          to="/"
          className="brand-button"
          onClick={onHomeClick}
        >
          <h1>
            The<br />RedCarpet
          </h1>
        </Link>

        <SearchBar {...searchProps} />
      </div>

      <ul>
        <li>
<<<<<<< HEAD
          <Link
            to={account ? "/groups" : "#"}
            onClick={(event) => {
              if (!account) {
                event.preventDefault()
                onSignInClick()
              }
            }}
=======
          <Link 
            to="/groups"
>>>>>>> origin/main
          >
            Ryhmäsivu
          </Link>
        </li>

        <li>
          <Link
            to="/"
            onClick={onFavoritesClick}
          >
            Suosikit
          </Link>
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
          <li className="profile-menu">
            <button
              type="button"
              className="profile"
              onClick={() => setMenu((open) => !open)}
              aria-expanded={menuOpen}
            >
              Profiili
            </button>

            {menuOpen && (
              <div className="dropdown">
                {/* Profile actions are shown vertically below the button. */}
                <button
                  type="button"
                  onClick={onLogout}
                >
                  Kirjaudu ulos
                </button>

                <DeleteAccountButton
                  account={account}
                  onLogout={onLogout}
                />
              </div>
            )}
          </li>
        )}
      </ul>
    </nav>
  )
}