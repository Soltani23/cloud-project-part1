export default function UploadPage() {
    const handleUpload = async (e) => {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);
      await fetch("/api/upload", { method: "POST", body: formData });
    };
  
    return (
      <div>
        <h1>Uploader un fichier</h1>
        <input type="file" onChange={handleUpload} />
      </div>
    );
  }
  