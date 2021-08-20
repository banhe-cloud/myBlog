const Koa = require("koa");
const app = new Koa();
const router = require("koa-router")();
app.use(require("koa-static")(__dirname + "/build"));
var bodyParser = require("koa-bodyparser");
app.use(bodyParser());
const multiparty = require("koa2-multiparty");
const {operaData,handleReturn} = require('./utils');
const addtoken = require('./addtoken')
//oss上传图片
router.post("/uploadImg", multiparty(), async (ctx) => {
  let file = ctx.req.files.file;
  let res = await client.multipartUpload(file.name, file.path);
  handleReturn(res.res.requestUrls[0],ctx)
});
//获取日记列表
router.get("/getNotesList", async (ctx) => {
  var sql = `SELECT * from notes order by create_time desc`;
  let res = await operaData(sql)
  handleReturn(res,ctx)
});
//添加日记
router.post("/addNotes", async (ctx) => {
  let data = ctx.request.body;
  var sql = "";
  if (data.time) {
    let id = operaData("select max(id) from notes")
    sql = `update notes set content = '${data.content}' where id=${id[0]['max(id)']} `;
  } else {
    sql = `insert into notes (content) values ('${data.content}')`;
  }
  let res = await operaData(sql)
  handleReturn("添加成功",ctx)
});
//删除文章
router.post("/deleteArticle", async (ctx) => {
  let id = ctx.request.body.id;
  let sql = `delete from article where id=${id}`;
  let res = await operaData(sql)
  handleReturn("删除成功",ctx)
});

//更新文章
router.post("/updateArticle", async (ctx, next) => {
  let data = ctx.request.body;
  let sql = `update article set title='${data.title}',content='${data.content}',content_markDown='${data.content_markDown}',catetory_id=${data.catetory_id},catetory='${data.catetory}' where id = ${data.id}`;
  let res = await operaData(sql)
  handleReturn("更新成功",ctx)
});

//添加文章
router.post("/addArticle", async (ctx, next) => {
  let data = ctx.request.body;
  var sql = `insert into article (title,content,catetory_id,catetory,content_markDown) values ('${data.title}','${data.content}','${data.catetory_id}','${data.catetory}','${data.content_markDown}')`;
  let res = await operaData(sql)
  handleReturn("添加成功",ctx)
});
//获取文章列表
router.get("/article_list", async (ctx, next) => {
  let catetory_id = ctx.query.catetory_id;
  var sql = catetory_id
    ? `SELECT * from article where catetory_id=${catetory_id} order by create_time desc`
    : "SELECT * from article order by create_time desc";
  let res = await operaData(sql)
  handleReturn(res,ctx)
});
//通过id查询文章
router.get("/article_detail", async (ctx, next) => {
  let id = ctx.query.id;
  var sql = `SELECT * from article where id=${id} `;
  let res = await operaData(sql)
  handleReturn(res[0],ctx)
});

//删除分类
router.post("/deleteCatetory", async (ctx, next) => {
  let delete_id = ctx.request.body.id;
  let obj = {
    message: "",
    code: 0,
  };
  let art = await operaData(` select * from article where catetory_id = ${delete_id}`)
  if (art.length) {
    obj.message = "请先删除此分类下所有文章";
  } else {
    await operaData(`delete FROM catetory WHERE id = '${delete_id}'`)
    obj.code = 1;
  }
  ctx.body = obj;
});
//添加分类
router.post("/addCatetory", async (ctx, next) => {
  let data = ctx.request.body;
  let res = await operaData(`insert into catetory (name ) values ('${data.name}')`)
  handleReturn("添加成功",ctx)
});
//获取分类
router.get("/catetory", async (ctx, next) => {
  var sql = "SELECT name,id from catetory";
  let arr = await operaData(sql)
  handleReturn(arr,ctx)
});
//登录
router.post("/sign", async (ctx, next) => {
  let obj = {
    message: "",
    code: 0,
  };
  let data = ctx.request.body;
  let res = handleReturn(`select * from user where username=${data.userName} and password=${data.password}`)
  if (res.length) {
    obj.message = "登陆成功";
    obj.code = 1;
    let tk = addtoken({user:res[0].username,id:res[0].id})
    ctx.cookies.set("isLogin", "1", {
      domain: "http://localhost:3000/",
      path: "",
      maxAge: 1000 * 60 * 60 * 1,
      expires: new Date("2021-02-21"),
      httpOnly: false,
      overwrite: false,
    });
    obj.tk = tk;
  } else {
    obj.message = "账号或密码错误";
    obj.code = 0;
  }
  ctx.response.body = {
    status: 200,
  };
  ctx.body = obj;
});

app.use(async (ctx, next) => {
  if (ctx.method == "OPTIONS") {
    ctx.body = 200;
  } else {
    await next();
  }
});
app.use(router.routes());
app.listen(8000);
