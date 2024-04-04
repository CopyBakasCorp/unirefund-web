"use client";
import {
  CountrySelector,
  lang,
} from "@repo/ayasofyazilim-ui/organisms/country-selector";
import Mainlayout from "@repo/ayasofyazilim-ui/templates/mainlayout";
import { Volo_Abp_Account_ProfileDto } from "ayasofyazilim-saas/AccountService";
import { Presentation, SquareStack, User } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  JSXElementConstructor,
  ReactElement,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { useLocale } from "src/providers/locale";
import "./../../globals.css";

type LayoutProps = {
  children: ReactElement<any, string | JSXElementConstructor<any>>;
};

type MenuProps = {
  href: string;
  icon: ReactNode;
  label: string;
  name: string;
  submenu?: Submenu[];
};

type Submenu = {
  href: string;
  icon: ReactNode;
  name: string;
};

export default function Layout({ children }: LayoutProps) {
  const { cultureName, resources, changeLocale } = useLocale();
  const [resourcesMap, setResourcesMap] = useState<{ [key: string]: string }>({
    profile: "Profile",
    dashboard: "Dashboard",
  });

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
      href: "profile",
    },
    {
      label: "Pages",
      name: resourcesMap.dashboard,
      icon: <SquareStack size={15} className="mr-2" />,
      href: "dashboard",
    },
    {
      label: "Pages",
      name: "Projects",
      icon: <Presentation size={15} className="mr-2" />,
      href: "projects",
    },
  ];
  let [user, setUser] = useState<Volo_Abp_Account_ProfileDto | null>({});
  // use effect to fetch the user from the server
  useEffect(() => {
    async function getUser() {
      let fetchedUser = await fetch("api/profile/myprofile");
      let userData = (await fetchedUser.json()) as Volo_Abp_Account_ProfileDto;
      console.log(userData);
      setUser(userData);
    }
    getUser();
  }, []);
  const userNavigation = {
    username: user?.name,
    initials: user?.name?.substring(0, 2).toUpperCase(),
    email: user?.email,
    imageURL: "https://github.com/a0m0rajab.png",
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
      let result = await fetch("/api/auth/logout");
      if (result.ok === false) {
        console.error("Failed to logout");
        return;
      }
      router.push("/");
    },
  };
  return (
    <Mainlayout
      logo="https://github.com/ayasofyazilim-clomerce.png"
      title="ayasofya"
      menus={exampleMenus}
      userNav={userNavigation}
      navMenu={navigationLinks}
      extraMenu={
        <CountrySelector
          menuAlign="end"
          countries={lang.countries}
          defaultValue={cultureName}
          onValueChange={changeLocale}
        />
      }
    >
      <>{children}</>
    </Mainlayout>
  );
}
