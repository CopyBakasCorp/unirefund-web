"use client";
import { MenuProps } from "@repo/ayasofyazilim-ui/molecules/side-bar";
import Navbar from "components/navbar";
import { Presentation, SquareStack, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { logoutAction } from "src/app/actions";
import { useConfig } from "src/providers/configuration";
import { useLocale } from "src/providers/locale";
import { useUser } from "src/providers/user";
import { getBaseLink } from "src/utils";
import Header from "../../../components/header";
import "../../globals.css";
type LayoutProps = {
  children: JSX.Element;
};

export default function Layout({ children }: LayoutProps) {
  const { user, getUser } = useUser();
  const { config, setConfig } = useConfig();
  const { cultureName, resources } = useLocale();
  const [resourcesMap, setResourcesMap] = useState<{ [key: string]: string }>({
    profile: "Profile",
    dashboard: "Dashboard",
  });

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    setResourcesMap({
      profile: resources?.AbpUi?.texts?.PersonalInfo || "Profile",
      dashboard:
        resources?.AbpForDeploy?.texts?.["Menu:Dashboard"] || "Dashboard",
    });
  }, [cultureName]);

  const router = useRouter();
  const navigationLinks = [
    {
      href: "/profile",
      text: resourcesMap.profile,
    },
    {
      href: "/dashboard",
      text: resourcesMap.dashboard,
    },
    {
      title: "Pages",
      submenu: [
        {
          title: resourcesMap.dashboard,
          href: "/dashboard",
          description: "Show the user dashboard.",
        },
        {
          title: resourcesMap.profile,
          href: "/profile",
          description: "Show the user profile",
        },
      ],
    },
  ];
  const exampleMenus: MenuProps[] = [
    {
      label: "Pages",
      name: resourcesMap.profile,
      icon: <User size={15} className="mr-2" />,
      href: getBaseLink("profile", true),
    },
    {
      label: "Pages",
      name: resourcesMap.dashboard,
      icon: <SquareStack size={15} className="mr-2" />,
      href: getBaseLink("dashboard", true),
    },
    {
      label: "Pages",
      name: "Projects",
      icon: <Presentation size={15} className="mr-2" />,
      href: getBaseLink("projects", true),
    },
    {
      label: "Settings",
      name: "Settings",
      icon: <Presentation size={15} className="mr-2" />,
      href: getBaseLink("settings/profile", true),
    },
  ];
  const userNavigation = {
    username: user?.name,
    initials: user?.name?.substring(0, 2).toUpperCase(),
    email: user?.email,
    imageURL: "https://github.com/shadcn.png",
    menuLinks: [
      {
        href: "profile",
        text: resourcesMap.profile,
        shortcut: "⌘P",
      },
      {
        href: "dashboard",
        text: resourcesMap.dashboard,
        shortcut: "⌘D",
      },
    ],
    logoutFunction: async () => {
      logoutAction();
    },
  };
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="flex flex-col z-90 border-b border-gray-100">
        <Header />
        <Navbar />
      </div>
      <div className="container overflow-hidden flex">{children}</div>
      {/* h-full removed */}
    </div>
  );
}