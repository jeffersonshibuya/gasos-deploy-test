import { Profile } from 'next-auth';

declare module 'next-auth' {
  interface Profile {
    given_name?: string;
    family_name?: string;
  }
}
