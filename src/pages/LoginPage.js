import { Button, Input, Form, Layout ,message} from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { withRouter,Redirect } from 'react-router-dom';
import React from 'react';

import { ToServer } from '../server/Server';
import { dataMake } from '../utils/FormUtils';

const { Content, Footer } = Layout;

class LoginPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    onFinish(values) {
        ToServer("/api/login", "POST", dataMake(values)).then(resp => {
            if (resp.code !== 0){
                message.open({ type: 'error',
                    content: resp.msg})
            }
            else {
                message.open({ type: 'success',
                    content: 'Success.'})
                this.props.onLoginFinished(resp.data)
                this.props.history.push("/")
            }
        })
    }

    render() {
        return <div>
            <Layout>
                <Layout className="layout">
                    <Content style={{ padding: '50px 100px' }}>
                        <Form
                            name="basic"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            style={{ maxWidth: 600 }}
                            initialValues={{ remember: true }}
                            onFinish={v => this.onFinish(v)}
                            autoComplete="off"
                        >
                            <Form.Item
                                label="UserID"
                                name="id"
                                rules={[{ required: true, message: 'Please input your username!' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Password"
                                name="password"
                                rules={[{ required: true, message: 'Please input your password!' }]}
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                                <Button type="primary" htmlType="submit" style={{ margin: "10px" }} icon={<UserOutlined />}>
                                    Login
                                </Button>
                            </Form.Item>
                        </Form>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>©2023 Edmond</Footer>
                </Layout>
            </Layout>

        </div>
    }
}
export default withRouter(LoginPage)
