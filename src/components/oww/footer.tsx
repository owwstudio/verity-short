import {
  component$,
  useSignal,
  useStyles$,
  useVisibleTask$,
} from "@builder.io/qwik";
import footerCss from "./footer.css?inline";

type MenuEntry = { label: string; href?: string };

const MENUS: Array<{ name: string; entries: MenuEntry[] }> = [
  {
    name: "Product",
    entries: [
      { label: "Asset Tokenizer" },
      { label: "Decision Pricer" },
      { label: "SAP Add-in" },
    ],
  },
  {
    name: "Solutions",
    entries: [
      { label: "Automotive" },
      { label: "Connected products" },
      { label: "Insurance" },
      { label: "Banking and payments" },
      { label: "Critical Infrastructure" },
      { label: "Assurance And Professional Services" },
      { label: "Cross-functional enterprise operations" },
      { label: "Cloud and technology platforms" },
    ],
  },
  {
    name: "Company",
    entries: [
      { label: "Careers" },
      { label: "Blog" },
      { label: "Press" },
      { label: "About" },
      { label: "Contact", href: "mailto:contact@helgeheupel.com" },
    ],
  },
  {
    name: "How it works",
    entries: [
      { label: "Evidence" },
      { label: "Security" },
      { label: "Trust" },
      { label: "Patents pending" },
    ],
  },
];

const OFFICES = [
  { name: "San Francisco", modifier: "san-francisco" },
  { name: "Amsterdam", modifier: "amsterdam" },
  { name: "Berlin", modifier: "berlin" },
];

