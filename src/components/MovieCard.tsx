import Image from 'next/image'

const WIDTH = 200
const HEIGHT = (WIDTH * 16) / 9

export default function MovieCard({ movie, onClick }) {
  return (
    <div
      onClick={() => onClick(movie)}
      className="grid gap-4 border-solid rounded-2xl border-2 p-4 max-w-200 hover:bg-[#ff3a2f]"
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
