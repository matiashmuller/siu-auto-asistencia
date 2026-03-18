(function () {

  // TOGGLE (abrir / cerrar desde el icono)
  let existing = document.getElementById("asistencia-panel");
  if (existing) {
    existing.remove();
    return;
  }

  const panel = document.createElement("div");
  panel.id = "asistencia-panel";

  panel.innerHTML = `
    <div id="asistencia-header">
      <h3>Asistencia PRO</h3>
      <button id="cerrar">✕</button>
    </div>

    <textarea id="inputDnis" placeholder="Pegá los DNIs..."></textarea>

    <button class="btn-main" id="marcar">Marcar asistencia</button>
    <button class="btn-clear" id="limpiar">Limpiar</button>

    <div id="preview"></div>
  `;

  document.body.appendChild(panel);

  const textarea = document.getElementById("inputDnis");
  const preview = document.getElementById("preview");

  // Cerrar panel
  document.getElementById("cerrar").onclick = () => panel.remove();

  // Persistencia
  chrome.storage.local.get(["dnis"], (res) => {
    if (res.dnis) textarea.value = res.dnis;
    actualizarPreview();
  });

  textarea.addEventListener("input", () => {
    chrome.storage.local.set({ dnis: textarea.value });
    actualizarPreview();
  });

  function limpiarInput(texto) {
    return (texto.match(/\d+/g) || []).map(d => d.replace(/\D/g, ""));
  }

  function actualizarPreview() {
    const lista = limpiarInput(textarea.value);
    preview.innerHTML = `Detectados: ${lista.length}`;
  }

  // Limpiar
  document.getElementById("limpiar").onclick = () => {
    textarea.value = "";
    chrome.storage.local.clear();
    actualizarPreview();
  };

  // Marcar asistencia
  document.getElementById("marcar").onclick = () => {

    let dnis = limpiarInput(textarea.value);
    if (!dnis.length) {
      alert("No hay DNIs válidos");
      return;
    }

    let dniSet = new Set(dnis);
    let noEncontrados = new Set(dniSet);
    let marcados = 0;

    let alumnos = document.querySelectorAll(".box-asistencia");

    alumnos.forEach(alumno => {
      try {
        let nodoDni = alumno.querySelector('.info.pull-right div:not(.truncate)');
        if (!nodoDni) return;

        let dni = nodoDni.textContent.replace(/\D/g, '');

        if (dniSet.has(dni)) {
          noEncontrados.delete(dni);

          if (alumno.classList.contains("ausente")) {
            alumno.click();
            marcados++;

            alumno.style.outline = "3px solid #00c853";
            alumno.style.backgroundColor = "#e8f5e9";
          }
        }

      } catch (e) {
        console.warn("Error:", e);
      }
    });

    alert(`✔ Marcados: ${marcados}\n❌ No encontrados: ${noEncontrados.size}`);
  };

})();