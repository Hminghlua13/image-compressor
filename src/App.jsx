import { useState } from "react";
import imageCompression from "browser-image-compression";


function App() {
  const [image, setImage] = useState(null);
  const [compressed, setCompressed] = useState(null);
  const [width, setWidth] = useState("");
const [height, setHeight] = useState("");
const [activeTool, setActiveTool] = useState("compress");

const resizeImage = () => {
  if (!image) return;

  const img = new Image();
  img.src = URL.createObjectURL(image);

  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = parseInt(width) || img.width;
canvas.height = parseInt(height) || img.height;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const resizedUrl = canvas.toDataURL("image/jpeg");
    setCompressed(resizedUrl);
  };
};
const convertToPNG = () => {
  if (!image) return;

  const img = new Image();
  img.src = URL.createObjectURL(image);

  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    const pngUrl = canvas.toDataURL("image/png");
    setCompressed(pngUrl);
  };
};
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
      🔥 Free Tools Hub
    </div>

    {/* 🧱 Main Content */}
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
      gap: "10px"
    }}>
      <div style={{
  backgroundColor: "white",
  padding: "40px",
  borderRadius: "15px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  textAlign: "center",
  width: "100%",
  maxWidth: "500px"
}}>
      <h1 style={{ marginBottom: "20px", color: "#222", fontSize: "24px" }}>
        Compress Image Online Free
      </h1>
      <p style={{ 
  color: "#666", 
  fontSize: "14px", 
  marginBottom: "20px" 
}}>
  Compress, resize and convert your images instantly — free and secure.
</p>

      <div style={{ marginBottom: "20px" }}>
  <button 
    onClick={() => setActiveTool("compress")}
    style={{
      backgroundColor: activeTool === "compress" ? "#007bff" : "#ccc",
      color: activeTool === "compress" ? "white" : "black",
      marginRight: "10px",
      padding: "6px 12px",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer"
    }}
  >
    Compress
  </button>

  <button 
    onClick={() => setActiveTool("resize")}
    style={{
      backgroundColor: activeTool === "resize" ? "#007bff" : "#ccc",
      color: activeTool === "resize" ? "white" : "black",
      marginRight: "10px",
      padding: "6px 12px",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer"
    }}
  >
    Resize
  </button>

  <button 
    onClick={() => setActiveTool("convert")}
    style={{
      backgroundColor: activeTool === "convert" ? "#007bff" : "#ccc",
      color: activeTool === "convert" ? "white" : "black",
      padding: "6px 12px",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer"
    }}
  >
    Convert
  </button>
</div>
{activeTool === "compress" && (
  <>
   <input 
  type="file" 
  onChange={handleImage}
  style={{
    marginBottom: "20px",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    width: "100%"
  }}
/>

      {image && (
        <img 
          src={URL.createObjectURL(image)} 
          alt="preview"
          style={{ width: "200px", marginBottom: "20px", borderRadius: "10px", marginBottom: "20px" }}
        />
      )}

      <button 
        onClick={compressImage}
        style={{
  padding: "10px",
  width: "40%",
  fontSize: "18px",
  fontWeight: "bold",
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer"
}}
      >
        Compress Image
      </button>
  </>
)}
{activeTool === "resize" && (
  <>
  <h3 style={{ marginBottom: "10px", color: "#444" }}>
  Resize Image
</h3>

<div style={{ marginBottom: "15px" }}>
  <input 
    type="number" 
    placeholder="Width (px)"
    value={width}
    onChange={(e) => setWidth(e.target.value)}
    style={{
      padding: "10px",
      width: "120px",
      marginRight: "10px",
      borderRadius: "5px",
      border: "1px solid #ccc"
    }}
  />

  <input 
    type="number" 
    placeholder="Height (px)"
    value={height}
    onChange={(e) => setHeight(e.target.value)}
    style={{
      padding: "10px",
      width: "120px",
      borderRadius: "5px",
      border: "1px solid #ccc"
    }}
  />
</div>

<button 
  onClick={resizeImage}
  style={{
  padding: "10px",
  width: "40%",
  fontSize: "18px",
  fontWeight: "bold",
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer"
}}
>
  Resize Image
</button>
  </>
)}
{activeTool === "convert" &&(
  <>
  <h3 style={{ marginBottom: "10px", color: "#444" }}>
 Convert to PNG
</h3>

<button 
  onClick={convertToPNG}
  style={{
  padding: "10px",
  width: "40%",
  fontSize: "18px",
  backgroundColor: "#007bff",
  color: "white",
  fontWeight: "bold",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer"
}}
>
  Convert to PNG
</button>
  </>
)}
{compressed && (
        <a 
          href={compressed} 
          download="compressed.png"
          style={{
  marginTop: "20px",
  display: "block",
  textDecoration: "none",
  backgroundColor: "#222",
  color: "white",
  padding: "10px",
  borderRadius: "8px"
}}
        >
          Download Image
        </a>
      )}


    </div>
</div>
<p style={{ 
  marginTop: "15px", 
  fontSize: "12px", 
  color: "#888" 
}}>
  ⚡ Fast • 🔒 Secure • 📱 Works on all devices
</p>
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