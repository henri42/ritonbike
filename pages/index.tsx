import type { GetStaticProps } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import dynamic from 'next/dynamic'
import type { Post } from '../types/post'
import { fetchAllPosts, fetchPost } from '../lib/post'
import Layout from '../components/Layout/Layout'

const MapWithNoSSR = dynamic(() => import('../components/BikeMap/BikeMap'), {
  ssr: false,
})

export const getStaticProps: GetStaticProps = async () => {
  const posts = await fetchAllPosts()
  const postsPromises = posts.map(async (p) => fetchPost(p.id))
  const fullPosts = await Promise.all(postsPromises)

  return {
    props: {
      posts: fullPosts,
    },
  }
}

type Props = {
  posts: Post[]
}

const Home = ({ posts }: Props) => {
  return (
    <Layout>
      <div className={styles.root}>
        <main className={styles.main}>
          <MapWithNoSSR posts={posts} />
          <span className={styles.credits}>riton bike trip</span>
        </main>
      </div>
    </Layout>
  )
}

export default Home
