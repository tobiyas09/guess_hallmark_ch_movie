'use client'

import { useEffect, useState } from 'react'
import { HMOVIES, MOVIES } from './const'
import MovieCard from '@/components/MovieCard'
import Snowflake from '@/components/Snowflake'

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmYzYyZTYxNDBmZjQ3NzA5YTRlNzE1NjAwOGNjNmFmNCIsIm5iZiI6MTczNTMwNzU3OC4wOTUsInN1YiI6IjY3NmViMTNhZjk0NTRlZWIxZDkyYTE3NSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ieTC0IlN2O1kFME3y2DzwP6-eJcYg2DVroPgVZSD0ug',
  },
}

export default function Home() {
  const [movie, setMovie] = useState(undefined)
  const [hmovie, setHMovie] = useState(undefined)
  const [loading, setLoading] = useState(true)
  const [streak, setStreak] = useState(0)
  const [best, setBest] = useState(Number(localStorage.getItem('best')) || 0)

  async function fetchMovies() {
    let index = Math.round(Math.random() * MOVIES.length)
    let m = MOVIES[index].split(' ').join('%20')

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
    fetchMovies()
  }, [])

  useEffect(() => {
    if (movie === undefined || hmovie === undefined) {
      fetchMovies()
    }
  }, [hmovie, movie])

  async function selectHandler(movie) {
    if (movie.id === hmovie.id) {
      setStreak((p) => p + 1)
      await fetchMovies()
    } else {
      setStreak(0)
      if (streak > best) {
        setBest(streak)
        localStorage.setItem('best', streak.toString())
      }
      await fetchMovies()
    }
  }

  return (
    <div className="h-full grid grid-cols-1 gap-6 items-center p-16 font-[family-name:var(--font-geist-sans)] overflow-hidden">
      <h1 className="text-center text-xl font-bold">
        Guess which movie is from the Hallmark Channel
      </h1>
      <div
        className={`flex gap-6 justify-center items-center  h-full ${
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
      <p className="text-center">
        <p>
          Streak: <b>{streak}</b>
        </p>
        <p>
          Best: <b>{best}</b>
        </p>
      </p>
      {Array(400)
        .fill(1)
        .map((v, i) => {
          return <Snowflake key={i} id={`snowflake-${i}`} />
        })}
    </div>
  )
}
