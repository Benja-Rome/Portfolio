document.addEventListener("DOMContentLoaded", () => {
	// ==========================================
	// 1. CONTROL DE Z-INDEX INTELIGENTE (SIN ESCALA INFINITA)
	// ==========================================
	const windows = Array.from(document.querySelectorAll(".window"));

	windows.forEach((w, index) => {
		if (!w.style.zIndex) w.style.zIndex = index + 1;
	});

	windows.forEach((windowEl) => {
		windowEl.addEventListener("mousedown", () => {
			let maxZ = 0;
			windows.forEach((w) => {
				const currentZ = parseInt(w.style.zIndex) || 1;
				if (currentZ > maxZ) maxZ = currentZ;
			});

			if (parseInt(windowEl.style.zIndex) === maxZ && maxZ > 0) return;

			const nextZ = maxZ + 1;
			windowEl.style.zIndex = nextZ;

			if (nextZ > 100) {
				windows.sort(
					(a, b) =>
						(parseInt(a.style.zIndex) || 1) -
						(parseInt(b.style.zIndex) || 1),
				);
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

			/* Agregado para impedir el arrastre en entornos móviles y no romper la cuadrícula elástica */
			if (window.innerWidth < 768) return;

			e.preventDefault();

			const rect = windowEl.getBoundingClientRect();
			const shiftX = e.clientX - rect.left;
			const shiftY = e.clientY - rect.top;

			windowEl.style.position = "absolute";
			windowEl.style.margin = "0";

			windowEl.style.right = "auto";
			windowEl.style.bottom = "auto";

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
				/* Modificado de "block" a "flex" para asegurar el estiramiento responsivo interno del panel hundido */
				targetPanel.style.display = "flex";
			}
		});
	});

	// ==========================================
	// 4. CÓDIGO PARA STARTBUTTON
	// ==========================================
	const image = document.getElementById("startButton");

	if (image) {
		image.addEventListener("mousedown", (e) => {
			e.preventDefault();
			image.src = "./img/start-hundido.png";
		});

		image.addEventListener("mouseup", () => {
			image.src = "./img/start.png";
			console.log("Señal: Menú Inicio abierto");
		});

		image.addEventListener("mouseleave", () => {
			image.src = "./img/start.png";
		});
	}

	// ==========================================
	// 4. CÓDIGO PARA MINIMIZAR
	// ==========================================

	document.querySelectorAll(".mini").forEach((button) => {
		button.addEventListener("click", function () {
			// 1. Find the parent window container
			const parentWindow = this.closest(".window");
			if (!parentWindow) return;

			// 2. Find the specific body inside THIS window
			const windowBody = parentWindow.querySelector(".window-body");
			if (!windowBody) return;

			// 3. Toggle the display style of the body
			if (windowBody.style.display === "none") {
				windowBody.style.display = "block";
			} else {
				windowBody.style.display = "none";
			}
		});
	});
});
