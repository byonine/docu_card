const gulp = require('gulp');
const fs = require('fs');
const GulpSSH = require('gulp-ssh');
const browserSync = require('browser-sync').create();
const spritesmith = require('gulp.spritesmith');
const imagemin = require('gulp-imagemin');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');

sass.compiler = require('node-sass');

const paths = {
  img_src : 'src/img/sprites',
  img_dist : 'src/img',
  css_src : 'src/scss',
  css_dist : 'src/css',
}

gulp.task('sprite', function () {
  var spriteData = gulp.src(`${paths.img_src}/*.png`)
    .pipe(spritesmith({
      padding: 10,
      imgName: `${paths.img_dist}/sp_sprite.png`,
      cssName: `${paths.css_src}/_sp_sprite.scss`,
      cssTemplate: `${paths.css_src}/lib/scss.template.handlebars`,
    }));
  spriteData.pipe(gulp.dest('./'));

  return gulp.src(`${paths.img_dist}/*.png`)
          .pipe(imagemin())
          .pipe(gulp.dest(paths.img_dist));
});

gulp.task('sass', function () {
  return gulp.src(`${paths.css_src}/*.scss`)
    .pipe(sass.sync({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(gulp.dest(paths.css_dist))
    .pipe(browserSync.stream());
});

 gulp.task('ftp', function() {
  let ssh = new GulpSSH({
    ignoreErrors: false,
    sshConfig: {
      host: 'ftp.ui.h-firework.com',
      port: 22,
      username: 'admin',
      privateKey: fs.readFileSync('./admin_sftp')
    }
  })

  return gulp.src(['./src/**/*.css','./src/**/*.png','!./src/img/sprites/*.png','./src/*.html'])
          .pipe(ssh.dest('./publishing-guide'));
});

gulp.task('watch', function() {
    browserSync.init({
        server: "./src"
    });
    gulp.watch(paths.css_src, gulp.parallel('sass'));
    gulp.watch("./src").on('change', browserSync.reload);
});
