import React, { useState } from "react";
import { Button, Card, Input, message, Image, Progress } from "antd";
import { uploadBytesResumable, ref, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebase/firebaseConfig";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Box from "@mui/material/Box";
import { AccountCircle } from "@mui/icons-material";
import TextField from "@mui/material/TextField";
import { InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";

const UploadImage = () => {
  const [imageFile, setImageFile] = useState<File>();
  const [downloadURL, setDownloadURL] = useState<string>();
  const [isUploading, setIsUploading] = useState(false);
  const [progressUpload, setProgressUpload] = useState(0);
  const [type, settype] = useState<string>();

  const typehandleChange = (event: SelectChangeEvent) => {
    settype(event.target.value as string);
  };

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
          console.log("downloadURL:", downloadURL);
        }
      );
    } else {
      message.error("File not found");
    }
  };

  const handleRemovefile = () => setImageFile(undefined);

  return (
    <div className="container mt-5">
      <React.Fragment>
        <CssBaseline />
        <Container fixed>
          <div className="col-lg-8 offset-lg-2">
            <h1>Template Upload Page</h1>
            <div className="mt-5">
              <Card>
                <Grid container spacing={2} columns={16}>
                  <Grid item xs={8}>
                    <ListItem>
                      <Box sx={{ display: "flex", alignItems: "flex-end" , borderColor: 'error.main' }}>
                        <AccountCircle
                          sx={{ color: "action.active", mr: 1, my: 0.5 }}
                        />
                        <TextField
                          id="input-with-sx"
                          label="x-coordinate"
                          variant="standard"
                        />
                      </Box>
                    </ListItem>
                  </Grid>
                  <Grid item xs={8}>
                    <ListItem>
                      <Box sx={{ display: "flex", alignItems: "flex-end" , borderColor: 'error.main' }}>
                        <AccountCircle
                          sx={{ color: "action.active", mr: 1, my: 0.5 }}
                        />
                        <TextField
                          id="input-with-sx"
                          label="y -coordinate"
                          variant="standard"
                        />
                      </Box>
                    </ListItem>
                  </Grid>
                </Grid>
                <InputLabel id="demo-simple-select-label">Type</InputLabel>
                <Select
                  fullWidth
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={type}
                  label="Age"
                  onChange={typehandleChange}
                >
                  <MenuItem value={"thank"}>Thank You Form</MenuItem>
                  <MenuItem value={"certificate"}>Certificate</MenuItem>
                </Select>
                <p></p>
                <p></p>
                <p></p>

                <Input
                  type="file"
                  placeholder="Select file to upload"
                  accept="pdf/png"
                  onChange={(files) => handleSelectedFile(files.target.files)}
                />
                {imageFile && (
                  <>
                    <ListItem>
                      <Button onClick={handleRemovefile}>Clear</Button>
                      {/* <ListItem.Meta
                        title={imageFile.name}
                        description={`Size: ${imageFile.size}`}
                      /> */}
                    </ListItem>

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
                <p></p>
                <p>{downloadURL}</p>
                <p></p>
              </Card>
            </div>
          </div>
        </Container>
      </React.Fragment>
    </div>
  );
};

export default UploadImage;
