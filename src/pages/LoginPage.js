import { Button, Menu, Input, Form, Layout } from 'antd';
import { UserAddOutlined, UserOutlined} from '@ant-design/icons';
import { Link, withRouter } from 'react-router-dom';
import React from 'react';

const { Header, Content, Footer } = Layout;

const footerStyle = {
    textAlign: 'center',
    color: '#fff',
    backgroundColor: '#7dbcea',
};
class LoginPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    render() {
        return <div>
            <Layout>
                <Layout className="layout">
                    <Header>
                        <div className="logo" />
                        <Menu
                            theme="dark"
                            mode="horizontal"
                            defaultSelectedKeys={["登录"]}
                            items={[{
                                key: "登录",
                                label: "登录",
                                onClick: () => {
                                    this.props.history.push("/login")
                                }
                            }, {
                                key: "注册",
                                label: "注册",
                                onClick: () => {
                                    this.props.history.push("/regist")
                                }
                            }]
                            }
                        />
                    </Header>
                    <Content style={{ padding: '50px 100px' }}>
                        <Form
                            name="basic"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            style={{ maxWidth: 600 }}
                            initialValues={{ remember: true }}
                            autoComplete="off"
                        >
                            <Form.Item
                                label="UserID"
                                name="userid"
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
                                <Button type="primary" style={{ margin: "10px" }} icon={<UserOutlined />} >
                                    Login
                                </Button>
                                <Button style={{ margin: "20px" }} icon={<UserAddOutlined />} onClick={()=>{this.props.history.push("/regist")}}>
                                    Regist
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
