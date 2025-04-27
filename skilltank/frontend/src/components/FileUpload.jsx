import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const FileUpload = () => {
  const { mentorId } = useParams();
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const role = localStorage.getItem("role");

  useEffect(() => {
    axios
      .get(`/api/mentors/${mentorId}/files`)
      .then((response) => setFiles(response.data))
      .catch((err) => console.error("Error fetching files:", err));
  }, [mentorId]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const uploadFile = () => {
    if (!selectedFile) return alert("Select a file first!");
    const formData = new FormData();
    formData.append("file", selectedFile);

    axios
      .post(`/api/mentors/${mentorId}/files`, formData)
      .then((response) => {
        setFiles(response.data);
        setSelectedFile(null);
        alert("File uploaded successfully!");
      })
      .catch((err) => {
        console.error("Error uploading file:", err);
        alert("Upload failed.");
      });
  };

  const deleteFile = (fileId) => {
    axios
      .delete(`/api/mentors/${mentorId}/files/${fileId}`)
      .then(() => {
        setFiles(files.filter((file) => file._id !== fileId));
        alert("File deleted successfully!");
      })
      .catch((err) => {
        console.error("Error deleting file:", err);
        alert("Deletion failed.");
      });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-indigo-700 mb-6 text-center">
        Uploaded Files
      </h2>

      {role === "mentor" && (
        <div className="mb-6">
          <input
            type="file"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100"
          />
          <button
            onClick={uploadFile}
            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-md transition-colors duration-300"
          >
            Upload File
          </button>
        </div>
      )}

      <ul className="space-y-4">
        {files.map((file) => (
          <li
            key={file._id}
            className="bg-white p-4 rounded-md shadow-sm flex items-center justify-between border border-gray-200"
          >
            <a
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {file.name}
            </a>
            {role === "mentor" && (
              <button
                onClick={() => deleteFile(file._id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
              >
                Delete
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileUpload;
