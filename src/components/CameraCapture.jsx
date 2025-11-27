// src/components/CameraCapture.jsx
import React, { useRef, useCallback } from "react";
import Webcam from "react-webcam";
import "../App.css";

// Deixa o browser escolher a resolução suportada (melhor p/ Android)
const videoConstraints = {
  facingMode: { ideal: "user" },
};

// Corrige orientação da imagem em celulares (gira se vier "deitada")
function fixOrientationIfNeeded(dataUrl) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const isLandscape = img.width > img.height;
      const isDevicePortrait = window.innerHeight > window.innerWidth;

      // Se a imagem veio horizontal mas o device está em pé,
      // giramos 90° para ficar retrato.
      if (isLandscape && isDevicePortrait) {
        const canvas = document.createElement("canvas");
        canvas.width = img.height;
        canvas.height = img.width;

        const ctx = canvas.getContext("2d");
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);

        // Gera PNG em alta qualidade
        const rotatedDataUrl = canvas.toDataURL("image/png");
        resolve(rotatedDataUrl);
      } else {
        resolve(dataUrl);
      }
    };
    img.src = dataUrl;
  });
}

const CameraCapture = ({ onCapture, onClose }) => {
  const webcamRef = useRef(null);

  const handleCapture = useCallback(async () => {
    if (!webcamRef.current) return;

    const rawImage = webcamRef.current.getScreenshot();

    if (!rawImage) {
      console.warn("getScreenshot retornou null (vídeo ainda não pronto ou erro).");
      alert(
        "Não foi possível capturar a imagem. Aguarde a câmera carregar e tente novamente."
      );
      return;
    }

    const fixedImage = await fixOrientationIfNeeded(rawImage);
    onCapture(fixedImage);
  }, [onCapture]);

  return (
    <div className="camera-overlay">
      <div className="camera-card">
        <div className="camera-header">
          <h2>Tire sua foto</h2>
          <p>
            Posicione seu rosto no enquadramento e clique em{" "}
            <strong>Capturar</strong>.
          </p>
        </div>

        <div className="camera-wrapper">
          <Webcam
            audio={false}
            ref={webcamRef}
            className="camera-video"
            videoConstraints={videoConstraints}
            mirrored={true}                // preview igual câmera frontal
            playsInline                     // importante para mobile
            screenshotFormat="image/png"    // 👉 PNG em vez de JPEG
            screenshotQuality={1}           // qualidade máxima
            screenshotWidth={1920}          // tenta chegar perto de Full HD
            forceScreenshotSourceSize={true}
            onUserMedia={() => {
              console.log("Webcam iniciada com sucesso");
            }}
            onUserMediaError={(err) => {
              console.error("Erro ao acessar a webcam:", err);
              alert(
                "Não foi possível acessar a câmera. Verifique as permissões do navegador/dispositivo."
              );
            }}
          />
        </div>

        <div className="camera-actions">
          <button className="btn btn-danger" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn btn-primary" onClick={handleCapture}>
            Capturar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CameraCapture;
