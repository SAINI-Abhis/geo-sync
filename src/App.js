import React from "react";
import SharePage from "./share_screen/share_screen";
import UploadPage from "./upload_page/upload_page";



export default function App() {
  let path = window.location.href;
  let paths = path.split('/');
  let prefix = paths[paths.length-1];
  if(prefix.length){
    const id = prefix.split('?')[0];
    return <SharePage/>;
  }else{
    return (<UploadPage/>);
  }
}
