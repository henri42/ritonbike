import Head from 'next/head'
import { ReactNode } from 'react'

import styles from './Layout.module.css'

type Props = {
  title?: string
  subtitle?: string
  container?: boolean
  children: ReactNode
}

const defaultTitle = 'ritonbike'

const Layout = ({
  title = defaultTitle,
  subtitle = '',
  container = false,
  children,
}: Props) => {
  const pageSubtitle = subtitle.length > 0 ? ' - ' + subtitle : ''
  const classes = container ? styles.container : ''
  return (
    <div className={styles.root}>
      <Head>
        <title>{title + pageSubtitle}</title>
        <meta
          name="description"
          content="Un petit tour de la méditerrannée avec pour véhicule le vélocipède."
        />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        ></link>
      </Head>
      <div className={classes}>{children}</div>
    </div>
  )
}

export default Layout
