import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
interface CoordinatesInputProps {
  x: number;
  y: number;
  z: number;
  onChange: (coords: { x: number; y: number; z: number }) => void;
  className?: string;
  inputClassName?: string;
}
function formatCoords(x: number, y: number, z: number): string {
  return `${x} ${y} ${z}`;
}
function parseCoords(value: string): { x: number; y: number; z: number } | null {
  const parts = value.trim().split(/\s+/);
  if (parts.length !== 3) return null;
  const nums = parts.map(Number);
  if (nums.some(isNaN)) return null;
  return { x: nums[0], y: nums[1], z: nums[2] };
}
export function CoordinatesInput({ x, y, z, onChange, className, inputClassName }: CoordinatesInputProps) {
  const [value, setValue] = useState(() => formatCoords(x, y, z));
  const [error, setError] = useState(false);
  // Sync from props when they change externally
  useEffect(() => {
    const current = parseCoords(value);
    if (!current || current.x !== x || current.y !== y || current.z !== z) {
      setValue(formatCoords(x, y, z));
      setError(false);
    }
  }, [x, y, z]);
  const handleChange = (raw: string) => {
    setValue(raw);
    const parsed = parseCoords(raw);
    if (parsed) {
      setError(false);
      onChange(parsed);
    } else {
      setError(raw.trim().length > 0);
    }
  };
  return (
    <div className={className}>
      <Input
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="0 0 0"
        className={inputClassName}
      />
      {error && (
        <p className="text-[10px] text-destructive mt-0.5">
          Mauvaises coordonées. Veuillez utiliser le format : "xx yy zz"
        </p>
      )}
    </div>
  );
}