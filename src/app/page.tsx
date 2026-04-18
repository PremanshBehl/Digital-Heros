import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        
        {/* Why Join Section */}
        <section className="bg-neutral-gray/30 py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
              <div>
                <h2 className="mb-6 text-4xl font-extrabold lg:text-5xl">
                  More Than Just a Score Tracker.
                </h2>
                <p className="mb-8 text-lg text-neutral-charcoal/80">
                  Digital Heroes transforms your golf hobby into a force for good. While you focus on improving your game, we ensure your participation supports vital causes and rewards your consistency.
                </p>
                <div className="space-y-4">
                  {[
                    "Automated charity contributions from every plan",
                    "Fair prize distribution with algorithmic draw options",
                    "Transparent winner verification system",
                    "Easy-to-use mobile-first score entry",
                  ].map((text, i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <CheckCircle2 className="h-6 w-6 text-success" />
                      <span className="font-medium text-neutral-charcoal">{text}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-10">
                  <Link href="/signup">
                    <Button variant="secondary" size="lg">
                      Get Started <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary to-secondary p-1">
                  <div className="h-full w-full rounded-[1.4rem] bg-card flex items-center justify-center p-8">
                    {/* Placeholder for an image or graphic */}
                    <div className="text-center">
                      <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <CheckCircle2 className="h-10 w-10" />
                      </div>
                      <h3 className="text-2xl font-bold">Verified Impact</h3>
                      <p className="mt-2 text-neutral-charcoal/70">Over $50,000 donated to local charities this year.</p>
                    </div>
                  </div>
                </div>
                {/* Floaties */}
                <div className="absolute -bottom-6 -right-6 rounded-2xl bg-white p-6 shadow-2xl premium-shadow">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-success/20 flex items-center justify-center text-success">
                      <Target className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="text-sm font-bold">New Winner!</div>
                      <div className="text-xs text-neutral-charcoal/60">J.S. won $1,250</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Charity Preview */}
        <section className="py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="mb-4 text-3xl font-extrabold sm:text-4xl">Supporting Local Heroes</h2>
            <p className="mb-12 text-neutral-charcoal/70 max-w-2xl mx-auto">
              Choose from hundreds of verified charities. Your play directly fuels their mission.
            </p>
            
            {/* Simple preview of 3 charities */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-2xl border p-6 premium-shadow">
                  <div className="mb-4 h-16 w-16 mx-auto bg-neutral-gray rounded-lg" />
                  <h3 className="text-xl font-bold mb-2">Charity Name {i}</h3>
                  <p className="text-sm text-neutral-charcoal/70 mb-4">Dedicated to providing clean water and health services to communities in need.</p>
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">Learn More</Button>
                </div>
              ))}
            </div>
            
            <div className="mt-12">
              <Link href="/charities">
                <Button variant="outline">Browse All Charities</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="border-t bg-neutral-charcoal py-12 text-neutral-gray">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
            <div className="col-span-1 md:col-span-2">
              <Link href="/" className="flex items-center space-x-2 text-white">
                <Trophy className="h-6 w-6" />
                <span className="text-xl font-bold tracking-tight">Digital Heroes</span>
              </Link>
              <p className="mt-4 max-w-sm text-neutral-gray/60">
                A subscription-driven golf platform making a difference. Join us in supporting local charities while tracking your performance and winning prizes.
              </p>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">Platform</h4>
              <ul className="space-y-2 text-sm text-neutral-gray/60">
                <li><Link href="/how-it-works" className="hover:text-secondary">How It Works</Link></li>
                <li><Link href="/charities" className="hover:text-secondary">Charities</Link></li>
                <li><Link href="/draws" className="hover:text-secondary">Draws</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">Legal</h4>
              <ul className="space-y-2 text-sm text-neutral-gray/60">
                <li><Link href="/privacy" className="hover:text-secondary">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-secondary">Terms of Service</Link></li>
                <li><Link href="/contact" className="hover:text-secondary">Contact Us</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-white/10 pt-8 text-center text-xs text-neutral-gray/40">
            © {new Date().getFullYear()} Digital Heroes. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

// Helper icons for the page
function Target(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function Trophy(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}
