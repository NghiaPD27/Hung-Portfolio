import { useEffect, useState } from 'react'

const QUERY = '(hover: hover) and (pointer: fine)'

export default function useFineHover() {
  const [fineHover, setFineHover] = useState(() => typeof window !== 'undefined' && window.matchMedia(QUERY).matches)

  useEffect(() => {
    const media = window.matchMedia(QUERY)
    const update = () => setFineHover(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  return fineHover
}
