import React, { useState, useCallback } from 'react';
import { gql } from "apollo-boost";
import axios from 'axios';
import { useQuery } from "@apollo/react-hooks";
// import { Label, Input } from "@rebass/forms";
// import { Box, Text } from "rebass";
import { useDropzone } from "react-dropzone";

const filesQuery = gql`
  {
    filesConnection {
      values {
        name,
        id,
        url
      }
    }
  }
`;

export const FilesList = () => {
  const { data, error, loading } = useQuery(filesQuery);

  if (loading) {
    return <div>loading...</div>;
  }

  if (error) {
    return error.message;
  }

  const { filesConnection: { values: files} } = data;

  return (
    <div>
      {files.map(f => (
        <div key={f.id}><pre>{JSON.stringify(f, null, 2)}</pre></div>
      ))}
    </div>
  );
};

// mutation UploadFile($file: Upload!) {
  //   upload(file: $file) {
  //     url
  //   }
  // }

// const uploadFileMutation = gql`
  
//   mutation upload($file: Upload!, $ref: String, $refId: String, $field: String) {
//     upload(file: $file, ref: $ref, refId: $refId, field: $field) {
//       id
//     }
//   }
// `;



export const Upload = () => {
  const [filesForUpload, setFiles] = useState(null);

  const requestUpload = useCallback(files => {
    // https://strapi.io/documentation/3.0.0-alpha.x/guides/upload.html
    const bodyFormData = new FormData();
    const token = sessionStorage.getItem('token');
  
    bodyFormData.append('refId', '5da5141682c29039770fd43b');
    bodyFormData.append('field', 'media');
    bodyFormData.append('ref', 'block');
  
    // Add each file upload to the form data
    files.forEach((file) => {
      bodyFormData.append('files', file, file.name);
    });
  
    axios({
      async: true,
      crossDomain: true,
      processData: false,
      contentType: false,
      mimeType: 'multipart/form-data',
      method: 'POST',
      url: `${process.env.REACT_APP_ENDPOINT}/upload`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: bodyFormData,
      onUploadProgress: (progressEvent) => {
        console.log('onUploadProgress', progressEvent);
      },
    })
      .then((response) => {
        if (response.status === 200) {
          console.log(response.data);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [])
  const onDrop = useCallback(
    (files) => {
      setFiles(files);
    },
    []
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });


  return (
    <div>
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag 'n' drop some files here, or click to select files</p>
      )}
      {filesForUpload && filesForUpload.map(f => f.name)}
      
    </div>
    <button onClick={() => {
      requestUpload(filesForUpload)
    }}>upload</button>
    </div>
  );
};

export default function Files() {
  return (
    <div>
      <FilesList />
      <Upload />
    </div>
  )
}