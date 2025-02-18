import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";

type ResponsiveModalWithTrigger = {
  hasTrigger: true;
  trigger: React.ReactNode;
};

type ResponsiveModalWithoutTrigger = {
  hasTrigger: false;
};

type ResponsiveModalProps = {
  children: React.ReactNode;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onCloseAutoFocus?: () => void;
} & (ResponsiveModalWithTrigger | ResponsiveModalWithoutTrigger);

export function ResponsiveModal({
  children,
  isOpen,
  onOpenChange,
  title,
  description,
  onCloseAutoFocus,
  ...props
}: ResponsiveModalProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        {props.hasTrigger && (
          <DialogTrigger asChild>{props.trigger}</DialogTrigger>
        )}
        <DialogContent
          className="sm:max-w-[475px]"
          onCloseAutoFocus={onCloseAutoFocus}
        >
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      {props.hasTrigger && (
        <DrawerTrigger asChild>{props.trigger}</DrawerTrigger>
      )}
      <DrawerContent className="px-5" onCloseAutoFocus={onCloseAutoFocus}>
        <DrawerHeader className="px-0 text-left">
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        {children}
        <DrawerFooter className="px-0 pt-2">
          <DrawerClose asChild className="px-0">
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
