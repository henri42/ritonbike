import {
  MapContainer,
  TileLayer,
  Polyline,
  CircleMarker,
  Popup,
  Tooltip,
  useMapEvent,
  Marker,
  FeatureGroup,
} from 'react-leaflet'
import {
  Icon,
  LatLngTuple,
  PathOptions,
  Point,
  FeatureGroup as LeafletFeatureGroup,
} from 'leaflet'

import styled from 'styled-components'
import styles from './BikeMap.module.css'
import 'leaflet/dist/leaflet.css'

import { Post } from '../../types/post'
import { ReactNode, useEffect, useRef, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import Image from 'next/image'
import { useRouter } from 'next/router'
import Stats from '../Stats/Stats'
import { Button } from '../Buttons/Buttons'
import { ChartIcon } from '../Icons/Icons'

const getPoints = (post: Post) => {
  const points =
    post.points !== undefined
      ? post.points.map((point) => [point.lat, point.lng] as LatLngTuple)
      : []
  return points
}

const initialZoom = 7
const routeColor = '#1fe885'

const routeOptions: PathOptions = {
  color: routeColor,
  dashArray: '2 6',
  weight: 4,
  fillOpacity: 1,
}

const markerMobileOptions: PathOptions = {
  weight: 30,
  fillColor: routeColor,
  fillOpacity: 1,
  opacity: 0,
}

const markerDesktopOptions: PathOptions = {
  fillColor: routeColor,
  fillOpacity: 1,
  opacity: 0,
}

type MapContentProps = {
  posts: Post[]
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

    -webkit-box-shadow: 0px 0px 0px 1px black;
    -moz-box-shadow: 0px 0px 0px 1px black;
    box-shadow: 0px 0px 0px 1px black;

    transition: all 0.1s ease-in-out;
    cursor: pointer;
    &:active {
      transform: scale(98%);
      opacity: 0.9;
    }
    &:hover {
      -webkit-box-shadow: 0px 0px 0px 3px black;
      -moz-box-shadow: 0px 0px 0px 3px black;
      box-shadow: 0px 0px 0px 3px black;
    }
    @media (prefers-color-scheme: dark) {
      background-color: black;
      color: white;
    }
  }
  .leaflet-popup-content {
    margin: 0.3rem;
  }
  .leaflet-popup-tip {
    display: none;
  }
`

const StyledTooltip = styled(Tooltip)`
  white-space: normal;
  @media (prefers-color-scheme: dark) {
    &.leaflet-tooltip-right::before {
      border-right-color: #000000;
    }
    &.leaflet-tooltip-left::before {
      border-left-color: #000000;
    }
    background-color: black;
    border-color: black;
    color: white;
  }
`

const Checkpoint = ({ center, postId, children }: CheckpointProps) => {
  const router = useRouter()
  const isDesktop = useMediaQuery({ query: '(min-width: 1224px)' })
  const [radius, setRadius] = useState(6)

  return (
    <CircleMarker
      center={center}
      pathOptions={isDesktop ? markerDesktopOptions : markerMobileOptions}
      radius={radius}
      eventHandlers={{
        mouseover: () => {
          setRadius(8)
        },
        mouseout: () => {
          setRadius(6)
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
        <StyledTooltip opacity={1}>
          {children}
        </StyledTooltip>
      )}
    </CircleMarker>
  )
}

const MapContent = ({ posts, lastPoint }: MapContentProps) => {
  const router = useRouter()

  const lastPointIcon = new Icon({
    iconUrl: '/biker-green.gif',
    iconAnchor: [-5, 17],
  })

  const [zoom, setZoom] = useState(initialZoom)
  const mapEvent = useMapEvent('zoom', () => {
    setZoom(mapEvent.getZoom())
  })

  const groupRef = useRef<LeafletFeatureGroup>(null)

  const handleZoomFit = () => {
    if (groupRef.current != null) {
      const bounds = groupRef.current.getBounds()
      mapEvent.fitBounds(bounds)
    }
  }

  useEffect(() => {
    handleZoomFit()
  }, [])

  return (
    <div className={styles.mapContent}>
      <TileLayer url="https://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}{r}.png" />
      <FeatureGroup ref={groupRef}>
        {posts.map((post) => {
          const points = getPoints(post)
          const isImagePresent = post.coverImage !== ''
          return (
            <div key={post.id}>
              <Polyline
                pathOptions={routeOptions}
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
                    <span className={styles.title}>{post.title}</span>
                    <Stats
                      distance={post.distance}
                      uphill={post.uphill}
                      downhill={post.downhill}
                    />
                  </div>
                </Checkpoint>
              )}
            </div>
          )
        })}
        <Marker position={lastPoint} icon={lastPointIcon} />
      </FeatureGroup>
      <div className={styles.mapButton}>
      <Button onClick={handleZoomFit} title='Ajuster'>
        <ChartIcon />
      </Button>
      </div>

      <button  >
        Zoom Fit
      </button>
    </div>
  )
}

const BikeMap = ({ posts }: BikeMapProps) => {
  const lastPostPoints = getPoints(posts[posts.length - 1])
  const lastPoint = lastPostPoints[lastPostPoints.length - 1]

  return (
    <MapContainer
      className={styles.map}
      zoom={initialZoom}
      scrollWheelZoom={false}
    >
      <MapContent posts={posts} lastPoint={lastPoint} />
    </MapContainer>
  )
}

export default BikeMap
