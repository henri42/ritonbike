import { GetStaticProps } from 'next/types'
import { ReactNode } from 'react'
import { ButtonLink } from '../components/Buttons/Buttons'
import { ListIcon, MapIcon } from '../components/Icons/Icons'
import Layout from '../components/Layout/Layout'
import { fetchAllStats } from '../lib/post'
import styles from '../styles/Stats.module.css'

export const getStaticProps: GetStaticProps = async () => {
  const stats = await fetchAllStats()
  return {
    props: {
      stats,
    },
  }
}

type StatItemProps = {
  value: number | string
  unit: string
  children?: ReactNode
}

const StatItem = ({ value, unit, children }: StatItemProps) => (
  <div className={styles.item}>
    <div className={styles.data}>
      <span className={styles.value}>{value}</span>
      <span className={styles.unit}>&nbsp;{unit}</span>
    </div>
    {children}
  </div>
)

type PageProps = {
  stats: any[]
}

const Stats = ({ stats }: PageProps) => {
  return (
    <Layout container>
      <div className={styles.root}>
        <h2>Quelques petites stats :</h2>
        <div className={styles.stats}>
          {stats.map((stat) => (
            <StatItem key={stat.id} value={stat.value} unit={stat.unit}>
              <span className={styles.bigEmoji}>{stat.emojis}</span>
            </StatItem>
          ))}
        </div>
        <footer className={styles.footer}>
          <nav className={styles.nav}>
            <ButtonLink href="/" title="Carte">
              <MapIcon />
            </ButtonLink>
            <ButtonLink href="/list" title="Articles">
              <ListIcon />
            </ButtonLink>
          </nav>
        </footer>
      </div>
    </Layout>
  )
}

export default Stats
