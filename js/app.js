document.addEventListener('DOMContentLoaded', () => {
  const agendaService = new AgendaService();
  const agendaController = new AgendaController(agendaService);
  agendaController.init();
});
