import { GetStaticProps } from 'next/types'
import { ReactNode } from 'react'
import { ButtonLink } from '../components/Buttons/Buttons'
import { ListIcon, MapIcon } from '../components/Icons/Icons'
import Layout from '../components/Layout/Layout'
import { fetchAllPosts, fetchAllStats } from '../lib/post'
import styles from '../styles/Stats.module.css'
import { Post, Stat } from '../types/post'

export const getStaticProps: GetStaticProps = async () => {
  const stats = await fetchAllStats()
  const posts = await fetchAllPosts()
  const totalUphill = posts
    .filter((post) => post.vehicle === 'bike')
    .map((post) => post.uphill)
    .reduce((acc, current) => acc + current, 0)
  const totalDistanceMeters = posts
    .filter((post) => post.vehicle === 'bike')
    .map((post) => post.distance)
    .reduce((acc, current) => acc + current, 0)
  const totalDistance = (totalDistanceMeters / 1000).toFixed(0)
  return {
    props: {
      stats,
      totalUphill,
      totalDistance,
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
  stats: Stat[]
  totalUphill: number
  totalDistance: number
}

const Stats = ({ stats, totalUphill, totalDistance }: PageProps) => {
  return (
    <Layout container>
      <div className={styles.root}>
        <h2>Chiffres sans intérêt 🤷</h2>
        <div className={styles.stats}>
          <StatItem value={totalDistance} unit="km parcourus">
            <span className={styles.bigEmoji}>🛣️</span>
          </StatItem>
          <StatItem value={totalUphill} unit="m grimpés">
            <span className={styles.bigEmoji}>⛰️</span>
          </StatItem>
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
