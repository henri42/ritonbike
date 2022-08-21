import {
  MapContainer,
  TileLayer,
  Polyline,
  CircleMarker,
  Popup,
  Tooltip,
  useMap,
  useMapEvent,
} from 'react-leaflet'
import { LatLngTuple, PathOptions, Point } from 'leaflet'

import styled from 'styled-components'
import styles from './BikeMap.module.css'
import 'leaflet/dist/leaflet.css'

import { Post } from '../../types/post'
import { ReactNode, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import Image from 'next/image'
import { builtinModules } from 'module'

const homePoint: LatLngTuple = [46.167071701158854, 9.031604235079925]

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

type BikeMapProps = {
  posts: Post[]
}

type CheckpointProps = {
  center: LatLngTuple
  children: ReactNode
}

const StyledTooltip = styled(Tooltip)`
  display: flex;
  flex-direction: column;
  img {
    border-radius: 3px;
  }
`

const StyledPopup = styled(Popup)`
  display: flex;
  flex-direction: column;
  img {
    border-radius: 3px;
    position: relative;
  }
  .leaflet-popup-content-wrapper {
    border-radius: 5px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  }
  .leaflet-popup-content {
    margin: 0.3rem;
  }
  .leaflet-popup-tip {
    display: none;
  }
`

const Checkpoint = ({ center, children }: CheckpointProps) => {
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
      }}
    >
      {!isDesktop ? (
        <StyledPopup
          closeButton={false}
          offset={new Point(0, 2)}
          className={styles.popup}
        >
          {children}
        </StyledPopup>
      ) : (
        <StyledTooltip>{children}</StyledTooltip>
      )}
    </CircleMarker>
  )
}

const MapContent = ({ posts }: BikeMapProps) => {
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
              <Checkpoint center={points[0]}>
                {isImagePresent && (
                  <Image src={post.coverImage} width={300} height={300} />
                )}
                {post.title}
              </Checkpoint>
            )}
          </div>
        )
      })}
    </div>
  )
}

const BikeMap = ({ posts }: BikeMapProps) => {
  const firstPostPoints = posts[0].points || []
  const firstPoint = firstPostPoints[0]
  return (
    <MapContainer
      className={styles.map}
      center={firstPoint}
      zoom={initialZoom}
      scrollWheelZoom={false}
    >
      <MapContent posts={posts} />
    </MapContainer>
  )
}

export default BikeMap
