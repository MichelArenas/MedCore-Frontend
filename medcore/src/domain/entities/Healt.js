// Entidad de dominio para el endpoint /health
export class Healt {
  constructor({ ok, ts, service, port }) {
    this.ok = ok;
    this.ts = ts;
    this.service = service;
    this.port = port;
  }
}
