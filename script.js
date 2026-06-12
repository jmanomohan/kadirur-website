const setupLazyMediaLoading = () => {
  const imageNodes = document.querySelectorAll('img');

  imageNodes.forEach((imageNode) => {
    if (!imageNode.hasAttribute('loading')) {
      imageNode.setAttribute('loading', 'lazy');
    }

    if (!imageNode.hasAttribute('decoding')) {
      imageNode.setAttribute('decoding', 'async');
    }

    if (!imageNode.hasAttribute('fetchpriority')) {
      imageNode.setAttribute('fetchpriority', 'low');
    }
  });

  const iframeNodes = document.querySelectorAll('iframe');

  iframeNodes.forEach((iframeNode) => {
    if (!iframeNode.hasAttribute('loading')) {
      iframeNode.setAttribute('loading', 'lazy');
    }
  });
};

setupLazyMediaLoading();

const revealNodes = document.querySelectorAll('.reveal');

const showAllRevealNodes = () => {
  revealNodes.forEach((node) => node.classList.add('visible'));
};

const shouldSkipRevealAnimation =
  !('IntersectionObserver' in window) || window.matchMedia('(max-width: 700px)').matches;

if (revealNodes.length && !shouldSkipRevealAnimation) {
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
      threshold: 0.05,
      rootMargin: '0px 0px -5% 0px',
    }
  );

  revealNodes.forEach((node) => revealObserver.observe(node));
} else {
  showAllRevealNodes();
}

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

if ('IntersectionObserver' in window) {
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
} else {
  counterNodes.forEach((node) => animateCounter(node));
}
