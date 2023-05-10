import React from 'react';
import { Button, Layout, Input, Form, Select,message } from 'antd';
import { UpCircleOutlined } from '@ant-design/icons';
import { withRouter } from 'react-router-dom';

import { ToServer } from '../server/Server';
import { dataMake } from '../utils/FormUtils';

const { Content, Footer } = Layout;
const { Option } = Select;

class RegistPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
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
                            onFinish={values => {
                                if (values.password.length < 6) {
                                    alert("Password length must be greater than or equal to 6.")
                                    return
                                }
                                ToServer("/api/register", "POST", dataMake(values)).then(resp => {
                                    if (resp.code !== 0) message.error(resp.msg)
                                    else message.success(resp.msg)
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
                            <Form.Item
                                label="Organization"
                                name="organization"
                                rules={[{ required: true, message: 'Please input your organization!' }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label="Role"
                                name="role"
                                rules={[{ required: true, message: 'Please choose your role!' }]}
                            >
                                <Select options={[{value: 'deliver',label: '运输'},
                                                  {value: 'user',label: '用户'}]}/>
                            </Form.Item>
                            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                                <Button type="primary" htmlType="submit" icon={<UpCircleOutlined />}>
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

