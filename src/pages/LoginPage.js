import { Layout, message, Space, Tabs } from 'antd';
import { withRouter, Redirect } from 'react-router-dom';
import React from "react"
import {
    AlipayCircleOutlined,
    LockOutlined,
    TaobaoCircleOutlined,
    UserOutlined,
    WeiboCircleOutlined,
} from '@ant-design/icons';
import {
    LoginForm,
    ProFormCaptcha,
    ProFormCheckbox,
    ProFormText,
    ProConfigProvider,
} from '@ant-design/pro-components';

import { ToServer } from '../server/Server';
import { dataMake } from '../utils/FormUtils';

const iconStyles = {
    marginInlineStart: '16px',
    color: 'rgba(0, 0, 0, 0.2)',
    fontSize: '24px',
    verticalAlign: 'middle',
    cursor: 'pointer',
};


class LoginPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    onFinish(values) {
        ToServer("/api/login", "POST", dataMake(values)).then(resp => {
            if (resp.code !== 0) {
                message.open({
                    type: 'error',
                    content: resp.msg
                })
            }
            else {
                console.log(resp.data)
                message.open({
                    type: 'success',
                    content: 'Success.'
                })
                console.log(resp.data)
                this.props.onLoginFinished(resp.data)
                if(resp.data.role!='deliver'){
                    this.props.history.push("/")
                }else{
                    this.props.history.push("/deliver")
                }
            }
        })
    }

    render() {
        return <div>
            <ProConfigProvider hashed={false}>
                <div style={{ backgroundColor: 'white' }}>
                    <LoginForm
                        logo="https://github.githubassets.com/images/modules/logos_page/Octocat.png"
                        title="Github"
                        subTitle="疫情物资智能调度系统"
                        onFinish={v=>{this.onFinish(v)}}
                        actions={
                            <Space>
                                其他登录方式
                                <AlipayCircleOutlined style={iconStyles} />
                                <TaobaoCircleOutlined style={iconStyles} />
                                <WeiboCircleOutlined style={iconStyles} />
                            </Space>
                        }
                    >
                        <ProFormText
                            name="organizationName"
                            fieldProps={{
                                size: 'large',
                                prefix: <UserOutlined className={'prefixIcon'} />,
                            }}
                            placeholder={'用户名: 组织名称'}
                            rules={[
                                {
                                    required: true,
                                    message: '请输入用户名!',
                                },
                            ]}
                        />
                        <ProFormText.Password
                            name="password"
                            fieldProps={{
                                size: 'large',
                                prefix: <LockOutlined className={'prefixIcon'} />,
                            }}
                            placeholder={'密码: ******'}
                            rules={[
                                {
                                    required: true,
                                    message: '请输入密码！',
                                },
                            ]}
                        />
                        <div
                            style={{
                                marginBlockEnd: 24,
                            }}
                        >
                            <ProFormCheckbox noStyle name="autoLogin">
                                自动登录
                            </ProFormCheckbox>
                        </div>
                    </LoginForm>
                </div>
            </ProConfigProvider>
            <Layout style={{ textAlign: 'center', backgroundColor: 'white' }}>©2023 Edmond</Layout>
        </div>
    }
}
export default withRouter(LoginPage)
