import React, {useContext, useEffect, useState} from 'react'
import { Menu } from 'antd'
import './index.css'
import {GlobalContext} from "../../../App.jsx";

function getItem(label, key, icon, children, type) {
    return {
        key,
        icon,
        children,
        label,
        type,
    };
}

const DomainList = (props) => {
    const {setDomain} = props
    const [domains, setDomains] = useState([]);
    const [AppServerUrl] = useContext(GlobalContext);

    const [isError,SetIsError] = useState(false)

    let items = [
        getItem('Group', 'grp', null,
            [getItem('Option 13', '13'), getItem('Option 14', '14')], 'group'),
    ];
    useEffect(() => {

        fetch(AppServerUrl+'/domain/list')
            .then(response => response.text())
            .then(data => {
                let arr = JSON.parse(JSON.parse(data).message)
                setDomains(arr)
            })
            .catch(error => {
                console.error('GET 请求失败：', error);
                SetIsError(true)
            });
    }, []);

    items = [
        getItem('域名列表', 'grp', null,
                domains.map((item)=>{
                    return  getItem(item.DomainName, item.DomainId)
                })
            ,
            'group')
    ]

    const onClick = (e) => {
        setDomain(e.domEvent.target.outerText)
    };

    return (
        <div className='domain-list'>
            {
                isError?
                    <div style={{textAlign:'center'}}>连接异常</div>
                    :
                    <Menu
                        onClick={onClick}
                        style={{
                            width: '100%'
                        }}
                        defaultSelectedKeys={[0]}
                        mode="inline"
                        items={items}
                    />
            }

        </div>
    );
};

export default DomainList;

