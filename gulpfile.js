const gulp = require('gulp');
const fs = require('fs');
const GulpSSH = require('gulp-ssh');
const browserSync = require('browser-sync').create();
const spritesmith = require('gulp.spritesmith');
const imagemin = require('gulp-imagemin');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const uitIndex = require('gulp-uit-index-helper');

sass.compiler = require('node-sass');

const paths = {
  img_src : 'src/img/sprites',
  img_dist : 'src/img',
  css_src : 'src/scss',
  css_dist : 'src/css',
}

// dest로 산출물 복사시 예외 처리 되어야 할 내용
const copyFile = [
	'src/**',
	'!src/scss/**',
	'!src/sprite/**'
]

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


gulp.task('copy',function(){
	gulp.src(copyFile)
	.pipe(gulp.dest('dest'))
})

gulp.task('index',function(){
	gulp.src(['src/**/*.html']) // 인덱스 대상 파일 선택
	.pipe(uitIndex({ // 옵션 설정.
	  filename: '@index',
	  title: '마크업 산출물',
	  exJs: false,
	  html: true,
	  qrcode: true,
	  fold: false,
	  fileSort: 'file',
	  groupSort: 'asc',
	}))
	.pipe(gulp.dest('src/')); // 인덱스 저장 경로
});