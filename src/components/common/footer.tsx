import Link from 'next/link';
import { SmartVisionIcon } from '../icons';

export function Footer() {
  return (
    <footer className="w-full border-t bg-card text-card-foreground">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <SmartVisionIcon className="h-6 w-6 text-primary" />
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by SmartVision. © {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
        <nav className="flex gap-4 sm:gap-6">
          <Link href="/docs/api" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Docs
          </Link>
          <Link href="/#demos" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Demos
          </Link>
          <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Terms
          </Link>
          <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Privacy
          </Link>
        </nav>
      </div>
    </footer>
  );
}
