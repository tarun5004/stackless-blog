/**
 * MDX component map — registers all custom JSX components available in MDX files.
 *
 * When an MDX file uses <Callout>, <Definition>, <Figure>, or <Takeaways>,
 * this map tells the MDX renderer which React component to render.
 */

import Callout from "@/components/mdx/Callout";
import Definition from "@/components/mdx/Definition";
import Figure from "@/components/mdx/Figure";
import Takeaways from "@/components/mdx/Takeaways";
import type { MDXComponents } from "mdx/types";

export function getMDXComponents(): MDXComponents {
  return {
    Callout,
    Definition,
    Figure,
    Takeaways,
  };
}
