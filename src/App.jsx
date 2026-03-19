import { useState } from "react";
import imageCompression from "browser-image-compression";

function App() {
  const [image, setImage] = useState(null);
  const [compressed, setCompressed] = useState(null);

  const handleImage = (e) => {
    setImage(e.target.files[0]);
  };

  const compressImage = async () => {
    if (!image) return;

    const options = {
      maxSizeMB: 0.2,
      maxWidthOrHeight: 800,
    };

    const compressedFile = await imageCompression(image, options);
    setCompressed(URL.createObjectURL(compressedFile));
  };

  return (
  <div style={{
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    fontFamily: "Arial",
    backgroundColor: "#f4f4f4"
  }}>

    {/* 🔝 Navbar */}
    <div style={{
      width: "100%",
      padding: "15px",
      backgroundColor: "#222",
      color: "white",
      textAlign: "center",
      fontWeight: "bold"
    }}>
      Free Tools Hub
    </div>

    {/* 🧱 Main Content */}
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      flex: 1
    }}>
      <div style={{
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    textAlign: "center"
  }}>
      <h1 style={{ marginBottom: "20px", color: "#222" }}>
        Compress Image Online Free
      </h1>

      <input 
        type="file" 
        onChange={handleImage}
        style={{ marginBottom: "20px" }}
      />

      {image && (
        <img 
          src={URL.createObjectURL(image)} 
          alt="preview"
          style={{ width: "200px", marginBottom: "20px" }}
        />
      )}

      <button 
        onClick={compressImage}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        Compress Image
      </button>

      {compressed && (
        <a 
          href={compressed} 
          download="compressed.jpg"
          style={{
            marginTop: "20px",
            textDecoration: "none",
            color: "#007bff",
            fontWeight: "bold"
          }}
        >
          Download Image
        </a>
      )}

    </div>
</div>
    {/* 🔻 Footer */}
    <div style={{
      width: "100%",
      padding: "10px",
      backgroundColor: "#222",
      color: "white",
      textAlign: "center"
    }}>
      © 2026 Free Tools Hub
    </div>

  </div>
);
}

export default App;