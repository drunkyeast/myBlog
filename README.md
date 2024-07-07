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

#### 补充安装
npm install joi
用于验证信息格式. 新版本的joi创建schema时与旧版本不一样, 注意与joi相关的两个文件, /route/admin/user-edit-fn.js与/model/user.js

#### 以用户删除为例,讲一下前后端交互的整个流程. 非常好的总结!!! 后端代码其实容易理解, 主要是前端代码不熟悉.
先说需求: 在前端点击删除按钮,前端弹出确认删除? 提交后后端接受,并从数据库中删除. 把删除后的结果再返回给前端.
前端: 首先到/views/admin/user.art 下面找删除按钮哪个图标, 发现它在一个循环中(因为有多个用户信息,用户信息是后端用json格式传的), 里面有一个<i ...>...</i>这个i标签一般表示图标即删除图标. 给标签的class里面添加一个delete, 之后再script中通过选择器和触发click事件 `$('.delete').on('click', function() {...});` ,然后执行`var id = $(this).attr('data-id');`获得data-id的值, 而data-id的值又是通过`{{@$value._id}}`在i标签中获取的, 这涉及到了模板引擎art的一些语法, 前面说的循环{{each users}}也用的是art模板引擎的语法. 此时id值在脚本中. 然后执行`$('#deleteUserId').val(id);` 这相当于把id值传送到html的带有deleteUserId这个class的标签中, 这个标签是input标签, 同时input标签在form标签中. 为form标签添加上`action="/admin/delete" method="get"` 表示通过这样的URL get发送给服务器. 之后我再次点击提交按钮才提交. 总结:点击删除图标,触发脚本把id写到form表单中, 再次点击提交按钮, 从前端传给后端.
后端: 根据/route/admin.js下的路由跳转到/route/admin/user-delete.js, 然后引用/model/user.js中的users, users是通过mongoose与mongodb交互的. 然后根据id从users中删除. 删除后会被`res.redirect('/admin/user');`~~重定向到/views/admin/user.art中.(冷知识: 前面关于路由说render不能加`/`,这儿redirect可以加`/`,虽然都是/views/admin中的文件.) 然后user.art又会根据art模板引擎进行渲染.~~ 注意我又犯错了, 这个从定向是URL的路径,到根据/route/admin.js的对/user的匹配,跳转到/route/admin/userPage.js中,在后端执行相关函数从数据库中找出所有用户users,同时根据users数目做分页处理得到page total参数,最后 `res.render('admin/user', { users: users, page: page, total: total });`. `这儿的admin/user是指/views/admin/user.art` (渲染模板在app.js指明了,这个render里面不能用`/`前面专门说过). 然后art模板引擎根据参数和user.art文件中的语法(例如循环),处理后传给前端. 前端就发现删除的用户没了.

#### 另外再以article和article-edit为例,讲讲流程
侧边栏: /views/common/aside.art中把链接`user.html`改成`/admin/user`. 逻辑与前面相同,通过前端的逻辑触发input,用URL/user.html请求,改成用URL/admin/user想服务器发送请求.
服务器根据不同的URL渲染并返回不同的页面. 有一种交互方法是在路由的/route/admin/article.js文件中, 增加一个`req.app.locals.currentLink = 'article';`, 然后再aside.art中用`{{currentLink == 'article' ? 'active' : ''}}`来获取值,改变侧边栏的选中情况.
同样的逻辑,在article-edit.art文件中,在作者信息哪里,利用`vallue={{@userInfo._id}}`显示用户相关信息.这个东西会在后端被art渲染引擎处理. 而这个user来源于哪里呢?? 答: 来源于res.render(xxx.art, {user: user}); 即在路由中的某个.js文件,在渲染时传递的参数.

#### 补充安装
npm install formidable@1.2.1, 尽量保持一致吧. 不然像joi那样不兼容挺烦人的.
formidable第三方模块用于表单的提交, 支持二进制文件如图片等的提交.

npm install dateformat@3.0.3  处理时间
npm install mongoose-sex-page@1.2.4  处理分页

#### 图片及时预览, 前端的代码太杂了
var file = document.querySeletcor('#file');
file.onchange = function() { ... } // 用户选择文件后
var reader = new FileReader(); 
reader.onload = function() { ... } // 监听onload事件
......

#### 大更新 dateFormat使用新语法代替旧语法
`<td>{{ $value.publishDate | dateFormat: 'yyyy-mm-dd' }}</td>`
现在博客可以正常登录,添加用户,删除用户,发布新文章,文章分页处理. 但此时还不能查看文章.

#### 补充安装
npm install morgan@1.9.1
npm install config@3.0.1

#### 新知识点
1. 博客封面展示的文字中不能有标签, 不嫩出现`&nbsp`这种东西. 批评一下华为雏鹰计划的习题就没处理好这个.
default.art文件中 <div class="brief">{{@$value.content.replace(/<[^>]+>/g, '').substr(0, 150) + '...'}}</div>  利用正则表达式和@处理上诉问题.
另外$value来源于哪里? 前面说过,后端/route下面的某个.js文件会调用res.render(xxx.art, {参数}), value就来源于render时额外传的参数!!

2. 博客首页点击某个文章,前端传递这个文章的id给后端,后端查找后再传给前端. 具体细节略...

3. 文章评论的流程: 评论放到数据库新的表中. 评论要与article和user关联,所有创建了aid和uid, 利用前面一样的隐藏域把aid和uid保存在评论表单中等待提交. 还有其他time, content字段. 提交后, 后端经过路由再把评论渲染到页面再传给前端. 具体细节略...

## 测试补充
超级管理员就一个,超级管理员可以增删用户,增删文章,普通用户只能查看. 后续再做优化. 一开始执行user.js会创建一个超级管理员, 然后再注释掉user.js里面的createUser();再执行.
目前还有一个bug, 删除超级用户后, 数据库的users中删除了, 但数据库超级用户对应的文章没有删除, 而浏览器在进入在/home首页时目前会显示所有文章. 所以手动修改文章对应的user.