import styles from '../styles/Home.module.css'
import Layout from '../components/Layout/Layout'
import Countdown, { CountdownRendererFn } from 'react-countdown'
import Image from 'next/image'

const Completionist = () => <span>Zépartiiii !</span>

const renderer: CountdownRendererFn = ({
  days,
  hours,
  minutes,
  seconds,
  completed,
}) => {
  if (completed) {
    return <Completionist />
  } else {
    return (
        <span suppressHydrationWarning={true} className={styles.countdown}>
          {days}j {hours}h {minutes}m {seconds}s
        </span>
    )
  }
}

const Home = () => {
  const startDate = new Date(2022, 8, 12, 0, 0, 0, 0)
  return (
    <Layout>
      <div className={styles.root}>
        <main className={styles.main}>
          <Image src="/tire.gif" width={32} height={32} />
          <h1>Encore quelques petits réglages...</h1>
          <Countdown date={startDate} renderer={renderer} />
        </main>
      </div>
    </Layout>
  )
}

export default Home
