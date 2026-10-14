class AgendaController {
  constructor(agendaService) {
    this.agendaService = agendaService;
    this.contactos = [];
    this.filtro = '';
    this.paginaActual = 1;
    this.porPagina = 25;

    this.form = document.getElementById('form-contacto');
    this.inputNombre = document.getElementById('input-nombre');
    this.inputApellido = document.getElementById('input-apellido');
    this.inputTelefono = document.getElementById('input-telefono');
    this.btnGuardar = document.getElementById('btn-guardar');
    this.mensajeEstado = document.getElementById('mensaje-estado');

    this.inputBuscar = document.getElementById('input-buscar');
    this.btnRecargar = document.getElementById('btn-recargar');
    this.cuerpoTabla = document.getElementById('cuerpo-tabla');
    this.cargando = document.getElementById('cargando');
    this.mensajeVacio = document.getElementById('mensaje-vacio');
    this.contador = document.getElementById('contador-contactos');

    this.btnAnt = document.getElementById('btn-ant');
    this.btnSig = document.getElementById('btn-sig');
    this.infoPagina = document.getElementById('info-pagina');
  }

  async init() {
    this.registrarEventos();
    await this.cargarContactos();
  }

  registrarEventos() {
    this.form.addEventListener('submit', (e) => this.guardar(e));

    this.inputBuscar.addEventListener('input', (e) => {
      this.filtro = e.target.value.trim().toLowerCase();
      this.paginaActual = 1;
      this.renderizar();
    });

    this.btnRecargar.addEventListener('click', () => {
      this.cargarContactos();
    });

    this.btnAnt.addEventListener('click', () => {
      if (this.paginaActual > 1) {
        this.paginaActual--;
        this.renderizar();
      }
    });

    this.btnSig.addEventListener('click', () => {
      const totalPaginas = this.obtenerTotalPaginas();
      if (this.paginaActual < totalPaginas) {
        this.paginaActual++;
        this.renderizar();
      }
    });
  }

  async cargarContactos() {
    this.mostrarCargando(true);
    this.mensajeVacio.classList.add('oculto');

    try {
      const datos = await this.agendaService.obtenerContactos();
      this.contactos = datos.reverse();
      this.paginaActual = 1;
      this.renderizar();
    } catch (error) {
      console.error(error);
      this.mostrarMensaje('No se pudieron cargar los contactos del servidor.', 'error');
    } finally {
      this.mostrarCargando(false);
    }
  }

  async guardar(e) {
    e.preventDefault();

    const nombre = this.inputNombre.value;
    const apellido = this.inputApellido.value;
    const telefono = this.inputTelefono.value;

    const nuevoContacto = new Contacto(nombre, apellido, telefono);
    if (!nuevoContacto.validar()) {
      this.mostrarMensaje('Por favor, completa todos los campos requeridos.', 'error');
      return;
    }

    this.btnGuardar.disabled = true;
    this.btnGuardar.textContent = 'Guardando...';

    try {
      const respuesta = await this.agendaService.guardarContacto(nuevoContacto);

      if (respuesta && (respuesta.exito === true || respuesta.exito === 'true')) {
        this.mostrarMensaje('Contacto guardado con éxito.', 'exito');
        this.form.reset();

        this.contactos.unshift(nuevoContacto);
        this.paginaActual = 1;
        this.renderizar();
      } else {
        this.mostrarMensaje('El servidor no pudo procesar el contacto.', 'error');
      }
    } catch (error) {
      console.error(error);
      this.mostrarMensaje('Error de conexión al guardar el contacto.', 'error');
    } finally {
      this.btnGuardar.disabled = false;
      this.btnGuardar.textContent = 'Guardar Contacto';
    }
  }

  obtenerContactosFiltrados() {
    if (!this.filtro) {
      return this.contactos;
    }

    return this.contactos.filter(c => {
      const n = (c.nombre || '').toLowerCase();
      const a = (c.apellido || '').toLowerCase();
      const t = (c.telefono || '').toLowerCase();
      return n.includes(this.filtro) || a.includes(this.filtro) || t.includes(this.filtro);
    });
  }

  obtenerTotalPaginas() {
    const totalItems = this.obtenerContactosFiltrados().length;
    return Math.max(1, Math.ceil(totalItems / this.porPagina));
  }

  renderizar() {
    const filtrados = this.obtenerContactosFiltrados();
    const total = filtrados.length;
    const totalPaginas = this.obtenerTotalPaginas();

    if (this.paginaActual > totalPaginas) {
      this.paginaActual = totalPaginas;
    }

    this.contador.textContent = `${this.contactos.length} contactos`;

    if (total === 0) {
      this.cuerpoTabla.innerHTML = '';
      this.mensajeVacio.classList.remove('oculto');
      this.infoPagina.textContent = 'Página 0 de 0';
      this.btnAnt.disabled = true;
      this.btnSig.disabled = true;
      return;
    }

    this.mensajeVacio.classList.add('oculto');

    const inicio = (this.paginaActual - 1) * this.porPagina;
    const fin = inicio + this.porPagina;
    const paginaContactos = filtrados.slice(inicio, fin);

    let html = '';
    paginaContactos.forEach(contacto => {
      html += `
        <tr>
          <td>${this.escaparHTML(contacto.nombre || '-')}</td>
          <td>${this.escaparHTML(contacto.apellido || '-')}</td>
          <td><span class="telefono-texto">${this.escaparHTML(contacto.telefono || '-')}</span></td>
        </tr>
      `;
    });

    this.cuerpoTabla.innerHTML = html;

    this.infoPagina.textContent = `Página ${this.paginaActual} de ${totalPaginas}`;
    this.btnAnt.disabled = this.paginaActual <= 1;
    this.btnSig.disabled = this.paginaActual >= totalPaginas;
  }

  mostrarMensaje(texto, tipo) {
    this.mensajeEstado.textContent = texto;
    this.mensajeEstado.className = `mensaje mensaje-${tipo}`;
    this.mensajeEstado.classList.remove('oculto');

    setTimeout(() => {
      this.mensajeEstado.classList.add('oculto');
    }, 4000);
  }

  mostrarCargando(activo) {
    if (activo) {
      this.cargando.classList.remove('oculto');
    } else {
      this.cargando.classList.add('oculto');
    }
  }

  escaparHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = AgendaController;
}
