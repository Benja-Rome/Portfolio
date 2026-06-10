document.addEventListener("DOMContentLoaded", () => {
	// ==========================================
	// 1. CONTROL DE Z-INDEX INTELIGENTE
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

			// Si la ventana está maximizada o minimizada, bloquear el arrastre para evitar bugs visuales
			if (
				windowEl.classList.contains("maximized") ||
				windowEl.classList.contains("minimized")
			)
				return;

			e.preventDefault();

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
	// 3. ACCIONES EXCLUSIVAS DE MINIMIZAR Y MAXIMIZAR
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
				windowEl.classList.remove("maximized"); // Quita maximizar si existía
				windowEl.classList.toggle("minimized");
			});
		}

		if (maximizeBtn) {
			maximizeBtn.addEventListener("click", (e) => {
				e.stopPropagation();
				windowEl.classList.remove("minimized"); // Quita minimizar si existía
				windowEl.classList.toggle("maximized");
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
