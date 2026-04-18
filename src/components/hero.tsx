import Link from "next/link"
import { Button } from "./ui/button"
import { ArrowRight, Trophy, Heart, Target } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background py-20 lg:py-32">
      {/* Background decoration */}
      <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      
      <div className="container relative mx-auto px-4 text-center sm:px-6 lg:px-8">
        <div className="animate-in mx-auto max-w-3xl">
          <div className="mb-8 inline-flex items-center space-x-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
            </span>
            <span>Next Draw: June 1st • Jackpot $5,000</span>
          </div>
          
          <h1 className="mb-6 text-5xl font-extrabold tracking-tight sm:text-7xl">
            Track. Play. Win. <span className="gradient-text">Give.</span>
          </h1>
          
          <p className="mb-10 text-xl text-neutral-charcoal/80 sm:text-2xl leading-relaxed">
            The platform where golf meets charity. Track your scores, participate in monthly draws, and support causes you care about.
          </p>
          
          <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Subscribe Now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/how-it-works">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                How It Works
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature grid preview */}
        <div className="mt-24 grid grid-cols-1 gap-8 md:grid-cols-3">
          {[
            {
              icon: Target,
              title: "Track Performance",
              description: "Easily manage your Stableford scores and monitor your rolling window of exactly 5 recent rounds.",
            },
            {
              icon: Trophy,
              title: "Win Monthly Prizes",
              description: "Each score is a ticket to our monthly draw. Win jackpots that roll over until claimed.",
            },
            {
              icon: Heart,
              title: "Support Charity",
              description: "At least 10% of every subscription goes directly to a charity of your choice.",
            },
          ].map((feature, i) => (
            <div 
              key={i} 
              className="group rounded-2xl border bg-card p-8 transition-all hover:-translate-y-1 hover:border-primary/50 premium-shadow"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-bold">{feature.title}</h3>
              <p className="text-neutral-charcoal/70 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
