import { CircularProgress, Grid } from "@mui/material";
import { addDoc, collection, doc } from "firebase/firestore";
import React, { useState } from "react";
import { db } from "../firebase";
const UploadPage = () => {
  const ref = collection(db, 'data');
  const [isUploading, setUploading] = useState(false);
  const check = (e) => {
    if(localStorage.getItem("name") === "" || localStorage.getItem("name") === null) {
      window.alert("Please enter your name or identification")
      e.preventDefault();
    }
  }

  const handleFile = (e) => {
    console.log(e);
      var GetFile = new FileReader();
      GetFile.onload = async () => {
        var data = GetFile.result;
        data = JSON.parse(data)
        setUploading(true);
        const s = await addDoc(ref, data);
        setUploading(false);
        window.location.href = '/' + s.id;
        // console.log("DONE",s);
    }
    GetFile.readAsText(e.target.files[0]);
  }

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: '100vh' }}
    >
      <Grid item xs={3}>
        <h1 style={{textAlign:'center'}}>UPLOAD</h1>
        <p style={{textAlign:'center'}}>Enter Your Name (mandatory)</p>
        <input type={'text'} name={"name"} onChange={(e) => { localStorage.setItem("name", e.currentTarget.value) }}></input>
        <p style={{textAlign:'center'}}>Accepted File Type: Geojson</p>
        <input type={'file'} name={"CSV File"} onClick={check} onChange={handleFile}></input>
        {isUploading ? <CircularProgress /> : null}
      </Grid>
    </Grid>

  );
}

export default UploadPage;
