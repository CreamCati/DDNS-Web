import React, {useContext, useEffect, useState} from 'react';
import './index.css'
import {Button, Form, Input, Modal, Space, Table, Tag} from "antd";
import {GlobalContext} from "../../../App.jsx";

const DomainInfo = (props) => {
    const {domain} = props

    const [record, setRecord] = useState([]);
    const [loading,setLoading] = useState(true)
    const [selectRecord,setSelectRecord] = useState()
    const [isAddOpen,SetIsAddOpen] = useState(false)
    const [form] = Form.useForm();
    const [id,setId] = useState()
    const [appServerUrl] = useContext(GlobalContext);

    function fetchData(){
        setLoading(true)
        setRecord([])
        let data = {
            Name: domain,
        };

        // 构建请求配置对象
        let requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };

        fetch(appServerUrl+'/domain/info', requestOptions)
            .then(response => response.json())
            .then(data => {

                // 处理响应数据
                let arr = JSON.parse(data.message)
                arr.Response.RecordList.shift()
                arr.Response.RecordList.shift()
                setRecord(arr.Response.RecordList)
                setId(undefined)
                setLoading(false)
            }).catch(error => {

        });
    }
    useEffect(()=>{
        fetchData()
    },[domain])

    function onSelectClick(e) {
        setSelectRecord(e)
        setId(e.RecordId)
    }
    function onDropClick(e) {
        setId(e)
        let requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                RecordId:e+"",
                Domain:domain
            })
        };

        fetch(appServerUrl+'/domain/delete', requestOptions)
            .then(response => response.json())
            .then(data => {
                alert(data.message)
                fetchData()

            }).catch(error => {

        });
    }

    const columns = [
        {
            title: 'ID',
            dataIndex: 'RecordId',
            key: 'RecordId',
        },
        {
            title: '网站前缀',
            dataIndex: 'Name',
            key: 'Name',
        },
        {
            title: '记录类型',
            dataIndex: 'Type',
            key: 'Type',
        },
        {
            title: 'IP地址',
            dataIndex: 'Value',
            key: 'Value',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <a onClick={()=>{onSelectClick(record)}}>选择</a>
                    <a onClick={()=>{onDropClick(record.RecordId)}}><Tag color={"red"}>删除（点了就没了哦）</Tag></a>
                </Space>
            ),
        },
    ];
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (e) => {
        const value = e.target.value;
        // 只允许输入正整数
        const sanitizedValue = value.replace(/\D/g, '');
        setInputValue(sanitizedValue);
    };
    const onSubmit = ()=>{
        if(!id){
            alert("选择一条记录，进行修改")
            return
        }
        // 构建请求配置对象
        let requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Time: inputValue,
                RecordId: selectRecord.RecordId+'',
                Domain:domain,
                Line:selectRecord.Line,
                Name:selectRecord. Name,
                Type:selectRecord.Type,

            })

        };

        fetch(appServerUrl+'/domain/task', requestOptions)
            .then(response => response.json())
            .then(data => {
                alert(data.message)
            }).catch(error => {
                alert(error)
        });
    }
    const handleAdd = () => {
        SetIsAddOpen(true)
    };
    const handleAddOk = () => {
        const value = form.getFieldsValue()

        let requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Value:value.ip,
                Name:value.qianzui,
                Type:value.leixing,
                Domain: domain,
            })

        };
        setLoading(true)

        fetch(appServerUrl+'/domain/create', requestOptions)
            .then(response => response.json())
            .then(data => {
                alert(data.message)
                fetchData()
            }).catch(error => {
            alert(error)
        }).finally(()=>{
            setLoading(false)
        });
        SetIsAddOpen(false)
    };
    const handleCancel = () => {
        SetIsAddOpen(false)

    };

    return (
        <div className='domain-info'>
            {
                domain?
                    <div>
                        <Button onClick={handleAdd} type="primary" style={{ margin: 16 }}>
                            添加一条记录
                        </Button>
                        <Table loading={loading}  columns={columns} dataSource={record} rowKey={(record) => record.RecordId}  />
                        <div className='task'>
                            <div className='task-title'>设置定时任务({id?id:'选一条记录吧'})</div>
                            <div className='task-content'>
                                <div>每<input type={"number"} className='task-time' value={inputValue} onChange={handleInputChange}/>分钟进行一次域名绑定</div>
                                <div style={{color:"red"}}>输入0提交任务即可关闭定时器</div>
                                <Button className='task-submit' type={"primary"} onClick={onSubmit}>提交定时任务</Button>
                            </div>
                        </div>

                        <Modal title="添加记录(请自行检查填写是否正确)" open={isAddOpen} onOk={handleAddOk} onCancel={handleCancel}>
                            <Form
                                form={form}
                                layout='vertical'
                            >
                                <Form.Item name="qianzui"
                                >
                                    <Input placeholder='网站前缀:@表示无前缀' />
                                </Form.Item>
                                <Form.Item name="leixing"
                                >
                                    <Input placeholder='记录类型:默认为A类'/>
                                </Form.Item>
                                <Form.Item name="ip"
                                >
                                    <Input placeholder='IP地址:192.168.1.1' />
                                </Form.Item>

                            </Form>
                        </Modal>
                    </div>
                    :<div>DDNS域名解析服务，使用前请确地址和身份设置正确</div>
            }


        </div>
    );
};

export default DomainInfo;

