import styles from './Buttons.module.css'
import { ReactNode } from 'react'
import Link from 'next/link'

type ButtonLinkProps = {
  title: string
  href: string
  children: ReactNode
}

const ButtonLink = ({ title, href, children }: ButtonLinkProps) => {
  return (
    <Link href={href}>
      <a className={styles.root}>
        {children}
        <span>{title}</span>
      </a>
    </Link>
  )
}

type ButtonProps = {
  title: string
  onClick: () => void
  children: ReactNode
}

const Button = ({ title, onClick, children }: ButtonProps) => {
  return (
    <button onClick={onClick} className={styles.root}>
      {children}
      <span>{title}</span>
    </button>
  )
}

export { ButtonLink, Button }
