"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Plus, Edit, Trash2, Star, Loader2, X } from "lucide-react"
import { toast } from "sonner"

export default function AdminCharitiesPage() {
  const supabase = createClient()
  const [charities, setCharities] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCharity, setEditingCharity] = useState<any>(null)
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    website_url: "",
    registration_number: "",
    is_featured: false
  })

  useEffect(() => {
    fetchCharities()
  }, [])

  async function fetchCharities() {
    const { data } = await supabase.from("charities").select("*").order("name")
    if (data) setCharities(data)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (editingCharity) {
        const { error } = await supabase
          .from("charities")
          .update(formData)
          .eq("id", editingCharity.id)
        if (error) throw error
        toast.success("Charity updated")
      } else {
        const { error } = await supabase.from("charities").insert(formData)
        if (error) throw error
        toast.success("Charity added")
      }
      setIsModalOpen(false)
      setEditingCharity(null)
      setFormData({ name: "", description: "", website_url: "", registration_number: "", is_featured: false })
      fetchCharities()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This will remove the charity from all linked users.")) return
    try {
      const { error } = await supabase.from("charities").delete().eq("id", id)
      if (error) throw error
      toast.success("Charity deleted")
      fetchCharities()
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const toggleFeatured = async (charity: any) => {
    try {
      // First, set all to NOT featured (only one featured allowed per PRD?)
      // PRD says: "Featured / Spotlight charity (one at a time, admin selectable)"
      await supabase.from("charities").update({ is_featured: false }).neq("id", charity.id)
      
      const { error } = await supabase
        .from("charities")
        .update({ is_featured: !charity.is_featured })
        .eq("id", charity.id)
      
      if (error) throw error
      fetchCharities()
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  return (
    <div className="space-y-8 animate-in">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Charity Management</h1>
          <p className="text-neutral-charcoal/60">Add, edit, and spotlight our partner organizations.</p>
        </div>
        <Button onClick={() => { setEditingCharity(null); setIsModalOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> Add Charity
        </Button>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {charities.map((charity) => (
          <Card key={charity.id} className={cn("premium-shadow", charity.is_featured && "border-secondary ring-1 ring-secondary")}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="h-12 w-12 rounded-lg bg-neutral-gray flex items-center justify-center text-primary">
                  <Heart className="h-6 w-6" />
                </div>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="icon" onClick={() => toggleFeatured(charity)}>
                    <Star className={cn("h-4 w-4", charity.is_featured ? "fill-secondary text-secondary" : "text-neutral-charcoal/40")} />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => {
                    setEditingCharity(charity)
                    setFormData({
                      name: charity.name,
                      description: charity.description || "",
                      website_url: charity.website_url || "",
                      registration_number: charity.registration_number || "",
                      is_featured: charity.is_featured
                    })
                    setIsModalOpen(true)
                  }}>
                    <Edit className="h-4 w-4 text-primary" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(charity.id)}>
                    <Trash2 className="h-4 w-4 text-danger" />
                  </Button>
                </div>
              </div>
              <CardTitle className="mt-4 text-xl">{charity.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="line-clamp-2 text-sm text-neutral-charcoal/60 mb-4">{charity.description}</p>
              <div className="text-xs font-bold text-neutral-charcoal/40 uppercase tracking-widest">
                Reg: {charity.registration_number || "N/A"}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <Card className="w-full max-w-lg animate-in">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{editingCharity ? "Edit Charity" : "Add New Charity"}</span>
                <button onClick={() => setIsModalOpen(false)}><X className="h-6 w-6" /></button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Charity Name</label>
                  <input
                    required
                    type="text"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <textarea
                    rows={3}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Website URL</label>
                    <input
                      type="url"
                      placeholder="https://..."
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={formData.website_url}
                      onChange={(e) => setFormData({...formData, website_url: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Registration #</label>
                    <input
                      type="text"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={formData.registration_number}
                      onChange={(e) => setFormData({...formData, registration_number: e.target.value})}
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (editingCharity ? "Update Charity" : "Create Charity")}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ")
}
