import { useState, useMemo, useEffect, useRef } from "react";
import imageCompression from "browser-image-compression";

function App() {
  const [image, setImage] = useState(null);
  const [compressed, setCompressed] = useState(null);
  const [compressedBlob, setCompressedBlob] = useState(null);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [activeTool, setActiveTool] = useState("compress");
  const [format, setFormat] = useState("png");
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [outputSize, setOutputSize] = useState(null);

  const fileInputRef = useRef();

  const previewUrl = useMemo(() => {
    if (!image) return null;
    return URL.createObjectURL(image);
  }, [image]);

  useEffect(() => {
    return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); };
  }, [previewUrl]);

  useEffect(() => {
    return () => {
      if (compressed && compressed.startsWith("blob:")) URL.revokeObjectURL(compressed);
    };
  }, [compressed]);

  useEffect(() => {
    setCompressed(null);
    setCompressedBlob(null);
    setWidth("");
    setHeight("");
    setOutputSize(null);
  }, [activeTool]);

  const createCanvas = (w, h) => {
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas not supported on this browser.");
    return { canvas, ctx };
  };

  const getQuality = (fmt) =>
    fmt === "jpeg" || fmt === "webp" ? 0.9 : undefined;

  const handleImage = (file) => {
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      setCompressed(null);
      setCompressedBlob(null);
      setOutputSize(null);
    } else {
      alert("Please upload a valid image file.");
    }
  };

  // ✅ Remove image and reset everything
  const handleRemoveImage = (e) => {
    e.stopPropagation(); // prevent drop zone click from firing
    setImage(null);
    setCompressed(null);
    setCompressedBlob(null);
    setWidth("");
    setHeight("");
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleImage(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleDragLeave = (e) => {
    if (!e.relatedTarget || e.currentTarget.contains(e.relatedTarget)) return;
    setIsDragging(false);
  };

  const resizeImage = () => {
    if (!image) { alert("Please upload an image first."); return; }
    const img = new Image();
    img.src = previewUrl;
    img.onerror = () => alert("Failed to process image.");
    img.onload = () => {
      let newWidth = parseInt(width, 10);
      let newHeight = parseInt(height, 10);

      if (newWidth && !newHeight) newHeight = Math.round((img.height / img.width) * newWidth);
      else if (!newWidth && newHeight) newWidth = Math.round((img.width / img.height) * newHeight);
      else { newWidth = newWidth || img.width; newHeight = newHeight || img.height; }
      
     

      if (newWidth <= 0 || newHeight <= 0) {
        alert("Invalid dimensions. Please enter positive values.");
        return;
      }
      if (newWidth > 5000 || newHeight > 5000) {
        alert("Maximum allowed size is 5000×5000px to prevent browser freezing.");
        return;
      }
       setOutputSize({w : newWidth, h : newHeight});

      try {
        const { canvas, ctx } = createCanvas(newWidth, newHeight);
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
        setCompressed(canvas.toDataURL(`image/${format}`, getQuality(format)));
        setCompressedBlob(null);
      } catch (err) {
        alert(err.message);
      }
    };
  };

  const convertImage = () => {
    if (!image) { alert("Please upload an image first."); return; }
    const img = new Image();
    img.src = previewUrl;
    img.onerror = () => alert("Failed to process image.");
    img.onload = () => {
      try {
        const { canvas, ctx } = createCanvas(img.width, img.height);
        ctx.drawImage(img, 0, 0);
        setCompressed(canvas.toDataURL(`image/${format}`, getQuality(format)));
        setCompressedBlob(null);
      } catch (err) {
        alert(err.message);
      }
    };
  };

  const compressImage = async () => {
    if (!image) { alert("Please upload an image first."); return; }
    setLoading(true);
    try {
      const options = { maxSizeMB: 0.2, maxWidthOrHeight: 800 };
      const compressedFile = await imageCompression(image, options);
      setCompressedBlob(compressedFile);
      setCompressed(URL.createObjectURL(compressedFile));
    } catch {
      alert("Compression failed. Please try a different image.");
    } finally {
      setLoading(false);
    }
  };

  let downloadName;
  if (activeTool === "compress" && compressedBlob) {
    const type = compressedBlob?.type?.split("/")?.[1] || "jpg";
    downloadName = `compressed.${type}`;
  } else {
    downloadName = `image.${format}`;
  }

  const btnStyle = {
    padding: "10px", width: "40%", fontSize: "16px", fontWeight: "bold",
    backgroundColor: "#007bff", color: "white", border: "none",
    borderRadius: "8px", cursor: "pointer",
  };

  const tabStyle = (tool) => ({
    backgroundColor: activeTool === tool ? "#007bff" : "#ccc",
    color: activeTool === tool ? "white" : "black",
    marginRight: "10px", padding: "6px 12px",
    border: "none", borderRadius: "5px", cursor: "pointer",
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", fontFamily: "Arial", backgroundColor: "#f4f4f4" }}>

      <div style={{ width: "100%", padding: "15px", backgroundColor: "#222", color: "white", textAlign: "center", fontWeight: "bold" }}>
        🔥 Free Tools Hub
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, gap: "10px", padding: "20px" }}>
        <div style={{ backgroundColor: "white", padding: "40px", borderRadius: "15px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", textAlign: "center", width: "100%", maxWidth: "500px" }}>

          <h1 style={{ marginBottom: "20px", color: "#222", fontSize: "24px" }}>Compress Image Online Free</h1>
          <p style={{ color: "#666", fontSize: "14px", marginBottom: "20px" }}>
            Compress, resize and convert your images instantly — free and secure.
          </p>

          <div style={{ marginBottom: "20px" }}>
            <button onClick={() => setActiveTool("compress")} style={tabStyle("compress")}>Compress</button>
            <button onClick={() => setActiveTool("resize")} style={tabStyle("resize")}>Resize</button>
            <button onClick={() => setActiveTool("convert")} style={tabStyle("convert")}>Convert</button>
          </div>

          {/* ✅ Drop zone — shows image inside when uploaded */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onClick={() => !image && fileInputRef.current.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && !image && fileInputRef.current.click()}
            style={{
              border: `2px dashed ${isDragging ? "#0056cc" : "#007bff"}`,
              backgroundColor: isDragging ? "#e8f0fe" : "#f9f9f9",
              borderRadius: "10px",
              padding: image ? "12px" : "30px",
              textAlign: "center",
              cursor: image ? "default" : "pointer",
              marginBottom: "20px",
              transition: "all 0.2s ease",
              outline: "none",
              position: "relative",
            }}
          >
            {image && previewUrl ? (
              // ✅ Image preview inside the box
              <>
                <img
                  src={previewUrl}
                  alt="preview"
                  style={{
                    width: "100%",
                    maxHeight: "220px",
                    objectFit: "contain",
                    borderRadius: "8px",
                    display: "block",
                  }}
                />
                {/* File info bar below image */}
                <div style={{
                  marginTop: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "12px",
                  color: "#666",
                }}>
                  <span>📄 {image.name}</span>
                  <span>{(image.size / 1024).toFixed(1)} KB</span>
                </div>
                {/* ✅ Remove button */}
                <button
                  onClick={handleRemoveImage}
                  style={{
                    marginTop: "10px",
                    padding: "5px 14px",
                    fontSize: "12px",
                    fontWeight: "bold",
                    backgroundColor: "#ff4d4d",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  ✕ Remove
                </button>
              </>
            ) : (
              // ✅ Empty state — prompt to upload
              <>
                <p style={{ marginBottom: "10px", fontWeight: "bold" }}>Drag & Drop your image here</p>
                <p style={{ fontSize: "14px", color: "#666" }}>or click to upload</p>
              </>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => { handleImage(e.target.files[0]); e.target.value = null; }}
              style={{ display: "none" }}
            />
          </div>

          {activeTool === "compress" && (
            <button onClick={compressImage} style={btnStyle} disabled={loading || !image}>
              {loading ? "Compressing..." : "Compress Image"}
            </button>
          )}

          {activeTool === "resize" && (
            <>
              <h3 style={{ marginBottom: "6px", color: "#444" }}>Resize Image</h3>
              <p style={{ fontSize: "13px", color: "#888", marginBottom: "12px" }}>
                Enter one value to auto-maintain aspect ratio.
              </p>
              <div style={{ marginBottom: "15px" }}>
                <input
                  type="number" placeholder="Width (px)" value={width}
                  min="1" max="5000"
                  onChange={(e) => setWidth(e.target.value)}
                  style={{ padding: "10px", width: "120px", marginRight: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
                />
                <input
                  type="number" placeholder="Height (px)" value={height}
                  min="1" max="5000"
                  onChange={(e) => setHeight(e.target.value)}
                  style={{ padding: "10px", width: "120px", borderRadius: "5px", border: "1px solid #ccc" }}
                />
              </div>
              <button onClick={resizeImage} style={btnStyle} disabled={!image}>Resize Image</button>
              {compressed && outputSize && (
  <p style={{ fontSize: "13px", color: "#444", marginTop: "10px" }}>
    Output: {outputSize.w} × {outputSize.h} px
  </p>
)}
            </>
          )}

          {activeTool === "convert" && (
            <>
              <h3 style={{ marginBottom: "10px", color: "#444" }}>Convert Image</h3>
              <select
                value={format} onChange={(e) => setFormat(e.target.value)}
                style={{ padding: "10px", marginBottom: "15px", borderRadius: "5px", display: "block", margin: "0 auto 15px" }}
              >
                <option value="png">PNG</option>
                <option value="jpeg">JPG</option>
                <option value="webp">WEBP</option>
              </select>
              <button onClick={convertImage} style={btnStyle} disabled={!image}>Convert Image</button>
            </>
          )}

          {/* Compressed size feedback */}
          {compressed && activeTool === "compress" && compressedBlob && (
            <p style={{ fontSize: "13px", color: "#444", marginTop: "12px" }}>
              Compressed size: <strong>{(compressedBlob.size / 1024).toFixed(1)} KB</strong>
              {image && (
                <span style={{ color: "#28a745", marginLeft: "8px" }}>
                  ({Math.round((1 - compressedBlob.size / image.size) * 100)}% smaller)
                </span>
              )}
            </p>
          )}

          {/* Output preview + download */}
          {compressed && (
  <>
    <img
      src={compressed}
      alt="result"
      style={{
  maxWidth: "100%",
  maxHeight: "250px",
  objectFit: "contain",
  borderRadius: "10px"
}}
    />

    <a
      href={compressed}
      download={downloadName}
      style={{
        marginTop: "10px",
        display: "block",
        textDecoration: "none",
        backgroundColor: "#222",
        color: "white",
        padding: "10px",
        borderRadius: "8px"
      }}
    >
      ⬇ Download Image
    </a>
  </>
)}

          <div style={{ marginTop: "30px", textAlign: "left" }}>
            <h3>About This Tool</h3>
            <p style={{ lineHeight: "1.6" }}>
              Compress images, resize photos, and convert between PNG, JPG, and WEBP — instantly, free, no signup.
            </p>
            <p style={{ lineHeight: "1.6" }}>Perfect for websites, forms, and social media. Works on all devices.</p>
          </div>

          <p style={{ marginTop: "15px", fontSize: "12px", color: "#888" }}>⚡ Fast • 🔒 Secure • 📱 Works on all devices</p>
        </div>
      </div>

      <div style={{ width: "100%", padding: "10px", backgroundColor: "#222", color: "white", textAlign: "center" }}>
        © 2026 Free Tools Hub
      </div>
    </div>
  );
}

export default App;