import { component$, useStyles$ } from "@builder.io/qwik";
import heroCss from "./hero.css?inline";

export const Hero = component$(() => {
  useStyles$(heroCss);

  return (
    <section class="hero" aria-labelledby="hero-title" data-hero>
      <div class="hero__inner container">
        <div class="hero__content">
          <div class="hero__heading">
            <span class="tag tag--outline" data-hero-eyebrow>
              Enterprise Decision Management™
            </span>

            <h1 class="hero__title" id="hero-title" data-hero-title>
              <span class="hero__title-line hero__title-line--muted">
                Better decisions.
              </span>
              <span class="hero__title-line">
                The next frontier in productivity.
              </span>
            </h1>
          </div>

          <div class="hero__aside">
            <p class="hero__description">
              We bring Silicon Valley expertise, global enterprise delivery
              experience, and patent-pending technology to the decisions that
              shape enterprise performance – while your business keeps running.
            </p>

            <div class="hero__actions">
              <a
                class="button button--primary button--with-icon hero__primary-action"
                href="mailto:contact@helgeheupel.com?subject=Discuss%20a%20critical%20decision"
                data-button="primary"
                data-hero-primary-action
              >
                <span class="button__label">
                  Discuss your next critical decision
                </span>
                <span class="button__icon" aria-hidden="true">
                  <img
                    src="/assets/icons/arrow-circle-right.svg"
                    alt=""
                    width="38"
                    height="38"
                  />
                </span>
              </a>

              <a
                class="button button--secondary hero__secondary-action"
                href="#decision-forecast"
                data-button="secondary"
                data-hero-secondary-action
              >
                <span class="button__label">Explore our perspective</span>
              </a>
            </div>
          </div>
        </div>

        <div class="hero__visual" id="decision-forecast" data-hero-visual>
          <img
            class="hero__visual-image"
            src="/assets/images/hero-decision-forecast.png"
            alt="Enterprise performance forecast showing actual revenue through August and modeled P10, P50, and P90 outcomes through November."
            width="1344"
            height="720"
            loading="eager"
            decoding="async"
          />
        </div>
      </div>
    </section>
  );
});
