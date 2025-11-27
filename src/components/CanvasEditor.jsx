import React, { useRef, useEffect, useState } from "react";
import { Stage, Layer, Image as KonvaImage, Transformer } from "react-konva";
import useImage from "use-image";

const URLImage = ({ image, isSelected, onSelect, onChange, draggable, scale }) => {
  const shapeRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  // Update scale when prop changes
  useEffect(() => {
    if (shapeRef.current) {
      shapeRef.current.scale({ x: scale, y: scale });
      shapeRef.current.getLayer().batchDraw();
    }
  }, [scale]);

  return (
    <>
      <KonvaImage
        image={image}
        ref={shapeRef}
        draggable={draggable}
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) => {
          onChange({
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={() => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          onChange({
            x: node.x(),
            y: node.y(),
            scaleX,
            scaleY,
            rotation: node.rotation(),
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};

const CanvasEditor = ({ userImageSrc, frameImageSrc, stageRef, userScale = 1 }) => {
  const [userImage] = useImage(userImageSrc);
  const [frameImage] = useImage(frameImageSrc);
  const [selectedId, selectShape] = useState(null);
  const [imageState, setImageState] = useState({ x: 0, y: 0 });

  // tamanho lógico do design (9:16)
  const DESIGN_WIDTH = 324;
  const DESIGN_HEIGHT = 576;

  // escala para se adaptar à largura da tela
  const [scale, setScale] = useState(1);
  const [stageSize, setStageSize] = useState({
    width: DESIGN_WIDTH,
    height: DESIGN_HEIGHT,
  });

  useEffect(() => {
    const handleResize = () => {
      const vw =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;

      const MAX_DESKTOP_WIDTH = 380; // limite visual no desktop
      const H_PADDING = 32; // “respiro” lateral

      // largura máxima que queremos usar
      const availableWidth = Math.min(MAX_DESKTOP_WIDTH, vw - H_PADDING);

      // fator de escala relativo ao design
      let newScale = availableWidth / DESIGN_WIDTH;

      // nunca deixa maior que o tamanho original
      if (newScale > 1) newScale = 1;

      setScale(newScale);
      setStageSize({
        width: DESIGN_WIDTH * newScale,
        height: DESIGN_HEIGHT * newScale,
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const checkDeselect = (e) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectShape(null);
    }
  };

  return (
    <div
      className="frame-wrapper"
      style={{
        width: stageSize.width,
        height: stageSize.height,
        border: '2px solid #fff', // White border for visibility on green bg
      }}
    >
      <Stage
        width={DESIGN_WIDTH}               // tamanho lógico fixo
        height={DESIGN_HEIGHT}
        scale={{ x: scale, y: scale }}     // escala global
        onMouseDown={checkDeselect}
        onTouchStart={checkDeselect}
        ref={stageRef}
      >
        <Layer>
          {/* Foto do usuário (embaixo) */}
          {userImage && (
            <URLImage
              image={userImage}
              isSelected={selectedId === "user"}
              onSelect={() => selectShape("user")}
              onChange={(newAttrs) => setImageState(newAttrs)}
              draggable={true}
              scale={userScale}
            />
          )}

          {/* Moldura (por cima, cobrindo o Stage inteiro) */}
          {frameImage && (
            <KonvaImage
              image={frameImage}
              width={DESIGN_WIDTH}
              height={DESIGN_HEIGHT}
              listening={false}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
};

export default CanvasEditor;
