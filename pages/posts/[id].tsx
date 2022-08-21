import { GetStaticPaths, GetStaticProps } from 'next'
import Image from 'next/image'
import type { Post } from '../../types/post'
import { SVGProps } from 'react'

import styles from '../../styles/Post.module.css'
import Link from 'next/link'
import { ChartIcon, ListIcon, MapIcon } from '../../components/Icons/Icons'

type Props = {
  postData: Post
}

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await fetch('http://localhost:5000/api/posts')
  const posts: Post[] = await res.json()
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
  const res = await fetch('http://localhost:5000/api/posts/' + params?.id)
  const post = await res.json()
  const postData: Post = {
    content: post.content,
    title: post.title,
    coverImage:
      post.cover_image !== undefined
        ? process.env.BACK_END_URL + post.cover_image
        : '',
    points: post.points || [],
    created: post.created,
    id: post.id,
  }
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
    <div className={styles.root}>
      <div className={styles.container}>
        <div className={styles.imageContainer}>
          <Image
            src={postData.coverImage}
            layout="responsive"
            width={500}
            height={500}
          />
        </div>
        <h1>{postData.title}</h1>
        <p>{postData.content}</p>
        <footer>
          <nav>
            <Link href="/">{mapLink}</Link>
            <Link href="/list">{listLink}</Link>
            <Link href="/stats">{statsLink}</Link>
          </nav>
        </footer>
      </div>
    </div>
  )
}

export default Post
