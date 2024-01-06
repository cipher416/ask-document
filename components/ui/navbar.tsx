"use client";

import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "./navigation-menu";
import Profile from "./profile";
import React from "react";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./select";

export default function Navbar() {
  return (
    <div className="flex flex-row justify-between p-5 mx-10 h-fit">
      <div className="flex space-x-10 items-center">
        <h1 className="font-extrabold">
          ask-document
        </h1>
        <Select defaultValue="" onValueChange={(value) => {
              console.log(value)
            }}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a fruit" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="apple">Apple</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
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