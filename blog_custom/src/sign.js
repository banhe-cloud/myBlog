import React, { useState, useRef, useEffect } from "react";
import { NavLink, withRouter } from "react-router-dom";
import "./sign.scss";
import { Input,Button } from "antd";
import { sign } from "./utils/utils.js"

function UserSign() {
  const nameRef = useRef();
  const passwordRef = useRef();


  function handleOk() {
    let params = {
      userName: nameRef.current.state.value,
      password: passwordRef.current.state.value
    }
    sign(params).then((res) => {
      if (res.data.code) {
        message.success("登录成功");
        setVisible(false);
        localStorage.setItem('is_login', '1')
      } else {
        message.error("账号或密码错误")
      }
    }).catch((e) => {
      message.error("登录失败" + e)
    })
  }
  return (
    <div className="sign borderShadow">
      <Input className="sign_user" ref={nameRef} placeholder="用户名" />
      <Input className="sign_password" ref={passwordRef} placeholder="密码" />
      <Button className="sign_btn" type="primary" onClick={handleOk}>登录</Button>
    </div>
  );
}
export default withRouter(UserSign);
