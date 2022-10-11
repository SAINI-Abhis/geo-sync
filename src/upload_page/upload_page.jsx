import { CircularProgress } from "@mui/material";
import { addDoc, collection, doc } from "firebase/firestore";
import React, { useState } from "react";
import { db } from "../firebase";
const UploadPage = ()=> {
    const ref = collection(db,'data');
    const [isUploading,setUploading] = useState(false);
    const handleFile = (e) => {
        
        console.log(e);
        var GetFile = new FileReader();
        GetFile.onload = async () => {
            var data = GetFile.result;
            data = JSON.parse(data)
            setUploading(true);
            const s = await addDoc(ref,data);
            setUploading(false);
            window.location.href = '/'+s.id;
            // console.log("DONE",s);
        }
        GetFile.readAsText(e.target.files[0]);
    }

  return (
    <div style={{alignItems:'center',justifyContent:'center'}}>
        <h1>UPLOAD</h1>
        <input type={'file'} name={"CSV File"} onChange={handleFile}></input>
        {isUploading?<CircularProgress/>:null}
    </div>
  );
}

export default UploadPage;
