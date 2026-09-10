//import { Link } from 'react-router-dom'
import "./Navbar.css"
export default function Navbar() {
    return (
        <>
         <nav>
      <div class="nav-left">
         <h1>The<br/>RedCarpet</h1>

        <form class="search">
          <input type="search" placeholder='Hakukenttä' aria-label="Hae"></input>
          <button type="submit">Hae</button>
        </form>
      </div>
        <ul>
          <li><a href="#">Ryhmäsivu</a></li>
          <li><a href="#">Arvostelut</a></li>
          <li><a href="#">Suosikit/SuosikkiLista</a></li>
          <li><button class="signup">Rekisteröidy</button></li>
          <li><button class="signin">Kirjaudu</button></li>
        </ul>
      </nav>
      <div id="content">
        <article>
          <div>
            
          </div>
        </article>
      </div>
    </>
    )
}