import { type NavItem } from "@/types/nav";

export interface LinksConfig {
  mainNav: NavItem[];
}

export const linksConfig: LinksConfig = {
  mainNav: [
    {
      title: "Entries",
      href: "/authenticated/entries",
      requiresAdmin: false,
    },
    {
      title: "Users",
      href: "/authenticated/users",
      requiresAdmin: true,
    },
    {
      title: "Audit",
      href: "/authenticated/audit",
      requiresAdmin: true,
    },
  ],
};
