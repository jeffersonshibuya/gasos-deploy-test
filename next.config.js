/** @type {import('next').NextConfig} */
const nextConfig = {
  server: {
    host: '0.0.0.0', // Use '0.0.0.0' to listen on all available network interfaces
    port: 3000 // You can also specify the port here
  }
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
