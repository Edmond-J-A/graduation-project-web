import React from 'react';
import {Redirect, withRouter} from 'react-router-dom';
import {Button, Form, Input, Layout, message, Select, InputNumber, Space, Divider, Tag, Table, Row, Col} from "antd";
import {ReloadOutlined, UpCircleOutlined, UserOutlined} from "@ant-design/icons";
import {ToServer} from "../server/Server";
import {dataMake} from "../utils/FormUtils";

const {Header, Content, Footer} = Layout
const {Option} = Select;

class ResourcePage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            ress: null,
            unit: "件",
            logs: null
        }
        ToServer("/api/getstorage", "GET").then(resp => {
            if (resp.code !== 0) message.info(resp.msg)
            else this.setState({
                ress: resp.data,
            })
        })
        ToServer("/api/mylogs", "GET").then(resp => {
            if (resp.code !== 0) message.info(resp.msg)
            else {
                resp.data.map((item, key) => {
                    if (item.amount >= 0) {
                        resp.data[key].operate = "申报"
                    } else {
                        resp.data[key].amount = -resp.data[key].amount
                        resp.data[key].operate = "请求"
                    }
                })
                this.setState({logs: resp.data})
            }
        })
    }
    reSetData = () => {
        ToServer("/api/mylogs", "GET").then(resp => {
            if (resp.code !== 0) message.info(resp.msg)
            else {
                resp.data.map((item, key) => {
                    if (item.amount >= 0) {
                        resp.data[key].operate = "申报"
                    } else {
                        resp.data[key].amount = -resp.data[key].amount
                        resp.data[key].operate = "请求"
                    }
                })
                this.setState({logs: resp.data})
            }
        })}
    render() {
        if (!this.props.nowaccount) {
            return <Redirect to={"/login"}>Login</Redirect>
        }
        const columns = [
            {
                title: 'Id',
                dataIndex: 'id',
                key: 'id',
                render: (text) => <a>{text}</a>,
            },
            {
                title: 'UserID',
                dataIndex: 'userID',
                key: 'userID',
            },
            {
                title: 'ResourceName',
                dataIndex: 'resourceName',
                key: 'resourceName',
            },
            {
                title: 'Organization',
                dataIndex: 'organization',
                key: 'organization',
                render: (_, {organization}) => {
                    if (organization === 0) {
                        return <Tag color={"geekblue"}>管理员</Tag>
                    }
                    let org = this.props.nowaccount.organizationname.name
                    if (org !== undefined) {
                        return <Tag color={"cyan"}>{org}</Tag>
                    }
                    return <Tag color={"red"}>Error</Tag>
                }
            },
            {
                title: 'Operate',
                dataIndex: 'operate',
                key: 'operate',
                render: (_, {operate}) => {
                    let color
                    if (operate === "申报") {
                        color = 'green'
                    } else {
                        color = 'volcano'
                    }
                    return <Tag color={color}>{operate}</Tag>
                }
            },
            {
                title: 'Amount',
                dataIndex: 'amount',
                key: 'amount',
            },
            {
                title: 'Emergence',
                dataIndex: 'emergence',
                key: 'emergence',
                render: (_, {emergence}) => {
                    if (emergence === 1) {
                        return <Tag color={"red"}>紧急</Tag>
                    }
                }
            },
            {
                title: 'processing',
                dataIndex: 'need',
                key: 'need',
                render: (_, {need}) => {
                    if (need != 0) {
                        return <Tag color={"yellow"}>待处理{need}件</Tag>
                    } else {
                        return <Tag color={"green-inverse"}>完成</Tag>
                    }

                }
            },
        ]
        return <div>
            <Layout>
                <Layout className="layout">
                    <Content style={{padding: '50px 50px'}}>
                        <Form
                            name="basic"
                            initialValues={{remember: true}}
                            onFinish={values => {
                                let id = values.id, amount = values.amount, operate = values.operate
                                if (operate === 1) amount = -amount
                                ToServer("/api/addresource", "POST", dataMake({
                                    id: id,
                                    amount: amount
                                })).then(resp => {
                                    if (resp.code !== 0) message.error(resp.msg)
                                    else message.success(resp.msg)
                                })
                            }}
                            autoComplete="off"
                        >

                            <Space>
                                <Form.Item label="Operate" style={{minWidth: "210px", maxWidth: "210px"}}
                                           required={true}>
                                    <Form.Item
                                        name={'operate'}

                                        rules={[
                                            {
                                                required: true,
                                                message: 'Operate is required',
                                            },
                                        ]}
                                    >
                                        <Select placeholder="Operate">
                                            <Option value={0}>申报</Option>
                                            <Option value={1}>请求</Option>
                                        </Select>
                                    </Form.Item>
                                </Form.Item>
                                <Form.Item label="Resource" required={true}>
                                    <Space align={"start"}>
                                        <Form.Item
                                            name={'id'}
                                            noStyle
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Resource type is required',
                                                },
                                            ]}
                                        >
                                            <Select placeholder="Select resource"
                                                    style={{minWidth: "210px", maxWidth: "210px"}}
                                                    onChange={e => {
                                                        let nowid = e
                                                        let unit = "件"
                                                        for (var i in this.state.ress) {
                                                            if (this.state.ress[i].id === nowid) {
                                                                unit = this.state.ress[i].unit
                                                                break
                                                            }
                                                        }
                                                        this.setState({unit: unit})
                                                    }
                                                    }>
                                                {this.state.ress === null ?
                                                    null :
                                                    this.state.ress.map(res => {
                                                        return <Option value={res.id}>{res.name}</Option>
                                                    })}
                                            </Select>
                                        </Form.Item>
                                        <Form.Item
                                            name={'amount'}
                                            Style={{minWidth: "190px"}}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Amount is required',
                                                },
                                            ]}
                                        >
                                            <InputNumber
                                                min="0"
                                                step="0.01"
                                                stringMode
                                                addonAfter={this.state.unit}
                                            />
                                        </Form.Item>
                                        <Form.Item>
                                            <Button type="primary" htmlType="submit" icon={<UpCircleOutlined/>}>
                                                Submit
                                            </Button>
                                        </Form.Item>
                                    </Space>
                                </Form.Item>
                            </Space>
                        </Form>
                        <Divider dashed/>
                        <Table columns={columns} dataSource={this.state.logs} pagination={{defaultPageSize: 10}}/>
                        <Row>
                            <Col span={21}></Col>
                            <Col span={3}>
                                <Button type="primary" icon={<ReloadOutlined/>}
                                        onClick={() => this.reSetData()}>刷新</Button></Col>
                        </Row>
                    </Content>

                </Layout>
            </Layout>
        </div>
    }
}

export default withRouter(ResourcePage)