"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "./ui/navigation-menu";
import Link from "next/link";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Skeleton } from "./ui/skeleton";

export default function Navbar() {
  const {update, data, status} = useSession();
  return (
    <div className="flex flex-row justify-between my-5 mx-10">
      <div className="grid items-center">
        <h1 className="font-extrabold">
          ask-document
        </h1>
      </div>
      <NavigationMenu>
        <NavigationMenuList>
        <NavigationMenuItem>
          {status === 'authenticated' ?
          <>
            <NavigationMenuTrigger>
              <Avatar>
                <AvatarImage src={data.user!.image!} alt="user" />
              </Avatar>
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink onClick={() => signOut()} className={navigationMenuTriggerStyle()}>
                  Sign Out
              </NavigationMenuLink>
            </NavigationMenuContent>
          </>
            :
            status !== 'loading' ?
                <NavigationMenuLink onClick={()=> signIn()} className={navigationMenuTriggerStyle()}>
                  Sign In
                </NavigationMenuLink>
            :
            <Skeleton className="h-12 w-12 rounded-full" />
          }
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div> 
  )
}