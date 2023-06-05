import React, { useState, useRef } from "react";

const UploadImage = ({inputJson,inputName,uploadpic}) => {
  let { errors, touched } = inputJson;

  const [file, setFile] = useState("./images/download.png");
  const imageRef = useRef();

  const showOpenFileDialog = () => {
    imageRef.current.click();
  };


  const handleChange = (event) => {
    let id=(event.target.id);
    const fileObject = event.target.files[0];
    if (!fileObject) return;
    setFile(URL.createObjectURL(event.target.files[0]));
    uploadpic({fileObject,id})
  };


  return (
    <>
      <label className="mb-2"> Upload Front </label> <br></br>
      <img
        style={{width:"70px", height:"70px"}}
        src={file}
        id={inputName}
        className="img-thumbnail"
        onClick={showOpenFileDialog}
        alt="img"
      />
      <input
        type="file"
        ref={imageRef}
        id={inputName}
        accept="image/*"
        onChange={handleChange}
        hidden
      />
      <br></br>
       {errors[inputName] && touched[inputName] && (<span style={{ color: 'red' }}>{errors[inputName]}</span>)}
      
    </>
  );
};

export default UploadImage;
