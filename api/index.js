import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import errorHandler from './middleware/errorHandler.js'
import testRouter from './routes/testRouter.js'

const port = process.env.PORT || 3000

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/', testRouter)

// Health check endpoint for database connectivity
app.get('/api/health', async (req, res) => {
  try {
    const { pool } = await import('./models/db.js')
    await pool.query('SELECT 1')
    res.status(200).json({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      database: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString()
    })
  }
})

app.get('/api/tmdb/popular', async (req, res) => {
  try {
    const response = await fetch(
      'https://api.themoviedb.org/3/movie/popular?language=fi-FI&page=1',
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
          accept: 'application/json'
        }
      }
    );

    if (!response.ok) {
      return res.status(response.status).json({
        error: 'TMDB request failed'
      });
    }

    const data = await response.json();

    res.json(data);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Failed to fetch movies from TMDB'
    });
  }
});

app.get('/api/tmdb/search', async (req, res) => {
  try {
    const query = req.query.query?.trim()

    if (!query) {
      return res.status(400).json({
        error: 'Search query is required'
      })
    }

    const url = new URL('https://api.themoviedb.org/3/search/movie')

    url.searchParams.set('query', query)
    url.searchParams.set('page', '1')

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
        accept: 'application/json'
      }
    })

    if (!response.ok) {
      return res.status(response.status).json({
        error: 'TMDB request failed'
      })
    }

    const data = await response.json()

    res.json(data)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      error: 'Failed to search movies from TMDB'
    })
  }
})

app.use((req, res, next) => {
  const error = new Error('Not found')
  error.status = 404
  next(error)
})

app.use(errorHandler)

app.listen(port, () => {  
  console.log(`Server is running on http://localhost:${port}`)
  console.log('Backend hot reload is working!')
})