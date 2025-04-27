import { useEffect, useState } from "react";
import axios from "axios";

const ManageFiles = () => {
  const [files, setFiles] = useState([]);
  const [file, setFile] = useState(null);
  const mentorId = localStorage.getItem("mentorId");

  useEffect(() => {
    axios.get(`http://localhost:5000/api/files/files/${mentorId}`)
      .then((res) => setFiles(res.data))
      .catch((err) => console.error(err));
  }, [mentorId]);

  const handleFileUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await axios.post("http://localhost:5000/api/files/upload", formData, {
      headers: { Authorization: localStorage.getItem("token") }
    });
    setFiles(data.files);
  };

  const deleteFile = async (filename) => {
    await axios.delete(`http://localhost:5000/api/files/delete/${filename}`, {
      headers: { Authorization: localStorage.getItem("token") }
    });
    setFiles(files.filter((f) => f.filename !== filename));
  };

  return (
    <div>
      <h2>Manage Files</h2>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleFileUpload}>Upload</button>
      <ul>
        {files.map((file) => (
          <li key={file.filename}>
            <a href={`http://localhost:5000${file.fileUrl}`} target="_blank" rel="noreferrer">{file.filename}</a>
            <button onClick={() => deleteFile(file.filename)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageFiles;

