import Link from 'next/link';

interface LogoProps {
  /** Optional size class. Default: text-4xl sm:text-5xl md:text-6xl */
  className?: string;
  /** If true, render as span instead of link (e.g. for footer) */
  asSpan?: boolean;
}

export default function Logo({ className = 'text-4xl sm:text-5xl md:text-6xl', asSpan }: LogoProps) {
  const sharedClassName = `font-moresugar pr-1 theme-gradient-text-135 tracking-[-0.1em] ${className}`.trim();

  if (asSpan) {
    return <span className={sharedClassName}>weesh</span>;
  }

  return (
    <Link href="/" className={sharedClassName}>
      weesh
    </Link>
  );
}
