import { useRef, useEffect } from 'react'

export default function Snowflake({ id }: { id: string }) {
  const windowSize = useRef<{ x: number; y: number }>({
    x: window.innerWidth,
    y: window.innerHeight,
  })
  const alfa = useRef(1)
  const speed = Math.random() * 1 + 1
  const dy = -2 * Math.random() * windowSize.current.y
  const dx =
    windowSize.current.x / 2 +
    Math.random() *
      windowSize.current.x *
      (Math.round(Math.random() * 2) % 2 === 0 ? 1 : -1)

  const x = useRef(dx)
  const y = useRef(dy)

  useEffect(() => {
    const updateSize = () => {
      windowSize.current = { x: window.innerWidth, y: window.innerHeight }
    }

    const mouseMove = (ev: MouseEvent) => {
      alfa.current = Math.max(
        Math.min((ev.pageX - windowSize.current.x / 2) / ev.pageY, 1),
        -1
      )
    }

    window.addEventListener('resize', updateSize)
    window.addEventListener('mousemove', mouseMove)

    return () => {
      window.removeEventListener('resize', updateSize)
      window.removeEventListener('mousemove', mouseMove)
    }
  }, [])

  useEffect(() => {
    animate()
  }, [])

  function animate() {
    document.documentElement.style.setProperty(`--posX-${id}`, `${x.current}px`)
    document.documentElement.style.setProperty(`--posY-${id}`, `${y.current}px`)
    if (y.current >= windowSize.current.y) {
      x.current = dx
      y.current = dy
    } else {
      x.current += 1 * alfa.current
      y.current += 1 * speed
    }

    requestAnimationFrame(() => animate())
  }

  return (
    <div
      className={`snowflake animatedBox`}
      style={{
        zIndex: -1,
        transform: `translate(var(--posX-${id}), var(--posY-${id}))`,
        top: 0,
        left: 0,
      }}
    />
  )
}
