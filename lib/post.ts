import { Post } from '../types/post'

const fetchAllStats = async () => {
  const backendUrl = process.env.BACK_END_URL
  if (backendUrl === undefined) throw Error('BACK_END_URL not set properly')

  const res = await fetch(backendUrl + '/api/stats')
  const stats = await res.json()
  return stats
}

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
    distance: post.distance || 0,
    uphill: post.uphill || 0,
    downhill: post.downhill || 0,
    created: post.created,
    id: post.id,
    vehicle: post.vehicle
  }
  return postObject
}

export { fetchAllPosts, fetchPost, fetchAllStats }
