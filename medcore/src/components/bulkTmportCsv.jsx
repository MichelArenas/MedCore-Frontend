import { useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./bulkTmportCsv.css";
import Swal from "sweetalert2";

export default function BulkImportCsv() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event) => {
    const f = event.target.files?.[0] ?? null;
    setFile(f);
    setResult(null);
  };

  // --- Drag & Drop helpers ---
  const acceptCsv = (f) => !!f && (f.type === "text/csv" || /\.csv$/i.test(f.name));
  const onDragOver = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const onDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
  const onDrop = (e) => {
    e.preventDefault(); e.stopPropagation(); setIsDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (!f) return;
    if (!acceptCsv(f)) {
      Swal.fire({ icon: "warning", title: "Archivo no válido", text: "Arrastra un archivo .csv" });
      return;
    }
    setFile(f); setResult(null);
  };

  // --- Normalizador robusto de estructura de errores ---
  const normalizedErrors = useMemo(() => {
    const raw = result?.errors || result?.errores || [];
    return (raw || []).map((e, idx) => ({
      row: e.row ?? e.fila ?? e.line ?? e.index ?? e.lineNumber ?? (idx + 1),
      document:
        e.document ??
        e.documento ??
        e.documento_identidad ??
        e.id_number ??
        e.idNumber ??
        e.doc ??
        "-",
      field: e.field ?? e.campo ?? e.column ?? e.columna ?? "-",
      message: e.message ?? e.error ?? e.motivo ?? "Error no especificado",
    }));
  }, [result]);

  // --- Descargar CSV de errores ---
  const downloadErrorsCSV = () => {
    if (!normalizedErrors.length) return;
    const header = ["Fila", "Documento", "Campo", "Error"];
    const rows = normalizedErrors.map((e) => [
      `${e.row}`,
      `${e.document}`.replace(/"/g, '""'),
      `${e.field}`.replace(/"/g, '""'),
      `${e.message}`.replace(/"/g, '""'),
    ]);
    const csv =
      [header, ...rows]
        .map((r) => r.map((v) => `"${v}"`).join(","))
        .join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "errores_carga_masiva.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // --- Submit ---
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      Swal.fire({ icon: "info", title: "Selecciona un archivo", text: "Debes elegir un archivo .csv para continuar" });
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:3003/api/v1/users/bulk-import", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        Swal.fire({
          icon: "error",
          title: "Error al cargar",
          text: data?.message || `Error ${response.status}`,
        });
        return;
      }

      setResult(data);
      Swal.fire({
        icon: "success",
        title: "¡Carga completa!",
        html: `
          <div style="text-align:left">
            <div><b>Mensaje:</b> ${data.message || "OK"}</div>
            <div><b>Insertados:</b> ${data.inserted?.length ?? 0}</div>
            <div><b>Errores:</b> ${data.errors?.length ?? 0}</div>
            <div><b>Duplicados CSV:</b> ${data.duplicatesCSV?.length ?? 0}</div>
            <div><b>Duplicados BD:</b> ${data.duplicatesDB?.length ?? 0}</div>
          </div>
        `,
        confirmButtonText: "Entendido",
      });
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({ icon: "error", title: "Error de red", text: "No se pudo contactar al servidor" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2>Carga masiva (.CSV)</h2>

      <form className="register-form" onSubmit={handleSubmit}>
        <div className="upload-card">
          <div
            className={`header ${isDragging ? "dragging" : ""}`}
            onDragOver={onDragOver}
            onDragEnter={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
            role="button"
            tabIndex={0}
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M7 10V9C7 6.23858 9.23858 4 12 4C14.7614 4 17 6.23858 17 9V10C19.2091 10 21 11.7909 21 14C21 15.4806 20.1956 16.8084 19 17.5M7 10C4.79086 10 3 11.7909 3 14C3 15.4806 3.8044 16.8084 5 17.5M7 10C7.43285 10 7.84965 10.0688 8.24006 10.1959M12 12V21M12 12L15 15M12 12L9 15" stroke="#007bff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p>{isDragging ? "Suelta el archivo aquí…" : "Carga un archivo CSV"}</p>
          </div>

          <label htmlFor="file" className="footer">
            <div className="file-left" title="Elegir archivo">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M14 2H6a2 2 0 0 0-2 2v16l4-4h8a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"/>
              </svg>
            </div>

            <div className="file-middle">
              {file ? (
                <>
                  <div className="file-name" title={file.name}>{file.name}</div>
                  <div className="file-meta">{(file.size/1024).toFixed(0)} KB</div>
                </>
              ) : (
                <p className="file-placeholder">No se ha seleccionado ningún archivo</p>
              )}
            </div>

            <div
              className="file-right"
              title={file ? "Quitar archivo" : "Sin archivo"}
              role="button"
              onClick={(e) => {
                e.preventDefault();
                if (!file) return;
                setFile(null);
                setResult(null);
                if (inputRef.current) inputRef.current.value = "";
              }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M9 3h6l1 2h4v2H4V5h4l1-2zm1 6h2v8h-2V9zm4 0h2v8h-2V9z"/>
              </svg>
            </div>
          </label>

          <input
            id="file"
            name="file"
            ref={inputRef}
            type="file"
            accept=".csv,text/csv"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>

        <div className="actions-row">
          <button className="register-btn" type="submit" disabled={!file || loading}>
            {loading ? "Subiendo..." : "Subir CSV"}
          </button>
          <button type="button" className="register-btn secondary" onClick={() => navigate("/DashboardAdmin")}>
            Volver
          </button>
        </div>
        {/* --- Panel de resultados + Tabla de Errores --- */}
        {result && (
          <div className="results-card">
            <div className="results-grid">
              <div><b>Insertados:</b> {result?.inserted?.length ?? 0}</div>
              <div><b>Errores:</b> {normalizedErrors.length}</div>
              <div><b>Duplicados CSV:</b> {result?.duplicatesCSV?.length ?? 0}</div>
              <div><b>Duplicados BD:</b> {result?.duplicatesDB?.length ?? 0}</div>
            </div>

            {normalizedErrors.length > 0 && (
              <>
                <div className="errors-header">
                  <h3>Errores detectados</h3>
                  <button
                    type="button"
                    className="btn-download"
                    onClick={downloadErrorsCSV}
                  >
                    Descargar CSV de errores
                  </button>
                </div>

                <div className="table-wrap">
                  <table className="errors-table">
                    <thead>
                      <tr>
                        <th>Fila</th>
                        <th>Documento</th>
                        <th>Campo problemático</th>
                        <th>Error</th>
                      </tr>
                    </thead>
                    <tbody>
                      {normalizedErrors.map((e, i) => (
                        <tr key={`${e.row}-${i}`}>
                          <td data-label="Fila">{e.row}</td>
                          <td data-label="Documento">{e.document || "-"}</td>
                          <td data-label="Campo problemático">{e.field || "-"}</td>
                          <td data-label="Error">{e.message}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}
      </form>
    </div>
  );
}
