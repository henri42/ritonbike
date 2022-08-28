export type Point = {
  id: number
  lat: number
  lng: number
  elv: number
}

export type Post = {
  content: string
  coverImage: string
  created: string
  id: number
  title: string
  points: Point[]
  distance: number
  uphill: number
  downhill: number
}
