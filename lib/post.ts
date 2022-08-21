import { Post } from "../types/post"

const fetchAllPosts = async () => {
  const res = await fetch('http://localhost:5000/api/posts')
  const posts: Post[] = await res.json()
  return posts
}

const fetchPost = async (postId: number | string) => {
  const res = await fetch('http://localhost:5000/api/posts/' + postId.toString())
  const post = await res.json()
  const postObject: Post = {
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
  return postObject
}

export { fetchAllPosts, fetchPost }