import browserSync from "browser-sync";

browserSync.init({
  proxy: "localhost:3000", // Il tuo server Express
  port: 3001, // Porta per browser-sync
  open: true, // Apre automaticamente il browser
  notify: false, // Disabilita le notifiche popup
  files: ["src/**/*.ts", "src/**/*.tsx", "templates/**/*.html", "public/**/*"],
  ignore: ["node_modules"],
  reloadDelay: 1000, // Ritardo per aspettare che il server si riavvii
});
