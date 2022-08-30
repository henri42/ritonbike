import { GetStaticProps } from 'next/types'
import { fetchAllPosts, fetchPost } from '../lib/post'
import { Post } from '../types/post'

import styles from '../styles/List.module.css'
import Layout from '../components/Layout/Layout'
import { ButtonLink } from '../components/Buttons/Buttons'
import { ChartIcon , MapIcon } from '../components/Icons/Icons'

export const getStaticProps: GetStaticProps = async () => {
  const posts = await fetchAllPosts()
  return {
    props: {
      posts,
    },
  }
}

type Props = {
  posts: Post[]
}

const List = ({ posts }: Props) => {
  return (
    <Layout container>
      <div className={styles.root}>
        <div className={styles.articles}>
          {posts.map((p) => (
            <div key={p.id}>
              <h3>{p.title}</h3>
            </div>
          ))}
        </div>
        <footer className={styles.footer}>
          <nav className={styles.nav}>
            <ButtonLink href="/" title="Carte">
              <MapIcon />
            </ButtonLink>
            <ButtonLink href="/stats" title="Stats">
              <ChartIcon />
            </ButtonLink>
          </nav>
        </footer>
      </div>
    </Layout>
  )
}

export default List
