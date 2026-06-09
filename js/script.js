document.addEventListener("DOMContentLoaded", () => {
	const tabs = document.querySelectorAll('[role="tab"]');
	const panels = document.querySelectorAll('[role="tabpanel"]');

	tabs.forEach((tab) => {
		tab.addEventListener("click", (event) => {
			// Prevent the anchor link from jumping the page
			event.preventDefault();

			// 1. Reset all tabs to unselected
			tabs.forEach((t) => t.setAttribute("aria-selected", "false"));

			// 2. Set the clicked tab as selected
			tab.setAttribute("aria-selected", "true");

			// 3. Hide all content panels
			panels.forEach((panel) => (panel.style.display = "none"));

			// 4. Show the panel linked to the clicked tab
			const targetPanelId = tab.getAttribute("aria-controls");
			const targetPanel = document.getElementById(targetPanelId);
			if (targetPanel) {
				targetPanel.style.display = "block";
			}
		});
	});
});

document.addEventListener("DOMContentLoaded", () => {
	const titleBars = document.querySelectorAll(".title-bar");

	titleBars.forEach((titleBar) => {
		const windowEl = titleBar.closest(".window");
		if (!windowEl) return;

		titleBar.style.cursor = "move";

		titleBar.addEventListener("mousedown", (e) => {
			if (e.target.closest(".title-bar-controls")) return;

			e.preventDefault();

			document
				.querySelectorAll(".window")
				.forEach((w) => (w.style.zIndex = "1"));
			windowEl.style.zIndex = "10";

			// --- ¡ESTO ARREGLA EL ESTIRAMIENTO! ---
			// Guardamos el tamaño exacto actual en píxeles antes de volverla absoluta
			const currentWidth = windowEl.offsetWidth;
			windowEl.style.width = currentWidth;
			// --------------------------------------

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
});
