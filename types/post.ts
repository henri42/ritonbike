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
  vehicle: 'bike' | 'boat' | 'car' | 'train'
  points: Point[]
  distance: number
  uphill: number
  downhill: number
}

export type Stat = {
  id: number
  value: number
  unit: string
  emojis?: string
}