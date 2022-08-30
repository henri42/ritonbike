import styles from './Stats.module.css'

import { UpIcon, DownIcon, DistanceIcon } from '../../components/Icons/Icons'

type StatsProps = {
  distance: number
  uphill: number
  downhill: number
}

const Stats = ({ distance, uphill, downhill }: StatsProps) => {
  const kmDistance = (distance / 1000).toFixed(1)
  return (
    <div className={styles.root}>
      <div className={`${styles.invert} ${styles.item}`}>
        <DistanceIcon />
        <span>
          {kmDistance}
          <small>km</small>
        </span>
      </div>
      <div className={styles.item}>
        <UpIcon />
        <span>
          {uphill}
          <small>m</small>
        </span>
      </div>
      <div className={styles.item}>
        <DownIcon />
        <span>
          {downhill}
          <small>m</small>
        </span>
      </div>
    </div>
  )
}

export default Stats
