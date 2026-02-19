import { useEffect, useRef, useState } from "react";

interface NpcHeadIconProps {
  textureUrl: string;
  size?: number;
  className?: string;
}

export function NpcHeadIcon({ textureUrl, size = 24, className = "" }: NpcHeadIconProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (!textureUrl) return;
    setFailed(false);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, size, size);

      ctx.drawImage(img, 8, 8, 8, 8, 0, 0, size, size);
    };
    img.onerror = () => setFailed(true);
    img.src = `http://localhost:3001/api/skin?url=${encodeURIComponent(textureUrl)}`;
  }, [textureUrl, size]);

  if (!textureUrl || failed)
    return null;

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className={`inline-block ${className}`}
      style={{ imageRendering: "pixelated", width: size, height: size }}
    />
  );
}
