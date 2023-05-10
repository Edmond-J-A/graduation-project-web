import React from "react"
import { Redirect, withRouter } from "react-router-dom"
import { DatePicker, Divider, Button, Table, Tag, Layout, Row, Col, message, Select, Space } from 'antd';
import { ToServer } from "../server/Server";
import { ReloadOutlined } from '@ant-design/icons';
import { dataMake } from "../utils/FormUtils";
import dayjs from 'dayjs';
import { ProCard, ProList } from "@ant-design/pro-components";
import { Line, Pie } from '@ant-design/plots';

const { RangePicker } = DatePicker;

const { Header, Content, Footer } = Layout;
const dateFormat = 'YYYY/MM/DD';


export const DemoPie = ({ data, text }) => {
    const config = {
        appendPadding: 10,
        data,
        angleField: 'value',
        colorField: 'name',
        radius: 1,
        innerRadius: 0.6,
        label: {
            type: 'inner',
            offset: '-50%',
            content: '{value}',
            style: {
                textAlign: 'center',
                fontSize: 14,
            },
        },
        interactions: [
            {
                type: 'element-selected',
            },
            {
                type: 'element-active',
            },
        ],
        statistic: {
            title: false,
            content: {
                style: {
                    whiteSpace: 'pre-wrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                },
                content: text,
            },
        },
    };
    return <Pie style={{ width: "300px", height: "300px" }} {...config} />;
};


export const AdminL = ({ data }) => {
    var config = {
        data,
        xField: 'date',
        yField: 'value',
        seriesField: 'name',
        xAxis: {
            range: [0, 1],
            tickCount: 30,
            label: {
                // 数值格式化为千分位
                formatter: (v) => dayjs(v * 1000).format(dateFormat),
            },
        },
    };

    return <Line style={{ height: "200px" }} {...config} />;
}

class LogPage extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            requests: null,
            storageData:null,
            alluser:null,
            usersSelect:null,
            resourceSelect:null,
            predictLine:[],
        }
    }
    UNSAFE_componentWillMount() {
        ToServer("/api/getresourcerequestsadmin", "GET").then(resp => {
            if (resp.code !== 0) message.info(resp.msg)
            else {
                this.setState({ requests: resp.data })
            }
        })
        ToServer("/api/getalluser", "GET").then(resp => {
            if (resp.code !== 0) message.info(resp.msg)
            else {console.log(resp.data)
                this.setState({ alluser: resp.data })
            }
        })
        ToServer("/api/getmystorage", "GET").then(resp => {
            if (resp.code !== 0) message.info(resp.msg)
            else {
              this.setState({ storageData: resp.data })
            }
          })
          ToServer("/api/getmonthrequireitems", "POST", dataMake({  })).then(resp => {
            if (resp.code !== 0) message.error(resp.msg)
            else {
                this.setState({ requirePieData: resp.data })
            }
        })
    }
    render() {
        if (!this.props.nowaccount) {
            return <Redirect to={"/login"}>Login</Redirect>
        }
        var PieStore = this.state.storageData ? this.state.storageData : []
        var selectListOrg = this.state.alluser? this.state.alluser:[]
        var selectListRes = []
        var requestsList = this.state.requests?this.state.requests:[]
        var predictData = this.state.predictLine?this.state.predictLine:[]
        for (let i = 0; i < this.state.storageData?.length; i++) {
            selectListRes.push({ value: this.state.storageData[i].name, label: this.state.storageData[i].name })
    
          }
        const columns = [
            {
                title: '编号',
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
                        return <Tag color={"red"}>已完成</Tag>
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
                                ToServer("/api/operateresourcerequest", "POST", dataMake({ id: id, operate: 1 })).then(resp => {
                                    if (resp.code !== 0) message.error(resp.msg)
                                    else {
                                        message.success("Success.")
                                        let reqs = this.state.requests

                                        for (var i in reqs) {
                                            if (reqs[i].id === id) {
                                                reqs[i].state = 1
                                                break
                                            }
                                        }
                                        this.setState({ requests: reqs })
                                    }
                                })
                            }} type="link">批准</Button>
                            <Button onClick={(record) => {
                                ToServer("/api/operateresourcerequest", "POST", dataMake({ id: id, operate: 2 })).then(resp => {
                                    if (resp.code !== 0) message.error(resp.msg)
                                    else {
                                        message.success("Success.")
                                        let reqs = this.state.requests

                                        for (var i in reqs) {
                                            if (reqs[i].id === id) {
                                                reqs[i].state = -1
                                                break
                                            }
                                        }
                                        this.setState({ requests: reqs })
                                    }
                                })
                            }} type="link">否决</Button>
                        </div>
                    } else if (state === 1 || state === -1) {
                        return <Button onClick={(record) => {
                            ToServer("/api/operateresourcerequest", "POST", dataMake({ id: id, operate: 3 })).then(resp => {
                                if (resp.code !== 0) message.error(resp.msg)
                                else {
                                    message.success("Success.")
                                    let reqs = this.state.requests

                                    for (var i in reqs) {
                                        if (reqs[i].id === id) {
                                            reqs[i].state = 0
                                            break
                                        }
                                    }
                                    this.setState({ requests: reqs })
                                }
                            })
                        }} type="link">撤回</Button>
                    }
                    return <a>/</a>
                },
            },
        ];

        return <div>
            <ProCard style={{ margin: "20px 20px" }}
                tabs={{
                    tabBarExtraContent: <div>
                        
                        <Select  mode="multiple" placeholder="Please select organization"  style={{ width: 220, margin: "0px 20px" }}
                            options={selectListOrg} onChange={v => {
                                if(this.state.resourceSelect!==null&&v.length!==0&&this.state.resourceSelect.length!==0){
                                    ToServer("/api/predict", "POST", dataMake({ users: v, ress: this.state.resourceSelect })).then(resp => {
                                        if (resp.code !== 0) message.error(resp.msg)
                                        else {
                                            message.success(resp.msg)
                                            this.setState({ predictLine: resp.data })
                                        }
                                    })
                                }else{

                                }
                                this.setState({usersSelect:v})
                            }} />
                             <Select  mode="multiple" placeholder="Please select resource type"  style={{ width: 220, margin: "0px 20px" }}
                            options={selectListRes} onChange={v => {
                                if(this.state.usersSelect!==null&&v.length!==0&&this.state.usersSelect.length!==0){
                                    ToServer("/api/predict", "POST", dataMake({ users: this.state.usersSelect, ress: v })).then(resp => {
                                        if (resp.code !== 0) message.error(resp.msg)
                                        else {
                                            message.success(resp.msg)
                                            this.setState({ predictLine: resp.data })
                                        }
                                    })
                                }else{
                                    
                                }
                                this.setState({resourceSelect:v})
                            }} />
                    </div>
                }}
            >
                <ProCard.TabPane key="tab1" tab="库存" >
                    <Row>
                        <Col span={8}>
                            <DemoPie data={PieStore} text={"库存概览"} />
                        </Col>
                        <Col span={2}>

                        </Col>
                        <Col span={14}>

                        </Col>
                    </Row>
                </ProCard.TabPane>
                <ProCard.TabPane key="tab2" tab="预测消耗曲线" >
                    <AdminL data={predictData}/>
                </ProCard.TabPane>
            </ProCard>
            <ProCard>
                <Table columns={columns} dataSource={requestsList} pagination={{ defaultPageSize: 20 }} />

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

export default withRouter(LogPage)
