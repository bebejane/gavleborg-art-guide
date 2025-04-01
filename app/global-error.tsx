'use client'

import s from './global-error.module.scss'

export default function GlobalError({ error, reset }: {
  error: Error & { digest?: string }
  reset: () => void
}) {

  return (
    <html>
      <body className={`${s.body} ${s.error}`}>
        <h2>Something went wrong!</h2>
        <p>{error.message}</p>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  )
}