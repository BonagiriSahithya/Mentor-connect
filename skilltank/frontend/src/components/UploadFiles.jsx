import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const UploadFile = () => {
  const { mentorId } = useParams();
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchFiles();
  }, [mentorId]);

  const fetchFiles = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/mentors/${mentorId}/files`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFiles(res.data);
      localStorage.setItem(`mentorFiles_${mentorId}`, JSON.stringify(res.data));
    } catch (err) {
      console.error("❌ Error fetching files:", err);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return alert("Select a file first!");
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await axios.post(`http://localhost:5000/api/mentors/${mentorId}/upload-file`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setFiles(res.data.uploadedFiles);
      localStorage.setItem(`mentorFiles_${mentorId}`, JSON.stringify(res.data.uploadedFiles));
      setSelectedFile(null);
    } catch (err) {
      console.error("❌ Upload error:", err);
    }
  };

  const deleteFile = async (fileId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/mentors/${mentorId}/delete-file/${fileId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      const updatedFiles = files.filter((file) => file._id !== fileId);
      setFiles(updatedFiles);
      localStorage.setItem(`mentorFiles_${mentorId}`, JSON.stringify(updatedFiles));
    } catch (error) {
      console.error("❌ Error deleting file:", error.message);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "12px", backgroundColor: "#f9f9f9" }}>
      <h2 style={{ textAlign: "center", color: "#333" }}>Uploaded Files</h2>

      {role === "mentor" && (
        <div style={{ marginBottom: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <input
            type="file"
            onChange={(e) => setSelectedFile(e.target.files[0])}
            style={{
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              backgroundColor: "#fff",
            }}
          />
          <button
            onClick={handleUpload}
            style={{
              padding: "10px 20px",
              backgroundColor: "#4CAF50",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Upload
          </button>
        </div>
      )}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {files.map((file) => (
          <li
            key={file._id}
            style={{
              marginBottom: "12px",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              backgroundColor: "#fff",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <a
              href={`http://localhost:5000${file.fileUrl}`}
              target="_blank"
              rel="noreferrer"
              style={{ color: "#007BFF", textDecoration: "none", fontWeight: "bold" }}
            >
              {file.fileName}
            </a>
            {role === "mentor" && (
              <button
                onClick={() => deleteFile(file._id)}
                style={{
                  padding: "6px 12px",
                  backgroundColor: "#e74c3c",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  marginLeft: "10px",
                }}
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

export default UploadFile;
