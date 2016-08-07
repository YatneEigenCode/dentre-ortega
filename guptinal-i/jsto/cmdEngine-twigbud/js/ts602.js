//8-7-2016 config for local file on cruise
//6-1-2016 ts602 config
cfg= { color:'blue'
  ,topLevel:{ sendPkgUrl: "lipaotwig.io/ts/set/?i={0}"
             ,textPkgUrl: "./ts/text/{0}.txt"}
}
xcfg= { color:'blue'
  ,topLevel:{ sendPkgUrl: "/ts/set/?i={0}"
             ,textPkgUrl: "/ts/text/?i={0}"}
}
//a version was used for development while on a cruise using this config
xcfg= { color:'green'
  ,topLevel:{ sendPkgUrl: "/ts/set/?i={0}"
             ,textPkgUrl: "./text/{0}"}
}
