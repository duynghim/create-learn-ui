'use client';

import DOMPurify from 'isomorphic-dompurify';

type Props = {
  readonly html: string;
  readonly transform?: (clean: string) => string;
  readonly className?: string;
};

export default function SafeHtml({ html, transform, className }: Props) {
  const clean = DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed'],
    FORBID_ATTR: ['onerror', 'onclick', 'style'],
    ALLOWED_URI_REGEXP:
      /^(?:(?:https?|mailto):|[^a-z]|[a-z+.]+(?:[^a-z+.\-:]|$))/i,
    ADD_ATTR: ['target', 'rel'],
  });

  const finalHtml = transform ? transform(clean) : clean;

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: finalHtml }}
    />
  );
}
