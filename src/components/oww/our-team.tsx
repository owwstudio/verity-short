import {
  component$,
  useSignal,
  useStyles$,
  useVisibleTask$,
} from "@builder.io/qwik";
import ourTeamCss from "./our-team.css?inline";

export const OurTeam = component$(() => {
  useStyles$(ourTeamCss);
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

      const heading = section.querySelector<HTMLElement>(
        "[data-our-team-heading]",
      );
      const portrait = section.querySelector<HTMLElement>(
        "[data-our-team-portrait]",
      );
      const body = section.querySelector<HTMLElement>("[data-our-team-body]");
      const quote = section.querySelector<HTMLElement>("[data-our-team-quote]");
      const author = section.querySelector<HTMLElement>(
        "[data-our-team-author]",
      );

      if (!heading || !portrait || !body || !quote || !author) return;

      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const compact = window.matchMedia("(max-width: 69.999rem)").matches;

        gsap.set([heading, body, quote, author], {
          y: () => (compact ? 56 : innerHeight * 0.46),
          autoAlpha: 0,
        });
        gsap.set(portrait, {
          y: () => (compact ? 96 : innerHeight * 1.28),
          scale: compact ? 0.72 : 0.209,
          autoAlpha: 0,
          transformOrigin: "50% 50%",
        });

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${Math.max(innerHeight * 1.8, 1200)}`,
            pin: section,
            pinSpacing: true,
            anticipatePin: 1,
            scrub: 1.2,
            invalidateOnRefresh: true,
            refreshPriority: -30,
          },
        });

        timeline
          .to({}, { duration: 0.55 })
          .to(
            heading,
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.62,
              ease: "power3.out",
            },
            0.55,
          )
          .to(
            portrait,
            {
              y: 0,
              scale: 1,
              autoAlpha: 1,
              duration: 0.92,
              ease: "power3.out",
            },
            0.68,
          )
          .to(
            body,
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.72,
              ease: "power3.out",
            },
            0.76,
          )
          .to(
            quote,
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.62,
              ease: "power3.out",
            },
            0.9,
          )
          .to(
            author,
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.6,
              ease: "power3.out",
            },
            1.02,
          )
          .to({}, { duration: 0.58 });

        return () => {
          timeline.scrollTrigger?.kill();
          timeline.kill();
          gsap.set([heading, portrait, body, quote, author], {
            clearProps: "transform,opacity,visibility",
          });
        };
      });

      const refreshTimer = window.setTimeout(() => {
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
      }, 220);

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
      class="our-team"
      id="our-team"
      aria-labelledby="our-team-title"
      data-our-team
    >
      <div class="our-team__stage">
        <header class="our-team__heading" data-our-team-heading>
          <p class="our-team__eyebrow">Our team</p>
          <h2 class="our-team__title" id="our-team-title">
            <span>Technology expertise.</span>
            <span>Industrial delivery.</span>
            <span>Accountability for outcomes.</span>
          </h2>
        </header>

        <blockquote class="our-team__quote" data-our-team-quote>
          “Our decisions and results stand up to independent scrutiny—including
          when the evidence challenges us.”
        </blockquote>

        <div class="our-team__author" data-our-team-author>
          <strong>Helge Heupel</strong>
          <span>Founder and Managing Director</span>
        </div>

        <figure class="our-team__portrait" data-our-team-portrait>
          <img
            src="/assets/images/our-team-helge-heupel.png"
            alt="Helge Heupel"
            width="800"
            height="1000"
          />
        </figure>

        <div class="our-team__body" data-our-team-body>
          <span class="our-team__icon" aria-hidden="true">
            <img
              src="/assets/icons/our-team-cube.svg"
              alt=""
              width="24"
              height="19"
            />
          </span>
          <div class="our-team__body-copy">
            <p>
              We develop and invest in AI and quantum machine learning to
              advance enterprise productivity and help address climate change.
            </p>
            <p>
              Our core team brings experience from Microsoft, Amazon, Google,
              and Capgemini Consulting. We combine senior leadership with
              hands-on engineering, supported by specialist expertise as
              requirements evolve. We serve clients from San Francisco,
              Amsterdam, and Berlin.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
});
