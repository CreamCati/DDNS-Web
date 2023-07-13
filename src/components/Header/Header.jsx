import React, {useContext, useRef, useState} from 'react';
import './Header.css'
import {Button, Form, Input, Modal} from "antd";
import {GlobalContext} from "../../App.jsx";

const Header = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [formAuth] = Form.useForm();

    const [appServerUrl,setAppServerUrl,secretId, setSecretId,secretKey, setSecretKey] = useContext(GlobalContext);

    const openSetting = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
        setAppServerUrl(form.getFieldsValue().url)
        window.location.reload();
        form.resetFields()
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const openAuth = ()=>{
        setIsAuthOpen(true)
    }
    const handleAuthOk = () => {
        setIsAuthOpen(false);
        const value = formAuth.getFieldsValue()
        let requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                SecretId : value.secretId,
                SecretKey : value.secretKey
            })

        };
        console.log(requestOptions)
        fetch(appServerUrl+'/setting/auth', requestOptions)
            .then(response => response.json())
            .then(data => {
                alert(data.message)
            }).catch(error => {
            alert(error)
        });
        window.location.reload()
    };
    const handleAuthCancel = () => {
        setIsAuthOpen(false);
    };
    return (
        <div className='header'>
            <div className='title'>DDNS</div>
            <div className='setting'>
                <div className='settingUrl' onClick={openSetting}>设置服务器地址</div>
                <div className='settingAuth' onClick={openAuth}>身份设置</div>
            </div>
            <Modal
                title="设置(默认为本地80端口)"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        关闭
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleOk}>
                        修改
                    </Button>,
                ]}
            >
                <Form
                    form={form}
                    layout='vertical'
                >
                    <Form.Item name="url"
                    >
                        <Input placeholder={appServerUrl} />
                    </Form.Item>
                    <div style={{color:'red'}}>配置后出现错误请检查控制台输出内容</div>
                    <div>默认：http://localhost:80</div>

                </Form>
            </Modal>

            <Modal
                title="身份认证"
                open={isAuthOpen}
                onCancel={handleAuthCancel}
                footer={[
                    <Button key="back" onClick={handleAuthCancel}>
                        关闭
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleAuthOk}>
                        保存
                    </Button>,
                ]}
            >
                <div>请填写腾讯云中获取到的secretId,secretKey</div>
                <Form
                    form={formAuth}
                    layout='vertical'
                >
                    <Form.Item name="secretId" label='secretId' required={true}
                    >
                        <Input placeholder={secretId} />
                    </Form.Item>

                    <Form.Item name="secretKey" label='secretKey' required={true}
                    >
                        <Input placeholder={secretKey} />
                    </Form.Item>

                </Form>
            </Modal>
        </div>

    );
};

export default Header;

