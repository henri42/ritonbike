import { GetStaticProps } from 'next/types'
import { fetchAllPosts, fetchPost } from '../lib/post'
import { Post } from '../types/post'

import styles from '../styles/List.module.css'
import Layout from '../components/Layout/Layout'

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
        <div className={styles.container}>
          {posts.map((p) => (
            <div key={p.id}>
              <h3>{p.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}

export default List
