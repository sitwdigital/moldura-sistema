// src/components/CanvasEditor.jsx
import React, { useEffect, useState } from "react";
import { Stage, Layer, Image as KonvaImage } from "react-konva";
import useImage from "use-image";

const CANVAS_WIDTH = 360;  // largura “visível” na tela
const CANVAS_HEIGHT = 640; // altura “visível” na tela

const CanvasEditor = ({ userImageSrc, frameImageSrc, stageRef, userScale }) => {
  const [userImage] = useImage(userImageSrc || "", "anonymous");
  const [frameImage] = useImage(frameImageSrc || "", "anonymous");

  const [baseScale, setBaseScale] = useState(1);

  // assim que a imagem do usuário carrega, calculamos um scale que faça ela caber
  useEffect(() => {
    if (!userImage) return;

    const imgW = userImage.width;
    const imgH = userImage.height;

    if (!imgW || !imgH) return;

    const scaleToFitWidth = CANVAS_WIDTH / imgW;
    const scaleToFitHeight = CANVAS_HEIGHT / imgH;

    // queremos que a imagem inteira apareça (contain)
    const scale = Math.min(scaleToFitWidth, scaleToFitHeight);

    setBaseScale(scale);
  }, [userImage]);

  const effectiveScale = baseScale * (userScale || 1);

  const userX = userImage
    ? (CANVAS_WIDTH - userImage.width * effectiveScale) / 2
    : 0;
  const userY = userImage
    ? (CANVAS_HEIGHT - userImage.height * effectiveScale) / 2
    : 0;

  return (
    <div
      className="frame-section-inner"
      style={{
        margin: "0 auto",
        borderRadius: 24,
        overflow: "hidden",
        boxShadow: "0 16px 40px rgba(0,0,0,0.45)",
      }}
    >
      <Stage
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        ref={stageRef}
        // deixa responsivo via CSS (o Stage em si é 360x640 lógico)
        style={{
          width: "100%",
          height: "auto",
          display: "block",
        }}
      >
        <Layer>
          {/* FOTO DO USUÁRIO */}
          {userImage && (
            <KonvaImage
              image={userImage}
              x={userX}
              y={userY}
              scaleX={effectiveScale}
              scaleY={effectiveScale}
              draggable
            />
          )}

          {/* MOLDURA FIXA POR CIMA */}
          {frameImage && (
            <KonvaImage
              image={frameImage}
              x={0}
              y={0}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              listening={false}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
};

export default CanvasEditor;
