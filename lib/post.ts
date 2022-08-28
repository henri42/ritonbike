import { Post } from '../types/post'

const fetchAllPosts = async () => {
  const backendUrl = process.env.BACK_END_URL
  const readApiKey = process.env.READ_APIKEY
  if (backendUrl === undefined) throw Error('BACK_END_URL not set properly')
  if (readApiKey === undefined) throw Error('READ_APIKEY not set properly')

  const headers = new Headers({
    Authorization: `Bearer ${readApiKey}`,
  })

  const res = await fetch(backendUrl + '/api/posts', {
    method: 'GET',
    headers,
  })
  const posts: Post[] = await res.json()
  return posts
}

const fetchPost = async (postId: number | string) => {
  const backendUrl = process.env.BACK_END_URL
  const readApiKey = process.env.READ_APIKEY
  if (backendUrl === undefined) throw Error('BACK_END_URL not set properly')
  if (readApiKey === undefined) throw Error('READ_APIKEY not set properly')

  const headers = new Headers({
    Authorization: `Bearer ${readApiKey}`,
  })

  const res = await fetch(backendUrl + '/api/posts/' + postId.toString(), {
    method: 'GET',
    headers,
  })
  const post = await res.json()
  const postObject: Post = {
    content: post.content,
    title: post.title,
    coverImage:
      post.cover_image !== undefined ? backendUrl + post.cover_image : '',
    points: post.points || [],
    created: post.created,
    id: post.id,
  }
  return postObject
}

export { fetchAllPosts, fetchPost }
