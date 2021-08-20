const mysql = require("mysql");
const OSS = require("ali-oss");

//登录oss
const client = new OSS({
    region: "oss-cn-hangzhou",
    accessKeyId: "LTAI4FkrkGCtW73BH3KudK28",
    accessKeySecret: "tEeyrK3Qc3SiClRJY9Zr0RbRxfiPgN",
    bucket: "banh-test",
});
//连接数据库
var connection = mysql.createConnection({
  host: "115.29.194.147",
  user: "root",
  password: "aA8714871.",
  // password: "123465",
  database: "my_blog",
  useConnectionPooling: true,
});
//判断数据表  是否存在 不存在把表创建出来
connection.connect((err) => {
  if (err) return console.log("数据库连接失败" + err);
  console.log("数据库连接成功");
  connection.query("show tables;", function (err, result) {
    if (err) return console.log(err, result);
    let tableArr = [];
    let ary = [];
    let createTable = {
      article: [
        'create table article(id int(10),title varchar(30),content varchar(5000),content_markDown varchar(5000),catetory_id varchar(10),catetory varchar(10),create_time datetime DEFAULT CURRENT_TIMESTAMP COMMENT "创建时间", `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT "更新时间")',
        " alter table article add primary key (id)",
        "alter table article modify id int auto_increment",
        "alter table article AUTO_INCREMENT=1;",
      ],
      catetory: [
        "create table catetory(name varchar(20),id int(10))",
        "alter table catetory add primary key (id)",
        "alter table catetory modify id int auto_increment;",
        "alter table catetory AUTO_INCREMENT=10000;",
      ],
      notes: [
        'create table notes(id int(10),content varchar(5000),create_time datetime DEFAULT CURRENT_TIMESTAMP COMMENT "创建时间", `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT "更新时间")',
        "alter table notes add primary key (id)",
        "alter table notes modify id int auto_increment;",
        "alter table notes AUTO_INCREMENT=10000;",
      ],
    };
    if (result) {
      result.forEach((item) => {
        tableArr.push(item.Tables_in_my_blog);
      });
    }
    for (let k in createTable) {
      ary.push(k);
    }
    ary.forEach((item, index) => {
      if (tableArr.indexOf(item) < 0) {
        createTable[item].forEach((_item, _index) => {
          connection.query(_item, function (err) {
            let pro =
              index === 0 ? "文章表" : index === 1 ? "分类表" : "日记表";
            if (err) return console.log(pro + "创建失败" + err);
            console.log(pro + "创建成功");
          });
        });
      }
    });
  });
});

//允许跨域设置
function arrowOrigin(ctx) {
  ctx.set("Access-Control-Allow-Origin");
  ctx.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild"
  );
  ctx.set("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
  ctx.set("Access-Control-Allow-Credentials", true);
}
//操作数据库
function operaData(str) {
  return new Promise((resolve,reject) => {
    connection.query(str, function (err, result) {
      if (err) console.log(err);
      resolve(result);
    });
  });
}
//接口失败或者成功处理
function handleReturn(res,ctx){
    let obj = {
        data: res,
        code: 1,
    };
    ctx.body = obj;
}
module.exports = {
  client,
  operaData,
  handleReturn
};
