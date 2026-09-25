import {
  component$,
  useSignal,
  useStyles$,
  useVisibleTask$,
} from "@builder.io/qwik";
import decisionValueCss from "./decision-value.css?inline";

const VALUE_ROWS = [
  {
    operation: "Invested capital",
    today: "€100m",
    improvement: "€100m",
    measure: "Reconciled opening invested capital",
  },
  {
    operation: "ROIC vs. WACC",
    today: "12% vs. 8%",
    improvement: "14% vs. 8%",
    measure: "NOPAT ÷ invested capital; risk-appropriate WACC",
  },
  {
    operation: "Annual economic profit",
    today: "€4m",
    improvement: "€6m",
    measure: "Capital × (ROIC − WACC)",
  },
  {
    operation: "Free cash flow to the firm",
    today: "€12m",
    improvement: "€14m",
    measure: "After tax and reinvestment; no growth",
  },
  {
    operation: "Operating enterprise value",
    today: "€150m",
    improvement: "€175m",
    measure: "FCFF ÷ (WACC − g), g = 0",
  },
] as const;

export const DecisionValue = component$<{ embedded?: boolean }>(
  ({ embedded = false }) => {
    useStyles$(decisionValueCss);
    const sectionRef = useSignal<HTMLElement>();

    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(
      async ({ cleanup }) => {
        const section = sectionRef.value;
        if (!section) return;
        if (section.classList.contains("decision-value--embedded")) return;

        const [{ gsap }, { ScrollTrigger }] = await Promise.all([
          import("gsap"),
          import("gsap/ScrollTrigger"),
        ]);
        gsap.registerPlugin(ScrollTrigger);

        const copyTargets = Array.from(
          section.querySelectorAll<HTMLElement>("[data-value-copy]"),
        );
        const metricTargets = Array.from(
          section.querySelectorAll<HTMLElement>("[data-value-metric]"),
        );
        const table = section.querySelector<HTMLElement>("[data-value-table]");
        const note = section.querySelector<HTMLElement>("[data-value-note]");

        if (!copyTargets.length || !metricTargets.length || !table || !note) {
          return;
        }

        const media = gsap.matchMedia();

        media.add("(prefers-reduced-motion: no-preference)", () => {
          gsap.set(copyTargets, { y: 56, autoAlpha: 0 });
          gsap.set(metricTargets, { y: 72, autoAlpha: 0 });
          gsap.set(table, { y: 88, autoAlpha: 0 });
          gsap.set(note, { y: 40, autoAlpha: 0 });

          const isDesktop = window.matchMedia("(min-width: 70rem)").matches;
          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: isDesktop ? "top top" : "top 78%",
              end: isDesktop
                ? () => `+=${Math.max(innerHeight * 0.95, 680)}`
                : "top 20%",
              pin: isDesktop,
              pinSpacing: isDesktop,
              anticipatePin: isDesktop ? 1 : 0,
              scrub: 1.3,
              invalidateOnRefresh: true,
            },
          });

          timeline
            .to(copyTargets, {
              y: 0,
              autoAlpha: 1,
              duration: 0.38,
              stagger: 0.055,
              ease: "power2.out",
            })
            .to(
              metricTargets,
              {
                y: 0,
                autoAlpha: 1,
                duration: 0.4,
                stagger: 0.06,
                ease: "power2.out",
              },
              0.12,
            )
            .to(
              table,
              {
                y: 0,
                autoAlpha: 1,
                duration: 0.45,
                ease: "power2.out",
              },
              0.36,
            )
            .to(
              note,
              {
                y: 0,
                autoAlpha: 1,
                duration: 0.32,
                ease: "power2.out",
              },
              0.62,
            )
            .to({}, { duration: 0.18 });

          const refreshTimer = window.setTimeout(() => {
            ScrollTrigger.sort();
            ScrollTrigger.refresh();
          }, 200);

          return () => {
            window.clearTimeout(refreshTimer);
            timeline.scrollTrigger?.kill();
            timeline.kill();
            gsap.set([...copyTargets, ...metricTargets, table, note], {
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
        class={`decision-value ${embedded ? "decision-value--embedded" : ""}`}
        id="decision-value"
        aria-labelledby="decision-value-title"
        data-decision-value
      >
        <div class="decision-value__stage">
          <header class="decision-value__intro">
            <div class="decision-value__copy">
              <p class="decision-value__eyebrow" data-value-copy>
                Connect decisions to enterprise value
              </p>
              <h2
                class="decision-value__title"
                id="decision-value-title"
                data-value-copy
              >
                What better decisions are worth.
              </h2>
              <p class="decision-value__description" data-value-copy>
                Decisions change operating cash flow; cash flow sets enterprise
                value. We make that link explicit before resources are committed
                and measure it after. The bridge is hypothetical, uses standard
                valuation, and is the first thing we build with your finance
                owner.
              </p>
            </div>

            <div class="decision-value__metrics" aria-label="Value improvement">
              <div class="decision-value__metric" data-value-metric>
                <strong>+€2m</strong>
                <span>annual free cash flow</span>
              </div>
              <img
                class="decision-value__arrow"
                src="/assets/icons/value-arrow-right.svg"
                alt=""
                width="32"
                height="32"
                data-value-metric
              />
              <div class="decision-value__metric" data-value-metric>
                <strong>+€25m</strong>
                <span>operating enterprise value</span>
              </div>
            </div>
          </header>

          <div class="decision-value__data" data-value-table>
            <div
              class="decision-value__table-scroll"
              role="region"
              aria-label="Illustrative enterprise value calculation"
              tabIndex={0}
            >
              <table class="decision-value__table">
                <thead>
                  <tr>
                    <th scope="col">Illustrative operation</th>
                    <th scope="col">Today</th>
                    <th scope="col">After improvement</th>
                    <th scope="col">How you measure it</th>
                  </tr>
                </thead>
                <tbody>
                  {VALUE_ROWS.map((row) => (
                    <tr key={row.operation}>
                      <th scope="row">{row.operation}</th>
                      <td>{row.today}</td>
                      <td>{row.improvement}</td>
                      <td>{row.measure}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div
              class="decision-value__mobile-list"
              role="list"
              aria-label="Illustrative enterprise value calculation"
            >
              {VALUE_ROWS.map((row) => (
                <article
                  class="decision-value__mobile-item"
                  role="listitem"
                  key={row.operation}
                >
                  <h3 class="decision-value__mobile-title">{row.operation}</h3>
                  <div class="decision-value__mobile-comparison">
                    <div class="decision-value__mobile-value">
                      <span>Today</span>
                      <strong>{row.today}</strong>
                    </div>
                    <img
                      class="decision-value__mobile-arrow"
                      src="/assets/icons/value-arrow-right.svg"
                      alt=""
                      width="16"
                      height="16"
                    />
                    <div class="decision-value__mobile-value">
                      <span>After improvement</span>
                      <strong>{row.improvement}</strong>
                    </div>
                  </div>
                  <p class="decision-value__mobile-measure">
                    <span>How you measure it</span>
                    {row.measure}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <p class="decision-value__note" data-value-note>
            Hypothetical: an extra €2m each year from next year, in perpetuity,
            net of ongoing costs, at 8% WACC and zero growth. No additional
            capital; upfront implementation costs reduce the gain. Sources: CFA
            Institute, Capital Investments and Capital Allocation (2026);
            Damodaran, Valuation and Economic Value Added lectures, NYU Stern.
          </p>
        </div>
      </section>
    );
  },
);
