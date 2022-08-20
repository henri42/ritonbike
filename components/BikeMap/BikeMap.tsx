import { MapContainer, TileLayer, Polyline } from 'react-leaflet'
import { LatLngTuple } from 'leaflet'

import styles from './BikeMap.module.css'
import 'leaflet/dist/leaflet.css'

import points from './points.json'

const homePoint: LatLngTuple = [45.438940467914996, 4.385841191619965]
const chabouret = points as LatLngTuple[]

const BikeMap = () => {
  return (
    <MapContainer className={styles.map} center={homePoint} zoom={7} scrollWheelZoom={false}>
      <TileLayer url="https://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}{r}.png" />
      <Polyline smoothFactor={2.0} positions={chabouret} />
    </MapContainer>
  )
}

export default BikeMap