import React from "react"
import {Redirect, withRouter} from "react-router-dom"
import {Space, Divider, Button, Table, Tag, Layout, Row, Col, message} from 'antd';
import {ToServer} from "../server/Server";
import {ReloadOutlined} from '@ant-design/icons';
import {dataMake} from "../utils/FormUtils";

const {Header, Content, Footer} = Layout;

class LogPage extends React.Component {
    reSetData = () => {
        ToServer("/api/getlogs", "GET").then(resp => {
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
        ToServer("/api/getorganizations", "GET").then(resp => {
            if (resp.code !== 0) message.info(resp.msg)
            else this.setState({
                organizations: resp.data,
            })
        })
    }

    constructor(props) {
        super(props)
        this.state = {
            logs: null,
            organizations: null,
            selectionType: 'button'
        }
        this.reSetData()
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
                    let org = this.state.organizations?.find(item => item.id === organization)
                    if (org !== undefined) {
                        return <Tag color={"cyan"}>{org.name}</Tag>
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
                    if(need!=0){
                        return <Tag color={"yellow"}>待处理{need}件</Tag>
                    }else{
                        return <Tag color={"green-inverse"}>完成</Tag>
                    }

                }
            },
            {
                title: 'Action',
                dataIndex: 'action',
                key: 'action',
                render: (_, {emergence}) => {
                    if (emergence === 1) {
                        return <Button type="link">取消紧急</Button>
                    }
                    return <Button type="link">设置紧急</Button>
                },
            },
        ];
        return <div><Table onRow={(record) => {
            return {
                onClick: (event) => {
                    console.log(record)
                    let state=0
                    if(record.emergence===0){
                        state=1
                    }
                    ToServer("/api/changeemergence","POST",dataMake({id:record.id,state:state})).then(resp=>{
                        if(resp.code!==0) message.error(resp.msg)
                        else {
                            message.success("Success.")
                            let lgs=this.state.logs
                            for(var i in lgs){
                                if(lgs[i].id===record.id){
                                    lgs[i].emergence=state
                                }
                            }
                            this.setState({logs:lgs})

                        }
                    })
                },
            }
        }} columns={columns} dataSource={this.state.logs} pagination={{defaultPageSize: 20}}/>
            <Row>
                <Col span={21}></Col>
                <Col span={3}>
                    <Button type="primary" icon={<ReloadOutlined/>} onClick={() => this.reSetData()}>刷新</Button></Col>
            </Row>
            <Divider dashed/>
        </div>
    }
}

export default withRouter(LogPage)
