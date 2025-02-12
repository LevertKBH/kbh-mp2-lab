"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import {
  type BetterAuthCreateUser,
  betterAuthCreateUserSchema,
} from "@/types/user-model";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle } from "lucide-react";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Icons } from "../shared/icons";
import { ResponsiveModal } from "../shared/responsive-modal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

export default function CreateUserDialog() {
  const id = useId();

  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<BetterAuthCreateUser>({
    resolver: zodResolver(betterAuthCreateUserSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "user",
      name: "",
    },
  });

  const utils = api.useUtils();
  const createUser = api.users.createUser.useMutation({
    onSuccess: async () => {
      await utils.users.getAllUsers.invalidate();
      form.reset();
      setIsOpen(false);
      toast.success("User created", {
        description: "User has been created successfully",
      });
    },
    onError: (error) => {
      toast.error("Failed to create user", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    },
  });

  return (
    <ResponsiveModal
      title="Create User"
      description="Create a new user for this organization."
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          form.reset();
        }
        setIsOpen(open);
      }}
      hasTrigger
      trigger={
        <Button variant="outline" size="sm">
          <PlusCircle className="mr-1 h-4 w-4" />
          Create User
        </Button>
      }
    >
      <Form {...form}>
        <form
          className="space-y-5"
          onSubmit={form.handleSubmit((data) =>
            createUser.mutate({
              email: data.email,
              password: data.password,
              name: data.name,
              role: data.role as "admin" | "user",
            }),
          )}
        >
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor={`${id}-name`}>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      id={`${id}-name`}
                      placeholder="Matt"
                      type="text"
                      autoComplete="given-name"
                      required
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor={`${id}-email`}>Email</FormLabel>
                  <FormControl>
                    <Input
                      id={`${id}-email`}
                      placeholder="hi@yourcompany.com"
                      type="email"
                      autoComplete="email"
                      required
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor={`${id}-password`}>Password</FormLabel>
                  <FormControl>
                    <Input
                      id={`${id}-password`}
                      placeholder="Enter your password"
                      type="password"
                      autoComplete="new-password"
                      required
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <FormControl>
                  <RadioGroup
                    className="gap-2"
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormItem>
                      <FormControl>
                        <div className="relative flex w-full items-center gap-2 rounded-lg border border-input px-4 py-3 shadow-sm shadow-black/5 has-[[data-state=checked]]:border-ring has-[[data-state=checked]]:bg-accent">
                          <RadioGroupItem
                            value="user"
                            id={`${id}-user`}
                            aria-describedby={`${id}-user-description`}
                            className="order-1 after:absolute after:inset-0"
                          />
                          <div className="grid grow gap-1">
                            <Label htmlFor={`${id}-user`}>Member</Label>
                            <p
                              id={`${id}-user-description`}
                              className="text-xs text-muted-foreground"
                            >
                              Not able to access user management
                            </p>
                          </div>
                        </div>
                      </FormControl>
                    </FormItem>
                    <FormItem>
                      <FormControl>
                        <div className="relative flex w-full items-center gap-2 rounded-lg border border-input px-4 py-3 shadow-sm shadow-black/5 has-[[data-state=checked]]:border-ring has-[[data-state=checked]]:bg-accent">
                          <RadioGroupItem
                            value="admin"
                            id={`${id}-admin`}
                            aria-describedby={`${id}-admin-description`}
                            className="order-1 after:absolute after:inset-0"
                          />
                          <div className="grid grow gap-1">
                            <Label htmlFor={`${id}-admin`}>Admin</Label>
                            <p
                              id={`${id}-admin-description`}
                              className="text-xs text-muted-foreground"
                            >
                              Able to access user management
                            </p>
                          </div>
                        </div>
                      </FormControl>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full"
            disabled={createUser.isPending}
          >
            {createUser.isPending && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Create User
          </Button>
        </form>
      </Form>
    </ResponsiveModal>
  );
}
