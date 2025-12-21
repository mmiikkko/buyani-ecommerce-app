"use client";

import { LoadingButton } from "@/components/loading-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UserAvatar } from "@/components/user-avatar";
import { authClient } from "@/server/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@/server/auth-types";
import { XIcon, User as UserIcon, Save, Image as ImageIcon, CheckCircle2, AlertCircle, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CardDescription } from "@/components/ui/card";
import { toast } from "sonner";

const updateProfileSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }),
  first_name: z.string().trim().optional(),
  last_name: z.string().trim().optional(),
  image: z.string().optional().nullable(),
});

export type UpdateProfileValues = z.infer<typeof updateProfileSchema>;

interface ProfileDetailsFormProps {
  user: User;
}

export function ProfileDetailsForm({ user }: ProfileDetailsFormProps) {
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const router = useRouter();

  const form = useForm<UpdateProfileValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user.name ?? "",
      first_name: user.first_name ?? "",
      last_name: user.last_name ?? "",
      image: user.image ?? null,
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name ?? "",
        first_name: user.first_name ?? "",
        last_name: user.last_name ?? "",
        image: user.image ?? null,
      });
    }
  }, [user, form]);

  async function onSubmit(values: UpdateProfileValues) {
    setStatus(null);
    setError(null);

    const { error } = await authClient.updateUser(values);

    if (error) {
      setError(error.message || "Failed to update profile");
    } else {
      setStatus("Profile updated");
      toast.success("Profile updated successfully!");
      router.refresh();
    }
  }

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be under 10MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file");
      return;
    }

    setUploadingImage(true);
    setError(null);

    try {
      // Create FormData
      const formData = new FormData();
      formData.append('images', file);

      // Upload to Cloudinary
      const response = await fetch('/api/sellers/upload-images', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const { images } = await response.json();
      
      // Set the Cloudinary URL
      form.setValue("image", images[0].url, { shouldDirty: true });
      toast.success("Profile image uploaded successfully!");
    } catch (error) {
      console.error('Upload error:', error);
      const errorMsg = error instanceof Error ? error.message : 'Failed to upload image';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setUploadingImage(false);
      // Clear the input
      e.target.value = '';
    }
  }

  const imagePreview = form.watch("image");
  const loading = form.formState.isSubmitting;

  return (
    <Card className="flex flex-col transition-all duration-300 hover:shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#2E7D32]/10">
            <UserIcon className="h-5 w-5 text-[#2E7D32]" />
          </div>
          <div>
            <CardTitle className="text-xl">Profile Details</CardTitle>
            <CardDescription className="mt-1">
              Update your personal information and profile picture
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col flex-1">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col flex-1 gap-5"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Username</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Enter your username" 
                      className="h-10"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">First Name</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="First name" 
                        className="h-10"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Last Name</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Last name" 
                        className="h-10"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="image"
              render={() => (
                <FormItem>
                  <FormLabel className="text-sm font-medium flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    Profile Image
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-3">
                      <div className="relative">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          disabled={uploadingImage}
                          className={`h-10 cursor-pointer ${uploadingImage ? 'opacity-50' : ''}`}
                        />
                        {uploadingImage && (
                          <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded">
                            <div className="flex items-center gap-2 text-[#2E7D32] font-medium text-sm">
                              <Upload className="h-4 w-4 animate-bounce" />
                              <span>Uploading...</span>
                            </div>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        Max 10MB. Images are stored securely in the cloud.
                      </p>
                      {imagePreview && (
                        <div className="relative inline-block">
                          <div className="relative size-20 rounded-full overflow-hidden border-2 border-[#2E7D32] shadow-lg">
                            <UserAvatar
                              name={user.name}
                              image={imagePreview}
                              className="size-20"
                            />
                          </div>
                          {imagePreview.startsWith("https://res.cloudinary.com/") && (
                            <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold shadow-md">
                              ☁️
                            </div>
                          )}
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute -top-1 -right-1 size-6 rounded-full shadow-md"
                            onClick={() => form.setValue("image", null, { shouldDirty: true })}
                            aria-label="Remove image"
                          >
                            <XIcon className="size-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && (
              <div role="alert" className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}
            {status && (
              <div role="status" className="flex items-start gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-700">
                <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p>{status}</p>
              </div>
            )}

            <LoadingButton 
              className="mt-auto w-full sm:w-auto bg-[#2E7D32] hover:bg-[#2E7D32]/90 text-white" 
              type="submit" 
              loading={loading}
              disabled={uploadingImage}
            >
              <Save className="h-4 w-4 mr-2" />
              Save changes
            </LoadingButton>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}