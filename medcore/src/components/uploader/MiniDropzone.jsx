import React, { useRef, useState } from "react";
import "./miniDropzone.css";

/**
 * MiniDropzone
 * props:
 * - onChange(files: File[]) => void
 * - accept (string) ej: "image/*,application/pdf"
 * - max (number) máximo de archivos (opcional)
 * - maxSizeMB (number) tam máx por archivo (opcional, default 15MB)
 * - placeholder (string)
 */
export default function MiniDropzone({
  onChange,
  accept = "image/*,application/pdf",
  max,
  maxSizeMB = 15,
  placeholder = "Arrastra o haz clic para adjuntar…"
}) {
  const inputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const addFiles = (list) => {
    const arr = Array.from(list || []);
    if (!arr.length) return;

    // validaciones
    const filtered = [];
    const errors = [];
    for (const f of arr) {
      if (max && files.length + filtered.length >= max) {
        errors.push(`Se alcanzó el máximo de ${max} archivos.`);
        break;
      }
      if (f.size > maxSizeMB * 1024 * 1024) {
        errors.push(`${f.name} excede ${maxSizeMB}MB.`);
        continue;
      }
      filtered.push(f);
    }

    if (errors.length) {
      alert(errors.join("\n"));
    }
    if (!filtered.length) return;

    const next = [...files, ...filtered];
    setFiles(next);
    onChange?.(next);
  };

  const removeAt = (idx) => {
    const next = files.filter((_, i) => i !== idx);
    setFiles(next);
    onChange?.(next);
    if (next.length === 0 && inputRef.current) inputRef.current.value = "";
  };

  const clearAll = () => {
    setFiles([]);
    onChange?.([]);
    if (inputRef.current) inputRef.current.value = "";
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  };

  return (
    <div className="mini-uploader">
      <div
        className={`mini-dropzone ${isDragging ? "dragging" : ""}`}
        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }}
        onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); }}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label="Cargar documentos"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7 10V9a5 5 0 0110 0v1a4 4 0 012 7.5M7 10a4 4 0 00-2 7.5M12 12v7m0 0l3-3m-3 3l-3-3"
                stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        </svg>
        <span>{placeholder}</span>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        onChange={(e) => addFiles(e.target.files)}
        style={{ display: "none" }}
      />

      {files.length > 0 && (
        <div className="mini-list">
          {files.map((f, i) => (
            <div key={`${f.name}-${i}`} className="mini-item">
              <div className="mini-file">
                <strong className="name" title={f.name}>{f.name}</strong>
                <span className="meta">{(f.size/1024/1024).toFixed(2)} MB</span>
              </div>
              <button type="button" className="mini-remove" onClick={() => removeAt(i)}>✕</button>
            </div>
          ))}
          <div className="mini-actions">
            <button type="button" className="mini-clear" onClick={clearAll}>Limpiar</button>
          </div>
        </div>
      )}
    </div>
  );
}
