import { MovieDetails } from '@/types/movies'
import Image from 'next/image'

const WIDTH = 200
const HEIGHT = (WIDTH * 16) / 9

type MovieCardProps = {
  movie: MovieDetails
  onClick: (movie: MovieDetails) => void
}

export default function MovieCard({ movie, onClick }: MovieCardProps) {
  return (
    <div
      onClick={() => onClick(movie)}
      className="flex flex-1 flex-col justify-between border-solid rounded-2xl border-2 p-4 w-200 max-w-200 h-full hover:bg-[#ff3a2f] cursor-pointer"
    >
      <Image
        src={'https://image.tmdb.org/t/p/original' + movie.poster_path}
        alt="Movie poster"
        width={WIDTH}
        height={HEIGHT}
        className="rounded-lg"
        priority
      />
      <p className="movie_name">{movie.title}</p>
    </div>
  )
}
