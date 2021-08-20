import React, { useState, useRef, useEffect } from "react";
import { NavLink, withRouter } from "react-router-dom";
import "./detail.scss";
import { article_detail } from "./utils/utils";
import "./markdown.css";

function Detail(props) {
  const [data, setData] = useState("");
  useEffect(() => {
    let id = localStorage.getItem("id");
    article_detail({ id }).then((res) => {
      setData(res.data.data);
    });
  }, []);
  return (
    <div className="detail custom-html-style">
      <>
        <div className="detail_title">{data.title}</div>
        <div
          className="detail_content"
          dangerouslySetInnerHTML={{ __html: data.content }}
        ></div>
      </>
    </div>
  );
}
export default withRouter(Detail);
