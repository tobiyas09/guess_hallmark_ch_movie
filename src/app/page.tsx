'use client'

import { useEffect, useState } from 'react'
import { HMOVIES, MOVIES } from './const'
import MovieCard from '@/components/MovieCard'
import Snowflake from '@/components/Snowflake'
import { MovieDetails } from '@/types/movies'

const BEST_KEY = 'best'
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${process.env.TOKEN}`,
  },
}

let initalFetch = false

export default function Home() {
  const [movie, setMovie] = useState<MovieDetails | undefined>(undefined)
  const [hmovie, setHMovie] = useState<MovieDetails | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [streak, setStreak] = useState(0)
  const [best, setBest] = useState(0)

  async function fetchMovies() {
    let index = Math.round(Math.random() * MOVIES.length)
    let m = MOVIES[index].split(' ').join('%20')

    if (!initalFetch) {
      initalFetch = true
    }

    try {
      setLoading(true)
      let res = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${m}&include_adult=false&language=en-US&page=1`,
        options
      )

      let data = await res.json()
      setMovie(data.results[0])

      index = Math.round(Math.random() * HMOVIES.length)
      m = HMOVIES[index].split(' ').join('%20')

      res = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${m}&include_adult=false&language=en-US&page=1`,
        options
      )
      data = await res.json()

      setHMovie(data.results[0])
    } catch (error) {
      console.error(error)
    }
    setLoading(false)
  }

  useEffect(() => {
    const bst = Number(localStorage.getItem(BEST_KEY) || 0)
    setBest(bst)
  }, [])

  useEffect(() => {
    fetchMovies()
  }, [])

  useEffect(() => {
    if ((movie === undefined || hmovie === undefined) && initalFetch) {
      fetchMovies()
    }
  }, [hmovie, movie])

  async function selectHandler(movie: MovieDetails) {
    if (movie.id === hmovie?.id) {
      setStreak((p) => p + 1)
      await fetchMovies()
    } else {
      setStreak(0)
      if (streak > best) {
        setBest(streak)
        localStorage.setItem(BEST_KEY, streak.toString())
      }
      await fetchMovies()
    }
  }

  return (
    <div
      className="h-full grid grid-cols-1 gap-6 items-center p-16 font-[family-name:var(--font-geist-sans)] overflow-hidden relative"
      style={{
        contain: 'layout paint',
      }}
    >
      <h1 className="text-center text-xl font-bold">
        Which movie is from the Hallmark Channel?
      </h1>
      <div
        className={`flex gap-6 justify-center items-center h-full ${
          Math.random() * 2 < 1
            ? 'sm:flex-row flex-col-reversew'
            : 'sm:flex-row-reverse flex-col-reverse'
        }`}
      >
        {loading || !movie || !hmovie ? (
          <div className="flex items-center" style={{ height: (200 * 16) / 9 }}>
            Loading...
          </div>
        ) : (
          <>
            <MovieCard movie={movie} onClick={selectHandler} />
            <MovieCard movie={hmovie} onClick={selectHandler} />
          </>
        )}
      </div>
      <div className="text-center">
        <p>
          Streak: <b>{streak}</b>
        </p>
        <p>
          Best: <b>{best}</b>
        </p>
      </div>
      {Array(401)
        .fill(1)
        .map((v, i) => {
          return <Snowflake key={i} id={`snowflake-${i}`} />
        })}
    </div>
  )
}
