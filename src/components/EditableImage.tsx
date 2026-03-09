import { useRef } from "react";
import { Camera } from "lucide-react";
import { cn } from "@/lib/utils";

interface EditableImageProps {
  src: string;
  alt: string;
  editMode: boolean;
  onChange: (newUrl: string) => void;
  className?: string;
  imgClassName?: string;
  style?: React.CSSProperties;
}

export function EditableImage({ src, alt, editMode, onChange, className, imgClassName, style }: EditableImageProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onChange(url);
  };

  if (!editMode) {
    return (
      <div className={className} style={style}>
        <img src={src} alt={alt} className={cn("w-full h-full object-cover", imgClassName)} />
      </div>
    );
  }

  return (
    <div
      className={cn("relative group/editimg cursor-pointer", className)}
      style={style}
      onClick={() => inputRef.current?.click()}
    >
      <img src={src} alt={alt} className={cn("w-full h-full object-cover", imgClassName)} />
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/editimg:opacity-100 transition-opacity flex items-center justify-center rounded-inherit">
        <div className="bg-background/90 rounded-full p-3">
          <Camera className="w-6 h-6 text-foreground" />
        </div>
      </div>
      <span className="absolute inset-0 rounded border-2 border-dashed border-primary/40 opacity-0 group-hover/editimg:opacity-100 transition-opacity pointer-events-none" />
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  );
}
