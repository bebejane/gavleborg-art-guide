import Link from 'next/link'
import s from './not-found.module.scss'

export default function NotFound() {
  return (
    <div className={s.container}>
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <Link href="/">Return Home</Link>
    </div>
  )
}