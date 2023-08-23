'use client';

import { signOut } from 'next-auth/react';

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from './ui/dropdown-menu';

import useLoginModal from '@/hooks/useLoginModal';
import { LogIn, LogOut, Settings, User, User2 } from 'lucide-react';

interface UserNavProps {
  currentuser: any;
}

export function UserNav({ currentuser }: UserNavProps) {
  const { onOpen } = useLoginModal();

  return (
    <>
      {!currentuser ? (
        <>
          <Button onClick={onOpen} variant={'outline'} className="gap-2">
            Log in
            <LogIn size={16} />
          </Button>
          {/* <Button
            onClick={() => signIn('cognito')}
            variant={'outline'}
            className="gap-2"
          >
            LogIn
            <LogIn size={16} />
          </Button> */}
        </>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="group flex-shrink-0 rounded-full"
            >
              <div className="flex items-center">
                <div>
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={currentuser?.user.image}
                      alt="user avatar"
                    />
                    <AvatarFallback>
                      <User2 size={16} className="text-indigo-500/80" />
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="ml-3">
                  <p className="text-xs font-medium text-gray-400 group-hover:text-indigo-700">
                    {currentuser?.user.email}
                  </p>
                </div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {currentuser?.user.name}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {currentuser?.user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                Profile
                <DropdownMenuShortcut>
                  <User size={16} />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                Settings
                <DropdownMenuShortcut>
                  <Settings size={16} />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}>
              Log out
              <DropdownMenuShortcut>
                <LogOut size={16} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
}
