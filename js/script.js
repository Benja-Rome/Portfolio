document.addEventListener("DOMContentLoaded", () => {
	// ==========================================
	// 1. CONTROL DE Z-INDEX INTELIGENTE (SIN ESCALA INFINITA)
	// ==========================================
	const windows = Array.from(document.querySelectorAll(".window"));

	// Inicializamos cada ventana con un z-index base si no lo tienen
	windows.forEach((w, index) => {
		if (!w.style.zIndex) w.style.zIndex = index + 1;
	});

	windows.forEach((windowEl) => {
		windowEl.addEventListener("mousedown", () => {
			// 1. Buscamos el z-index más alto actual en la pantalla
			let maxZ = 0;
			windows.forEach((w) => {
				const currentZ = parseInt(w.style.zIndex) || 1;
				if (currentZ > maxZ) maxZ = currentZ;
			});

			// 2. Si esta ventana ya es la que está arriba de todo, salimos de la función
			if (parseInt(windowEl.style.zIndex) === maxZ && maxZ > 0) return;

			// 3. Si no, la ponemos un paso por encima del máximo actual
			const nextZ = maxZ + 1;
			windowEl.style.zIndex = nextZ;

			// 4. CONTROL DE SEGURIDAD: Si el número sube mucho, normalizamos el mazo
			if (nextZ > 100) {
				// Ordenamos el array de ventanas según su z-index actual de menor a mayor
				windows.sort(
					(a, b) =>
						(parseInt(a.style.zIndex) || 1) - (parseInt(b.style.zIndex) || 1),
				);
				// Reasignamos valores limpios empezando desde 1, manteniendo el orden intacto
				windows.forEach((w, index) => {
					w.style.zIndex = index + 1;
				});
			}
		});
	});

	// ==========================================
	// 2. FUNCIÓN PARA EL ARRASTRE (DRAG & DROP)
	// ==========================================
	const titleBars = document.querySelectorAll(".title-bar");

	titleBars.forEach((titleBar) => {
		const windowEl = titleBar.closest(".window");
		if (!windowEl) return;

		titleBar.style.cursor = "move";

		titleBar.addEventListener("mousedown", (e) => {
			if (e.target.closest(".title-bar-controls")) return;

			e.preventDefault();

			// NOTA: Borramos las líneas viejas de zIndex fijas (z=1 / z=10)
			// de aquí adentro porque la Sección 1 ya se encarga de todo el z-index.

			const currentWidth = windowEl.offsetWidth;
			windowEl.style.width = currentWidth + "px";

			const rect = windowEl.getBoundingClientRect();
			const shiftX = e.clientX - rect.left;
			const shiftY = e.clientY - rect.top;

			windowEl.style.position = "absolute";
			windowEl.style.margin = "0";

			function moveAt(clientX, clientY) {
				windowEl.style.left = clientX - shiftX + "px";
				windowEl.style.top = clientY - shiftY + "px";
			}

			moveAt(e.clientX, e.clientY);

			function onMouseMove(event) {
				moveAt(event.clientX, event.clientY);
			}

			document.addEventListener("mousemove", onMouseMove);

			document.addEventListener(
				"mouseup",
				() => {
					document.removeEventListener("mousemove", onMouseMove);
				},
				{ once: true },
			);
		});
	});

	// ==========================================
	// 3. CÓDIGO DE LAS PESTAÑAS (TABS)
	// ==========================================
	const tabs = document.querySelectorAll('[role="tab"]');
	const panels = document.querySelectorAll('[role="tabpanel"]');

	tabs.forEach((tab) => {
		tab.addEventListener("click", (event) => {
			event.preventDefault();
			tabs.forEach((t) => t.setAttribute("aria-selected", "false"));
			tab.setAttribute("aria-selected", "true");
			panels.forEach((panel) => (panel.style.display = "none"));

			const targetPanelId = tab.getAttribute("aria-controls");
			const targetPanel = document.getElementById(targetPanelId);
			if (targetPanel) {
				targetPanel.style.display = "block";
			}
		});
	});
});
