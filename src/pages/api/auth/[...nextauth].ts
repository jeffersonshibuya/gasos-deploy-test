import NextAuth, { AuthOptions } from 'next-auth';
import CognitoProvider from 'next-auth/providers/cognito';

export const authOptions: AuthOptions = {
  providers: [
    // GithubProvider({
    //   clientId: process.env.GITHUB_ID as string,
    //   clientSecret: process.env.GITHUB_SECRET as string
    // }),
    CognitoProvider({
      clientId: process.env.AWS_COGNITO_CLIENT_ID as string,
      clientSecret: process.env.AWS_COGNITO_CLIENT_SECRET as string,
      issuer: process.env.AWS_COGNITO_ISSUER as string
    })
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID as string,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    // })
    // CredentialsProvider({
    //   name: 'credentials',
    //   credentials: {
    //     email: { label: 'email', type: 'text' },
    //     password: { label: 'password', type: 'password' }
    //   },
    //   async authorize(credentials) {
    //     if (!credentials?.email || !credentials?.password) {
    //       throw new Error('Invalid credentials');
    //     }

    //     // const UserPool = new CognitoUserPool({
    //     //   UserPoolId: 'us-east-1_bZwF8KhNc',
    //     //   ClientId: '4cpmkkf3dghi5j8fg5fm55onta'
    //     // });

    //     // const user = UserPool.getCurrentUser();

    //     // return user;
    //     return null;
    //   }
    // })
  ],
  // callbacks: {
  //   async signIn({ user, account, profile, email, credentials }) {
  //     const firstName =
  //       (profile?.given_name?.charAt(0).toUpperCase() || '') +
  //       (profile?.given_name?.slice(1) || '');

  //     console.log(firstName);
  //     user.name = firstName;
  //     ' ' +
  //       profile?.family_name?.charAt(0).toUpperCase() +
  //       profile?.family_name?.slice(1);

  //     return true;
  //   }
  // },
  pages: {
    signIn: '/'
  },
  // debug: process.env.NODE_ENV === 'development',
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET
};

export default NextAuth(authOptions);
