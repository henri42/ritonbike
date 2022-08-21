import {
  MapContainer,
  TileLayer,
  Polyline,
  CircleMarker,
  Popup,
  Tooltip,
  useMapEvent,
  Marker,
} from 'react-leaflet'
import { Icon, LatLngTuple, PathOptions, Point } from 'leaflet'

import styled from 'styled-components'
import styles from './BikeMap.module.css'
import 'leaflet/dist/leaflet.css'

import { Post } from '../../types/post'
import { ReactNode, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import Image from 'next/image'
import { useRouter } from 'next/router'

const getPoints = (post: Post) => {
  const points =
    post.points !== undefined
      ? post.points.map((point) => [point.lat, point.lng] as LatLngTuple)
      : []
  return points
}

const initialZoom = 7

const pathOptions: PathOptions = {
  color: 'red',
  weight: 6,
  fillOpacity: 1,
}

const markerMobileOptions: PathOptions = {
  weight: 30,
  fillColor: 'red',
  fillOpacity: 1,
  opacity: 0,
}

const markerDesktopOptions: PathOptions = {
  fillColor: 'red',
  fillOpacity: 1,
  opacity: 0,
}

type MapContentProps = {
  posts: Post[],
  lastPoint: LatLngTuple
}

type BikeMapProps = {
  posts: Post[]
}

type CheckpointProps = {
  center: LatLngTuple
  postId: number
  children: ReactNode
}

const StyledPopup = styled(Popup)`
  display: flex;
  flex-direction: column;
  .leaflet-popup-content-wrapper {
    border-radius: 5px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
    transition: all 0.05s ease-in-out;
    cursor: pointer;
    &:active {
      box-shadow: 0 1 3px rgba(0, 0, 0, 0.2);
      transform: scale(98%);
    }
  }
  .leaflet-popup-content {
    margin: 0.3rem;
  }
  .leaflet-popup-tip {
    display: none;
  }
`

const Checkpoint = ({ center, postId, children }: CheckpointProps) => {
  const router = useRouter()
  const isDesktop = useMediaQuery({ query: '(min-width: 1224px)' })
  const [radius, setRadius] = useState(10)

  return (
    <CircleMarker
      center={center}
      pathOptions={isDesktop ? markerDesktopOptions : markerMobileOptions}
      radius={radius}
      eventHandlers={{
        mouseover: () => {
          setRadius(13)
        },
        mouseout: () => {
          setRadius(10)
        },
        click: () => {
          if (isDesktop) router.push('/posts/' + postId.toString())
        },
      }}
    >
      {!isDesktop ? (
        <StyledPopup closeButton={false} offset={new Point(0, 2)}>
          {children}
        </StyledPopup>
      ) : (
        <Tooltip opacity={1}>{children}</Tooltip>
      )}
    </CircleMarker>
  )
}

const MapContent = ({ posts, lastPoint }: MapContentProps) => {
  const router = useRouter()

  const lastPointIcon = new Icon({
    iconUrl: '/biker-red-line.gif',
    iconAnchor: [-5, 17]
  })

  const [zoom, setZoom] = useState(initialZoom)
  const map = useMapEvent('zoom', () => {
    setZoom(map.getZoom())
  })

  return (
    <div className={styles.mapContent}>
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
            {zoom > 6 && (
              <Checkpoint center={points[0]} postId={post.id}>
                <div
                  className={styles.markerContent}
                  onClick={() => router.push('/posts/' + post.id.toString())}
                >
                  {isImagePresent && (
                    <Image src={post.coverImage} width={300} height={300} />
                  )}
                  {post.title}
                </div>
              </Checkpoint>
            )}
          </div>
        )
      })}
      <Marker position={lastPoint} icon={lastPointIcon} />
    </div>
  )
}

const BikeMap = ({ posts }: BikeMapProps) => {
  const firstPostPoints = posts[0].points || []
  const firstPoint = firstPostPoints[0]

  const lastPostPoints = getPoints(posts[posts.length - 1])
  const lastPoint = lastPostPoints[lastPostPoints.length - 1]


  return (
    <MapContainer
      className={styles.map}
      center={lastPoint}
      zoom={initialZoom}
      scrollWheelZoom={false}
    >
      <MapContent posts={posts} lastPoint={lastPoint} />
    </MapContainer>
  )
}

export default BikeMap
