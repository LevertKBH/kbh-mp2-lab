import { type Icons } from "@/components/shared/icons";

export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
  label?: string;
  requiresAdmin: boolean;
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}
