import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const cookieStore = cookies();
  return cookieStore.getAll().map((cookie) => console.log(cookie));
}

export async function GET(request: Request) {
  cookies().set({
    name: 'next-auth.callback-url',
    value: '',
    expires: new Date('2016-10-05'),
    path: '/' // For all paths
  });
  cookies().set({
    name: 'next-auth.csrf-token',
    value: '',
    expires: new Date('2016-10-05'),
    path: '/' // For all paths
  });
  cookies().set({
    name: 'next-auth.session-token',
    value: '',
    expires: new Date('2016-10-05'),
    path: '/' // For all paths
  });
  return NextResponse.redirect(new URL('/', request.url));
}
