import React, { useState } from 'react'
import ReactMapGL from 'react-map-gl'

const Map = ({ latitude, longitude, zoom, width, height}) => {
  const [viewport, setViewport] = useState({
    latitude,
    longitude,
    zoom
  })
  console.log(process.env.MAPBOX_TOKEN)
  return <ReactMapGL
    {...viewport} 
    width={width}
    height={height}
    onViewportChange={(viewport) => setViewport(viewport)}
    mapboxApiAccessToken={process.env.MAPBOX_TOKEN}
  />
}

export default Map