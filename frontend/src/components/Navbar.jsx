import "./Navbar.css"
import SearchBar from './search/SearchBar'

export default function Navbar({ onSignUpClick, onSignInClick, props}) {

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
      </ul>
    </nav>
  )
}