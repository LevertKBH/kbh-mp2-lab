import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { type UserWithRole } from "better-auth/plugins";
import { type FC } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Icons } from "../shared/icons";
import { ResponsiveModal } from "../shared/responsive-modal";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";

const formSchema = z.object({
  reason: z.string().min(1, {
    message: "Reason is required",
  }),
});

interface BanUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserWithRole;
}

const BanUserDialog: FC<BanUserDialogProps> = ({
  open,
  onOpenChange,
  user,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reason: "",
    },
  });

  const utils = api.useUtils();

  const banUser = api.users.banUser.useMutation({
    onSuccess: async () => {
      await utils.users.getAllUsers.invalidate();
      toast.success("User banned successfully");
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error("Failed to ban user", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    },
  });

  return (
    <ResponsiveModal
      title="Ban User"
      description="Are you sure you want to ban this user?"
      hasTrigger={false}
      isOpen={open}
      onOpenChange={(open) => {
        if (!open) {
          form.reset();
        }
        onOpenChange(open);
      }}
    >
      <Form {...form}>
        <form
          className="space-y-5"
          onSubmit={form.handleSubmit((data) =>
            banUser.mutate({
              userId: user.id,
              banReason: data.reason,
            }),
          )}
        >
          <FormField
            control={form.control}
            name="reason"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ban Reason</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter the reason for banning the user"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={banUser.isPending}>
            {banUser.isPending && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Ban User
          </Button>
        </form>
      </Form>
    </ResponsiveModal>
  );
};

export default BanUserDialog;
