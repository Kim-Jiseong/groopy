import { Home, Store, Telescope, Users } from "lucide-react";

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "groopy - Try out a professional AI Agent team in just 10 seconds. Make your own AI team in 10 minutes. ",
  description:
    "groopy - Try out a professional AI Agent team in just 10 seconds. Make your own AI team in 10 minutes",
  navItems: [
    {
      label: "Store",
      href: "/store",
      icon: Store,
    },
    {
      label: "My Groop",
      href: "/groop",
      icon: Users,
    },
    {
      label: "Studio",
      href: "/studio",
      icon: Telescope,
    },
  ],

  // --------------
  navMenuItems: [
    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Projects",
      href: "/projects",
    },
    {
      label: "Team",
      href: "/team",
    },
    {
      label: "Calendar",
      href: "/calendar",
    },
    {
      label: "Settings",
      href: "/settings",
    },
    {
      label: "Help & Feedback",
      href: "/help-feedback",
    },
    {
      label: "Logout",
      href: "/logout",
    },
  ],
  links: {
    github: "https://github.com/nextui-org/nextui",
    twitter: "https://twitter.com/getnextui",
    docs: "https://nextui.org",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
