'use client'
import s from './error.module.scss'
import { useEffect } from 'react'

export default function Error({ error, reset }: {
  error: Error & { digest?: string }
  reset: () => void
}) {

  useEffect(() => { console.error(error) }, [error])

  return (
    <div className={s.error}>
      <h1>Something went wrong!</h1>
      <p>{error.message}</p>
      <button onClick={() => reset()}>
        Try again
      </button>
    </div>
  )
}