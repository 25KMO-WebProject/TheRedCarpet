import "./Navbar.css"
import SearchBar from './search/SearchBar'
import { useState } from "react"
import DeleteAccountButton from "./DeleteAccount"

export default function Navbar({ onSignUpClick, onSignInClick, account, props}) {

const [menuOpen, setMenu] = useState(false)

  return (
    <nav>
      <div className="nav-left">
        <h1>
          The<br />RedCarpet
        </h1>

        <SearchBar {...props} />
      </div>

      <ul>
        <li><a href="#">Ryhmäsivu</a></li>
        <li><a href="#">Arvostelut</a></li>
        <li><a href="#">SuosikkiLista</a></li>
        <li><button type="button" className="signup" onClick={onSignUpClick}>Rekisteröidy</button></li> 
        <li><button type="button" className="signin" onClick={onSignInClick}>Kirjaudu</button></li>
        <li><button type="button" className="profile" onClick={() => setMenu(!menuOpen)}>Profiili</button>
        {menuOpen && (
          <div className="dropdown-menu">
            <button>Kirjaudu ulos</button>
            <DeleteAccountButton account={account} />
          </div>
        )}
      </li>
      </ul>
    </nav>
  )
}