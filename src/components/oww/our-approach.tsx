import {
  component$,
  useSignal,
  useStyles$,
  useVisibleTask$,
} from "@builder.io/qwik";
import ourApproachCss from "./our-approach.css?inline";

const DECISION_ITEMS = [
  {
    title: "Evidence gap",
    description:
      "Supplier capacity evidence is out of date. A critical requirement remains unmet.",
  },
  {
    title: "Enterprise exposure",
    description:
      "An unmet critical requirement takes precedence over the overall score.",
  },
  {
    title: "Required action",
    description: "Verify capacity before release.",
  },
] as const;

export const OurApproach = component$(() => {
  useStyles$(ourApproachCss);
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

      const copyTargets = Array.from(
        section.querySelectorAll<HTMLElement>("[data-approach-copy-reveal]"),
      );
      const card = section.querySelector<HTMLElement>("[data-approach-card]");
      const cardTargets = Array.from(
        section.querySelectorAll<HTMLElement>("[data-approach-card-reveal]"),
      );
      const cta = section.querySelector<HTMLElement>("[data-approach-cta]");

      if (!copyTargets.length || !card || !cardTargets.length || !cta) return;

      const evidenceItems = Array.from(
        section.querySelectorAll<HTMLElement>(".our-approach__evidence-item"),
      );
      const evidenceTriggers = Array.from(
        section.querySelectorAll<HTMLButtonElement>(
          ".our-approach__evidence-trigger",
        ),
      );
      const evidencePanels = Array.from(
        section.querySelectorAll<HTMLElement>(".our-approach__evidence-panel"),
      );
      const evidenceIcons = Array.from(
        section.querySelectorAll<HTMLImageElement>(
          ".our-approach__evidence-icon",
        ),
      );

      const setActiveEvidence = (activeIndex: number) => {
        evidenceItems.forEach((item, index) => {
          const isActive = index === activeIndex;
          item.classList.toggle(
            "our-approach__evidence-item--active",
            isActive,
          );
          evidenceTriggers[index]?.setAttribute(
            "aria-expanded",
            String(isActive),
          );
          evidencePanels[index]?.setAttribute("aria-hidden", String(!isActive));
          if (evidenceIcons[index]) {
            evidenceIcons[index].src = isActive
              ? "/assets/icons/approach-minus-circle.svg"
              : "/assets/icons/plus-circle.svg";
          }
        });
      };

      const evidenceListeners = evidenceTriggers.map((trigger, index) => {
        const handler = () => setActiveEvidence(index);
        trigger.addEventListener("click", handler);
        return { handler, trigger };
      });

      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(copyTargets, { y: 36, autoAlpha: 0 });
        gsap.set(card, {
          scaleX: 0.125,
          autoAlpha: 0,
          transformOrigin: "100% 50%",
        });
        gsap.set(cardTargets, { y: 20, autoAlpha: 0 });
        gsap.set(cta, { y: 72, autoAlpha: 0 });

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${Math.max(innerHeight * 1.05, 720)}`,
            pin: section,
            pinSpacing: true,
            anticipatePin: 1,
            refreshPriority: -10,
            scrub: 1.1,
            invalidateOnRefresh: true,
          },
        });

        timeline
          .to(
            card,
            {
              scaleX: 1,
              autoAlpha: 1,
              duration: 0.34,
              ease: "power2.inOut",
            },
            0.16,
          )
          .to(
            copyTargets,
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.3,
              stagger: 0.05,
              ease: "power2.out",
            },
            0.22,
          )
          .to(
            cardTargets,
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.34,
              stagger: 0.05,
              ease: "power2.out",
            },
            0.8,
          )
          .to(
            cta,
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.3,
              ease: "power2.out",
            },
            0.88,
          )
          .to({}, { duration: 0.12 }, 1.24);

        const refreshTimer = window.setTimeout(() => {
          ScrollTrigger.sort();
          ScrollTrigger.refresh();
        }, 200);

        return () => {
          window.clearTimeout(refreshTimer);
          timeline.scrollTrigger?.kill();
          timeline.kill();
          gsap.set([card, cta, ...copyTargets, ...cardTargets], {
            clearProps: "transform,opacity,visibility",
          });
        };
      });

      cleanup(() => {
        evidenceListeners.forEach(({ handler, trigger }) => {
          trigger.removeEventListener("click", handler);
        });
        media.revert();
      });
    },
    { strategy: "document-ready" },
  );

  return (
    <section
      ref={sectionRef}
      class="our-approach"
      id="our-approach"
      aria-labelledby="our-approach-title"
      data-approach
    >
      <div class="our-approach__stage">
        <div class="our-approach__copy">
          <div class="our-approach__heading">
            <p class="our-approach__eyebrow" data-approach-copy-reveal>
              Our approach
            </p>
            <h2
              class="our-approach__title"
              id="our-approach-title"
              data-approach-copy-reveal
            >
              <span>Know what matters.</span>
              <span>Know when to act.</span>
            </h2>
          </div>
          <p class="our-approach__description" data-approach-copy-reveal>
            We help leaders assess the evidence, understand the enterprise
            consequences, and act before options narrow—with clear ownership and
            a documented rationale.
          </p>
        </div>

        <a
          class="our-approach__cta button button--primary button--with-icon"
          href="#decision-flow"
          data-approach-cta
        >
          <span class="button__label">Explore the decision framework</span>
          <span class="button__icon" aria-hidden="true">
            <img
              src="/assets/icons/arrow-circle-right.svg"
              alt=""
              width="38"
              height="38"
            />
          </span>
        </a>

        <article class="our-approach__card" data-approach-card>
          <header class="our-approach__card-header" data-approach-card-reveal>
            <div class="our-approach__card-heading">
              <p class="our-approach__card-eyebrow">Our approach</p>
              <h3 class="our-approach__card-title">
                Is the evidence sufficient to release the next order?
              </h3>
            </div>
            <div class="our-approach__status">
              <span class="our-approach__status-label">Action required</span>
              <span class="our-approach__status-copy">
                Verify capacity before release
              </span>
            </div>
          </header>

          <div
            class="our-approach__evidence"
            data-approach-card-reveal
            data-approach-accordion
          >
            {DECISION_ITEMS.map((item, index) => {
              const isActive = index === 0;
              const panelId = `approach-evidence-panel-${index}`;
              const triggerId = `approach-evidence-trigger-${index}`;

              return (
                <div
                  class={`our-approach__evidence-item ${
                    isActive ? "our-approach__evidence-item--active" : ""
                  } ${index === 0 ? "our-approach__evidence-item--first" : ""}`}
                  key={item.title}
                >
                  <button
                    class="our-approach__evidence-trigger"
                    id={triggerId}
                    type="button"
                    aria-controls={panelId}
                    aria-expanded={isActive}
                  >
                    <span>{item.title}</span>
                    <img
                      class="our-approach__evidence-icon"
                      src={
                        isActive
                          ? "/assets/icons/approach-minus-circle.svg"
                          : "/assets/icons/plus-circle.svg"
                      }
                      alt=""
                      width="24"
                      height="24"
                    />
                  </button>
                  <div
                    class="our-approach__evidence-panel"
                    id={panelId}
                    role="region"
                    aria-labelledby={triggerId}
                    aria-hidden={!isActive}
                  >
                    <div class="our-approach__evidence-panel-inner">
                      <p>{item.description}</p>
                    </div>
                  </div>
                  {index < DECISION_ITEMS.length - 1 && (
                    <img
                      class="our-approach__divider"
                      src="/assets/icons/approach-divider.svg"
                      alt=""
                      width="568"
                      height="1"
                    />
                  )}
                </div>
              );
            })}
          </div>

          <p class="our-approach__score" data-approach-card-reveal>
            <span>Decision Quality Score™</span>: 78/100 — An unmet critical
            requirement takes precedence over the overall score.
          </p>
        </article>
      </div>
    </section>
  );
});
