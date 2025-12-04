import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import "./clinicalNotes.css";

export default function ClinicalNotes({ value, onChange }) {
  return (
    <div className="notes-editor-wrapper" style={{ gridColumn: "1 / -1" }}> 
      <label>Notas clínicas</label>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        style={{ background: "white" }}
      />
    </div>
  );
}