# nideshop-admin1
### NideShop商城（后台）

+在NideShop商城基础上写的 https://github.com/tumobi/nideshop
+ 目前只写了商品，分类，订单的部分功能，自用。。
+用的vue，home文件夹是后台入口，npm run serve 打开。。

+后端修改了部分配置和文件，开启了thinkjs静态文件，静态文件放www/static下，访问静态资源localhost:8360/static/upload/1.jpg就可以了，thinkjs官方文档很多地方写的不全。。
www/static/upload/图片上传文件夹，
controller里面增加了adminSet.js文件，后台接口都在这个里。。