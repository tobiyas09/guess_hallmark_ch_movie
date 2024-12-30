'use client'

import { useEffect, useState } from 'react'
import { HMOVIES, MOVIES } from './const'
import MovieCard from '@/components/MovieCard'

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
  const [streak, setStreak] = useState(0)

  async function fetchMovies() {
    let index = Math.round(Math.random() * MOVIES.length)
    console.log(index)
    console.log(MOVIES[index])
    let m = MOVIES[index].split(' ').join('%20')

    fetch(
      `https://api.themoviedb.org/3/search/movie?query=${m}&include_adult=false&language=en-US&page=1`,
      options
    )
      .then((res) => res.json())
      .then((res) => {
        setMovie(res.results[0])
        console.log(res)
      })
      .catch((err) => console.error(err))

    index = Math.round(Math.random() * HMOVIES.length)
    m = HMOVIES[index].split(' ').join('%20')

    fetch(
      `https://api.themoviedb.org/3/search/movie?query=${m}&include_adult=false&language=en-US&page=1`,
      options
    )
      .then((res) => res.json())
      .then((res) => {
        setHMovie(res.results[0])
        console.log(res)
      })
      .catch((err) => console.error(err))
  }

  useEffect(() => {
    fetchMovies()
  }, [])

  async function selectHandler(movie) {
    console.log(movie.title)
    if (movie.id === hmovie.id) {
      console.log('tocno')
      setStreak((p) => p + 1)
      await fetchMovies()
    } else {
      setStreak(0)
      await fetchMovies()
    }
  }

  return (
    <div className="h-full grid grid-cols-1 gap-6 items-center p-16 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-center text-xl font-bold">
        Guess which movie is from the Hallmark Channel
      </h1>
      <div
        className={`flex gap-6 justify-center items-center h-full ${
          Math.random() * 2 < 1
            ? 'sm:flex-row flex-col-reverse	'
            : 'sm:flex-row-reverse flex-col-reverse	'
        }`}
      >
        {movie ? <MovieCard movie={movie} onClick={selectHandler} /> : null}

        {hmovie ? <MovieCard movie={hmovie} onClick={selectHandler} /> : null}
      </div>
      <p className="text-center">Streak: {streak}</p>
    </div>
  )
}
