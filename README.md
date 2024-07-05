## 记录一下过程
`npm init -y`
`npm install express mongoose art-template express-art-template`
`sudo npm install -g nodemon` 有的要sudo有的又不需要sudo,烦.
`nodemon app.js` 修改文件后会自动重新执行.
`{file%.html}`这样可以删除.html后缀. `for file in *.html; do mv "$file" "${file%.html}.art"; done`

#### 关于模板(.html或.art)的优化, 抽出公共部分.
模板html的相对路径不是相对于文件, 而是相对于url里面的请求路径. 请求路径的设置又来源于`app.use('/admin', admin);`这里/admin就是请求路径. 注意`/admin/login`其中login是login.art文件,/admin才是login的默认路径. 所以在查看网页源码时,点击外链文件,例如css和js文件时,会以请求路径为默认路径. 但域名中的请求路径/admin与静态文件/admin/xxx.css文件不一定统一. 所以用绝对路径可以解决这个问题. 另外我猜测:app.js中开放静态资源,相当于把/public/下面的文件放到了/下面,例如某个css文件本来是/public/admin/css/xxx.css的,开放后期绝对路径就变成了/admin/css/xxx.css了.域名中那请求路径会变来变去的,所以用绝对路径更好.
将/views/admin下面的文件的公共部分抽离带/views/admin/common下面, 然后再模板(模板指.html或.art)中用{{include './common/xxx.art'}}引入. 然后用..../common/layout.art作为所有模板的骨架,提取公共部分,例如css和js等, 然后不同的模板引用骨架,然后填充`{{block 'main'}} 填充各个模板自己的单独的内容 {{/block}}`这样来填充.

#### 遇到了一个搞了很久的bug
mongoose版本问题, 最后mongoose版本安装的`npm install express mongoose@6.8.1 art-template express-art-template`

#### vim多行注释操作
ctrl + shift + q进入 Visual Block模式, 然后选择多行. 按shift + I, 然输入在单行输入//, 再按两次Esc.

#### 补充安装
npm install body-parser
npm install express-session

