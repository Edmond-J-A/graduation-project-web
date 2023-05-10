import React from "react"
import { Redirect, withRouter } from "react-router-dom"
import { DatePicker, Divider, Button, Table, Tag, Layout, Row, Col, message, Avatar,Space } from 'antd';
import { ToServer } from "../server/Server";
import { ReloadOutlined } from '@ant-design/icons';
import { dataMake } from "../utils/FormUtils";
import dayjs from 'dayjs';
import { ProCard,ProList, ProForm,ProFormText,ModalForm} from "@ant-design/pro-components";
const iconStyles = {
    marginInlineStart: '16px',
    color: 'rgba(0, 0, 0, 0.2)',
    fontSize: '24px',
    verticalAlign: 'middle',
    cursor: 'pointer',
};

const { RangePicker } = DatePicker;

const { Header, Content, Footer } = Layout;
const dateFormat = 'YYYY/MM/DD';

export const DemoMessage = ({ data, test }) => (
    <ProList style={{ margin: "20px 20px" }}
        search={{
            filterType: 'light',
        }}
        rowKey="name"
        headerTitle={<b>通知</b>}
        pagination={{
            pageSize: 4,
        }}
        dataSource={data}
        showActions="hover"
        metas={{
            title: {
                dataIndex: 'title',
                title: '标题',
                search: false,
            },
            avatar: {
                render: () => [
                    <Avatar src="https://storage.takemeto.icu/jzb/1f1f2aa9d9ce29e2e9e1340475c713a.png" />
                ],
                search: false,
            },
            description: {
                dataIndex: 'text',
                search: false,
            },
            subTitle: {
                dataIndex: 'state',
                render: (_, { state }) => {
                    if (state == 0) {
                        return <div><Space size={0}>
                            <Tag color="red" >
                                未读
                            </Tag>
                        </Space></div>
                    } else {
                        return <div><Space size={0}>
                            <Tag color="green">
                                已读
                            </Tag>
                        </Space></div>
                    }
                },
                search: false,
            },
            actions: {
                render: (_, { title,id, state ,sender,time,text}) => {
                    if (state === 0) {
                        return <div>
                            <Button onClick={(record) => {
                                ToServer("/api/setnewsstate", "POST", dataMake({ id: id, state: 1 })).then(resp => {
                                    if (resp.code !== 0) message.error(resp.msg)
                                    else {
                                        test(resp.data)
                                        this.forceUpdate()
                                    }
                                })
                            }} type="Link">标为已读</Button>
                            <ModalForm
                                title={<b>标题：{title}</b>}
                                trigger={
                                    <Button onClick={(record) => {
                                        ToServer("/api/setnewsstate", "POST", dataMake({ id: id, state: 1 })).then(resp => {
                                            if (resp.code !== 0) message.error(resp.msg)
                                            else {
                                                test(resp.data)
                                                this.forceUpdate()
                                            }
                                        })
                                    }} type="Link">
                                        查看
                                    </Button>
                                }
                                onFinish={ () => {
                                    return true;
                                  }}
                                autoFocusFirstInput
                                modalProps={{
                                    destroyOnClose: true,
                                }}
                            >
                                <ProForm.Group>
                                    <ProFormText
                                        width="md"
                                        name="sender"
                                        initialValue={sender}
                                        readonly
                                        label={<b>发信人:</b>}
                                    />

                                    <ProFormText width="md" readonly name="company" label={<b>时间:</b>} initialValue={ dayjs(time * 1000).format(dateFormat)} />
                                </ProForm.Group>
                                <ProForm.Group>
                                    <ProFormText readonly width="md" name="contract" label={<b>正文:</b>} initialValue={ text} />
                                </ProForm.Group>
                            </ModalForm>
                            <Button onClick={(record) => {
                                ToServer("/api/setnewsstate", "POST", dataMake({ id: id, state: 2 })).then(resp => {
                                    if (resp.code !== 0) message.error(resp.msg)
                                    else {
                                        test(resp.data)
                                        this.forceUpdate()
                                    }
                                })
                            }} type="Link">删除</Button>
                        </div>
                    } else {
                        return <div>
                            <Button onClick={(record) => {
                                ToServer("/api/setnewsstate", "POST", dataMake({ id: id, state: 0 })).then(resp => {
                                    if (resp.code !== 0) message.error(resp.msg)
                                    else {
                                        test(resp.data)
                                        this.forceUpdate()
                                    }
                                })
                            }} >标为未读</Button>
                            <ModalForm
                                title={<b>标题：{title}</b>}
                                trigger={
                                    <Button onClick={(record) => {
                                        ToServer("/api/setnewsstate", "POST", dataMake({ id: id, state: 1 })).then(resp => {
                                            if (resp.code !== 0) message.error(resp.msg)
                                            else {
                                                test(resp.data)
                                                this.forceUpdate()
                                            }
                                        })
                                    }} >
                                        查看
                                    </Button>
                                }
                                onFinish={ () => {
                                    return true;
                                  }}
                                autoFocusFirstInput
                                modalProps={{
                                    destroyOnClose: true,
                                }}
                            >
                                <ProForm.Group>
                                    <ProFormText
                                        width="md"
                                        name="sender"
                                        initialValue={sender}
                                        readonly
                                        label={<b>发信人:</b>}
                                    />

                                    <ProFormText width="md" readonly name="company" label={<b>时间:</b>} initialValue={ dayjs(time * 1000).format(dateFormat)} />
                                </ProForm.Group>
                                <ProForm.Group>
                                    <ProFormText readonly width="md" name="contract" label={<b>正文:</b>} initialValue={ text} />
                                </ProForm.Group>
                            </ModalForm>
                            <Button  onClick={(record) => {
                                ToServer("/api/setnewsstate", "POST", dataMake({ id: id, state: 2 })).then(resp => {
                                    if (resp.code !== 0) message.error(resp.msg)
                                    else {
                                        test(resp.data)
                                        this.forceUpdate()
                                    }
                                })
                            }} >删除</Button>
                        </div >
                    }
                },
                search: false,
            },
            status: {
                // 自己扩展的字段，主要用于筛选，不在列表中显示
                title: '状态',
                valueType: 'select',
                search: false,
                valueEnum: {
                    all: { text: '全部', status: 'Default' },
                    open: {
                        text: '已读',
                        status: 'read',
                    },
                    closed: {
                        text: '未读',
                        status: 'unread',
                    },
                },
            },
        }}
    />
);

class DeliverPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            requests:null,
        }
    }

    UNSAFE_componentWillMount() {
        if (this.props.nowaccount?.role === "deliver") {
            ToServer("/api/getresourcerequestsdeliver", "GET").then(resp => {
                if (resp.code !== 0) message.info(resp.msg)
                else {
                    this.setState({ requests: resp.data })
                }
            })
            ToServer("/api/getmynews", "GET").then(resp => {
                if (resp.code !== 0) message.error(resp.msg)
                else {
                    this.setState({ messageList: resp.data })
                }
            })
        }

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
                title: 'organizationName',
                dataIndex: 'organizationName',
                key: 'organizationName',
                render: (_, { organizationName }) => {
                    return <Tag color={"geekblue"}>{organizationName}</Tag>
                }
            },
            {
                title: 'resource',
                dataIndex: 'resource',
                key: 'resource',
                render: (_, { resource }) => {
                    console.log(resource)
                    return <div><Tag color={"purple"}>{resource.name}</Tag><Tag color={"magenta"}>{resource.resourceType}</Tag></div>
                }
            },
            {
                title: 'deliver',
                dataIndex: 'resource',
                key: 'resource',
                render: (_, { resource }) => {

                    return <Tag color={"volcano"}>{resource.default}</Tag>
                }
            },
            {
                title: 'amount',
                dataIndex: 'amount',
                key: 'amount',
                render: (_, { amount }) => {
                    return <Tag color={"cyan"}>{amount}</Tag>
                }
            },
            {
                title: 'submitTime',
                dataIndex: 'submitTime',
                key: 'submitTime',
                render: (_, { submitTime }) => {
                    return dayjs(submitTime * 1000).format(dateFormat)
                }
            },
            {
                title: 'state',
                dataIndex: 'state',
                key: 'state',
                render: (_, { state }) => {
                    if (state === 0) {
                        return <Tag color={"yellow"}>待处理</Tag>
                    } else if (state === 1) {
                        return <Tag color={"geekblue"}>已批准</Tag>
                    }
                    else if (state === 2) {
                        return <Tag color={"volcano"}>运送中</Tag>
                    } else if (state === 3) {
                        return <Tag color={"green"}>已完成</Tag>
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
                    if (state === 1) {
                        return <div>
                            <Button onClick={(record) => {
                                ToServer("/api/operateresourcerequestsdeliver", "POST", dataMake({ id: id, operate: 1 })).then(resp => {
                                    if (resp.code !== 0) message.error(resp.msg)
                                    else {
                                        message.success("Success.")
                                        let reqs = this.state.requests

                                        for (var i in reqs) {
                                            if (reqs[i].id === id) {
                                                reqs[i].state = 2
                                                break
                                            }
                                        }
                                        this.setState({ requests: reqs })
                                    }
                                })
                            }} type="link">取件</Button>
                        </div>
                    }else if (state === 2) {
                        return <div>
                            <Button onClick={(record) => {
                                ToServer("/api/operateresourcerequestsdeliver", "POST", dataMake({ id: id, operate: 2 })).then(resp => {
                                    if (resp.code !== 0) message.error(resp.msg)
                                    else {
                                        message.success("Success.")
                                        let reqs = this.state.requests

                                        for (var i in reqs) {
                                            if (reqs[i].id === id) {
                                                reqs[i].state = 3
                                                break
                                            }
                                        }
                                        this.setState({ requests: reqs })
                                    }
                                })
                            }} type="link">完成</Button>
                        </div>
                    }
                    return <a>/</a>
                },
            },
        ];
        var setMessage = (v) => {
            this.setState({ messageList: v })
        }
        var messageL = this.state.messageList ? this.state.messageList : []
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
            <ProCard>
            <DemoMessage data={messageL} test={(v) => { setMessage(v) }} />
            </ProCard>
        </div>
    }
}
export default withRouter(DeliverPage)
