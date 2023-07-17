'use client';

import { signIn, signOut } from 'next-auth/react';
import { cookies } from 'next/headers';
import { toast } from 'react-hot-toast';

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

import axios from 'axios';
import { LogIn, LogOut, Settings, User, User2 } from 'lucide-react';

interface UserNavProps {
  currentUser: any;
}

export function UserNav({ currentUser }: UserNavProps) {
  const login = async () => {
    axios
      .post('/api/login', {
        Username: 'test@email.com',
        Password: '123456'
      })
      .then((response) => {
        console.log(response);
        toast.success('User Logged In!');
      })
      .catch(() => {
        toast.error('Something went wrong!');
      });
  };

  return (
    <>
      {!currentUser ? (
        <Button onClick={() => signIn()} variant={'outline'} className="gap-2">
          LogIn
          <LogIn size={16} />
        </Button>
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
                      src={currentUser?.user.image}
                      alt="user avatar"
                    />
                    <AvatarFallback>
                      <User2 size={16} className="text-indigo-500/80" />
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="ml-3">
                  <p className="text-xs font-medium text-gray-400 group-hover:text-indigo-700">
                    {currentUser?.user.email}
                  </p>
                </div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {currentUser?.user.name}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {currentUser?.user.email}
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
            <DropdownMenuItem
              onClick={() => signOut({ callbackUrl: '/api/signout' })}
            >
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
