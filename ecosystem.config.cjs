module.exports = {
  apps: [
    {
      name: 'aadhirai-website',
      script: 'server.js',
      cwd: __dirname,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
}
