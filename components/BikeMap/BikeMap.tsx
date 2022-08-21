import {
  MapContainer,
  TileLayer,
  Polyline,
  CircleMarker,
  Popup,
  Tooltip,
} from 'react-leaflet'
import { LatLngTuple, PathOptions } from 'leaflet'

import styles from './BikeMap.module.css'
import 'leaflet/dist/leaflet.css'

import { Post } from '../../types/post'
import { ReactNode, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import Image from 'next/image'

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
  children: ReactNode
}

const Checkpoint = ({ center, children }: CheckpointProps) => {
  const [radius, setRadius] = useState(5)
  const isDesktop = useMediaQuery({ query: '(min-width: 1224px)' })
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
      {!isDesktop ? (
        <Popup className={styles.popup}>{children}</Popup>
      ) : (
        <Tooltip>{children}</Tooltip>
      )}
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
        const isImagePresent = post.coverImage !== ''
        return (
          <div key={post.id}>
            <Polyline
              pathOptions={pathOptions}
              smoothFactor={4}
              positions={points}
            />
            <Checkpoint center={points[0]}>
              {post.title}
              {isImagePresent && (
                <Image src={post.coverImage} width={300} height={300} />
              )}
            </Checkpoint>
          </div>
        )
      })}
    </MapContainer>
  )
}

export default BikeMap
