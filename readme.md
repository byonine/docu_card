IT 운영팀 퍼블리싱 프로젝트 표준 가이드
===============================

### 프로젝트 환경 구축

dreamplus 프로젝트의 퍼블리싱 업무를 시작한다고 가정합니다.
아래의 명령어를 통해 IT 운영팀 퍼블리싱 표준 프로젝트 가이드 환경을 clone 받습니다.

<pre>
<code>
    git clone http://15.164.63.108:8001/publishing/publishing-guide.git
     
</code>
</pre>

gulpfile.js 파일을 열어 gulp.task('ftp') 영역을 찾아 프로젝트 이름을 진행할 프로젝트명으로 변경합니다.

```javascript
gulp.task('ftp', function() {
  .
  .
  .
  return gulp.src(['./src/**/*.css','./src/**/*.png','!./src/img/sprites/*.png','./src/*.html'])
          .pipe(ssh.dest('./publishing-guide'));
        //.pipe(ssh.dest('./publishing-dreamplus')); 와 같이 진행할 프로젝트 이름으로 변경
});
```

.git 파일을 모두 제거한 뒤 프로젝트 저장소로 remote를 재설정합니다.

<pre>
<code>
    rm -rf .git
    git init
    git remote add origin http://15.164.63.108:8001/publishing/publishing-dreamplus.git
     
</code>
</pre>

### 프로젝트 구성

<pre>
<code>
    node_modules     
    src     
    ┗ css          
        ┗ main.css                  // 서비스 CSS file     
        ┗ img                       // sprite 이미지 or 통 이미지     
            ┗ sprites               // sprite 이미지로 생성될 이미지       
                ┗ ico_○○○○○.png     
                ┗ ...     
            ┗ sp_sprite.png         // sprite 이미지     
        ┗ scss     
            ┗ common     
                ┗ _base.scss        // reset CSS     
                ┗ _mixin.scss       // sass mixin      
            ┗ lib      
                ┗ scss.template.handlebars         
            ┗ _sp_sprites.scss      //sprite 이미지 scss     
            ┗ main.scss             // 서비스 scss     
    ○○○○○.html    
    
</code>
</pre>


### 프로젝트 진행
1. node module 설치
<pre>
<code>
    sudo npm install -g gulp    
    sudo npm install    
        
</code>
</pre>

2.
<pre>
<code>
    gulp watch
     
</code>
</pre>
퍼블리싱 업무를 위해 자주 수정되는 `/src/scss/*.scss` 파일과 `/src/*.html` 파일이 수정될 때 마다     
페이지 새로고침 없이 browser에서 작업한 내용을 바로 확인할 수 있습니다.

3. 
<pre>
<code>
    gulp sprite
     
</code>
</pre>
`/src/img/sprites` 경로에 추가되는 이미지를 위 명령어를 통해 하나의 스프라이트 이미지로 생성해줍니다.     
생성된 스프라이트 이미지는 `/src/img/sp_sprite.png`로 저장됩니다.

4.
<pre>
<code>
    gulp ftp
     
</code>
</pre>
퍼블리싱 작업이 모두 완료되면 위 명령어를 통해 IT운영팀 view server에 업로드합니다.     
https://view.ui.h-firework.com/프로젝트명/○○○○○.html URL을 통해 외부망에서 접근이 가능합니다.

5.
작업 완료 후 공유 시에 업무 내용을 확인할 수 있도록 아래 내용을 필히 포함하여 메일로 회신합니다.
    - view server URL (현업 확인용)
    - 수정된 CSS URL (개발자 확인용)
    - 수정된 html 파일의 diff URL (개발자 확인용)
