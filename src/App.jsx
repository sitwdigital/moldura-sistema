import React, { useState, useRef, useEffect } from "react";
import CanvasEditor from "./components/CanvasEditor";
import CameraCapture from "./components/CameraCapture";
import framePng from "./assets/frame.png"; // <-- IMPORTA A MOLDURA
import "./App.css";

function App() {
  const [userImage, setUserImage] = useState(null);
  // não precisa ser state, a moldura é fixa:
  const frameImage = framePng;
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isSelectionOpen, setIsSelectionOpen] = useState(false);
  const [zoom, setZoom] = useState(1);

  const stageRef = useRef(null);

  // Exemplo de uso do backend (health check)
  useEffect(() => {
    const API_BASE_URL =
      import.meta.env.VITE_API_URL || "http://localhost:4000";

    fetch(`${API_BASE_URL}/api/health`)
      .then((res) => res.json())
      .then((data) => console.log("Backend health check:", data))
      .catch((err) => console.error("Backend health check failed:", err));
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setUserImage(url);
      setIsSelectionOpen(false);
    }
  };

  const handleDownload = () => {
    if (stageRef.current) {
      const currentScale = stageRef.current.scaleX();
      const pixelRatio = 2 / currentScale;

      const uri = stageRef.current.toDataURL({ pixelRatio });
      const link = document.createElement("a");
      link.download = "minha-foto-com-moldura.png";
      link.href = uri;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="App">
      {/* HEADER NO ESTILO DO BANNER */}
      <header className="hero-header">
        <div className="hero-badge">Convenção estadual do MDB-MA</div>

        <h1 className="hero-title">
          AVISA LÁ QUE <span>VOCÊ VAI!</span>
        </h1>

        <p className="hero-subtitle">
          Gere sua foto em apoio à convenção do MDB MA e compartilhe em todas
          as suas redes sociais!
        </p>
      </header>

      {/* BOTÃO PRINCIPAL */}
      <div className="controls">
        <button
          className="action-btn primary-btn"
          onClick={() => setIsSelectionOpen(true)}
        >
          Escolher Foto
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ marginLeft: "10px" }}
          >
            <path
              d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
              fill="currentColor"
            />
            <path
              d="M20 4H16.83L15.12 2.17C14.93 1.96 14.66 1.84 14.37 1.84H9.63C9.34 1.84 9.07 1.96 8.88 2.17L7.17 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>

      {/* ÁREA DA MOLDURA / CANVAS */}
      <div className="frame-section">
        <CanvasEditor
          userImageSrc={userImage}
          frameImageSrc={frameImage}
          stageRef={stageRef}
          userScale={zoom}
        />
      </div>

      {/* SLIDER DE ZOOM */}
      {userImage && (
        <div className="zoom-controls">
          <span className="zoom-icon">-</span>
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.1"
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="zoom-slider"
          />
          <span className="zoom-icon">+</span>
        </div>
      )}

      {/* BOTÃO DE DOWNLOAD */}
      <div
        className="download-section"
        style={{
          margin: "30px 0 30px 0",
          textAlign: "center",
          width: "100%",
        }}
      >
        <button
          className="download-btn"
          onClick={handleDownload}
          disabled={!userImage}
        >
          Baixar foto
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ marginLeft: "10px" }}
          >
            <path
              d="M12 16L7 11H10V4H14V11H17L12 16ZM12 18C14.2091 18 16 16.2091 16 14V18H8V14C8 16.2091 9.79086 18 12 18Z"
              fill="currentColor"
            />
            <path
              d="M19 19H5V14H3V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V14H19V19Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>

      {/* MODAL DE SELEÇÃO (Galeria ou Câmera) */}
      {isSelectionOpen && (
        <div
          className="modal-overlay"
          onClick={() => setIsSelectionOpen(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Escolha uma opção</h3>
            </div>
            <div className="modal-options">
              <label className="modal-option">
                <span className="modal-icon">🖼️</span>
                <span>Galeria de fotos</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </label>

              <button
                className="modal-option"
                onClick={() => {
                  setIsSelectionOpen(false);
                  setIsCameraOpen(true);
                }}
              >
                <span className="modal-icon">📷</span>
                <span>Tirar foto</span>
              </button>
            </div>
            <button
              className="modal-cancel"
              onClick={() => setIsSelectionOpen(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* MODAL DA CÂMERA */}
      {isCameraOpen && (
        <CameraCapture
          onCapture={(img) => {
            setUserImage(img);
            setIsCameraOpen(false);
          }}
          onClose={() => setIsCameraOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
