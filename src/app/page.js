"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    profileImage: null,
  });
  const [message, setMessage] = useState("");

  // Fetch list of files from S3
  const fetchFiles = async () => {
    const res = await fetch("/api/list");
    const data = await res.json();
    setFiles(data.files || []);
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  // Handle file upload to S3
  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setMessage(data.message || "Upload failed.");
    fetchFiles();
    setFile(null);
  };

  // Handle file deletion from S3
  const handleDeleteFile = async (fileName) => {
    const res = await fetch("/api/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileName }),
    });
    const data = await res.json();
    setMessage(data.message || "Deletion failed.");
    fetchFiles();
  };

  // Handle user form input changes
  const handleUserInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle profile image selection
  const handleProfileImageChange = (e) => {
    setUserData((prev) => ({ ...prev, profileImage: e.target.files[0] }));
  };

  // Handle user creation
  const handleUserSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("firstName", userData.firstName);
    formData.append("lastName", userData.lastName);
    formData.append("email", userData.email);
    if (userData.profileImage) {
      formData.append("profileImage", userData.profileImage);
    }

    const res = await fetch("/api/user/create", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setMessage(data.message || "User creation failed.");
    setUserData({ firstName: "", lastName: "", email: "", profileImage: null });
  };

  // Handle user deletion
  const handleUserDelete = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/user/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userData.email }),
    });
    const data = await res.json();
    setMessage(data.message || "User deletion failed.");
  };

  return (
    <div className="min-h-screen p-8 flex flex-col gap-8">
      <h1 className="text-2xl font-bold">File and User Management with Amal</h1>

      {/* File Upload Section */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl">Upload File to S3</h2>
        <form onSubmit={handleFileUpload} className="flex gap-4">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="border p-2"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Upload File
          </button>
        </form>
      </section>

      {/* List Files Section */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl">Files in S3 Bucket</h2>
        <ul className="list-disc pl-5">
          {files.map((file) => (
            <li key={file.Key} className="flex gap-2 items-center">
              <span>{file.Key}</span>
              <button
                onClick={() => handleDeleteFile(file.Key)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* User Form Section */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl">Manage Users</h2>
        <form className="flex flex-col gap-4 max-w-md">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={userData.firstName}
            onChange={handleUserInputChange}
            className="border p-2"
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={userData.lastName}
            onChange={handleUserInputChange}
            className="border p-2"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={userData.email}
            onChange={handleUserInputChange}
            className="border p-2"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleProfileImageChange}
            className="border p-2"
          />
          <div className="flex gap-4">
            <button
              onClick={handleUserSubmit}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Insert
            </button>
            <button
              onClick={handleUserDelete}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        </form>
      </section>

      {/* Message Display */}
      {message && <p className="text-center text-red-500">{message}</p>}
    </div>
  );
}