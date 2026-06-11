document.addEventListener("DOMContentLoaded", () => {
	// Breakpoint de diseño móvil: 768px (equivalente a 48rem)
	const MOBILE_BREAKPOINT = 768;

	const windows = Array.from(document.querySelectorAll(".window"));

	// ==========================================
	// GESTOR DINÁMICO DE ESTADO DE BOTONES
	// ==========================================
	function updateButtonStates(windowEl) {
		const minimizeBtn = windowEl.querySelector(
			'button[aria-label="Minimize"]',
		);
		const maximizeBtn = windowEl.querySelector(
			'button[aria-label="Maximize"]',
		);

		if (windowEl.classList.contains("minimized")) {
			// Si está minimizado: se bloquea minimizar y se activa maximizar (que actuará como restaurar)
			if (minimizeBtn) minimizeBtn.disabled = true;
			if (maximizeBtn) maximizeBtn.disabled = false;
		} else {
			// Estado normal: se activa minimizar y maximizar se bloquea (porque no se puede maximizar en serio)
			if (minimizeBtn) minimizeBtn.disabled = false;
			if (maximizeBtn) maximizeBtn.disabled = true;
		}
	}

	// Inicializa los botones al cargar la página
	windows.forEach((windowEl) => updateButtonStates(windowEl));

	// ==========================================
	// 1. CONTROL DE Z-INDEX INTELIGENTE
	// ==========================================
	windows.forEach((w, index) => {
		if (!w.style.zIndex) w.style.zIndex = index + 1;
	});

	windows.forEach((windowEl) => {
		windowEl.addEventListener("mousedown", () => {
			if (window.innerWidth < MOBILE_BREAKPOINT) return;

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
			if (window.innerWidth < MOBILE_BREAKPOINT) return;

			e.preventDefault();

			const rect = windowEl.getBoundingClientRect();
			const shiftX = e.clientX - rect.left;
			const shiftY = e.clientY - rect.top;

			windowEl.style.position = "absolute";
			windowEl.style.margin = "0";

			function moveAt(clientX, clientY) {
				// 1. Calculate the intended placement coordinates
				let newX = clientX - shiftX;
				let newY = clientY - shiftY;

				const taskbarHeightPx = window.innerHeight * 0.04;

				// 2. Determine maximum bounds based on real-time dimensions
				const maxX = window.innerWidth - windowEl.offsetWidth;
				const maxY =
					window.innerHeight -
					windowEl.offsetHeight -
					taskbarHeightPx;

				// 3. Clamp X coordinates (Left and Right screen limits)
				if (newX < 0) newX = 0;
				if (newX > maxX) newX = maxX;

				// 4. Clamp Y coordinates (Top and Bottom screen limits)
				if (newY < 0) newY = 0;
				if (newY > maxY) newY = maxY;

				// 5. Safely apply the restricted values
				windowEl.style.left = newX + "px";
				windowEl.style.top = newY + "px";
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
	// 3. ACCIONES EXCLUSIVAS DE MINIMIZAR Y RESTAURAR
	// ==========================================
	windows.forEach((windowEl) => {
		const minimizeBtn = windowEl.querySelector(
			'button[aria-label="Minimize"]',
		);
		const maximizeBtn = windowEl.querySelector(
			'button[aria-label="Maximize"]',
		);
		const closeBtn = windowEl.querySelector('button[aria-label="Close"]');

		if (minimizeBtn) {
			minimizeBtn.addEventListener("click", (e) => {
				e.stopPropagation();
				if (window.innerWidth < MOBILE_BREAKPOINT) return;
				if (windowEl.classList.contains("minimized")) return;

				windowEl.classList.add("minimized");
				updateButtonStates(windowEl);
			});
		}

		if (maximizeBtn) {
			maximizeBtn.addEventListener("click", (e) => {
				e.stopPropagation();
				if (window.innerWidth < MOBILE_BREAKPOINT) return;

				// El botón de maximizar ahora solo responde si la ventana está minimizada (actúa como Restaurar)
				if (windowEl.classList.contains("minimized")) {
					windowEl.classList.remove("minimized");
					updateButtonStates(windowEl);
				}
			});
		}

		if (closeBtn) {
			closeBtn.addEventListener("click", (e) => {
				e.stopPropagation();
				windowEl.style.display = "none";
			});
		}
	});

	// ==========================================
	// 4. CONTROL DEL BOTÓN DE INICIO
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
});
