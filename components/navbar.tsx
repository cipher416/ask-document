"use client";

import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "./ui/navigation-menu";
import Profile from "./profile";

export default function Navbar() {
  return (
    <div className="flex flex-row justify-between pt-5 mx-10 h-fit">
      <div className="grid items-center">
        <h1 className="font-extrabold">
          ask-document
        </h1>
      </div>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Profile />
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div> 
  )
}
