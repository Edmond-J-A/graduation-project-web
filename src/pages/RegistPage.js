import React from 'react';
import { Button, Menu, Layout, Input ,Form,Select} from 'antd';
import { UserAddOutlined, UserOutlined, LockOutlined } from '@ant-design/icons';
import { withRouter } from 'react-router-dom';

const { Header, Content, Footer } = Layout;
const { Option } = Select;

const footerStyle = {
    textAlign: 'center',
    color: '#fff',
    backgroundColor: '#7dbcea',
};
class RegistPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            organizations: null,
        }

        fetch("http://localhost/api/getorganizations", {
            method: "GET",
            credentials: "include",
        }).then(r => r.json()).then(resp => {
            if (resp.code !== 0) alert(resp.msg)
            else this.setState({
                organizations: resp.data,
            })
        })
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
                            defaultSelectedKeys={["注册"]}
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
                            onFinish={values => {
                                let fd = new FormData()
                                fd.append("name", values.name)
                                fd.append("password", values.password)
                                fd.append("organization", values.organization)
                                fetch("http://localhost/api/register", {
                                    method: "POST",
                                    credentials: "include",
                                    body: fd,
                                }).then(r => r.json()).then(resp => {
                                    if (resp.code !== 0) alert(resp.msg)
                                    else alert(resp.data.Id)
                                })
                            }}
                            autoComplete="off"
                        >
                            <Form.Item
                                label="Username"
                                name="name"
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
                            <Form.Item name="organization" label="Organization" rules={[{ required: true }]}>
                                <Select
                                    placeholder="Please select your organization"
                                    onChange={()=>{}}
                                    allowClear
                                >
                                    {this.state.organizations === null ?
                                    null :
                                    this.state.organizations.map(org => {
                                        return <Option value={org.Id}>{org.Name}</Option>
                                    })}
                                </Select>
                            </Form.Item>

                            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                                <Button type="primary" htmlType="submit">
                                    Submit
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

export default withRouter(RegistPage)

