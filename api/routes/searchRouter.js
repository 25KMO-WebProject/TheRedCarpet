import express from 'express'

const router = express.Router()

router.get('/search', async (req, res) => {
  try {
    const query = req.query.query?.trim()
    const type = req.query.type || 'all'
    const year = req.query.year?.trim()

    if (!query) {
      return res.status(400).json({
        error: 'Search query is required'
      })
    }

    if (!['all', 'movie', 'tv'].includes(type)) {
      return res.status(400).json({
        error: 'Invalid type'
      })
    }

    let endpoint

    if (type === 'movie') {
      endpoint = 'https://api.themoviedb.org/3/search/movie'
    } else if (type === 'tv') {
      endpoint = 'https://api.themoviedb.org/3/search/tv'
    } else {
      endpoint = 'https://api.themoviedb.org/3/search/multi'
    }

    const url = new URL(endpoint)

    url.searchParams.set('query', query)
    url.searchParams.set('language', 'fi-FI')
    url.searchParams.set('include_adult', 'false')
    url.searchParams.set('page', '1')

    if (year && type === 'movie') {
      url.searchParams.set('year', year)
    }

    if (year && type === 'tv') {
      url.searchParams.set('first_air_date_year', year)
    }

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

    let results = data.results || []

    if (type === 'movie') {
      results = results.map(item => ({
        ...item,
        media_type: 'movie'
      }))
    }

    if (type === 'tv') {
      results = results.map(item => ({
        ...item,
        media_type: 'tv'
      }))
    }

    if (type === 'all') {
      results = results.filter(
        item =>
          item.media_type === 'movie' ||
          item.media_type === 'tv'
      )

      if (year) {
        results = results.filter(item => {
          const date =
            item.media_type === 'movie'
              ? item.release_date
              : item.first_air_date

          return date?.startsWith(year)
        })
      }
    }

    res.json({
      ...data,
      results
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      error: 'Failed to search TMDB'
    })
  }
})

export default router