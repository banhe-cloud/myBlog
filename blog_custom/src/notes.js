import React, { useState, useRef, useEffect } from "react";
import "./notes.scss";
import { Input, Button, message } from "antd";
import { getCatetory, getArticle, addNotes, getNotesList } from "./utils/utils";
const { TextArea } = Input;

let isToday;
function Notes(params) {
  const [content, setContent] = useState("");
  const [list, setList] = useState([]);
  const [defaultValue, setDefaultValue] = useState("");

  useEffect(() => {
    getList();
  }, []);

  let testRef = useRef();
  //获取今天日期
  function getDate() {
    let Today = new Date();
    let arr = Today.toLocaleDateString()
      .split("/")
      .map((item) => {
        if (item.length < 2) return "0" + item;
        return item;
      });
    return arr.join("-");
  }

  //获取列表
  function getList() {
    getNotesList()
      .then((res) => {
        setList(res.data.data);
        if (
          res.data.data.length &&
          res.data.data[0].create_time.indexOf(getDate()) >= 0
        ) {
          isToday = true;
          setDefaultValue(res.data.data[0].content);
        }
      })
      .catch((e) => {
        message.error("获取列表失败" + e);
      });
  }
  //提交
  function _submit() {
    let content = testRef.current.resizableTextArea.props.value;
    let params = {
      content,
    };
    if (isToday) params.time = getDate();
    addNotes(params)
      .then((res) => {
        if (res.data.code === 1) {
          getList();
          message.success("提交成功");
        }
      })
      .catch((e) => {
        message.error("提交失败" + e);
      });
  }
  return (
    <div className="notes">
      <div className="notes_left borderShadow">
        {list.map((item, index) => (
          <div className="notes_item" key={index}>
            <div className="item_time">{item.create_time.substring(0, 10)}</div>
            {/* <p className="item_content" dangerouslySetInnerHTML={{ __html: item.content }}></p> */}
            <pre className="item_content">{item.content}</pre>
          </div>
        ))}
      </div>
      {localStorage.getItem("is_login") ? (
        <div className="notes_right borderShadow">
          <TextArea
            placeholder="说点什么吧..."
            className="right_text"
            ref={testRef}
            rows={4}
            key={defaultValue}
            defaultValue={defaultValue}
          />

          <Button type="primary" className="right_btn" onClick={_submit}>
            提交
          </Button>
        </div>
      ) : null}
    </div>
  );
}

export default Notes;
