// Directiva v-reveal: anima la entrada de un elemento cuando aparece en pantalla.
//
// Uso:
//   v-reveal            → entra desde abajo (por defecto)
//   v-reveal:down       → entra desde arriba
//   v-reveal:left       → entra desde la izquierda
//   v-reveal:right      → entra desde la derecha
//   v-reveal:up="150"   → con retraso de 150ms (para escalonar, ej. en grillas)
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('reveal', {
    mounted(el: HTMLElement, binding) {
      const dir = (binding.arg as string) || 'up';
      el.classList.add('reveal', `reveal-${dir}`);

      const delay = Number(binding.value) || 0;
      if (delay) el.style.transitionDelay = `${delay}ms`;

      // Si el navegador no soporta IntersectionObserver, mostramos sin animar.
      if (typeof IntersectionObserver === 'undefined') {
        el.classList.add('is-visible');
        return;
      }

      const io = new IntersectionObserver(
        (entries, obs) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              obs.unobserve(entry.target); // se anima una sola vez
            }
          }
        },
        { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
      );
      io.observe(el);
      (el as any)._revealIO = io;
    },
    unmounted(el: HTMLElement) {
      (el as any)._revealIO?.disconnect();
    },
  });
});
