import { useEffect, useRef, useState } from "react";
import { User } from "lucide-react";

interface NpcHeadIconProps {
  textureUrl: string;
  size?: number;
  className?: string;
}

export function NpcHeadIcon({ textureUrl, size = 24, className = "" }: NpcHeadIconProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (!textureUrl) {
      setFailed(true);
      return;
    }

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

  if (!textureUrl || failed) {
    return (
      <div
        className="rounded-sm border border-dashed border-muted-foreground/30 flex items-center justify-center bg-muted/30"
        style={{ width: size, height: size }}
      >
        <User
          className="text-muted-foreground/40"
          style={{ width: size * 0.8, height: size * 0.8 }}
        />
      </div>
    );
  }

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
