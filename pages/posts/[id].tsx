import { GetStaticPaths, GetStaticProps } from 'next'
import Image from 'next/image'
import { getPlaiceholder } from 'plaiceholder'
import type { Post } from '../../types/post'

import styles from '../../styles/Post.module.css'
import { ChartIcon, ListIcon, MapIcon } from '../../components/Icons/Icons'
import Layout from '../../components/Layout/Layout'
import Stats from '../../components/Stats/Stats'

import { fetchAllPosts, fetchPost } from '../../lib/post'
import { ButtonLink } from '../../components/Buttons/Buttons'

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
      <Stats
        distance={postData.distance}
        uphill={postData.uphill}
        downhill={postData.downhill}
      />
      <p
        className={styles.content}
        dangerouslySetInnerHTML={{
          __html: postData.content.replace(/\n/g, '<br />'),
        }}
      ></p>
      <footer className={styles.footer}>
        <nav className={styles.nav}>
        <ButtonLink href="/" title="Carte">
              <MapIcon />
            </ButtonLink>
            <ButtonLink href="/list" title="Articles">
              <ListIcon />
            </ButtonLink>
            <ButtonLink href="/stats" title="Stats">
              <ChartIcon />
            </ButtonLink>
        </nav>
      </footer>
    </Layout>
  )
}

export default Post
