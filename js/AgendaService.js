class AgendaService {
  constructor() {
    const esHttps = typeof window !== 'undefined' && window.location && window.location.protocol === 'https:';
    this.apiUrl = esHttps
      ? 'https://www.raydelto.org/agenda.php'
      : 'http://www.raydelto.org/agenda.php';
  }

  async obtenerContactos() {
    try {
      const respuesta = await fetch(this.apiUrl);
      if (!respuesta.ok) {
        throw new Error('Error al consultar el servidor');
      }
      const datos = await respuesta.json();
      return datos.map(c => Contacto.desdeObjeto(c));
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async guardarContacto(contacto) {
    try {
      const payload = contacto.toJSON ? contacto.toJSON() : contacto;

      const respuesta = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!respuesta.ok) {
        throw new Error('Error al registrar el contacto en el servidor');
      }

      return await respuesta.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = AgendaService;
}
