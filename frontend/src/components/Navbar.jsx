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
  console.log("Navbar ac: ", account)
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
          <Link 
            to={account ? "/groups" : "#"}
            onClick={ (event) => {
              if (!account) {
                event.preventDefault()
                onSignInClick()
              }
            }}
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
          <li>
            <button type="button" className="profile" onClick={() => setMenu(!menuOpen)}>
              Profiili
            </button>
            {menuOpen && (
              <div className="dropdown">
                <button type="button" onClick={onLogout}>
                  Kirjaudu ulos
                </button>
                <DeleteAccountButton account={account} onLogout={onLogout} />
              </div>
            )}
          </li>
        )}
      </ul>
    </nav>
  )
}
