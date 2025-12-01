'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { SmartVisionIcon } from '../icons';

const navLinks = [
  { href: '#features', label: 'Features' },
  { href: '#api', label: 'API' },
  { href: '#demos', label: 'Demos' },
  { href: '/docs/api', label: 'Docs' },
];

export function Header() {
  const pathname = usePathname();
  
  const NavLink = ({ href, label }: { href: string; label: string }) => (
    <Link
      href={href}
      className={cn(
        'text-sm font-medium transition-colors hover:text-primary',
        pathname === href ? 'text-primary' : 'text-muted-foreground'
      )}
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <SmartVisionIcon className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block">
              SmartVision
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navLinks.map(link => <NavLink key={link.href} {...link} />)}
          </nav>
        </div>

        {/* Mobile Nav */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Toggle Navigation"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader className="sr-only">
              <SheetTitle>Mobile Navigation</SheetTitle>
              <SheetDescription>Main navigation menu for the SmartVision website.</SheetDescription>
            </SheetHeader>
            <Link href="/" className="mr-6 flex items-center space-x-2">
                <SmartVisionIcon className="h-6 w-6 text-primary" />
                <span className="font-bold">SmartVision</span>
            </Link>
            <div className="mt-6 flex flex-col space-y-4">
              {navLinks.map(link => (
                  <Link href={link.href} key={link.href} className="text-muted-foreground hover:text-foreground">
                      {link.label}
                  </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          
        </div>
      </div>
    </header>
  );
}
