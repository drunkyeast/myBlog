## 记录一下过程
`npm init -y`
`npm install express mongoose art-template express-art-template`
`sudo npm install -g nodemon` 有的要sudo有的又不需要sudo,烦.
`nodemon app.js` 修改文件后会自动重新执行.

#### 遇到了一个搞了很久的bug
mongoose版本问题, 最后mongoose版本安装的`npm install express mongoose@6.8.1 art-template express-art-template`

#### bash命令与vim多行注释操作
ctrl + shift + q进入 Visual Block模式, 然后选择多行. 按shift + I, 然输入在单行输入//, 再按两次Esc.
`{file%.html}`这样可以删除.html后缀. `for file in *.html; do mv "$file" "${file%.html}.art"; done`

#### 补充安装
npm install body-parser
npm install express-session

#### 以此为分界线,开启vscode写项目. 之前用vim和tmux真的太折磨人了.
现在完成的功能有:登录,根据cookie的登录拦截,点击退出登录后,前端相当于从新请求ip/admin/logout,/logout会根据路由到logout.js,然后清理缓存,重定向到/admin/login.

#### 重新说明路由情况
哪些地方会出现: `admin/login` `/admin/login` `/login`这样的东西?
1. app.js文件中的`const admin = require('./route/admin');` `app.use('/admin', admin);` 这些是URL的路径与nodejs的js文件的路径处理.
2. 静态资源, `app.use(express.static(path.join(__dirname, 'public')));` 标签文件.html或.art中的路由, 例如 `<a href="/admin/user-edit" ...>...</a>` `{{include './common/header.art'}}`  `<script src="/admin/js/common.js"></script>`, 这些路由有相对路由和绝对路由. 相对路由不是相对于当前文件的目录, 而是相对于URL的路径.(具体原因就不说了,反正记住!!!因此静态资源用绝对路径.). 好,绝对路径的`/`对应项目中的`public/`. 这很好理解是吧, 但是又有一个坑见下面views文件.
3. `app.set('views', path.join(__dirname, 'views'));`, 哪些地方会使用呢? `res.render('admin/user-edit');`所以引用的地方是在nodejs的js文件中,而不是在标签文件. 但视图文件与静态文件在app.js中分别是app.set引入, 以及app.use引入. 导致的结论是视图文件的路由与静态资源的路由看着类似,但区别也很多. 结果是render里面的路径不能有`/`根目录这个东西.
4. 总结: 分为两类:一类是在标签文件中,一类是在.js文件中. 标签文件中有`/`绝对路径,对应`public/`.

