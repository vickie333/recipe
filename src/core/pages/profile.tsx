"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/core/hooks/useAuth"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/core/components/ui/button"
import { Input } from "@/core/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/core/components/ui/card"
import { Alert, AlertDescription } from "@/core/components/ui/alert"
import { User, Mail, Lock, CheckCircle2 } from "lucide-react"
import { Spinner } from "@/core/components/ui/spinner"

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  password: z.string().min(5, "Password must be at least 5 characters").optional().or(z.literal("")),
  confirmPassword: z.string().optional(),
}).refine((data) => {
  if (data.password && data.password.length > 0) {
    return data.password === data.confirmPassword
  }
  return true
}, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type ProfileFormValues = z.infer<typeof profileSchema>

export default function Profile() {
  const { user, updateProfile, isLoading: authLoading } = useAuth()
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  })

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        password: "",
        confirmPassword: "",
      })
    }
  }, [user, reset])

  const onSubmit = async (data: ProfileFormValues) => {
    setError(null)
    setSuccess(false)
    setIsUpdating(true)

    try {
      const updateData: { name: string; password?: string } = {
        name: data.name,
      }

      if (data.password && data.password.length > 0) {
        updateData.password = data.password
      }

      await updateProfile(updateData)
      setSuccess(true)

      // Reset password fields
      reset({
        name: data.name,
        password: "",
        confirmPassword: "",
      })
    } catch (err: any) {
      setError(err.message || "Failed to update profile")
    } finally {
      setIsUpdating(false)
    }
  }

  if (authLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account information and preferences.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Account Information
          </CardTitle>
          <CardDescription>Update your personal details and security settings.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-primary/50 bg-primary/5">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <AlertDescription className="text-primary">Profile updated successfully!</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  Email Address
                </label>
                <Input value={user?.email || ""} disabled className="bg-muted/50 cursor-not-allowed" />
                <p className="text-xs text-muted-foreground">Email address cannot be changed</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  Full Name
                </label>
                <Input {...register("name")} />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>

              <div className="pt-4 border-t">
                <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  Change Password
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">New Password</label>
                    <Input type="password" placeholder="Leave blank to keep current" {...register("password")} />
                    {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Confirm New Password</label>
                    <Input
                      type="password"
                      placeholder="Confirm new password"
                      {...register("confirmPassword")}
                    />
                    {errors.confirmPassword && (
                      <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isUpdating} className="min-w-[120px]">
                {isUpdating ? (
                  <>
                    <Spinner size="sm" className="mr-2" /> Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Statistics</CardTitle>
          <CardDescription>Your recipe management activity.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-muted/30 border text-center">
              <p className="text-2xl font-bold text-primary">-</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Recipes</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30 border text-center">
              <p className="text-2xl font-bold text-primary">-</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Tags</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30 border text-center">
              <p className="text-2xl font-bold text-primary">-</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Ingredients</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-4 italic">
            Statistics coming soon - keep creating recipes!
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
