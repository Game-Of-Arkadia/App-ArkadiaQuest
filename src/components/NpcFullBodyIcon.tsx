import { useEffect, useRef, useState } from "react";

interface NpcFullBodyIconProps {
  textureUrl: string;
  size?: number;
  className?: string;
  onClick?: () => void;
}

export function NpcFullBodyIcon({
  textureUrl,
  size = 64,
  className = "",
  onClick,
}: NpcFullBodyIconProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!textureUrl)
        return;
    setFailed(false);

    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas)
        return;
      const ctx = canvas.getContext("2d");
      if (!ctx)
        return;

      ctx.imageSmoothingEnabled = false;

      const baseWidth = 16;
      const baseHeight = 32;

      canvas.width = baseWidth;
      canvas.height = baseHeight;
      ctx.clearRect(0, 0, baseWidth, baseHeight);

      // Head (8x8)
      ctx.drawImage(img, 8, 8, 8, 8, 4, 0, 8, 8);
      // Body (8x12)
      ctx.drawImage(img, 20, 20, 8, 12, 4, 8, 8, 12);
      // Right Arm (4x12)
      ctx.drawImage(img, 44, 20, 4, 12, 0, 8, 4, 12);
      // Left Arm (4x12)
      ctx.drawImage(img, 36, 52, 4, 12, 12, 8, 4, 12);
      // Right Leg (4x12)
      ctx.drawImage(img, 4, 20, 4, 12, 4, 20, 4, 12);
      // Left Leg (4x12)
      ctx.drawImage(img, 20, 52, 4, 12, 8, 20, 4, 12);

      const scale = size / baseHeight;

      canvas.style.width = `${baseWidth * scale}px`;
      canvas.style.height = `${size}px`;
    };

    img.onerror = () => setFailed(true);

    img.src = `http://localhost:3001/api/skin?url=${encodeURIComponent(
      textureUrl
    )}`;
  }, [textureUrl, size]);

  if (!textureUrl || failed) return null;

  return (
    <canvas
      ref={canvasRef}
      className={`inline-block ${onClick ? "cursor-pointer" : ""} ${className}`}
      style={{
        imageRendering: "pixelated",
      }}
      onClick={onClick}
    />
  );
}

export async function validateMinecraftSkin(
  textureUrl: string
): Promise<boolean> {
  if (!textureUrl)
    return false;

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    const timeout = setTimeout(() => {
      resolve(false);
    }, 5000);

    img.onload = () => {
      clearTimeout(timeout);

      const { width, height } = img;

      const isValidSize = (width === 64 && height === 64) || (width === 64 && height === 32);

      resolve(isValidSize);
    };

    img.onerror = () => {
      clearTimeout(timeout);
      resolve(false);
    };

    img.src = `http://localhost:3001/api/skin?url=${encodeURIComponent(
      textureUrl
    )}`;
  });
}
