import React from "react";
import SharePage from "./share_screen/share_screen";
import UploadPage from "./upload_page/upload_page";



export default function App() {
  let path = window.location.href;
  let paths = path.split('/');
  let id = paths[paths.length-1];
  if(id.length){
    return <SharePage/>;
  }else{
    return (<UploadPage/>);
  }
}
