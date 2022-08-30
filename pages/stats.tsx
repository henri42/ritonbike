import { ReactNode } from 'react'
import { ButtonLink } from '../components/Buttons/Buttons'
import { ListIcon, MapIcon } from '../components/Icons/Icons'
import Layout from '../components/Layout/Layout'
import styles from '../styles/Stats.module.css'

type StatItemProps = {
  value: number | string
  unit: string
  children?: ReactNode
}

const StatItem = ({ value, unit, children }: StatItemProps) => (
  <div className={styles.item}>
    <div className={styles.data}>
      <span className={styles.value}>{value}</span>
      <span className={styles.unit}>{unit}</span>
    </div>
    {children}
  </div>
)

const Stats = () => {
  return (
    <Layout container>
      <div className={styles.root}>
        <h2>Quelques petites stats :</h2>
        <div className={styles.stats}>
          <StatItem value={3} unit=" pays">
            {' '}
            <span className={styles.bigEmoji}>🇦🇿🇧🇪🇧🇻</span>
          </StatItem>
          <StatItem value={453} unit=" km"></StatItem>
          <StatItem value={157} unit=" dates mangées"></StatItem>
          <StatItem value={3} unit=" poulet capturés"></StatItem>
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
