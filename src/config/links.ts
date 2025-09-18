import { type NavItem } from "@/types/nav";

export interface LinksConfig {
  mainNav: NavItem[];
}

export const linksConfig: LinksConfig = {
  mainNav: [
    {
      title: "Lab Results",
      href: "/dashboard/entries",
      requiresAdmin: false,
    },
    {
      title: "Users",
      href: "/dashboard/users",
      requiresAdmin: true,
    },
    {
      title: "Audit",
      href: "/dashboard/audit",
      requiresAdmin: true,
    },
  ],
};
