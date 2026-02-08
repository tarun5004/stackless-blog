/**
 * About Page — tells readers what Stackless is and why it exists.
 *
 * This is a static page with hand-written content.
 * It addresses the three key questions from the IA doc:
 * 1. What is Stackless?
 * 2. Why does it exist?
 * 3. Who writes it?
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Stackless re-explains company engineering blogs — Discord, Netflix, Uber, Stripe — so students can genuinely understand real-world engineering.",
};

export default function AboutPage() {
  return (
    <article className="prose prose-lg mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1>About Stackless</h1>

      <p>
        The best engineering knowledge lives inside company engineering blogs —
        Discord, Netflix, Uber, Stripe, Meta, and dozens more. These blogs
        explain real-world system design decisions, scaling challenges,
        architecture migrations, and production incidents.
      </p>

      <p>
        <strong>The problem:</strong> almost none of this content is accessible
        to students or early-career developers.
      </p>

      <p>
        Company engineering blogs are written by senior engineers for other
        senior engineers. They assume familiarity with distributed systems
        jargon, internal tooling, and years of production experience. A student
        reading &quot;How Discord Stores Trillions of Messages&quot; hits a wall within
        two paragraphs because the post assumes you already know what consistent
        hashing, gossip protocols, or write-ahead logs are.
      </p>

      <h2>What Stackless Does</h2>

      <p>
        Stackless takes the ideas from these real engineering blogs and
        re-explains them — clearly, calmly, and completely — so that a student
        with basic CS fundamentals can follow along and genuinely understand.
      </p>

      <p>Every post on Stackless:</p>

      <ul>
        <li>
          <strong>Links to the original source</strong> — you always know where
          the ideas came from
        </li>
        <li>
          <strong>Defines technical terms inline</strong> — no jargon left
          unexplained
        </li>
        <li>
          <strong>Uses diagrams and analogies</strong> — because complex systems
          need visual mental models
        </li>
        <li>
          <strong>Ends with concrete takeaways</strong> — what you should
          remember and what to explore next
        </li>
      </ul>

      <h2>What Stackless Is Not</h2>

      <ul>
        <li>
          <strong>Not AI-generated content.</strong> Every post is written by a
          human who reads the original blog, understands it, and re-explains it.
        </li>
        <li>
          <strong>Not a summary service.</strong> Stackless doesn&apos;t shorten
          company blogs — it rebuilds the explanation from the ground up for a
          different audience.
        </li>
        <li>
          <strong>Not a marketing site.</strong> No ads. No sponsored content.
          No growth hacks. Just teaching.
        </li>
      </ul>

      <h2>Who Writes This</h2>

      <p>
        Stackless is written by{" "}
        <strong>Varun</strong>, a developer who believes
        the gap between &quot;industry knowledge&quot; and &quot;student
        understanding&quot; is a problem worth solving — one blog post at a
        time.
      </p>

      <hr />

      <p>
        Want to suggest a company engineering blog for Stackless to cover?
        Reach out via{" "}
        <a
          href="https://github.com/stackless-dev"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
        .
      </p>
    </article>
  );
}
