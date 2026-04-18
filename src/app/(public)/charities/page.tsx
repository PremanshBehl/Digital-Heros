import { createClient } from "@/utils/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, Filter, ExternalLink, Heart } from "lucide-react"
import Link from "next/link"

export default async function CharitiesPage() {
  const supabase = await createClient()
  
  const { data: charities } = await supabase
    .from("charities")
    .select("*")
    .order("is_featured", { ascending: false })

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <section className="bg-primary py-20 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-4xl font-extrabold sm:text-6xl">Our Heroes</h1>
          <p className="mx-auto max-w-2xl text-lg opacity-80 sm:text-xl">
            Meet the organizations on the front lines. Your subscription fuels their impact every single month.
          </p>
        </div>
      </section>

      <div className="container mx-auto mt-12 px-4 sm:px-6 lg:px-8">
        {/* Search & Filters */}
        <div className="mb-12 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-charcoal/40" />
            <input
              type="text"
              placeholder="Search charities by name or cause..."
              className="w-full rounded-full border border-input bg-card pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring premium-shadow"
            />
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" className="rounded-full">
              <Filter className="mr-2 h-4 w-4" /> All Categories
            </Button>
            <Button variant="outline" className="rounded-full">
              Featured First
            </Button>
          </div>
        </div>

        {/* Charity Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {charities && charities.length > 0 ? (
            charities.map((charity) => (
              <Card key={charity.id} className="group overflow-hidden transition-all hover:-translate-y-1">
                <div className="relative h-48 w-full bg-neutral-gray/30">
                  {charity.logo_url ? (
                    <img src={charity.logo_url} alt={charity.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-neutral-charcoal/20">
                      <Heart className="h-16 w-16" />
                    </div>
                  )}
                  {charity.is_featured && (
                    <div className="absolute top-4 right-4 rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground shadow-lg">
                      Featured
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {charity.name}
                    {charity.website_url && (
                      <a href={charity.website_url} target="_blank" rel="noopener noreferrer" className="text-neutral-charcoal/40 hover:text-primary">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-3 text-sm text-neutral-charcoal/70 mb-6">
                    {charity.description || "No description provided."}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="text-xs text-neutral-charcoal/50">
                      ID: {charity.registration_number || "Pending"}
                    </div>
                    <Link href={`/charities/${charity.id}`}>
                      <Button variant="outline" size="sm">View Profile</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            // Empty State
            <div className="col-span-full py-24 text-center">
              <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-neutral-gray flex items-center justify-center text-neutral-charcoal/20">
                <Search className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold">No charities found</h3>
              <p className="text-neutral-charcoal/60">Try adjusting your search filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
