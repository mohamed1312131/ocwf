/**
 * QR code block with a marked slot for a static image.
 *
 * Renders NOTHING until a real QR image is supplied via `src`.
 * TODO(qr-image): when a static QR image is ready, pass its path to `src`.
 * No QR-generation dependency is used on purpose.
 */
export function QRCodeBlock({
  src,
  href,
  caption,
  className = '',
}: {
  src?: string;
  href?: string;
  caption?: string;
  className?: string;
}) {
  if (!src) return null;

  const inner = (
    <div className="rounded-2xl bg-white p-3 shadow-card">
      <img src={src} alt={caption} loading="lazy" decoding="async" width={144} height={144} className="h-36 w-36" />
    </div>
  );

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          {inner}
        </a>
      ) : (
        inner
      )}
      {caption ? <p className="text-sm text-text-secondary">{caption}</p> : null}
    </div>
  );
}