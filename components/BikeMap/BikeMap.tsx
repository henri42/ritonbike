import {
  MapContainer,
  TileLayer,
  Polyline,
  CircleMarker,
  Popup,
  Tooltip,
  Marker,
  FeatureGroup,
  useMap,
} from 'react-leaflet'
import {
  Icon,
  LatLngTuple,
  PathOptions,
  FeatureGroup as LeafletFeatureGroup,
} from 'leaflet'

import styled from 'styled-components'
import styles from './BikeMap.module.css'
import 'leaflet/dist/leaflet.css'

import { Post, Point } from '../../types/post'
import { ReactNode, useEffect, useRef, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import Image from 'next/image'
import { useRouter } from 'next/router'
import Stats from '../Stats/Stats'
import { Button, ButtonLink } from '../Buttons/Buttons'
import { ChartIcon, ListIcon, ZoomFitIcon } from '../Icons/Icons'

const getPoints = (post: Post) => {
  const points =
    post.points !== undefined
      ? post.points.map((point) => [point.lat, point.lng] as LatLngTuple)
      : []
  return points
}

const getMiddle = (points: Point[]) => {
  const leftIndex = Math.floor(points.length / 2)
  const rightIndex = leftIndex + 1

  const left = points[leftIndex]
  const right = points[rightIndex]

  const middle = [
    (left.lat + right.lat) / 2,
    (left.lng + right.lng) / 2,
  ] as LatLngTuple

  return middle
}

const initialZoom = 7
const isTripOver = true

const routeColors = {
  bike: '#18d978',
  boat: '#318bff',
  train: '#E67E22',
  plane: '#808080',
  car: '#ff2457',
}

const bikerUrl = {
  bike: 'icons/biker.gif',
  boat: 'icons/biker-boat.gif',
  train: 'icons/biker-train.gif',
  car: 'icons/biker-car.gif',
  plane: 'icons/biker.gif'
}

const reverseBikerUrl = {
  bike: 'icons/reverse-biker.gif',
  boat: 'icons/reverse-biker-boat.gif',
  train: 'icons/reverse-biker-train.gif',
  car: 'icons/reverse-biker-car.gif',
  plane: 'icons/reverse-biker.gif'
}

const finishFlagUrl = 'icons/flag.gif'

const routeSvgUrl = {
  bike: '',
  boat: '/sailboat-line.svg',
  train: '/train-line.svg',
  car: '/car-line.svg',
  plane: '/plane-line.svg'
}

const defaultColor = routeColors.bike

const routeOptions: PathOptions = {
  color: defaultColor,
  dashArray: '2 6',
  weight: 4,
  fillOpacity: 1,
}

const markerMobileOptions: PathOptions = {
  weight: 30,
  fillColor: defaultColor,
  fillOpacity: 1,
  opacity: 0,
}

const markerDesktopOptions: PathOptions = {
  fillColor: defaultColor,
  fillOpacity: 1,
  opacity: 0,
}

type MapContentProps = {
  posts: Post[]
}

type BikeMapProps = {
  posts: Post[]
}

type CheckpointProps = {
  center: LatLngTuple
  postId: number
  color: string
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

const Checkpoint = ({ center, postId, color, children }: CheckpointProps) => {
  const router = useRouter()
  const isDesktop = useMediaQuery({ query: '(min-width: 1224px)' })
  const [radius, setRadius] = useState(6)

  const pathOptions = isDesktop ? markerDesktopOptions : markerMobileOptions

  return (
    <CircleMarker
      center={center}
      pathOptions={{ ...pathOptions, fillColor: color }}
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
        <StyledPopup closeButton={false} offset={[0, 2]}>
          {children}
        </StyledPopup>
      ) : (
        <StyledTooltip opacity={1}>{children}</StyledTooltip>
      )}
    </CircleMarker>
  )
}

const MapContent = ({ posts }: MapContentProps) => {
  const router = useRouter()

  const map = useMap()
  const groupRef = useRef<LeafletFeatureGroup>(null)

  const lastPost = posts[posts.length - 1]
  const lastPostPoints = getPoints(lastPost)

  const firstPoint = lastPostPoints[0]
  const lastPoint = lastPostPoints[lastPostPoints.length - 1]
  const isReverse = (lastPoint[1] - firstPoint[1]) < 0

  let iconUrl = bikerUrl[lastPost.vehicle]
  if (isTripOver) iconUrl = finishFlagUrl
  else if (isReverse) iconUrl = reverseBikerUrl[lastPost.vehicle]

  const lastPointIcon = new Icon({
    iconUrl,
    iconAnchor: isReverse && !isTripOver ? [32, 17] : [-5, 17],
  })

  const handleZoomFit = () => {
    if (groupRef.current != null) {
      const bounds = groupRef.current.getBounds()
      map.fitBounds(bounds, {
        padding: [100, 100],
      })
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
          const isBike = post.vehicle === 'bike'
          const color = routeColors[post.vehicle]

          const vehicleIcon = new Icon({
            iconUrl: routeSvgUrl[post.vehicle],
            iconAnchor: [8, 8],
            className: styles.svgMarker,
          })

          return (
            <div key={post.id}>
              <Polyline
                pathOptions={{ ...routeOptions, color }}
                smoothFactor={4}
                positions={points}
              />
              {!isBike && (
                <Marker position={getMiddle(post.points)} icon={vehicleIcon} />
              )}
              <Checkpoint center={points[0]} postId={post.id} color={color}>
                <div
                  className={styles.markerContent}
                  onClick={() => router.push('/posts/' + post.id.toString())}
                >
                  {isImagePresent && (
                    <Image src={post.coverImage} width={300} height={300} />
                  )}
                  <span className={styles.title}>{post.title}</span>
                  {isBike && (
                    <Stats
                      distance={post.distance}
                      uphill={post.uphill}
                      downhill={post.downhill}
                    />
                  )}
                </div>
              </Checkpoint>
            </div>
          )
        })}
        {<Marker position={lastPoint} icon={lastPointIcon} />}
      </FeatureGroup>
      <div className={styles.mapButtons}>
        <Button onClick={handleZoomFit} title="Ajuster">
          <ZoomFitIcon />
        </Button>
        <ButtonLink href="/list" title="Articles">
          <ListIcon />
        </ButtonLink>
        <ButtonLink href="/stats" title="Stats">
          <ChartIcon />
        </ButtonLink>
      </div>
    </div>
  )
}

const BikeMap = ({ posts }: BikeMapProps) => {
  return (
    <MapContainer className={styles.map} zoom={initialZoom}>
      <MapContent posts={posts} />
    </MapContainer>
  )
}

export default BikeMap
