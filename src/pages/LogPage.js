import React from "react"
import {withRouter} from "react-router-dom"
import {Space,Divider, Button, Table, Tag, Layout, Row, Col} from 'antd';
import {ToServer} from "../server/Server";
import {ReloadOutlined} from '@ant-design/icons';

const {Header, Content, Footer} = Layout;

class LogPage extends React.Component {
    reSetData=()=>{
        ToServer("/api/getlogs", "GET").then(resp => {
            if (resp.code !== 0) alert(resp.msg)
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
            if (resp.code !== 0) alert(resp.msg)
            else this.setState({
                organizations: resp.data,
            })
        })
    }
    constructor(props) {
        super(props)
        this.state = {
            logs: null,
            organizations:null,
        }
        this.reSetData()
    }

    render() {
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
                    if(organization===0){
                        return <Tag color={"geekblue"}>管理员</Tag>
                    }
                    console.log(this.state.organizations[organization])
                    let org=this.state.organizations.find(item=>item.id==organization)
                    if(org!==undefined){
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
                    if (operate == "申报") {
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
                title: 'Action',
                key: 'action',
                render: (_, record) => (
                    <Space size="middle">
                        <a>operate</a>
                    </Space>
                ),
            },
        ];
        return <div><Table columns={columns} dataSource={this.state.logs} pagination={{defaultPageSize:20}}/>
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
