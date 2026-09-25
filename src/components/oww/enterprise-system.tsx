import {
  component$,
  useSignal,
  useStyles$,
  useVisibleTask$,
} from "@builder.io/qwik";
import enterpriseSystemCss from "./enterprise-system.css?inline";

const DEVELOPMENT_ITEMS = [
  {
    title: "Framework published",
    description:
      "Our decision framework and mathematical supplement set out how we assess commitments, evidence quality, and review timing. Empirical evaluation with an initial client decision class is the next step.",
  },
  {
    title: "Patent applications filed · Evaluation ongoing",
    description:
      "Seven patent applications were filed with the USPTO on 30 June 2026. PwC’s evaluation of the model’s assumptions, internal workings, and associated post-quantum security claims is ongoing. Patent filings do not establish technical effectiveness or customer value.",
  },
  {
    title: "Initial proof deployments",
    description: "The system is entering its first proof deployments.",
  },
] as const;

export const EnterpriseSystem = component$(() => {
  useStyles$(enterpriseSystemCss);
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

      const frame = section.querySelector<HTMLElement>(
        "[data-enterprise-system-frame]",
      );
      const background = section.querySelector<HTMLElement>(
        "[data-enterprise-system-background]",
      );
      const intro = section.querySelector<HTMLElement>(
        "[data-enterprise-system-intro]",
      );
      const introTargets = Array.from(
        section.querySelectorAll<HTMLElement>(
          "[data-enterprise-system-intro-reveal]",
        ),
      );
      const validation = section.querySelector<HTMLElement>(
        "[data-enterprise-system-validation]",
      );
      const validationTargets = Array.from(
        section.querySelectorAll<HTMLElement>(
          "[data-enterprise-system-validation-reveal]",
        ),
      );
      const cards = Array.from(
        section.querySelectorAll<HTMLElement>("[data-enterprise-system-card]"),
      );

      if (
        !frame ||
        !background ||
        !intro ||
        !introTargets.length ||
        !validation ||
        !validationTargets.length ||
        cards.length !== DEVELOPMENT_ITEMS.length
      ) {
        return;
      }

      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const compact = window.matchMedia("(max-width: 47.999rem)").matches;
        const frameInset = compact ? 10 : 16;
        const frameRadius = compact ? 20 : 32;

        gsap.set(frame, {
          clipPath: "inset(0px round 0px)",
        });
        gsap.set(background, {
          xPercent: -50,
          yPercent: -50,
          x: 0,
          y: () => innerHeight * -0.04,
          scale: compact ? 1.72 : 1.65,
          rotation: 0,
          transformOrigin: "50% 50%",
        });
        gsap.set(introTargets, { y: 42, autoAlpha: 0 });
        gsap.set(intro, { autoAlpha: 1, pointerEvents: "none" });
        gsap.set(validationTargets, { y: 34, autoAlpha: 0 });
        gsap.set(validation, { autoAlpha: 1, pointerEvents: "none" });
        gsap.set(cards, {
          y: (index) => (compact ? 220 + index * 90 : [460, 650, 570][index]),
          autoAlpha: 0,
        });

        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${Math.max(innerHeight * 5.6, 3600)}`,
            pin: section,
            pinSpacing: true,
            anticipatePin: 1,
            scrub: 1.35,
            invalidateOnRefresh: true,
            refreshPriority: -20,
          },
        });

        timeline
          .to({}, { duration: 0.35 })
          .to(
            frame,
            {
              clipPath: `inset(${frameInset}px round ${frameRadius}px)`,
              duration: 0.9,
              ease: "power2.inOut",
            },
            0.35,
          )
          .to(
            background,
            {
              x: () => innerWidth * (compact ? -0.02 : -0.017),
              y: () => innerHeight * (compact ? -0.06 : -0.074),
              scale: 1,
              duration: 0.9,
              ease: "power2.inOut",
            },
            0.35,
          )
          .to({}, { duration: 0.28 })
          .set(intro, { pointerEvents: "auto" })
          .to(
            introTargets,
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.72,
              stagger: 0.085,
              ease: "power3.out",
            },
            1.53,
          )
          .to(
            background,
            {
              x: () => innerWidth * (compact ? -0.02 : -0.017),
              y: () => innerHeight * (compact ? -0.06 : -0.074),
              scale: 1,
              rotation: compact ? 5.5 : 9.87,
              duration: 0.9,
              ease: "power2.inOut",
            },
            1.48,
          )
          .to({}, { duration: 0.54 })
          .to(
            introTargets,
            {
              y: -54,
              autoAlpha: 0,
              duration: 0.52,
              stagger: 0.04,
              ease: "power2.inOut",
            },
            2.75,
          )
          .set(intro, { pointerEvents: "none" }, 3.27)
          .to(
            background,
            {
              x: () => innerWidth * (compact ? -0.08 : -0.017),
              y: () => innerHeight * (compact ? -0.1 : -0.074),
              scale: compact ? 1.2 : 1.28,
              rotation: compact ? 10 : 21.03,
              duration: 0.9,
              ease: "power2.inOut",
            },
            2.72,
          )
          .set(validation, { pointerEvents: "auto" }, 3.2)
          .to(
            validationTargets,
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.65,
              stagger: 0.075,
              ease: "power3.out",
            },
            3.22,
          )
          .to({}, { duration: 0.38 })
          .to(
            cards,
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.9,
              stagger: 0.11,
              ease: "power3.out",
            },
            4.25,
          )
          .to(
            background,
            {
              x: () => innerWidth * (compact ? -0.15 : -0.207),
              y: () => innerHeight * (compact ? -0.14 : -0.184),
              scale: compact ? 1.24 : 1.28,
              rotation: compact ? 8 : 15.84,
              duration: 0.9,
              ease: "power2.inOut",
            },
            4.25,
          )
          .to({}, { duration: 0.55 })
          .to({}, { duration: 1.4 });

        return () => {
          timeline.scrollTrigger?.kill();
          timeline.kill();
          gsap.set(
            [
              frame,
              background,
              intro,
              ...introTargets,
              validation,
              ...validationTargets,
              ...cards,
            ],
            {
              clearProps: "transform,opacity,visibility,clipPath,pointerEvents",
            },
          );
        };
      });

      const refreshTimer = window.setTimeout(() => {
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
      }, 180);

      cleanup(() => {
        window.clearTimeout(refreshTimer);
        media.revert();
      });
    },
    { strategy: "document-ready" },
  );

  return (
    <section
      ref={sectionRef}
      class="enterprise-system"
      id="enterprise-system"
      aria-labelledby="enterprise-system-title"
      data-enterprise-system
    >
      <div class="enterprise-system__stage">
        <div class="enterprise-system__frame" data-enterprise-system-frame>
          <img
            class="enterprise-system__background"
            src="/assets/images/enterprise-decision-system-background.png"
            alt=""
            width="1024"
            height="577"
            data-enterprise-system-background
          />

          <div class="enterprise-system__intro" data-enterprise-system-intro>
            <div class="enterprise-system__intro-copy">
              <p
                class="enterprise-system__eyebrow"
                data-enterprise-system-intro-reveal
              >
                Enterprise Decision System™
              </p>
              <h2
                class="enterprise-system__title"
                id="enterprise-system-title"
                data-enterprise-system-intro-reveal
              >
                <span>Keep the evidence connected</span>
                <span>to the decision.</span>
              </h2>
              <div
                class="enterprise-system__description"
                data-enterprise-system-intro-reveal
              >
                <p>
                  As information moves across functions and systems, its
                  meaning, ownership, and supporting evidence can become
                  disconnected.
                </p>
                <p>
                  We are developing the Enterprise Decision System to preserve
                  those connections—so people and AI can work from information
                  whose source, meaning, and decision authority remain
                  traceable.
                </p>
              </div>
            </div>

            <a
              class="enterprise-system__button button button--inverse button--with-icon"
              href="#enterprise-system-validation"
              data-enterprise-system-intro-reveal
            >
              <span class="button__label">Explore the system</span>
              <span class="button__icon" aria-hidden="true">
                <img
                  src="/assets/icons/arrow-circle-dark.svg"
                  alt=""
                  width="38"
                  height="38"
                />
              </span>
            </a>
          </div>

          <div
            class="enterprise-system__validation"
            id="enterprise-system-validation"
            data-enterprise-system-validation
          >
            <header class="enterprise-system__validation-header">
              <p
                class="enterprise-system__validation-eyebrow"
                data-enterprise-system-validation-reveal
              >
                Development and validation
              </p>
              <div class="enterprise-system__validation-meta">
                <p data-enterprise-system-validation-reveal>
                  As of 20 September 2026
                </p>
                <a
                  class="enterprise-system__validation-button button button--inverse button--with-icon"
                  href="#enterprise-system-validation"
                  data-enterprise-system-validation-reveal
                >
                  <span class="button__label">
                    Read the framework and mathematics
                  </span>
                  <span class="button__icon" aria-hidden="true">
                    <img
                      src="/assets/icons/arrow-circle-dark.svg"
                      alt=""
                      width="38"
                      height="38"
                    />
                  </span>
                </a>
              </div>
              <span
                class="enterprise-system__divider"
                aria-hidden="true"
                data-enterprise-system-validation-reveal
              />
            </header>

            <div class="enterprise-system__cards">
              {DEVELOPMENT_ITEMS.map((item) => (
                <article
                  class="enterprise-system__card"
                  key={item.title}
                  data-enterprise-system-card
                >
                  <header class="enterprise-system__card-header">
                    <h3 class="enterprise-system__card-title">{item.title}</h3>
                    <span
                      class="enterprise-system__card-icon"
                      aria-hidden="true"
                    >
                      <img
                        src="/assets/icons/enterprise-system-cube.svg"
                        alt=""
                        width="24"
                        height="19"
                      />
                    </span>
                  </header>
                  <p class="enterprise-system__card-description">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
