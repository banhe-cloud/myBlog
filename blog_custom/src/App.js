import './App.scss';
import { Modal, Input } from 'antd';
import React, { useState, useRef } from 'react';
import { sign } from "./utils/utils.js"
import { message, Button, Space } from 'antd';
import {
  NavLink,
  withRouter
} from "react-router-dom"

function App(props) {
  const [visible, setVisible] = useState(false);
  const [userName, setName] = useState('');
  const [password, setPassword] = useState('');

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
  function handleCancel(params) {

  }
  return (
    <div className="app top">
      <div className="app_top">
        <div className="top_left">希望三旬的时候，理想也都在</div>
        <NavLink to="/" className="top_title">西 兰 花</NavLink>
        {
          !localStorage.getItem('is_login') ?
          <NavLink className="app_sign" to="/sign">登录</NavLink>
            :
            <NavLink className="app_sign" to="/edit">编辑</NavLink>
        }
      </div>
      <Modal style={{ top: 300 }} title="登陆" visible={visible} onOk={handleOk} onCancel={() => { setVisible(false) }}>
        <Input ref={nameRef} placeholder="用户名" />
        <Input ref={passwordRef} className="modal_input" placeholder="密码" />
      </Modal>
    </div>
  );
}

export default withRouter(App);
