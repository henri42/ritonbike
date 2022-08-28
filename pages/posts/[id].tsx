import { GetStaticPaths, GetStaticProps } from 'next'
import Image from 'next/image'
import type { Post } from '../../types/post'
import { SVGProps } from 'react'

import styles from '../../styles/Post.module.css'
import Link from 'next/link'
import { ChartIcon, ListIcon, MapIcon } from '../../components/Icons/Icons'
import { fetchAllPosts, fetchPost } from '../../lib/post'
import Layout from '../../components/Layout/Layout'

type Props = {
  postData: Post
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await fetchAllPosts()
  const idList = posts.map((post) => {
    return {
      params: {
        id: post.id.toString(), // TODO replace by slug
      },
    }
  })
  return {
    paths: idList,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const postId = params ? (params.id as string) : 1
  const postData = await fetchPost(postId)
  return {
    props: {
      postData,
    },
  }
}

const Post = ({ postData }: Props) => {
  const mapLink = (
    <a className={styles.navLink}>
      <MapIcon />
      <span>Carte</span>
    </a>
  )
  const listLink = (
    <a className={styles.navLink}>
      <ListIcon />
      <span>Liste</span>
    </a>
  )
  const statsLink = (
    <a className={styles.navLink}>
      <ChartIcon />
      <span>Stats</span>
    </a>
  )

  return (
    <Layout container subtitle={postData.title}>
      <div className={styles.imageContainer}>
        <Image
          src={postData.coverImage}
          layout="responsive"
          width={500}
          height={500}
        />
      </div>
      <h1>{postData.title}</h1>
      <p className={styles.content}>{postData.content}</p>
      <footer className={styles.footer}>
        <nav className={styles.nav}>
          <Link href="/">{mapLink}</Link>
          <Link href="/list">{listLink}</Link>
          <Link href="/stats">{statsLink}</Link>
        </nav>
      </footer>
    </Layout>
  )
}

export default Post
