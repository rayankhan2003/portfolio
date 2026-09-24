const DURATION = 800;
/** the moment the screen is fully dark — swap the theme then */
const SWAP_AT = 0.42 * DURATION;

/**
 * Run `apply` behind a CRT power-cycle animation. Falls straight through to
 * `apply` for reduced-motion visitors.
 */
export function crtSwitch(apply: () => void) {
  if (
    typeof window === "undefined" ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    document.querySelector(".crt-cycle")
  ) {
    apply();
    return;
  }
  const el = document.createElement("div");
  el.className = "crt-cycle";
  el.setAttribute("aria-hidden", "true");
  el.appendChild(document.createElement("span"));
  document.body.appendChild(el);
  window.setTimeout(apply, SWAP_AT);
  window.setTimeout(() => el.remove(), DURATION + 50);
}
