for (const strip of document.querySelectorAll("[data-strip]")) {
	const track = strip.querySelector(".strip__track");
	const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
	const step = (dir) => track.scrollBy({ left: dir * track.clientWidth * 0.9, behavior: still ? "auto" : "smooth" });
	strip.querySelector("[data-strip-prev]").addEventListener("click", () => step(-1));
	strip.querySelector("[data-strip-next]").addEventListener("click", () => step(1));
}
