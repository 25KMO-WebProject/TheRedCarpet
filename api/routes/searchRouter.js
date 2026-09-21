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

router.get('/details/:mediaType/:id', async (req, res) => {
  try {
    const { mediaType, id } = req.params

    if (!['movie', 'tv'].includes(mediaType)) {
      return res.status(400).json({
        error: 'Invalid media type'
      })
    }

    const headers = {
      Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
      accept: 'application/json'
    }

    const detailsUrl =
      `https://api.themoviedb.org/3/${mediaType}/${id}?language=fi-FI`

    const providersUrl =
      `https://api.themoviedb.org/3/${mediaType}/${id}/watch/providers`

    const ratingsUrl =
      mediaType === 'movie'
        ? `https://api.themoviedb.org/3/movie/${id}/release_dates`
        : `https://api.themoviedb.org/3/tv/${id}/content_ratings`

    const [
      detailsResponse,
      providersResponse,
      ratingsResponse
    ] = await Promise.all([
      fetch(detailsUrl, { headers }),
      fetch(providersUrl, { headers }),
      fetch(ratingsUrl, { headers })
    ])

    if (!detailsResponse.ok) {
      return res.status(detailsResponse.status).json({
        error: 'TMDB details request failed'
      })
    }

    const details = await detailsResponse.json()

    const providers = providersResponse.ok
      ? await providersResponse.json()
      : { results: {} }

    const ratings = ratingsResponse.ok
      ? await ratingsResponse.json()
      : { results: [] }

    // Suomen katselupalvelut
    const finnishProviders =
      providers.results?.FI || null

    // Suomen ikäraja
    let certification = null

    if (mediaType === 'movie') {
      const finnishReleaseData =
        ratings.results?.find(
          item => item.iso_3166_1 === 'FI'
        )

      certification =
        finnishReleaseData?.release_dates
          ?.find(item => item.certification)
          ?.certification || null
    } else {
      certification =
        ratings.results?.find(
          item => item.iso_3166_1 === 'FI'
        )?.rating || null
    }

    res.json({
      id: details.id,
      media_type: mediaType,

      title:
        details.title ||
        details.name,

      original_title:
        details.original_title ||
        details.original_name,

      overview: details.overview,

      release_date:
        details.release_date ||
        details.first_air_date,

      genres: details.genres || [],

      poster_path: details.poster_path,
      backdrop_path: details.backdrop_path,

      vote_average: details.vote_average,

      runtime:
        mediaType === 'movie'
          ? details.runtime
          : details.episode_run_time?.[0] || null,

      certification,

      watch_providers: finnishProviders
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      error: 'Failed to fetch media details'
    })
  }
})

export default router