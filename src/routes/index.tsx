import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { DecisionCta } from "~/components/oww/decision-cta";
import { EnterpriseSystem } from "~/components/oww/enterprise-system";
import { Experience } from "~/components/oww/experience";
import { Hero } from "~/components/oww/hero";
import { OurApproach } from "~/components/oww/our-approach";
import { OurTeam } from "~/components/oww/our-team";
import { TheProblem } from "~/components/oww/the-problem";

export default component$(() => (
  <>
    <Hero />
    <Experience />
    <TheProblem />
    <OurApproach />
    <EnterpriseSystem />
    <OurTeam />
    <DecisionCta />
  </>
));

export const head: DocumentHead = {
  title: "Helge Heupel",
  meta: [
    {
      name: "description",
      content:
        "Enterprise Decision Management for better, faster business decisions.",
    },
  ],
};
