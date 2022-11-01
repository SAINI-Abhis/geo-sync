import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import React, { useEffect, useRef, useState } from "react";
import { db } from "../firebase";
import { CircularProgress } from "@mui/material";
import { Marker, Popup } from "mapbox-gl";
import Update from "./Update";
import { async } from "@firebase/util";

mapboxgl.accessToken = 'pk.eyJ1Ijoic2F0ZW5kcmExMjQxIiwiYSI6ImNreGc2MjI5cjFwaTQyd3BkeGZ6NWVhMHUifQ.Wh1LgnYc3GQFGCJ7l-C2tQ';

const SharePage = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);
  const [isUploading,setUploading] = useState(false);
  const [visible,setVisible] = useState(false);
  const [key,setKey] = useState('');
  const [value,setValue] = useState('');
  const [curIdx,setCurIdx] = useState(0);
  // const [curFeature,setCurFeature] = useState(null);
  let path = window.location.href;
  let paths = path.split('/');
  const prefix = paths[paths.length - 1].split('?');
  let id = prefix[0];
  
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
  const update_properties = async ()=>{
    setUploading(true);
    // console.log(data['features'][curIdx],curIdx);
    data['features'][curIdx]['properties'][key] = value;
    await updateDoc(ref,data);
    setData(data);
    setKey('');
    setValue('');
    setUploading(false);
    // console.log(data);
  }

  const add_layer = async (e)=>{
    console.log(e);
    var GetFile = new FileReader();
    GetFile.onload = async () => {
        var newdata = GetFile.result;
        console.log(newdata)
        newdata = JSON.parse(newdata)
        setUploading(true);
        let totalData = data;
        totalData.features = [
          ...totalData.features,
          ...newdata.features
        ]
        const s = await updateDoc(ref,totalData);
        setUploading(false);
        window.location.reload(false);
        // console.log("DONE",s);
    }
    GetFile.readAsText(e.target.files[0]);
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

  const html = `
      <form action="/vhu1vs76lmt4XfKDqSTE" method="GET">
      <p style={{textAlign:'center'}}>Enter Property Name (mandatory)</p>
      <input type='text' name="key"></input>
      <br>
      <p style={{textAlign:'center'}}>Enter Property Value (mandatory)</p>
      <input type='text' name="value" ></input>
      <button type="submit"> Add </button>
      </form>

  `;
  const addMarkers = (data)=>{
    let i = 0;
    for(let i = 0;i<data.features.length;i++){
      let points = data.features[i];
      console.log(points);
      const marker = new Marker().setLngLat(points.geometry.coordinates).addTo(map.current);
        marker.getElement().addEventListener('click', () => {
        setVisible(true);
        // setCurFeature(points.properties);
        setCurIdx(i);
      });
    }
  }

  useEffect(() => {
    if(!map.current) return;
    if(!data) return;
    // map.current.addLayer({
    //   id: 'locations',
    //   type: 'circle',
    //   source: {
    //     type: 'geojson',
    //     data: data
    //   }
    // });
    addMarkers(data);
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
  let curFeature = data? data.features[curIdx].properties:null;
  return (
    <div>
      {
          <div>
            {isUploading?(<div style={
              {
                position:'absolute',
                top: '50vh',
                right:'50vw',
                zIndex:1000,
              }
              }>
              <CircularProgress/>
            </div>):null}
            <div style={{position:'absolute',zIndex:10,backgroundColor:'white',borderRadius:10,padding:'10px'}}>
              <button onClick={exportGeoJson}>Export as geojson</button>
              <br/>
               Update using Geojson File - 
              <input type={'file'} onChange={updateGeoJson}  name={'Update with geojson'} placeholder={'choose geojson file'}></input>
              <br/>
              Add new Layer
              <input type={'file'} onChange={add_layer}  name={'add layer with geojson'} placeholder={'choose geojson file'}></input>
              {/* {isUploading?<CircularProgress/>:null} */}
            </div>
            {
              visible?(
                <div style={{position:'absolute',zIndex:1000,backgroundColor:'white',borderRadius:10,padding:'10px',right:0}}>
                   <button onClick={()=>{setVisible(false)}}>x</button>
                  {
                    curFeature?
                    Object.keys(curFeature).map((feature)=>{
                      return <div>{feature} : {curFeature[feature]}</div>
                    })
                    :null
                    (()=>{
                      if(!curFeature) return null;
                      let html = '';
                      for(const feature of Object.keys(curFeature)){
                        html += feature + ':' + curFeature[feature];
                      }
                      console.log(html);
                      return html;
                    })()
                  }
                  <div>
                    <input type='text' placeholder="Key" onChange={(e)=>(setKey(e.target.value))} value={key}/>:<input type='text' placeholder="Value" onChange={(e)=>(setValue(e.target.value))} value={value}/><button onClick={update_properties}>+</button>
                  </div>
                  {/* {isUploading?<CircularProgress/>:null} */}
                 
                </div>
              ):null
            }
            <div ref={mapContainer} className="map-container" style={{ height: "100vh" }} />
          </div>
      }
    </div>
  );
}

export default SharePage;
