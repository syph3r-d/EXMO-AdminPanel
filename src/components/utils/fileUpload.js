import React, { useState } from "react";
import axios from "axios";

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);

      console.log(
        process.env.file_upload_server,
        process.env.file_upload_api_key
      );

      // axios
      //   .post(
      //     "http://admin.exmo.uom.lk/fileUpload.php",
      //     { body: formData },
      //     {
      //       headers: {
      //         "X-Api-Key": "xMsbQTsBl4PAv4I9r^17^!ghGGioOt1R",
      //       },
      //     }
      //   )
      //   .then((response) => {
      //     console.log("File uploaded:", response.data.path);
      //     // Handle the response from the server here
      //   })
      //   .catch((error) => {
      //     console.error("Error uploading file:", error);
      //     // Handle errors here
      //   });

      fetch("https://admin.exmo.uom.lk/fileUpload.php", {
        method: "POST",
        headers: {
          "X-Api-Key": "xMsbQTsBl4PAv4I9r^17^!ghGGioOt1R",
        },
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("File uploaded:", data.path);
          return data.path;
          // Handle the response from the server here
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
          // Handle errors here
        });
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default FileUpload;
