'use client'

import { useEffect, useRef, useState } from 'react'
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
  const [loading, setLoading] = useState(true)
  const [streak, setStreak] = useState(0)
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: window.innerWidth,
    y: window.innerHeight,
  })
  const [windowSize, setWindowSize] = useState<{ x: number; y: number }>({
    x: window.innerWidth,
    y: window.innerHeight,
  })

  const [beta, setBeta] = useState(1)
  const alfa = useRef(1)

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
    // fetchMovies()
  }, [])

  useEffect(() => {
    const updateSize = () => {
      setWindowSize({ x: window.innerWidth, y: window.innerHeight })
    }

    const mouseMove = (ev: MouseEvent) => {
      // setpos(ev.clientX)
      // const x = Math.min((windowSize.y * ev.pageX) / ev.pageY, windowSize.x)
      // const y = (x * ev.pageY) / ev.pageX
      // setPosition({ x: x, y: y })
      // console.log(ev.pageX / ev.pageY, 'fdsa')

      alfa.current = ev.pageX / ev.pageY
    }

    window.addEventListener('resize', updateSize)
    window.addEventListener('mousemove', mouseMove)

    return () => {
      window.removeEventListener('resize', updateSize)
      window.removeEventListener('mousemove', mouseMove)
    }
  }, [])

  const x = useRef(windowSize.x / 2)
  const y = useRef(0)

  useEffect(() => {
    animate()
  }, [])

  function animate() {
    requestAnimationFrame(() => {
      document.documentElement.style.setProperty('--posX', `${x.current}px`)
      document.documentElement.style.setProperty('--posY', `${y.current}px`)
    })

    // console.log(alfa.current)

    if (x.current >= windowSize.x / 2) {
      x.current = 0
      y.current = 0
    } else {
      x.current += 1 * (alfa.current - 1)
      y.current += 1
    }

    requestAnimationFrame(() => animate())
  }

  async function selectHandler(movie) {
    if (movie.id === hmovie.id) {
      setStreak((p) => p + 1)
      await fetchMovies()
    } else {
      setStreak(0)
      await fetchMovies()
    }
  }

  return (
    <div className="h-full grid grid-cols-1 gap-6 items-center p-16 font-[family-name:var(--font-geist-sans)] overflow-hidden">
      <h1 className="text-center text-xl font-bold">
        Guess which movie is from the Hallmark Channel
      </h1>
      <div
        className={`flex gap-6 justify-center items-center h-full ${
          Math.random() * 2 < 1
            ? 'sm:flex-row flex-col-reversew'
            : 'sm:flex-row-reverse flex-col-reverse'
        }`}
      >
        {loading ? (
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
      <p className="text-center">Streak: {streak}</p>

      {Array(251)
        .fill(1)
        .map((v, i) => {
          return (
            <div
              key={i}
              className={`snowflake animatedBox`}
              style={{
                zIndex: -1,
                transform: `translate(var(--posX), var(--posY))`,
                top: -5 * Math.random() * 200 + 20,
                left:
                  windowSize.x / 2 +
                  10 +
                  i *
                    Math.random() *
                    10 *
                    (Math.round(Math.random() * 2) % 2 === 0 ? 1 : -1),
              }}
            />
          )
        })}
    </div>
  )
}
