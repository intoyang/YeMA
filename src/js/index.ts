/* ============================================================
   Featured carousel — stacked cards with:
   - Drag to swipe (pointer events)
   - Left/right buttons
   - Keyboard arrow keys
   - Spring-back for under-threshold drags
   ============================================================ */

interface Card {
  el: HTMLElement;
  index: number;
}

const THRESHOLD = 0.3; // 30% of card width
const STACK_OFFSET_X = 12; // px per layer behind
const STACK_OFFSET_Y = 12;
const STACK_SCALE = 0.04; // per layer (1.0 - 0.04 - 0.08...)
const STACK_ROTATE = [0, -1.5, 2]; // rotation per layer (subtle)

function initFeaturedCarousel() {
  const stack = document.getElementById("featured-stack");
  if (!stack) return;

  const cards: Card[] = Array.from(
    stack.querySelectorAll<HTMLElement>(".featured-card")
  ).map((el, i) => ({ el, index: i }));

  if (cards.length === 0) return;

  let current = 0;
  let dragging = false;
  let startX = 0;
  let dx = 0;
  let activePointer: number | null = null;

  function layout(animate: boolean = true) {
    cards.forEach((card) => {
      const rel = (card.index - current + cards.length) % cards.length;
      const el = card.el;

      if (!animate) {
        el.style.transition = "none";
        requestAnimationFrame(() => {
          el.style.transition = "";
        });
      }

      if (rel === 0) {
        el.style.transform = "translate3d(0,0,0) scale(1) rotate(0deg)";
        el.style.opacity = "1";
        el.style.zIndex = "100";
        el.style.cursor = "grab";
        el.style.pointerEvents = "auto";
      } else if (rel <= 2) {
        const offX = STACK_OFFSET_X * rel;
        const offY = STACK_OFFSET_Y * rel;
        const scale = 1 - STACK_SCALE * rel * 2;
        const rot = STACK_ROTATE[rel] ?? 0;
        el.style.transform = `translate3d(${offX}px, ${offY}px, 0) scale(${scale}) rotate(${rot}deg)`;
        el.style.opacity = String(Math.max(0.3, 1 - 0.3 * rel));
        el.style.zIndex = String(100 - rel);
        el.style.cursor = "";
        el.style.pointerEvents = "none";
      } else {
        // Hide fully for >2
        el.style.transform = `translate3d(${STACK_OFFSET_X * 2}px, ${STACK_OFFSET_Y * 2}px, 0) scale(0.9)`;
        el.style.opacity = "0";
        el.style.zIndex = "0";
        el.style.pointerEvents = "none";
      }
    });
  }

  function next() {
    current = (current + 1) % cards.length;
    layout();
  }

  function prev() {
    current = (current - 1 + cards.length) % cards.length;
    layout();
  }

  // Drag handling on current card
  function onPointerDown(e: PointerEvent) {
    if (e.button !== 0) return; // left mouse only
    const target = e.target as HTMLElement;
    // Only start drag on current card, not on the link inside
    const card = target.closest<HTMLElement>(".featured-card");
    if (!card) return;
    const rel = (parseInt(card.dataset.index!, 10) - current + cards.length) % cards.length;
    if (rel !== 0) return;

    // Don't start drag if clicked on the CTA link
    if (target.closest("a")) return;

    dragging = true;
    activePointer = e.pointerId;
    startX = e.clientX;
    dx = 0;
    card.classList.add("is-dragging");
    card.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: PointerEvent) {
    if (!dragging || e.pointerId !== activePointer) return;
    dx = e.clientX - startX;
    const current_el = cards[current].el;
    const rot = dx * 0.03;
    current_el.style.transform = `translate3d(${dx}px, 0, 0) rotate(${rot}deg)`;
    current_el.style.opacity = String(Math.max(0.4, 1 - Math.abs(dx) / 800));
  }

  function onPointerUp(e: PointerEvent) {
    if (!dragging || e.pointerId !== activePointer) return;
    const current_el = cards[current].el;
    current_el.classList.remove("is-dragging");
    if (current_el.hasPointerCapture(e.pointerId)) {
      current_el.releasePointerCapture(e.pointerId);
    }
    dragging = false;
    activePointer = null;

    const width = current_el.offsetWidth;
    const passed = Math.abs(dx) / width > THRESHOLD;
    if (passed) {
      if (dx < 0) next();
      else prev();
    } else {
      // spring back
      layout(true);
    }
    dx = 0;
  }

  stack.addEventListener("pointerdown", onPointerDown);
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);
  window.addEventListener("pointercancel", onPointerUp);

  // Arrow buttons
  document
    .querySelector<HTMLButtonElement>("[data-featured-prev]")
    ?.addEventListener("click", prev);
  document
    .querySelector<HTMLButtonElement>("[data-featured-next]")
    ?.addEventListener("click", next);

  // Keyboard
  window.addEventListener("keydown", (e) => {
    if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") return;
    if (e.key === "ArrowLeft") prev();
    else if (e.key === "ArrowRight") next();
  });

  // Initial layout
  layout(false);
}

document.addEventListener("DOMContentLoaded", () => {
  initFeaturedCarousel();
});
