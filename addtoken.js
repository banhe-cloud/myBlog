const jwt = require('jsonwebtoken');
const serect = 'token';  //密钥，不能丢
module.exports = (userinfo) => { //创建token并导出
  let created = Math.floor(Date.now() / 1000);

  const token = jwt.sign({
    user: userinfo.user,
    id: userinfo.id
  }, serect, {algorithm: 'RS256'});
  return token;
};

 