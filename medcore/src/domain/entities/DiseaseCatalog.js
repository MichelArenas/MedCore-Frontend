// src/domain/entities/DiseaseCatalog.js
export class DiseaseCatalog {
  constructor({
    id,
    code,
    name,
    description,
    isActive,
    createdAt,
    updatedAt,
  }) {
    this.id = id;
    this.code = code; // ej. "J00"
    this.name = name; // ej. "Rinitis aguda..."
    this.description = description ?? null;
    this.isActive = isActive ?? true;

    this.createdAt = createdAt ? new Date(createdAt) : null;
    this.updatedAt = updatedAt ? new Date(updatedAt) : null;
  }
}
