import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  editMode: boolean;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  multiline?: boolean;
  type?: "text" | "number";
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function EditableText({
  value,
  onChange,
  editMode,
  as: Tag = "span",
  multiline = false,
  type = "text",
  className,
  style,
}: EditableTextProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const ref = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => { setDraft(value); }, [value]);
  useEffect(() => { if (editing) ref.current?.focus(); }, [editing]);

  if (!editMode) {
    return <Tag className={className} style={style}>{value}</Tag>;
  }

  if (editing) {
    const sharedProps = {
      value: draft,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setDraft(e.target.value),
      onBlur: () => { onChange(type === "number" ? String(Number(draft) || 0) : draft); setEditing(false); },
      onKeyDown: (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !multiline) { onChange(type === "number" ? String(Number(draft) || 0) : draft); setEditing(false); }
        if (e.key === "Escape") { setDraft(value); setEditing(false); }
      },
      className: cn("bg-background border border-primary/50 rounded px-2 py-1 w-full outline-none ring-2 ring-primary/20", className),
      style: { ...style, minHeight: multiline ? 80 : undefined },
    };

    if (multiline) {
      return <textarea ref={ref as React.RefObject<HTMLTextAreaElement>} {...sharedProps} />;
    }
    return <input ref={ref as React.RefObject<HTMLInputElement>} type={type === "number" ? "number" : "text"} {...sharedProps} />;
  }

  return (
    <Tag
      className={cn(className, "cursor-pointer relative group/editable")}
      style={style}
      onClick={() => setEditing(true)}
    >
      {value}
      <span className="absolute inset-0 rounded border-2 border-dashed border-primary/40 opacity-0 group-hover/editable:opacity-100 transition-opacity pointer-events-none" />
    </Tag>
  );
}
