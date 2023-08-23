/** @type {import('next').NextConfig} */
const nextConfig = {
  // images: {
  //   domains: ['gasos-ballot-gallery-resized.s3.us-east-1.amazonaws.com']
  // },
  // async headers() {
  //   return [
  //     {
  //       // matching all API routes
  //       source: '/api/:path*',
  //       headers: [
  //         {
  //           key: 'Access-Control-Allow-Credentials',
  //           value: String(process.env.ACCESS_CONTROL_ALLOW_CREDENTIALS)
  //         },
  //         {
  //           key: 'Access-Control-Allow-Origin',
  //           value: String(process.env.ACCESS_CONTROL_ALLOW_ORIGIN)
  //         },
  //         {
  //           key: 'Access-Control-Allow-Methods',
  //           value: String(process.env.ACCESS_CONTROL_ALLOW_METHODS)
  //         },
  //         {
  //           key: 'Access-Control-Allow-Headers',
  //           value: String(process.env.ACCESS_CONTROL_ALLOW_HEADERS)
  //         }
  //       ]
  //     }
  //   ];
  // }
};

module.exports = nextConfig;
