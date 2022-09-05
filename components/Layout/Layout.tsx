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
          content="Un petit tour de la méditerrannée en vélocipède."
        />
        <link key="favicon" rel="icon" href="/favicon.ico" />
        <link
          key="apple-touch-icon"
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        ></link>
        <link
          key="icon32"
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        ></link>
        <link
          key="icon16"
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        ></link>
        <link key="manifest" rel="manifest" href="/site.webmanifest"></link>
      </Head>
      <div className={classes}>{children}</div>
    </div>
  )
}

export default Layout
