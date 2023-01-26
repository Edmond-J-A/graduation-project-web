import React from 'react';
import { Button,Layout, Input ,Form,Select} from 'antd';
import { UpCircleOutlined} from '@ant-design/icons';
import { withRouter } from 'react-router-dom';

import { ToServer } from '../server/Server';

const { Content, Footer } = Layout;
const { Option } = Select;

class RegistPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            organizations: null,
        }

        ToServer("/api/getorganizations","GET").then(resp => {
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
                    <Content style={{ padding: '50px 100px' }}>
                        <Form
                            name="basic"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            style={{ maxWidth: 600 }}
                            initialValues={{ remember: true }}
                            onFinish={values => {
                                if (values.password.length<6){
                                    alert("Password length must be greater than or equal to 6.")
                                    return 
                                }
                                let fd = new FormData()
                                fd.append("name", values.name)
                                fd.append("password", values.password)
                                fd.append("organization", values.organization)
                                fd.append("role","user")
                                ToServer("/api/regist","POST",fd).then(resp => {
                                    if (resp.code !== 0) alert(resp.msg)
                                    else alert("You user id is :"+resp.data.Id+",please remember it!")
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
                                <Select placeholder="Please select your organization" allowClear>
                                    {this.state.organizations === null ?
                                    null :
                                    this.state.organizations.map(org => {
                                        return <Option value={org.Id}>{org.Name}</Option>
                                    })}
                                </Select>
                            </Form.Item>

                            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                                <Button type="primary" htmlType="submit" icon ={<UpCircleOutlined />}>
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

