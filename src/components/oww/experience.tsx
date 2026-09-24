import {
  component$,
  useSignal,
  useStyles$,
  useVisibleTask$,
} from "@builder.io/qwik";
import experienceCss from "./experience.css?inline";

const METRICS = [
  {
    value: "10",
    end: 10,
    decimals: 0,
    suffix: "",
    unit: "brands",
    description: "Served by one platform",
  },
  {
    value: "150+",
    end: 150,
    decimals: 0,
    suffix: "+",
    unit: "markets",
    description: "Global operational reach",
  },
  {
    value: "15,000+",
    end: 15000,
    decimals: 0,
    suffix: "+",
    unit: "endpoints",
    description: "Transitioned without production disruption",
  },
  {
    value: "99.999%",
    end: 99.999,
    decimals: 3,
    suffix: "%",
    unit: "availability",
    description: "Across five years of live operation",
  },
] as const;

export const Experience = component$(() => {
  useStyles$(experienceCss);
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

      const stage = section.querySelector<HTMLElement>(
        "[data-experience-stage]",
      );
      const metrics = section.querySelector<HTMLElement>(
        "[data-experience-metrics]",
      );
      if (!stage || !metrics) return;

      const textRevealTargets = Array.from(
        section.querySelectorAll<HTMLElement>("[data-experience-text-reveal]"),
      );

      const counters = Array.from(
        section.querySelectorAll<HTMLElement>("[data-experience-counter]"),
      )
        .map((element) => {
          const original = element.textContent.trim();
          const end = Number(element.dataset.counterEnd);
          const decimals = Number(element.dataset.counterDecimals ?? 0);
          const suffix = element.dataset.counterSuffix ?? "";
          if (!Number.isFinite(end) || !Number.isFinite(decimals)) return null;

          const state = { value: 0 };
          const render = () => {
            element.textContent = `${state.value.toLocaleString("en-US", {
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals,
            })}${suffix}`;
          };

          element.setAttribute("aria-label", original);
          return { element, original, state, end, render };
        })
        .filter((counter): counter is NonNullable<typeof counter> =>
          Boolean(counter),
        );

      const resetCounters = () => {
        counters.forEach((counter) => {
          counter.state.value = 0;
          counter.render();
        });
      };

      const restoreCounters = () => {
        counters.forEach((counter) => {
          counter.element.textContent = counter.original;
          counter.element.removeAttribute("aria-label");
        });
      };

      const createCounterTimeline = () => {
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 82%",
            toggleActions: "play none none reverse",
          },
        });

        counters.forEach((counter, index) => {
          timeline.to(
            counter.state,
            {
              value: counter.end,
              duration: 0.8,
              ease: "power2.out",
              onUpdate: counter.render,
            },
            index * 0.1,
          );
        });

        return timeline;
      };

      const media = gsap.matchMedia();

      media.add(
        "(min-width: 70rem) and (prefers-reduced-motion: no-preference)",
        () => {
          section.style.setProperty("--experience-length", "300svh");
          resetCounters();
          gsap.set(textRevealTargets, { y: 28, autoAlpha: 0 });

          const counterTimeline = createCounterTimeline();
          const scrollTimeline = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.9,
              invalidateOnRefresh: true,
            },
          });

          scrollTimeline
            .to(
              textRevealTargets,
              {
                y: 0,
                autoAlpha: 1,
                duration: 0.22,
                stagger: 0.025,
                ease: "power3.out",
              },
              0,
            )
            .to(
              metrics,
              {
                y: -244,
                duration: 1,
              },
              0,
            );

          return () => {
            counterTimeline.scrollTrigger?.kill();
            counterTimeline.kill();
            scrollTimeline.kill();
            section.style.removeProperty("--experience-length");
            gsap.set(metrics, { clearProps: "transform" });
            gsap.set(textRevealTargets, {
              clearProps: "transform,opacity,visibility",
            });
            restoreCounters();
          };
        },
      );

      media.add(
        "(max-width: 69.999rem) and (prefers-reduced-motion: no-preference)",
        () => {
          resetCounters();
          const counterTimeline = createCounterTimeline();
          const revealTargets = Array.from(
            section.querySelectorAll<HTMLElement>("[data-experience-reveal]"),
          );
          const tweens = revealTargets.map((target) =>
            gsap.from(target, {
              y: 28,
              autoAlpha: 0,
              duration: 0.7,
              ease: "power3.out",
              scrollTrigger: {
                trigger: target,
                start: "top 90%",
                toggleActions: "play none none reverse",
              },
            }),
          );

          return () => {
            counterTimeline.scrollTrigger?.kill();
            counterTimeline.kill();
            tweens.forEach((tween) => tween.kill());
            restoreCounters();
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
      class="experience"
      aria-labelledby="experience-title"
      data-experience
    >
      <div class="experience__sticky">
        <div class="experience__stage" data-experience-stage>
          <header class="experience__lead" data-experience-reveal>
            <p class="experience__eyebrow" data-experience-text-reveal>
              Experience behind the approach
            </p>
            <h2
              class="experience__title"
              id="experience-title"
              data-experience-text-reveal
            >
              <span>Global infrastructure transformed.</span>
              <span>Production kept running.</span>
            </h2>
            <p class="experience__introduction" data-experience-text-reveal>
              Our team helped deliver a global infrastructure programme for one
              of Europe&apos;s largest automotive groups—supporting 10 brands
              across more than 150 markets.
            </p>
          </header>

          <div
            class="experience__details"
            id="experience-details"
            data-experience-details
          >
            <div class="experience__copy" data-experience-reveal>
              <p data-experience-text-reveal>
                We mapped dependencies across systems spanning five decades,
                aligned business data across platforms, and managed the
                transition of more than 15,000 endpoints without disrupting
                production.
              </p>
              <p data-experience-text-reveal>
                As requirements expanded, we retained the core team and added
                specialist expertise. The platform supported successive
                production launches, achieving 99.999% availability over five
                years of live operation.
              </p>
              <p data-experience-text-reveal>
                That experience shapes our approach to enterprise decisions:
                understand the dependencies, make trade-offs explicit, and
                deliver change while operations continue.
              </p>
            </div>

            <div class="experience__metrics-window">
              <ul class="experience__metrics" data-experience-metrics>
                {METRICS.map((metric) => (
                  <li
                    class="experience__metric"
                    data-experience-reveal
                    key={metric.description}
                  >
                    <img
                      class="experience__divider"
                      src="/assets/icons/experience-divider.svg"
                      alt=""
                      width="680"
                      height="1"
                      loading="lazy"
                      decoding="async"
                    />
                    <div class="experience__metric-row">
                      <p class="experience__metric-value">
                        <span
                          class="experience__metric-number"
                          data-experience-counter
                          data-counter-end={String(metric.end)}
                          data-counter-decimals={String(metric.decimals)}
                          data-counter-suffix={metric.suffix}
                        >
                          {metric.value}
                        </span>{" "}
                        <span class="experience__metric-unit">
                          {metric.unit}
                        </span>
                      </p>
                      <p class="experience__metric-description">
                        {metric.description}
                      </p>
                    </div>
                  </li>
                ))}
                <li class="experience__metrics-end" aria-hidden="true">
                  <img
                    class="experience__divider"
                    src="/assets/icons/experience-divider.svg"
                    alt=""
                    width="680"
                    height="1"
                    loading="lazy"
                    decoding="async"
                  />
                </li>
              </ul>
            </div>
          </div>

          <div class="experience__fade" aria-hidden="true" />

          <div
            class="experience__action"
            data-experience-reveal
            data-experience-text-reveal
          >
            <a
              class="button button--primary button--with-icon experience__cta"
              href="#experience-details"
              data-button="primary"
            >
              <span class="button__label">Read the programme story</span>
              <span class="button__icon" aria-hidden="true">
                <img
                  src="/assets/icons/arrow-circle-right.svg"
                  alt=""
                  width="38"
                  height="38"
                />
              </span>
            </a>
            <p class="experience__note">
              Programme experience: 2018–2025. Firsthand account by Helge
              Heupel.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
});
