import Link from 'next/link';

const logoStyle = {
  background: 'linear-gradient(135deg, #E6007A 0%, #FF6600 100%)',
  WebkitBackgroundClip: 'text' as const,
  WebkitTextFillColor: 'transparent' as const,
  backgroundClip: 'text' as const,
  letterSpacing: '-0.1em',
};

interface LogoProps {
  /** Optional size class. Default: text-4xl sm:text-5xl md:text-6xl */
  className?: string;
  /** If true, render as span instead of link (e.g. for footer) */
  asSpan?: boolean;
}

export default function Logo({ className = 'text-4xl sm:text-5xl md:text-6xl', asSpan }: LogoProps) {
  const sharedClassName = `font-moresugar pr-1 ${className}`.trim();

  if (asSpan) {
    return (
      <span className={sharedClassName} style={logoStyle}>
        weesh
      </span>
    );
  }

  return (
    <Link href="/" className={sharedClassName} style={logoStyle}>
      weesh
    </Link>
  );
}
