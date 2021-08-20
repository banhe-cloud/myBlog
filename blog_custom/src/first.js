import './first.scss';
import { Modal, Input } from 'antd';
import React, { useEffect, useState, useRef } from 'react';
import { getCatetory, getArticle } from './utils/utils'
import {
    NavLink,
    withRouter
} from "react-router-dom"
function First(props) {
    const [catetory, setCatetory] = useState([]);
    const [article, setArticle] = useState([]);
    const [current_catetory, setCurrent_catetory] = useState({ name: "全部", id: "" });
    const [person_rel, setPerson_rel] = useState(false)
    useEffect(() => {
        getCatetory().then((res) => {
            res.data.data.unshift({ name: "全部", id: "" })
            setCatetory(res.data.data);
            if (sessionStorage.getItem("currentCatetory")) {
                queryArticle(JSON.parse(sessionStorage.getItem("currentCatetory")));
                sessionStorage.removeItem("currentCatetory")
            } else {
                getArticle({ catetory_id: "" }).then((res) => {
                    setArticle(res.data.data)
                })
            }

        });
    }, []);

    function queryArticle(item) {
        getArticle({ catetory_id: item.id }).then((res) => {
            setArticle(res.data.data)
        })
        setCurrent_catetory(item)
    }

    function toDetail(item) {
        localStorage.setItem("id", item.id);
        sessionStorage.setItem("currentCatetory", JSON.stringify(current_catetory))
        props.history.push({ pathname: "/detail" })
    }
    return (
        <div className="app">
            <div className="app_content">
                <div className="content_left">
                    {
                        catetory.map(item => {
                            return (
                                <div className={`left_item borderShadow ${current_catetory.id === item.id ? "selected" : ""}`} onClick={() => queryArticle(item)}>{item.name}</div>
                            )
                        })
                    }
                </div>
                <div className="content_right borderShadow">
                    {
                        article.length ?
                            article.map(item => {
                                return (
                                    <div className="content_item" onClick={() => { toDetail(item) }}>
                                        <div className="content_top">
                                            <div className="item_title">{item.title}</div>
                                            <div className="item_catetory">{item.catetory}</div>
                                        </div>

                                        <div className="item_font" >{item.content.replace(/<[^>]+>/g, "").substring(0, 300)}</div>
                                        <div className="item_time">{item.create_time.substring(0, 10)}</div>
                                    </div>
                                )
                            }) : null
                            // <img className="empty" src={empty}></img>
                    }
                </div>
                <div className="content_person borderShadow">
                    {
                        person_rel ?
                            <div className="person_block">
                                <img src="https://banh-test.oss-cn-hangzhou.aliyuncs.com/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20210308232924.jpg" />
                                <div className="person_name">班赫</div>
                                <div className="person_company">海康威视-萤石</div>
                            </div> :
                            <div className="person_block">
                                <img src="https://banh-test.oss-cn-hangzhou.aliyuncs.com/6ac55d26fb9f11c58b8c064009ef3f5.jpg" />
                                <div className="person_name">西兰花</div>
                                <div className="person_company">简单而有营养</div>
                            </div>
                    }

                    <i className="iconfont person_change" onClick={() => { setPerson_rel(!person_rel) }}>&#xe602;</i>
                    <div className="person_opera">
                        <div className=" opera_left" onClick={()=>{props.history.push({ pathname: "/notes" })}}>学习日记</div>
                        <div className=" opera_right" onClick={()=>{props.history.push({ pathname: "/myLife" })}}>其他</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default withRouter(First)