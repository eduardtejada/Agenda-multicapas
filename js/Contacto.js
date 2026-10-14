class Contacto {
  constructor(nombre = '', apellido = '', telefono = '') {
    this.nombre = (nombre || '').trim();
    this.apellido = (apellido || '').trim();
    this.telefono = (telefono || '').trim();
  }

  validar() {
    return this.nombre.length > 0 && this.apellido.length > 0 && this.telefono.length > 0;
  }

  toJSON() {
    return {
      nombre: this.nombre,
      apellido: this.apellido,
      telefono: this.telefono
    };
  }

  static desdeObjeto(obj) {
    if (!obj) return new Contacto();
    return new Contacto(obj.nombre, obj.apellido, obj.telefono);
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Contacto;
}
