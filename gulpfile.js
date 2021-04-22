const gulp = require('gulp');
const sftp = require('gulp-sftp');
const browserSync = require('browser-sync').create();
const spritesmith = require('gulp.spritesmith');
const imagemin = require('gulp-imagemin');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const merge = require('merge-stream');

sass.compiler = require('node-sass');

const paths = {
  img_src : 'src/img/sprites',
  img_dist : 'src/img',
  css_src : 'src/scss',
  css_dist : 'src/css',
  img_build : 'dist/img',
  css_build : 'dist/css',
}

gulp.task('sprite', function () {
  var spriteData = gulp.src(`${paths.img_src}/*.png`).pipe(spritesmith({
    padding: 10,
    imgName: `${paths.img_dist}/sp_sprite.png`,
    cssName: `${paths.css_src}/import/_sp_sprite.scss`,
    cssTemplate: `${paths.css_src}/lib/scss.template.handlebars`,
  }));
  return spriteData.pipe(gulp.dest('./'));
});

gulp.task('sass', function () {
  return gulp.src(`${paths.css_src}/*.scss`)
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(gulp.dest(paths.css_dist))
    .pipe(browserSync.stream());
});

gulp.task('build', function () {
  let imgStream = gulp.src(`${paths.img_dist}/*.png`)
                    .pipe(imagemin())
                    .pipe(gulp.dest(paths.img_build));

  let cssStream = gulp.src(`${paths.css_src}/*.scss`)
                    .pipe(sass.sync({outputStyle: 'compressed'}).on('error', sass.logError))
                    .pipe(autoprefixer())
                    .pipe(rename({ suffix: '.min' }))
                    .pipe(gulp.dest(paths.css_build));

  return merge(imgStream, cssStream);
 });

 gulp.task('ftp', function() {
  return gulp.src('src/*')
    .pipe(sftp({
        host: 'ftp.ui.h-firework.com',
        port: 22,
        auth: 'privateKey',
        remotePath: 'publishing-guide'
    }));
});

gulp.task('watch', function() {
    browserSync.init({
        server: "./src"
    });
    gulp.watch(paths.css_src, gulp.parallel('sass'));
    gulp.watch("./src").on('change', browserSync.reload);
});
