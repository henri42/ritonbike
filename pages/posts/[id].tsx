import { GetStaticPaths, GetStaticProps } from 'next'
import Image from 'next/image'
import { getPlaiceholder } from 'plaiceholder'
import type { Post } from '../../types/post'

import styles from '../../styles/Post.module.css'
import Link from 'next/link'
import {
  ChartIcon,
  ListIcon,
  MapIcon,
  UpIcon,
  DownIcon,
  DistanceIcon,
} from '../../components/Icons/Icons'
import { fetchAllPosts, fetchPost } from '../../lib/post'
import Layout from '../../components/Layout/Layout'

type Props = {
  postData: Post
  imageProps: any
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

  const { base64, img } = await getPlaiceholder(postData.coverImage)
  return {
    props: {
      postData,
      imageProps: {
        ...img,
        blurDataURL: base64,
      },
    },
  }
}

const Post = ({ postData, imageProps }: Props) => {
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

  const kmDistance = (postData.distance / 1000).toFixed(1)

  return (
    <Layout container subtitle={postData.title}>
      <div className={styles.imageContainer}>
        <Image
          {...imageProps}
          layout="responsive"
          width={500}
          height={500}
          placeholder="blur"
        />
      </div>
      <h1>{postData.title}</h1>
      <div className={styles.stats}>
        <div className={`${styles.invert} ${styles.item}`}>
          <DistanceIcon />
          <span>{kmDistance} <small>km</small></span>
        </div>
        <div className={styles.item}>
          <UpIcon />
          <span>{postData.uphill} <small>m</small></span>
        </div>
        <div className={styles.item}>
          <DownIcon />
          <span>
            {postData.downhill} <small>m</small>
          </span>
        </div>
      </div>
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
