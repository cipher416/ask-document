"use client";

import { NavigationMenu, NavigationMenuItem,  NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "./navigation-menu";
import Profile from "./profile";
import React, { useEffect, useState } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./select";
import DocumentService from "@/services/DocumentService";
import { UserDocuments } from "@/prisma/generated/client";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./hover-card";

function DocumentDropdownData() {
  const [documents, setDocuments] = useState<UserDocuments[]>([]);
  useEffect(()=> {
    DocumentService.getAllDocuments().then((results)=> {
      setDocuments(results);
    });
  }, [])

  return (
    <SelectContent>
      <SelectGroup>
    {documents.length != 0 ? documents.map((document)=> {
      return <SelectItem value={document.id} key={document.id}>{document.name}</SelectItem>
    }) : <></>}
      </SelectGroup>
    </SelectContent>
  );
}

export default function Navbar() {
  const router = useRouter();
  const {status} = useSession();
  return (
    <div className="flex flex-row justify-between p-5 mx-10 h-fit">
      <div className="flex space-x-10 items-center">
        <HoverCard>
            <HoverCardTrigger>
                <button onClick={()=> router.push('/')} className="font-extrabold">
                  ask-document 
                  </button>
          </HoverCardTrigger>
          <HoverCardContent>
            Made by <button onClick={() => router.push('https://github.com/cipher416/')} className="hover:underline">@cipher416</button>.
          </HoverCardContent>
        </HoverCard>
      
        {
          status === 'authenticated' ?
          <Select defaultValue='' onValueChange={(value) => {
            router.push(`/${value}`);
          }}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a document" />
            </SelectTrigger>
                <DocumentDropdownData/>
          </Select> : <></>
        }
        
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