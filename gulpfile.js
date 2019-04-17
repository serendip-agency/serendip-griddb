var gulp = require("gulp");
var ts = require("gulp-typescript");
var fs = require("fs-extra");
var mocha = require("gulp-mocha");
var child = require("child_process");

var paths = {
  dist: "dist",
  tsSources: "src/**/*.ts",
  tests: "dist/test/*.js"
};

const gridJsonPath = ".grid.json";

let servers = [];

function run() {
  servers.forEach(server => {
    if (server) if (server.kill) server.kill();
  });

  const gridJsonExists = fs.existsSync(gridJsonPath);

  if (!gridJsonExists)
    throw new Error(".grid.json not exists in current working directory!");

  var grid = fs.readJsonSync(gridJsonPath);

  for (const key in grid.infs) {
    if (grid.infs.hasOwnProperty(key)) {
      const node = grid.infs[key];

      if (node.type !== "controller")
        servers.push(
          child.spawn("node", ["./dist/app.js"], {
            env: {
              "db.mongoDb": key,
              nodeName: key,
              "http.port": node.address.split(":")[
                node.address.split(":").length - 1
              ]
            },
            stdio: "inherit"
          })
        );
    }
  }
  
}

// compile typescripts
function build() {
  if (fs.existsSync(paths.dist)) {
    fs.emptyDirSync(paths.dist);
  }

  return gulp
    .src(paths.tsSources)
    .pipe(
      ts({
        noImplicitAny: false,
        target: "ES2018",
        sourceMap: true,
        lib: ["ES2018"],
        module: "CommonJS",
        baseUrl: ".",
        paths: {
          "*": ["node_modules/*", "src/types/*"]
        }
      })
    )
    .pipe(gulp.dest(paths.dist));
}

gulp.watch(paths.tsSources, gulp.series(build, run));

exports.build = gulp.series(build);

exports.default = gulp.series(build, run);
