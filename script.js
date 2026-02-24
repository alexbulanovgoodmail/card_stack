document.addEventListener("DOMContentLoaded", (event) => {
  gsap.registerPlugin(ScrollTrigger);

  const lenis = new Lenis();

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  const cards = document.querySelectorAll(".card");
  const totalCards = cards.length;
  const transitionCount = Math.max(totalCards - 1, 1);
  const segmentSize = 1 / transitionCount;

  const cardOffset = 5;
  const cardScaleStep = 0.075;

  cards.forEach((card, index) => {
    gsap.set(card, {
      xPercent: -50,
      yPercent: -50 + index * cardOffset,
      scale: 1 - index * cardScaleStep,
    });
  });

  ScrollTrigger.create({
    trigger: ".sticky-cards",
    start: "top top",
    end: `+=${window.innerHeight * transitionCount}px`,
    pin: true,
    pinSpacing: true,
    scrub: 1,
    onUpdate: (self) => {
      const progress = self.progress;
      const activeIndex = Math.min(
        Math.floor(progress / segmentSize),
        totalCards - 1,
      );
      const segProgress = (progress - activeIndex * segmentSize) / segmentSize;

      cards.forEach((card, index) => {
        if (index < activeIndex) {
          gsap.to(card, {
            yPercent: -250,
            rotationX: 35,
          });
        } else if (index === activeIndex) {
          if (index === totalCards - 1) {
            gsap.set(card, {
              yPercent: -50,
              rotationX: 0,
              scale: 1,
            });
          } else {
            gsap.to(card, {
              yPercent: gsap.utils.interpolate(-50, -200, segProgress),
              rotationX: gsap.utils.interpolate(0, 35, segProgress),
              scale: 1,
            });
          }
        } else {
          const behindIndex = index - activeIndex;
          const currentYOffset = (behindIndex - segProgress) * cardOffset;
          const currentScale = 1 - (behindIndex - segProgress) * cardScaleStep;

          gsap.set(card, {
            yPercent: -50 + currentYOffset,
            rotationX: 0,
            scale: currentScale,
          });
        }
      });
    },
  });
});
