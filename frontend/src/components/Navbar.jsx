import "./Navbar.css"
import SearchBar from './search/SearchBar'

export default function Navbar(props) {

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
        <li><a href="#">Suosikit/SuosikkiLista</a></li>
        <li><button className="signup">Rekisteröidy</button></li>
        <li><button className="signin">Kirjaudu</button></li>
      </ul>
    </nav>
  )
}