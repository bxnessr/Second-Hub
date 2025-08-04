"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar } from "@/components/ui/avatar"
import { toast } from "@/components/ui/use-toast"

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
    password: "",
    profile_pic: ""
  })
  const [file, setFile] = useState<File | null>(null)

  useEffect(() => {
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
          password: "",
          profile_pic: data.profile_pic || ""
        })
      }
      setLoading(false)
    }
    fetchProfile()
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
    const fileExt = file.name.split('.').pop()
    const filePath = `avatars/${profile.id}.${fileExt}`
    const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file, { upsert: true })
    if (uploadError) {
      toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" })
      setUploading(false)
      return
    }
    const { data: publicUrl } = supabase.storage.from("avatars").getPublicUrl(filePath)
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
    const filePath = profile.profile_pic.split("/avatars/")[1]
    await supabase.storage.from("avatars").remove([`avatars/${filePath}`])
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
    if (form.password) {
      const { error: passError } = await supabase.auth.updateUser({ password: form.password })
      if (passError) {
        toast({ title: "Error updating password", description: passError.message, variant: "destructive" })
        setLoading(false)
        return
      }
    }
    toast({ title: "Profile updated" })
    setLoading(false)
  }

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="flex flex-col items-center space-y-2">
              <Avatar src={form.profile_pic || "/placeholder-user.jpg"} alt="Profile Picture" className="w-24 h-24" />
              <input type="file" accept="image/*" onChange={handleFileChange} className="block" />
              <div className="flex space-x-2">
                <Button type="button" onClick={handleUpload} disabled={uploading || !file}>
                  {uploading ? "Uploading..." : "Upload"}
                </Button>
                <Button type="button" variant="destructive" onClick={handleDeletePic} disabled={!form.profile_pic}>
                  Delete
                </Button>
              </div>
            </div>
            <Input name="nickname" type="text" placeholder="Nickname" value={form.nickname} onChange={handleChange} />
            <div className="grid grid-cols-2 gap-4">
              <Input name="first_name" type="text" placeholder="First Name" value={form.first_name} onChange={handleChange} required />
              <Input name="last_name" type="text" placeholder="Last Name" value={form.last_name} onChange={handleChange} required />
            </div>
            <Input name="email" type="email" placeholder="Email Address" value={form.email} onChange={handleChange} required />
            <Input name="password" type="password" placeholder="New Password" value={form.password} onChange={handleChange} minLength={6} />
            <Button type="submit" className="w-full bg-[#1A7F3D] hover:bg-[#1A7F3D]/90 text-white" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
