import React, { useState, useEffect, useRef } from "react";
import "./edit.scss";
import { Button, Modal, Input, message } from "antd";
import {
  getCatetory,
  getArticle,
  addCatetory,
  deleteCatetory,
  deleteArticle,
} from "./utils/utils";
import { NavLink, withRouter } from "react-router-dom";

function Edit(props) {
  const [catetory, setCatetory] = useState([]);
  const [article, setArticle] = useState([]);
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [visible3, setVisible3] = useState(false);
  const [catetoryData, setCatetoryData] = useState({});
  const [articleData, setArticleData] = useState({});
  function queryArticle(item) {
    getArticle({ catetory_id: item.id }).then((res) => {
      setArticle(res.data.data);
    });
    setCatetoryData(item);
  }
  const nameRef = useRef();

  useEffect(() => {
    getCatetory().then((res) => {
      setCatetory(res.data.data);
      if (res.data.data.length) {
        setCatetoryData(res.data.data[0]);
        queryArticle(res.data.data[0]);
      }
    });
  }, []);

  //获取分类列表
  function _getCatetory(type) {
    getCatetory().then((res) => {
      let data = res.data.data;
      setCatetory(data);
      queryArticle(type === "add" ? data[data.length - 1] : data[0]);
    });
  }
  function _deleteArticle(item) {
    deleteArticle({ id: item.id })
      .then((res) => {
        if (res.data.code) {
          message.success("删除成功");
          getArticle().then((res) => {
            setArticle(res.data.data);
          });
        }
      })
      .catch((e) => {
        message.success("操作失败" + e);
      });
  }
  //确定添加分类
  function handleOk(params) {
    addCatetory({ name: nameRef.current.state.value })
      .then((res) => {
        if (res.data.code) {
          setVisible(false);
          _getCatetory("add");
          message.success("添加分类成功");
        } else {
          message.error("操作失败");
        }
      })
      .catch((e) => {
        message.error("操作失败" + e);
      });
  }
  //删除分类
  function _deleteCatetory() {
    deleteCatetory({ id: catetoryData.id })
      .then((res) => {
        if (res.data.code) {
          message.success("删除分类成功");
          setVisible2(false);
          _getCatetory("reduce");
        } else if (!res.data.code) {
          message.error(res.data.message);
        }
      })
      .catch((e) => {
        message.error("操作失败" + e);
      });
  }
  //跳转文章详情
  function toDetail(item) {
    localStorage.setItem("id", item.id);
    props.history.push({ pathname: "/detail" });
  }
  //跳转编辑
  function toAdd(item, type) {
    if (!catetory.length) return message.success("请先添加一个分类");
    localStorage.setItem("isEdit", type);
    item && localStorage.setItem("id", item.id);
    props.history.push({ pathname: "/add" });
  }
  return (
    <>
      <div className="edit">
        <Button
          className="edit_btn"
          onClick={() => {
            toAdd("", "");
          }}
        >
          新增
        </Button>
        <div className="edit_catetory">
          {catetory.map((item) => {
            return (
              <div
                className={`catetory_item ${
                  catetoryData.id === item.id ? "selected" : ""
                }`}
                onClick={() => queryArticle(item)}
              >
                {item.name}
                <i
                  className="iconfont delete"
                  onClick={() => {
                    setCatetoryData(item);
                    setVisible2(true);
                  }}
                >
                  &#xe601;
                </i>
              </div>
            );
          })}
          <div
            className="catetory_item"
            style={{ fontSize: "20px" }}
            onClick={() => {
              setVisible(true);
            }}
          >
            +
          </div>
        </div>
        <div className="edit_content">
          {article.map((item) => {
            return (
              <div className="catetory_item">
                <div onClick={() => toDetail(item)}>{item.title}</div>

                <div className="item_set">
                  <div className="set_edit" onClick={() => toAdd(item, 1)}>
                    编辑
                  </div>
                  <div
                    className="set_delete"
                    style={{ marginLeft: "10px" }}
                    onClick={() => {
                      setArticleData(item);
                      setVisible3(true);
                    }}
                  >
                    删除
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <Modal
          style={{ top: 300 }}
          title="提示"
          visible={visible3}
          onOk={() => {
            _deleteArticle(articleData);
          }}
          onCancel={() => {
            setVisible3(false);
          }}
        >
          {`确定删除 ${articleData.title} 文章吗？`}
        </Modal>
        <Modal
          style={{ top: 300 }}
          title="提示"
          visible={visible2}
          onOk={_deleteCatetory}
          onCancel={() => {
            setVisible2(false);
          }}
        >
          {`确定删除 ${catetoryData.name} 分类吗？`}
        </Modal>
        <Modal
          style={{ top: 300 }}
          title="新增"
          visible={visible}
          onOk={handleOk}
          onCancel={() => {
            setVisible(false);
          }}
        >
          <Input ref={nameRef} placeholder="分类名称" />
        </Modal>
      </div>
    </>
  );
}
export default withRouter(Edit);
