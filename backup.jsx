import './App.css';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import { useEffect, useRef, useState } from 'react';
import { Link, Route, Router } from 'react-router-dom';

mapboxgl.accessToken = 'pk.eyJ1Ijoic2F0ZW5kcmExMjQxIiwiYSI6ImNreGc2MjI5cjFwaTQyd3BkeGZ6NWVhMHUifQ.Wh1LgnYc3GQFGCJ7l-C2tQ';




const UploadPage = ()=> {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);
  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom
    });
  });

  const load_data = (data) => {
    data = JSON.parse(data)
    // var geojsonLayer = new L.geoJSON(data);       
    // geojsonLayer.addTo(map);
    console.log(data);
    map.current.addLayer({
      id: 'locations',
      type: 'circle',
      source: {
        type: 'geojson',
        data: data
      }
    });
    const pos = data.features[0].geometry.coordinates;
    console.log(pos);
    setLat(pos[0]);
    setLng(pos[1]);
    setZoom(3);
  }

  const handleFile = (e) => {
    console.log(e);
    var GetFile = new FileReader();
    GetFile.onload = () => {
      // DO Somthing
      var data = GetFile.result;
      load_data(data);

    }
    GetFile.readAsText(e.target.files[0]);
  }
  return (
    <div >
      <input type={'file'} name={"CSV File"} onChange={handleFile}></input>
      <div ref={mapContainer} className="map-container" style={{height:"100vh"}} />
    </div>
  );
}

export default UploadPage;
