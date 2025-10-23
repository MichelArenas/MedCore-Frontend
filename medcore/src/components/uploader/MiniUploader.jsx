import { useState, useRef } from "react";
import "./miniUploader.css";

export default function MiniUploader({ label = "Adjuntar documentos", accept = "*", multiple = true, onChange }) {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const handleFiles = (list) => {
    const arr = Array.from(list || []);
    setFiles(arr);
    onChange?.(arr);
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="miniup-card">
      <div
        className={`miniup-drop ${isDragging ? "dragging" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7 10V9C7 6.24 9.24 4 12 4s5 2.24 5 5v1c2.21 0 4 1.79 4 4 0 1.48-.8 2.77-2 3.5M7 10C4.79 10 3 11.79 3 14c0 1.48.8 2.77 2 3.5M12 12v9m0-9l3 3m-3-3-3 3" stroke="#0a66ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <p>{isDragging ? "Suelta tus archivos aquí…" : label}</p>
      </div>

      <label htmlFor="miniup-input" className="miniup-bar">
        <div className="miniup-left">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16l4-4h8a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"/></svg>
        </div>
        <div className="miniup-mid">
          {files.length ? (
            <>
              <div className="miniup-name" title={files.map(f=>f.name).join(", ")}>{files.length} archivo(s) seleccionados</div>
              <div className="miniup-meta">
                {files.slice(0,2).map(f => f.name).join(", ")}{files.length>2 ? "…" : ""}
              </div>
            </>
          ) : <p className="miniup-placeholder">No se han adjuntado archivos</p>}
        </div>
        <button
          type="button"
          className="miniup-right"
          onClick={(e)=>{ e.preventDefault(); setFiles([]); onChange?.([]); if (inputRef.current) inputRef.current.value = ""; }}
          title="Quitar archivos"
        >
          ✕
        </button>
      </label>

      <input
        id="miniup-input"
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e)=>handleFiles(e.target.files)}
        style={{ display: "none" }}
      />
    </div>
  );
}
