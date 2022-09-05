import { GetStaticProps } from 'next/types'
import { fetchAllPosts, fetchPost } from '../lib/post'
import { Post } from '../types/post'

import styles from '../styles/List.module.css'
import Layout from '../components/Layout/Layout'
import { ButtonLink } from '../components/Buttons/Buttons'
import { ChartIcon, MapIcon } from '../components/Icons/Icons'
import Link from 'next/link'
import Image from 'next/image'

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
        <div className={styles.topIcon}>
          <Image src="/biker.gif" width={32} height={32} />
        </div>
        <div className={styles.list}>
          {posts.map((p, index) => (
            <div key={p.id}>
              Étape {index + 1}&nbsp;&nbsp;.&nbsp;&nbsp;
              <Link href={`/posts/${p.id}`}>{p.title}</Link>
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
