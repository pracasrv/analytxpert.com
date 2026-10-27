import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/profit-intelligence", label: "Profit Intelligence" },
  { href: "/about", label: "About" },
];

const resourceLinks = [
  { href: "/resources/blog", label: "Blog", desc: "Profit intelligence insights for Shopify stores" },
  { href: "/resources/attribution-memory", label: "Attribution Memory", desc: "Make every order remember where it came from" },
  { href: "/resources/growth-bottleneck-finder", label: "Growth Bottleneck Finder", desc: "Find your hidden growth constraint in 5 minutes" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-6">
        <a href="/" className="text-xl font-bold">
          Analyt<span className="text-primary">X</span>pert
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navLinks.map(link => (
            <a key={link.href} href={link.href} className="transition-colors hover:text-primary">
              {link.label}
            </a>
          ))}

          <div className="relative">
            <button
              onClick={() => setResourcesOpen(!resourcesOpen)}
              className="flex items-center gap-1 transition-colors hover:text-primary"
            >
              Resources <ChevronDown className="h-4 w-4" />
            </button>
            {resourcesOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setResourcesOpen(false)} />
                <div className="absolute top-full left-0 mt-2 w-80 bg-background border border-border rounded-lg shadow-lg p-2 z-50">
                  {resourceLinks.map(link => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setResourcesOpen(false)}
                      className="block rounded-md p-3 hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      <div className="text-sm font-medium">{link.label}</div>
                      <p className="text-xs text-muted-foreground mt-0.5">{link.desc}</p>
                    </a>
                  ))}
                </div>
              </>
            )}
          </div>

          <a href="/contact" className="transition-colors hover:text-primary">Contact</a>
        </nav>

        <a
          href="https://calendly.com/pracasrv/15min"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-flex items-center h-9 px-3 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Book a Call
        </a>

        <button
          className="md:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background px-6 py-4">
          <nav className="flex flex-col space-y-4">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="text-lg font-medium transition-colors hover:text-primary"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Resources</p>
              <div className="pl-4 space-y-2">
                {resourceLinks.map(link => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="block text-base transition-colors hover:text-primary"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
            <a
              href="/contact"
              className="text-lg font-medium transition-colors hover:text-primary"
              onClick={() => setMobileOpen(false)}
            >
              Contact
            </a>
            <a
              href="https://calendly.com/pracasrv/15min"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center h-11 px-8 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Book a Call
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
