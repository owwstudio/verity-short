import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Experience } from "~/components/oww/experience";
import { Hero } from "~/components/oww/hero";
import { OurApproach } from "~/components/oww/our-approach";
import { TheProblem } from "~/components/oww/the-problem";

export default component$(() => (
  <>
    <Hero />
    <Experience />
    <TheProblem />
    <OurApproach />
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
