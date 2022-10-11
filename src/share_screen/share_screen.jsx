import { doc, getDoc, updateDoc } from "firebase/firestore";
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import React, { useEffect, useRef, useState } from "react";
import { db } from "../firebase";
import { async } from "@firebase/util";
import { CircularProgress } from "@mui/material";

mapboxgl.accessToken = 'pk.eyJ1Ijoic2F0ZW5kcmExMjQxIiwiYSI6ImNreGc2MjI5cjFwaTQyd3BkeGZ6NWVhMHUifQ.Wh1LgnYc3GQFGCJ7l-C2tQ';

const SharePage = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);
  const [isUploading,setUploading] = useState(false);

  let path = window.location.href;
  let paths = path.split('/');
  let id = paths[paths.length - 1];
  const ref = doc(db, 'data', id);
  const [data, setData] = useState(null);
  const load_data = async () => {
    const document = await getDoc(ref);
    setData(document.data());
    map.current.flyTo({
      center: document.data().features[0].geometry.coordinates,
      essential: true // this animation is considered essential with respect to prefers-reduced-motion
      });
    // setLat(document.data().features[0].geometry.coordinates[0]);
    // setLng(document.data().features[0].geometry.coordinates[1]);
  }

  const initMap = () => {
    if (map.current) return; // initialize map only once
    console.log("init");
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom
    });
  }
  useEffect(() => {
    initMap();
    load_data();
  }, []);
  useEffect(() => {
    if(!map.current) return;
    if(!data) return;
    map.current.addLayer({
      id: 'locations',
      type: 'circle',
      source: {
        type: 'geojson',
        data: data
      }
    });
  }, [data,map.current])
  const exportGeoJson = ()=>{
    const fileData = JSON.stringify(data,null,2);
    const blob = new Blob([fileData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "data.geojson";
    link.href = url;
    link.click();
  }
  const updateGeoJson = (e)=>{
    
    console.log(e);
    var GetFile = new FileReader();
    GetFile.onload = async () => {
        var data = GetFile.result;
        data = JSON.parse(data)
        setUploading(true);
        const s = await updateDoc(ref,data);
        setUploading(false);
        window.location.reload(false);
        // console.log("DONE",s);
    }
    GetFile.readAsText(e.target.files[0]);
  }
  return (
    <div>
      {
          <div>
            <div style={{position:'absolute',zIndex:1000,backgroundColor:'white',borderRadius:10,padding:'10px'}}>
              <button onClick={exportGeoJson}>Export as geojson</button>
              <br/>
               Update using Geojson File - 
              <input type={'file'} onChange={updateGeoJson}  name={'Update with geojson'} placeholder={'choose geojson file'}></input>
              {isUploading?<CircularProgress/>:null}
            </div>
            <div ref={mapContainer} className="map-container" style={{ height: "100vh" }} />
          </div>
      }
    </div>
  );
}

export default SharePage;
