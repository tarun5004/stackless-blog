/**
 * TopicTag — a small label/link for displaying a topic category.
 *
 * Used in post cards, post headers, and anywhere a topic needs
 * to be displayed as a clickable tag.
 */

import Link from "next/link";

interface TopicTagProps {
  slug: string;
  name: string;
  /** If true, renders as a plain span instead of a link */
  asLabel?: boolean;
}

export default function TopicTag({ slug, name, asLabel = false }: TopicTagProps) {
  const classes =
    "inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-600 transition-colors";

  if (asLabel) {
    return <span className={classes}>{name}</span>;
  }

  return (
    <Link href={`/topics/${slug}`} className={`${classes} hover:bg-brand-600 hover:text-white`}>
      {name}
    </Link>
  );
}
