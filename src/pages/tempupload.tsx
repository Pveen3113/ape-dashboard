import React, { useState } from "react";
import { Button, Card, Input, List, message , Image, Progress } from "antd";
import { uploadBytesResumable, ref, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebase/firebaseConfig";

const UploadImage = () => {
  const [imageFile, setImageFile] = useState<File>();
  const [downloadURL, setDownloadURL] = useState<string>();
  const [isUploading, setIsUploading] = useState(false);
  const [progressUpload, setProgressUpload] = useState(0);

  const handleSelectedFile = (files: any) => {
    // if (files && files[0].size < 10000000) {
      

    //   console.log(files[0]);
    // } else {
    //   message.error("File size to large");
    // }
    setImageFile(files[0]);
  };
  const handleUploadFile = (file: any) => {
    if (imageFile) {
      const name = imageFile.name;
      //const storageRef = ref(storage, `image/${name}`);
      const storageRef = ref(storage, `pdf/${name}`);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);
      
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          //const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // console.log('Upload is ' + progress + '% done');
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

          setProgressUpload(progress); // to show progress upload
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          message.error(error.message);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            setDownloadURL(url);
          });
        }
      );
    } else {
      message.error("File not found");
    }
  };

  const handleRemovefile = () => setImageFile(undefined);

  return (
    <div className="container mt-5">
      <div className="col-lg-8 offset-lg-2">
        <Input
          type="file"
          placeholder="Select file to upload"
          accept="pdf/png"
          onChange={(files) => handleSelectedFile(files.target.files)}
        />

        <div className="mt-5">
          <Card>
            {imageFile && (
              <>
                <List.Item
                //   extra={[
                //     <Button
                //       key="btnRemoveFile"
                //       onClick={handleRemovefile}
                //       type="text"
                //       icon={<i className="fas fa-times"></i>}
                //     />,
                //   ]}
                >
                  <Button onClick={handleRemovefile}>Clear</Button>
                  <List.Item.Meta
                    title={imageFile.name}
                    description={`Size: ${imageFile.size}`}
                  />
                </List.Item>

                <div className="text-right mt-3">
                  <Button
                    loading={isUploading}
                    type="primary"
                    onClick={handleUploadFile}
                  >
                    Upload
                  </Button>

                  <Progress percent={progressUpload} />
                </div>
              </>
            )}

            {downloadURL && (
              <>
                {/* <Image
                  src={downloadURL}
                  alt={downloadURL}
                  style={{ width: 200, height: 200, objectFit: 'cover' }}
                /> */}
                <p>{downloadURL}</p>
              </>
            )}
            
             {downloadURL && (
              <>
                <Image
                  src={downloadURL}
                  alt={downloadURL}
                  style={{ width: 200, height: 200, objectFit: 'cover' }}
                />
                <p>{downloadURL}</p>
              </>
            )}
            <p></p>
            <p></p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UploadImage;
