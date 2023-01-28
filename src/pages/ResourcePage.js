import React from 'react';
import {Redirect, withRouter} from 'react-router-dom';
import {Button, Form, Input, Layout, message} from "antd";
import {UserOutlined} from "@ant-design/icons";

const {Header,Content,Footer}=Layout
class ResourcePage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    render() {
        if (!this.props.nowaccount) {
            return <Redirect to={"/login"}>Login</Redirect>
        }
        return  <div>
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

                </Layout>
            </Layout>
        </div>
    }
}
export default withRouter(ResourcePage)