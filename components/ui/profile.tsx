import { signIn, signOut, useSession } from "next-auth/react";
import { NavigationMenuContent, NavigationMenuLink, NavigationMenuTrigger, navigationMenuTriggerStyle } from "./navigation-menu";
import { Avatar, AvatarImage } from "./avatar";
import { Skeleton } from "./skeleton";

export default function Profile() {
  const {data, status} = useSession();
  console.log(status)
  switch (status) {
    case 'authenticated':
      return (
        <>
            <NavigationMenuTrigger>
              <Avatar>
                <AvatarImage src={data.user!.image!} alt="user" referrerPolicy="no-referrer"/>
              </Avatar>
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink onClick={() => signOut()} className={navigationMenuTriggerStyle()}>
                  Sign Out
              </NavigationMenuLink>
            </NavigationMenuContent>
        </>
      )
      case "unauthenticated":
        return (
          <NavigationMenuLink onClick={()=> signIn()} className={navigationMenuTriggerStyle()}>
            Sign In
          </NavigationMenuLink>
      )
      case 'loading':
        return (
          <Skeleton className="h-12 w-12 rounded-full" />
        )
    }
  }