export const Footer = component$(() => {
  useStyles$(footerCss);
  const footerRef = useSignal<HTMLElement>();

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(
    async ({ cleanup }) => {
      const footer = footerRef.value;
      if (!footer) return;

      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      gsap.registerPlugin(ScrollTrigger);

      const revealItems = Array.from(
        footer.querySelectorAll<HTMLElement>("[data-footer-reveal]"),
      );
      const pins = Array.from(
        footer.querySelectorAll<HTMLElement>("[data-footer-pin]"),
      );
      const map = footer.querySelector<HTMLElement>("[data-footer-map]");

      if (!revealItems.length && !pins.length) return;

      const media = gsap.matchMedia();

      media.add(
        "(min-width: 70rem) and (prefers-reduced-motion: no-preference)",
        () => {
          gsap.set(revealItems, { y: 24, autoAlpha: 0 });
          gsap.set(pins, { autoAlpha: 0 });

          const timeline = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: footer,
              start: "top bottom",
              end: "top top",
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          });

          revealItems.forEach((item, index) => {
            timeline.to(
              item,
              {
                y: 0,
                autoAlpha: 1,
                duration: 0.12,
                ease: "power2.out",
              },
              0.04 + index * 0.055,
            );
          });

          timeline.to(
            pins,
            {
              autoAlpha: 1,
              duration: 0.18,
              stagger: 0.08,
              ease: "power2.out",
            },
            0.5,
          );

          return () => timeline.kill();
        },
      );

      media.add(
        "(max-width: 69.999rem) and (prefers-reduced-motion: no-preference)",
        () => {
          const tweens = revealItems.map((target) =>
            gsap.from(target, {
              y: 40,
              autoAlpha: 0,
              duration: 0.7,
              ease: "power3.out",
              scrollTrigger: {
                trigger: target,
                start: "top 92%",
                toggleActions: "play none none reverse",
              },
            }),
          );

          const pinTimeline = map
            ? gsap
                .timeline({
                  scrollTrigger: {
                    trigger: map,
                    start: "top 88%",
                    toggleActions: "play none none reverse",
                  },
                })
                .from(pins, {
                  autoAlpha: 0,
                  duration: 0.5,
                  stagger: 0.12,
                  ease: "power2.out",
                })
            : undefined;

          return () => {
            tweens.forEach((tween) => tween.kill());
            pinTimeline?.kill();
          };
        },
      );

      cleanup(() => media.revert());
    },
    { strategy: "document-ready" },
  );

  return (
    <footer
      ref={footerRef}
      id="site-footer"
      class="site-footer"
      data-site-footer
    >
      <div class="site-footer__inner">
        <div class="site-footer__lead">
          <a
            class="site-footer__signature"
            href="/"
            aria-label="Helge Heupel home"
          >
            <img
              class="site-footer__mark"
              src="/assets/images/hh-monogram.svg"
              alt=""
              width="85"
              height="94"
              loading="lazy"
              decoding="async"
            />
            <span class="site-footer__brand">Helge Heupel</span>
          </a>

          <div class="site-footer__lead-actions">
            <ul class="site-footer__lead-links" data-footer-reveal>
              <li class="site-footer__lead-item">
                <a class="site-footer__link" href="/assessment/">
                  Assessment
                </a>
              </li>
              <li class="site-footer__lead-item">
                <a class="site-footer__link" href="/assurance/">
                  Assurance
                </a>
              </li>
            </ul>

            <a
              class="button button--primary button--with-icon site-footer__cta"
              href="mailto:contact@helgeheupel.com?subject=Call%20with%20Founder"
              data-button="primary"
              data-footer-reveal
            >
              <span class="button__label">Call with Founder</span>
              <span class="button__icon" aria-hidden="true">
                <img
                  src="/assets/icons/arrow-circle-right.svg"
                  alt=""
                  width="38"
                  height="38"
                />
              </span>
            </a>
          </div>
        </div>

        <nav class="site-footer__menus" aria-label="Footer navigation">
          {MENUS.map((menu) => (
            <div class="site-footer__menu" data-footer-reveal key={menu.name}>
              <h2 class="site-footer__group-name">{menu.name}</h2>
              <ul class="site-footer__list">
                {menu.entries.map((entry) => (
                  <li class="site-footer__item" key={entry.label}>
                    {entry.href ? (
                      <a class="site-footer__link" href={entry.href}>
                        {entry.label}
                      </a>
                    ) : (
                      <span class="site-footer__pending" aria-disabled="true">
                        {entry.label}
                        <span class="site-footer__pending-note">
                          {" "}
                          — coming soon
                        </span>
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <figure class="site-footer__map" data-footer-map data-footer-reveal>
          <div class="site-footer__map-canvas">
            <img
              class="site-footer__map-image"
              src="/assets/images/map-base%20footer.svg"
              alt=""
              width="1440"
              height="402"
              loading="lazy"
              decoding="async"
            />

            <ul class="site-footer__pins" aria-label="Office locations">
              {OFFICES.map((office) => (
                <li
                  class={`site-footer__pin site-footer__pin--${office.modifier}`}
                  data-footer-pin
                  key={office.name}
                >
                  <img
                    class="site-footer__pin-image"
                    src="/assets/images/pin%20footer.svg"
                    alt=""
                    width="40"
                    height="40"
                    loading="lazy"
                    decoding="async"
                  />
                  <span class="site-footer__pending-note">{office.name}</span>
                </li>
              ))}
            </ul>
          </div>
          <figcaption class="site-footer__pending-note">
            Offices in San Francisco, Amsterdam, and Berlin
          </figcaption>
        </figure>

        <div class="site-footer__company">
          <address class="site-footer__address" data-footer-reveal>
            <strong class="site-footer__company-name">Helge Heupel Inc.</strong>
            <span class="site-footer__address-line">
              1 Sansome Street, Suite 1400
            </span>
            <span class="site-footer__address-line">
              San Francisco, CA 94104 United States
            </span>
          </address>

          <p class="site-footer__contact-details" data-footer-reveal>
            <a
              class="site-footer__company-link"
              href="mailto:email@helgeheupel.com"
            >
              email@helgeheupel.com
            </a>
            <a class="site-footer__company-link" href="tel:+15124176804">
              +1 512 417 6804
            </a>
          </p>

          <ul class="site-footer__legal" data-footer-reveal>
            <li>
              <a class="site-footer__company-link" href="/impressum/">
                Legal notice
              </a>
            </li>
            <li>
              <a class="site-footer__company-link" href="/privacy/">
                Privacy policy
              </a>
            </li>
            <li>
              <a class="site-footer__company-link" href="/cookies/">
                Cookies
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
});
