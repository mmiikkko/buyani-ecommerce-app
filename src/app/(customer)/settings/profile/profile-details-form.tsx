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
import { XIcon, User as UserIcon, Save, Image as ImageIcon, CheckCircle2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CardDescription } from "@/components/ui/card";

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
      router.refresh();
    }
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      form.setValue("image", base64, { shouldDirty: true });
    };
    reader.readAsDataURL(file);
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
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="h-10 cursor-pointer"
                      />
                      {imagePreview && (
                        <div className="relative inline-block">
                          <div className="relative size-20 rounded-full overflow-hidden border-2 border-[#2E7D32]">
                            <UserAvatar
                              name={user.name}
                              image={imagePreview}
                              className="size-20"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute -top-1 -right-1 size-6 rounded-full shadow-md"
                            onClick={() => form.setValue("image", null)}
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
