import {
  component$,
  useSignal,
  useStyles$,
  useVisibleTask$,
} from "@builder.io/qwik";
import theProblemCss from "./the-problem.css?inline";

const PROBLEM_CARDS = [
  {
    title: "Hidden consequences",
    description:
      "A specification change, supplier switch, or funding decision can shift costs and risks across the enterprise. Those consequences may remain invisible when the decision is approved.",
  },
  {
    title: "Mistimed reviews",
    description:
      "Settled decisions reopen without new evidence. Material changes wait for the next committee. Both create rework, delay execution, and narrow the options available.",
  },
] as const;

const OUTCOMES = [
  "See the full impact.",
  "Respond to material evidence.",
  "Protect execution.",
] as const;

export const TheProblem = component$(() => {
  useStyles$(theProblemCss);
  const sectionRef = useSignal<HTMLElement>();

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(
    async ({ cleanup }) => {
      const section = sectionRef.value;
      if (!section) return;

      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      gsap.registerPlugin(ScrollTrigger);

      const stage = section.querySelector<HTMLElement>("[data-problem-stage]");
      const background = section.querySelector<HTMLElement>(
        "[data-problem-background]",
      );
      const headerTargets = Array.from(
        section.querySelectorAll<HTMLElement>("[data-problem-header-reveal]"),
      );
      const cards = Array.from(
        section.querySelectorAll<HTMLElement>("[data-problem-card]"),
      );
      const outcomes = section.querySelector<HTMLElement>(
        "[data-problem-outcomes]",
      );

      if (
        !stage ||
        !background ||
        headerTargets.length !== 2 ||
        cards.length !== 2 ||
        !outcomes
      )
        return;

      const media = gsap.matchMedia();
      const designWidth = () => Math.min(stage.clientWidth, 1440);

      media.add(
        "(min-width: 70rem) and (prefers-reduced-motion: no-preference)",
        () => {
          gsap.set(headerTargets, { y: 28, autoAlpha: 0 });
          gsap.set(background, {
            x: () => designWidth() * (-718.079 / 1440),
            y: () => designWidth() * (-211.88 / 1440),
            scale: 1.20467,
            transformOrigin: "0 0",
          });
          gsap.set(cards[0], {
            x: () => designWidth() * (1124 / 1440),
            height: 256,
          });
          gsap.set(cards[1], {
            x: () => designWidth() * (2238 / 1440),
            y: 0,
            height: 256,
          });
          gsap.set(outcomes, { y: 472, autoAlpha: 0 });

          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => `+=${Math.max(innerHeight * 0.6, 420)}`,
              pin: section,
              pinSpacing: true,
              anticipatePin: 1,
              scrub: 0.85,
              invalidateOnRefresh: true,
            },
          });

          timeline
            .to(
              headerTargets,
              {
                y: 0,
                autoAlpha: 1,
                duration: 0.12,
                stagger: 0.03,
                ease: "power3.out",
              },
              0,
            )
            .to(
              background,
              {
                x: 0,
                y: 0,
                scale: 1,
                duration: 0.3,
                ease: "power2.inOut",
              },
              0.24,
            )
            .to(cards[0], { x: 0, duration: 0.25, ease: "power3.out" }, 0.25)
            .to(cards[1], { x: 0, duration: 0.25, ease: "power3.out" }, 0.34)
            .to(
              background,
              {
                x: () => designWidth() * (346 / 1440),
                duration: 0.3,
                ease: "power2.inOut",
              },
              0.66,
            )
            .to(
              cards,
              { height: 280, duration: 0.28, ease: "power2.inOut" },
              0.66,
            )
            .to(cards[1], { y: 24, duration: 0.28, ease: "power2.inOut" }, 0.66)
            .to(
              outcomes,
              { y: 0, autoAlpha: 1, duration: 0.28, ease: "power3.out" },
              0.7,
            );

          return () => {
            timeline.scrollTrigger?.kill();
            timeline.kill();
            gsap.set([background, ...headerTargets, ...cards, outcomes], {
              clearProps: "transform,width,height,opacity,visibility",
            });
          };
        },
      );

      media.add(
        "(max-width: 69.999rem) and (prefers-reduced-motion: no-preference)",
        () => {
          gsap.set(headerTargets, { y: 24, autoAlpha: 0 });
          gsap.set(background, {
            xPercent: -16,
            yPercent: -5,
            scale: 1.18,
            transformOrigin: "50% 50%",
          });
          gsap.set(cards, {
            x: () =>
              innerWidth + Math.max(...cards.map((card) => card.offsetWidth)),
            autoAlpha: 1,
          });
          gsap.set(outcomes, { y: () => innerHeight * 0.55, autoAlpha: 0 });

          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => `+=${Math.max(innerHeight * 0.6, 420)}`,
              pin: section,
              pinSpacing: true,
              anticipatePin: 1,
              scrub: 0.75,
              invalidateOnRefresh: true,
            },
          });

          timeline
            .to(
              headerTargets,
              {
                y: 0,
                autoAlpha: 1,
                duration: 0.12,
                stagger: 0.03,
                ease: "power3.out",
              },
              0,
            )
            .to(
              background,
              {
                xPercent: -5,
                yPercent: 0,
                scale: 1.08,
                duration: 0.3,
                ease: "power2.inOut",
              },
              0.24,
            )
            .to(cards[0], { x: 0, duration: 0.24, ease: "power3.out" }, 0.25)
            .to(cards[1], { x: 0, duration: 0.24, ease: "power3.out" }, 0.34)
            .to(
              cards,
              {
                y: () => -innerHeight * 0.22,
                autoAlpha: 0,
                duration: 0.28,
                ease: "power2.inOut",
              },
              0.66,
            )
            .to(
              background,
              {
                xPercent: 8,
                scale: 1.12,
                duration: 0.3,
                ease: "power2.inOut",
              },
              0.66,
            )
            .to(
              outcomes,
              { y: 0, autoAlpha: 1, duration: 0.28, ease: "power3.out" },
              0.7,
            );

          return () => {
            timeline.scrollTrigger?.kill();
            timeline.kill();
            gsap.set([background, ...headerTargets, ...cards, outcomes], {
              clearProps: "transform,opacity,visibility",
            });
          };
        },
      );

      cleanup(() => media.revert());
    },
    { strategy: "document-ready" },
  );

  return (
    <section
      ref={sectionRef}
      class="the-problem"
      id="the-problem"
      aria-labelledby="the-problem-title"
      data-problem
    >
      <div class="the-problem__sticky">
        <div class="the-problem__stage" data-problem-stage>
          <div
            class="the-problem__background"
            data-problem-background
            aria-hidden="true"
          >
            <img
              class="the-problem__background-image"
              src="/assets/images/problem-background.png"
              alt=""
              width="4096"
              height="2305"
              decoding="async"
            />
          </div>

          <header class="the-problem__header">
            <p class="the-problem__eyebrow" data-problem-header-reveal>
              The problem
            </p>
            <h2
              class="the-problem__title"
              id="the-problem-title"
              data-problem-header-reveal
            >
              <span class="the-problem__title-muted">
                Decisions sit within functions.
              </span>
              <span>Their consequences span</span>
              <span>the enterprise.</span>
            </h2>
          </header>

          <div class="the-problem__cards">
            {PROBLEM_CARDS.map((card) => (
              <article
                class="the-problem__card"
                data-problem-card
                key={card.title}
              >
                <span class="the-problem__card-icon" aria-hidden="true">
                  <img
                    src="/assets/icons/problem-card-icon.svg"
                    alt=""
                    width="24"
                    height="19"
                  />
                </span>
                <div class="the-problem__card-copy">
                  <h3 class="the-problem__card-title">{card.title}</h3>
                  <p class="the-problem__card-description">
                    {card.description}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <ul class="the-problem__outcomes" data-problem-outcomes>
            {OUTCOMES.map((outcome) => (
              <li class="the-problem__outcome" key={outcome}>
                <img
                  class="the-problem__divider"
                  src="/assets/icons/problem-divider.svg"
                  alt=""
                  width="278"
                  height="1"
                  loading="lazy"
                  decoding="async"
                />
                <p>{outcome}</p>
              </li>
            ))}
            <li class="the-problem__outcomes-end" aria-hidden="true">
              <img
                class="the-problem__divider"
                src="/assets/icons/problem-divider.svg"
                alt=""
                width="278"
                height="1"
                loading="lazy"
                decoding="async"
              />
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
});
