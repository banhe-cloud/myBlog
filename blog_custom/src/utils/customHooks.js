import React, { useState, useRef, useEffect } from 'react';
import { getCatetory, getArticle } from './utils/utils'
function useQueryArticle(item){
    const [list,setList] = useState([]);
    useEffect(()=>{
        getArticle({ catetory_id: item.id }).then((res)=>{
            if(res.data.code){
                setList(res.data.data)
            }
        })
    })
    return {list}
}
export {
    useQueryArticle
}