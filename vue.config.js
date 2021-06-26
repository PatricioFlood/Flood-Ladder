module.exports = {
    publicPath: '/',
    chainWebpack: config => {
      config
          .plugin('html')
          .tap(args => {
              args[0].title = "Flood Ladder";
              return args;
          })
    },
    pwa: {
      name: 'Flood Ladder',
      themeColor: '#186363',
      manifestOptions: {
        background_color: "#6CABD4",
        description: "Programacion Ladder",
        display: "fullscreen",
        short_name: "Ladder",
        start_url: "/",
        prefer_related_applications: false
      },
      workboxOptions: {
        skipWaiting: true,
        exclude: [/CNAME/, /\.map$/]
      }
    }
  }