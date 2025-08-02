"use client";

import { useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Leaf, UploadCloud } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    address: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
      setAvatarUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      let avatarPublicUrl = null;
      if (avatarFile) {
        const { data, error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(`public/${Date.now()}_${avatarFile.name}`, avatarFile, {
            cacheControl: "3600",
            upsert: false,
          });
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(data.path);
        avatarPublicUrl = urlData.publicUrl;
      }
      // Get current user
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) throw userError || new Error("User not found");
      // Save profile
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: userData.user.id,
        first_name: form.firstName,
        last_name: form.lastName,
        address: form.address,
        phone: form.phone,
        avatar_url: avatarPublicUrl,
        updated_at: new Date().toISOString(),
      });
      if (profileError) throw profileError;
      setSuccess("Profile completed! Redirecting to dashboard...");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Failed to complete onboarding");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Leaf className="h-8 w-8 text-[#1A7F3D]" />
            <span className="text-2xl font-bold text-[#1A7F3D]">Bioloop Hub</span>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Welcome to Bioloop Hub!</CardTitle>
          <p className="text-gray-600">Complete your profile to get started</p>
        </CardHeader>
        <CardContent>
          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-6">
            <div className={`h-2 w-24 rounded-full ${step >= 1 ? "bg-[#1A7F3D]" : "bg-gray-200"}`}></div>
            <div className={`h-2 w-24 rounded-full mx-2 ${step >= 2 ? "bg-[#1A7F3D]" : "bg-gray-200"}`}></div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">{error}</div>}
            {success && <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md text-sm">{success}</div>}
            <div className="flex flex-col items-center space-y-2">
              <div className="relative w-24 h-24 mb-2">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar preview" className="w-24 h-24 rounded-full object-cover border-2 border-[#1A7F3D]" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-[#1A7F3D]">
                    <UploadCloud className="h-8 w-8 text-[#1A7F3D]" />
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                  disabled={loading}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="absolute bottom-0 right-0 bg-white border border-[#1A7F3D] text-[#1A7F3D]"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading}
                >
                  Upload
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                name="firstName"
                type="text"
                placeholder="First Name"
                value={form.firstName}
                onChange={handleChange}
                required
                disabled={loading}
              />
              <Input
                name="lastName"
                type="text"
                placeholder="Last Name"
                value={form.lastName}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            <Input
              name="address"
              type="text"
              placeholder="Home Address"
              value={form.address}
              onChange={handleChange}
              required
              disabled={loading}
            />
            <Input
              name="phone"
              type="tel"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              required
              disabled={loading}
            />
            <Button type="submit" className="w-full bg-[#1A7F3D] hover:bg-[#1A7F3D]/90 text-white" disabled={loading}>
              {loading ? "Completing..." : "Complete Onboarding"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
