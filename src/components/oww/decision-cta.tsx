import {
  component$,
  useSignal,
  useStyles$,
  useVisibleTask$,
} from "@builder.io/qwik";
import decisionCtaCss from "./decision-cta.css?inline";

export const DecisionCta = component$(() => {
  useStyles$(decisionCtaCss);
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

      const panel = section.querySelector<HTMLElement>(
        "[data-decision-cta-panel]",
      );
      const background = section.querySelector<HTMLElement>(
        "[data-decision-cta-background]",
      );
      const copy = Array.from(
        section.querySelectorAll<HTMLElement>("[data-decision-cta-copy]"),
      );
      const card = section.querySelector<HTMLElement>(
        "[data-decision-cta-card]",
      );
      const action = section.querySelector<HTMLElement>(
        "[data-decision-cta-action]",
      );

      if (!panel || !background || !copy.length || !card || !action) return;

      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(panel, { y: 40, scale: 0.985, autoAlpha: 0 });
        gsap.set(background, { scale: 1.06 });
        gsap.set(copy, { y: 28, autoAlpha: 0 });
        gsap.set(card, { x: 56, y: 12, autoAlpha: 0 });
        gsap.set(action, { y: 22, autoAlpha: 0 });

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 90%",
            end: "top 34%",
            scrub: 0.85,
            invalidateOnRefresh: true,
          },
        });

        timeline
          .to(panel, {
            y: 0,
            scale: 1,
            autoAlpha: 1,
            duration: 0.4,
            ease: "power3.out",
          })
          .to(
            background,
            {
              scale: 1,
              duration: 1.15,
              ease: "power2.out",
            },
            0,
          )
          .to(
            copy,
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.48,
              stagger: 0.09,
              ease: "power3.out",
            },
            0.18,
          )
          .to(
            card,
            {
              x: 0,
              y: 0,
              autoAlpha: 1,
              duration: 0.58,
              ease: "power3.out",
            },
            0.3,
          )
          .to(
            action,
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.46,
              ease: "power3.out",
            },
            0.46,
          )
          .to({}, { duration: 0.16 });

        return () => {
          timeline.scrollTrigger?.kill();
          timeline.kill();
          gsap.set([panel, background, ...copy, card, action], {
            clearProps: "transform,opacity,visibility",
          });
        };
      });

      cleanup(() => media.revert());
    },
    { strategy: "document-ready" },
  );

  return (
    <section
      ref={sectionRef}
      class="decision-cta"
      aria-labelledby="decision-cta-title"
      data-decision-cta
    >
      <div class="decision-cta__inner">
        <div class="decision-cta__panel" data-decision-cta-panel>
          <img
            class="decision-cta__background"
            src="/assets/images/decision-cta-background.png"
            alt=""
            width="1024"
            height="683"
            loading="lazy"
            decoding="async"
            data-decision-cta-background
          />

          <div class="decision-cta__copy">
            <h2
              class="decision-cta__title"
              id="decision-cta-title"
              data-decision-cta-copy
            >
              Start with one decision that matters.
            </h2>
            <p class="decision-cta__description" data-decision-cta-copy>
              Bring a supplier allocation, engineering change, or capacity
              commitment. In 45 minutes with Helge Heupel, explore what is at
              stake, where evidence is missing, and whether a focused assessment
              is warranted.
            </p>
          </div>

          <a
            class="decision-cta__action button button--inverse button--with-icon"
            href="mailto:contact@helgeheupel.com?subject=Discuss%20your%20decision"
            data-decision-cta-action
          >
            <span class="button__label">Discuss your decision</span>
            <span class="button__icon" aria-hidden="true">
              <img
                src="/assets/icons/decision-cta-arrow.svg"
                alt=""
                width="38"
                height="38"
              />
            </span>
          </a>

          <aside class="decision-cta__card" data-decision-cta-card>
            <h3 class="decision-cta__card-title">
              A clear threshold for proceeding.
            </h3>
            <p class="decision-cta__card-description">
              Any initial assessment has a defined scope and a documented
              go/no-go by week three. To proceed beyond it, the evidence must
              support a credible case for creating or protecting at least ten
              times the engagement’s cost over five years.
            </p>
          </aside>
        </div>

        <span class="decision-cta__divider" aria-hidden="true" />
      </div>
    </section>
  );
});
