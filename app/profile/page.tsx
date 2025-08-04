"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar } from "@/components/ui/avatar"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    nickname: "",
    email: "",
    profile_pic: ""
  })
  const [file, setFile] = useState<File | null>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    let subscription: any = null
    const fetchProfile = async () => {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/signin")
        return
      }
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()
      if (error) {
        toast({ title: "Error fetching profile", description: error.message, variant: "destructive" })
      } else {
        setProfile(data)
        setForm({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          nickname: data.nickname || "",
          email: user.email || "",
          profile_pic: data.profile_pic || ""
        })
      }
      // Subscribe to real-time updates for this user's profile
      subscription = supabase
        .channel('profile-updates')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user.id}`
        }, payload => {
          if (payload.new) {
            setProfile(payload.new)
            setForm(f => ({ ...f, ...payload.new }))
          }
        })
        .subscribe()
      setLoading(false)
    }
    fetchProfile()
    return () => {
      if (subscription) supabase.removeChannel(subscription)
    }
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) return
    setUploading(true)
    // Delete old file if exists
    if (profile?.profile_pic) {
      const oldPath = profile.profile_pic.split("/profile_pics/")[1]
      if (oldPath) await supabase.storage.from("profile_pics").remove([`profile_pics/${oldPath}`])
    }
    const fileExt = file.name.split('.').pop()
    const filePath = `profile_pics/${profile.id}/${Date.now()}.${fileExt}`
    const { error: uploadError } = await supabase.storage.from("profile_pics").upload(filePath, file, { upsert: true })
    if (uploadError) {
      toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" })
      setUploading(false)
      return
    }
    const { data: publicUrl } = supabase.storage.from("profile_pics").getPublicUrl(filePath)
    const { error: updateError } = await supabase.from("profiles").update({ profile_pic: publicUrl.publicUrl }).eq("id", profile.id)
    if (updateError) {
      toast({ title: "Error updating profile pic", description: updateError.message, variant: "destructive" })
    } else {
      setForm({ ...form, profile_pic: publicUrl.publicUrl })
      setProfile({ ...profile, profile_pic: publicUrl.publicUrl })
      toast({ title: "Profile picture updated" })
    }
    setUploading(false)
  }

  const handleDeletePic = async () => {
    if (!profile.profile_pic) return
    const filePath = profile.profile_pic.split("/profile_pics/")[1]
    await supabase.storage.from("profile_pics").remove([`profile_pics/${filePath}`])
    const { error } = await supabase.from("profiles").update({ profile_pic: null }).eq("id", profile.id)
    if (error) {
      toast({ title: "Error deleting profile pic", description: error.message, variant: "destructive" })
    } else {
      setForm({ ...form, profile_pic: "" })
      setProfile({ ...profile, profile_pic: "" })
      toast({ title: "Profile picture deleted" })
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const updates: any = {
      first_name: form.first_name,
      last_name: form.last_name,
      nickname: form.nickname
    }
    if (form.profile_pic) updates.profile_pic = form.profile_pic
    const { error } = await supabase.from("profiles").update(updates).eq("id", profile.id)
    if (error) {
      toast({ title: "Error updating profile", description: error.message, variant: "destructive" })
      setLoading(false)
      return
    }
    if (form.email && form.email !== profile.email) {
      const { error: emailError } = await supabase.auth.updateUser({ email: form.email })
      if (emailError) {
        toast({ title: "Error updating email", description: emailError.message, variant: "destructive" })
        setLoading(false)
        return
      }
    }
    toast({ title: "Profile updated" })
    setLoading(false)
  }

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-2 sm:p-6">
      <Card className="w-full max-w-lg mx-auto shadow-xl p-2 sm:p-6">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-3xl font-bold text-gray-900">Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-8">
            <div className="flex flex-col items-center space-y-4">
              <div className="rounded-full overflow-hidden w-28 h-28 sm:w-32 sm:h-32 border-2 border-[#1A7F3D] bg-white flex items-center justify-center shadow">
                {/* Avatar image fallback for responsiveness */}
                {form.profile_pic ? (
                  <img src={form.profile_pic} alt="Profile Picture" className="object-cover w-full h-full" />
                ) : (
                  <img src="/placeholder-user.jpg" alt="Profile Placeholder" className="object-cover w-full h-full" />
                )}
              </div>
              <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-2 sm:space-y-0 mt-2 w-full justify-center items-center">
                <input type="file" accept="image/*" onChange={handleFileChange} className="block w-full sm:w-auto" />
                <Button type="button" onClick={handleUpload} disabled={uploading || !file} className="w-full sm:w-auto">
                  {uploading ? "Uploading..." : "Upload"}
                </Button>
                <Button type="button" variant="secondary" onClick={() => setShowModal(true)} disabled={!form.profile_pic} className="w-full sm:w-auto">
                  View
                </Button>
                <Button type="button" variant="destructive" onClick={handleDeletePic} disabled={!form.profile_pic} className="w-full sm:w-auto">
                  Delete
                </Button>
              </div>
            </div>
            <Input name="nickname" type="text" placeholder="Nickname" value={form.nickname} onChange={handleChange} className="mt-2" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input name="first_name" type="text" placeholder="First Name" value={form.first_name} onChange={handleChange} required />
              <Input name="last_name" type="text" placeholder="Last Name" value={form.last_name} onChange={handleChange} required />
            </div>
            <Input name="email" type="email" placeholder="Email Address" value={form.email} onChange={handleChange} required className="mt-2" />
            <Link href="/settings" className="block text-sm text-blue-600 hover:underline mb-2 mt-1">Change Password</Link>
            <Button type="submit" className="w-full bg-[#1A7F3D] hover:bg-[#1A7F3D]/90 text-white text-lg py-3" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
          {/* Modal for viewing profile picture */}
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-2">
              <div className="bg-white rounded-lg p-6 flex flex-col items-center max-w-xs w-full shadow-2xl">
                <img src={form.profile_pic} alt="Profile" className="w-48 h-48 sm:w-64 sm:h-64 rounded-full object-cover mb-4" />
                <Button onClick={() => setShowModal(false)} className="w-full">Close</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
