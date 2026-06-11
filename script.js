const revealNodes = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15,
  }
);

revealNodes.forEach((node) => revealObserver.observe(node));

const counterNodes = document.querySelectorAll('.stat[data-count]');

const animateCounter = (node) => {
  const target = Number(node.dataset.count);
  const suffix = node.dataset.suffix ?? '';
  const isDecimal = String(target).includes('.');
  const duration = 1400;
  const startTime = performance.now();

  const tick = (time) => {
    const elapsed = Math.min(time - startTime, duration);
    const progress = elapsed / duration;
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = target * eased;

    const renderedValue = isDecimal ? value.toFixed(1) : Math.round(value).toLocaleString('en-IN');
    node.textContent = `${renderedValue}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(tick);
      return;
    }

    const finalValue = isDecimal ? target.toFixed(1) : target.toLocaleString('en-IN');
    node.textContent = `${finalValue}${suffix}`;
  };

  requestAnimationFrame(tick);
};

const statObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        statObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

counterNodes.forEach((node) => statObserver.observe(node));
