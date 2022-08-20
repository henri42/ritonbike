import {
  MapContainer,
  TileLayer,
  Polyline,
  CircleMarker,
  Popup,
  useMapEvent,
  Tooltip,
} from 'react-leaflet'
import { LatLngTuple, PathOptions } from 'leaflet'

import styles from './BikeMap.module.css'
import 'leaflet/dist/leaflet.css'

import { Post } from '../../types/post'
import { useState } from 'react'

const homePoint: LatLngTuple = [46.167071701158854, 9.031604235079925]

const getPoints = (post: Post) => {
  const points =
    post.points !== undefined
      ? post.points.map((point) => [point.lat, point.lng] as LatLngTuple)
      : []
  return points
}

const pathOptions: PathOptions = {
  color: 'red',
  weight: 5,
  fillOpacity: 1,
}

type BikeMapProps = {
  posts: Post[]
}

type CheckpointProps = {
  center: LatLngTuple
  title: string
}

const Checkpoint = ({ center, title }: CheckpointProps) => {
  const [radius, setRadius] = useState(5)
  return (
    <CircleMarker
      center={center}
      pathOptions={pathOptions}
      radius={radius}
      eventHandlers={{
        mouseover: () => {
          setRadius(7)
        },
        mouseout: () => {
          setRadius(5)
        },
      }}
    >
      <Popup className={styles.popup}>
        <div className={styles.funny}>{title}</div>
      </Popup>
    </CircleMarker>
  )
}

const BikeMap = ({ posts }: BikeMapProps) => {
  return (
    <MapContainer
      className={styles.map}
      center={homePoint}
      zoom={7}
      scrollWheelZoom={false}
    >
      <TileLayer url="https://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}{r}.png" />
      {posts.map((post) => {
        const points = getPoints(post)
        return (
          <div key={post.id}>
            <Polyline
              pathOptions={pathOptions}
              smoothFactor={4}
              positions={points}
            />
            <Checkpoint center={points[0]} title={post.title} />
          </div>
        )
      })}
    </MapContainer>
  )
}

export default BikeMap
