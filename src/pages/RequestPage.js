import React from "react"
import { Redirect, withRouter } from "react-router-dom"
import { Space, Divider, Button, Table, Tag, Layout, Row, Col, message } from 'antd';
import { ToServer } from "../server/Server";
import { ReloadOutlined } from '@ant-design/icons';
import { dataMake } from "../utils/FormUtils";
import { ProCard } from "@ant-design/pro-components";

const { Header, Content, Footer } = Layout;

class RequestPage extends React.Component {
    reSetData = () => {
        ToServer("/api/getrequests", "GET").then(resp => {
            if (resp.code !== 0) message.info(resp.msg)
            else {
                this.setState({ requests: resp.data })
            }
        })
    }

    constructor(props) {
        super(props)
        this.state = {
            requests: null,
            selectionType: 'button'
        }
        this.reSetData()

    }

UNSAFE_componentWillMount(){
    ToServer("/api/getrequests", "GET").then(resp => {
        if (resp.code !== 0) message.info(resp.msg)
        else {
            this.setState({ requests: resp.data })
        }
    })
}

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
                title: 'name',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: 'role',
                dataIndex: 'role',
                key: 'role',
                render: (_, { role }) => {
                    if (role === "user") {
                        return <Tag color={"green"}>用户</Tag>
                    } else if (role === 'admin') {
                        return <Tag color={"geekblue"}>管理员</Tag>
                    } else {
                        return <Tag color={"volcano"}>货运</Tag>
                    }

                }
            },
            {
                title: 'organization name',
                dataIndex: 'organizationName',
                key: 'organizationName',
                render: (_, { organizationName }) => {
                    return <Tag color={"geekblue"}>{organizationName}</Tag>

                }
            },
            {
                title: 'admin',
                dataIndex: 'admin',
                key: 'admin',
                render: (_, { admin }) => {
                    let color
                    if (admin === true) {
                        color = 'green'
                        return <Tag color={color}>是</Tag>
                    } else {
                        color = 'red'
                        return <Tag color={color}>否</Tag>
                    }

                }
            },
            {
                title: 'address',
                dataIndex: 'address',
                key: 'address',
            },
            {
                title: 'state',
                dataIndex: 'state',
                key: 'state',
                render: (_, { state }) => {
                    if (state === 0) {
                        return <Tag color={"yellow"}>待处理</Tag>
                    } else if (state === 1) {
                        return <Tag color={"green"}>已批准</Tag>
                    } else {
                        return <Tag color={"red"}>已否决</Tag>
                    }
                }
            },
            {
                title: 'Action',
                dataIndex: 'action',
                key: 'action',
                render: (_, { state, id }) => {
                    if (state === 0) {
                        return <div>
                            <Button onClick={(record) => {
                                ToServer("/api/operaterequest", "POST", dataMake({ id: id, operate: 1 })).then(resp => {
                                    if (resp.code !== 0) message.error(resp.msg)
                                    else {
                                        message.success("Success.")
                                        let reqs = this.state.requests

                                        for (var i in reqs) {
                                            if (reqs[i].id === id) {
                                                reqs[i].state = resp.data.state
                                                break
                                            }
                                        }
                                        this.setState({ requests: reqs })
                                    }
                                })
                            }} type="link">批准</Button>
                            <Button onClick={(record) => {
                                ToServer("/api/operaterequest", "POST", dataMake({ id: id, operate: 2 })).then(resp => {
                                    if (resp.code !== 0) message.error(resp.msg)
                                    else {
                                        message.success("Success.")
                                        let reqs = this.state.requests

                                        for (var i in reqs) {
                                            if (reqs[i].id === id) {
                                                reqs[i].state = resp.data.state
                                                break
                                            }
                                        }
                                        this.setState({ requests: reqs })
                                    }
                                })
                            }} type="link">否决</Button>
                        </div>
                    }
                    return <a>/</a>
                },
            },
        ];
        return <div>
            <ProCard>
                <Table columns={columns} dataSource={this.state.requests} pagination={{ defaultPageSize: 20 }} />

                <Divider dashed />
                <Row>
                    <Col span={21}></Col>
                    <Col span={3}>
                        <Button type="primary" icon={<ReloadOutlined />} onClick={() => this.reSetData()}>刷新</Button></Col>
                </Row>
            </ProCard>
        </div>
    }
}

export default withRouter(RequestPage)
