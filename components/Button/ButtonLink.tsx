import styles from './ButtonLink.module.css'
import { ReactNode } from 'react'
import Link from 'next/link'

type Props = {
  title: string
  href: string
  children: ReactNode
}

const ButtonLink = ({ title, href, children }: Props) => {
  return (
    <Link href={href}>
      <a className={styles.root}>
        {children}
        <span>{title}</span>
      </a>
    </Link>
  )
}

export default ButtonLink
