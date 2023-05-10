import { Redirect } from "react-router-dom"
import { Tag, DatePicker, Space, message, Avatar } from 'antd';
import { Liquid, Area, Pie } from '@ant-design/plots';
import React, { useState, useEffect } from 'react';
import { StatisticCard, ProCard, ProList, ModalForm,
    ProForm,
    ProFormText, } from '@ant-design/pro-components';
import RcResizeObserver from 'rc-resize-observer';
import dayjs from 'dayjs';
import { PlusOutlined } from '@ant-design/icons';
import { dataMake } from "../utils/FormUtils";
import { ToServer } from "../server/Server";
import { Button } from "antd/es/radio";

const { Divider } = StatisticCard;
const { RangePicker } = DatePicker;
const imgStyle = {
    display: 'block',
    width: 42,
    height: 42,
};
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
                            }} type="Link">标为未读</Button>
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
                            <Button type="link" onClick={(record) => {
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

export const DemoLiquid = ({ rate ,text}) => {
    const config = {
        percent: rate,
        outline: {
            border: 4,
            distance: 8,
        },
        wave: {
            length: 128,
        },
        outline: {
            border: 10,
            distance: 6,
            style: {
                stroke: '#FFC100',
                strokeOpacity: 0.9,
            },
        },
        statistic: {
            title: false,
            content: {
                style: {
                    whiteSpace: 'pre-wrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                },
                content: text+":\n" + (rate * 100) + "%",
            },
        },
    };
    return <Liquid style={{ width: "250px", height: "250px" }} {...config} />;
};

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
        xAxis: {
            range: [0, 1],
            tickCount: 30,
            label: {
                // 数值格式化为千分位
                formatter: (v) => dayjs(v * 1000).format(dateFormat),
            },
        },
        areaStyle: () => {
            return {
                fill: 'l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff',
            };
        },
    };
    return <Area style={{ height: "200px" }} {...config} />;
}

class MainPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: null,
            dayRange: [dayjs('2023/03/01', dateFormat), dayjs('2023/03/31', dateFormat)],
            consumeLineData: null,
            requireLineData: null,
            thismonth: [dayjs('2023/03/01', dateFormat), dayjs('2023/03/31', dateFormat)],
            consumePieData: null,
            requirePieData: null,
            messageList: null,
            j: true,
        }
    }

    UNSAFE_componentWillMount() {
        ToServer("/api/getmynews", "GET").then(resp => {
            if (resp.code !== 0) message.error(resp.msg)
            else {
                this.setState({ messageList: resp.data })
            }
        })
        ToServer("/api/getmainpageinfo", "GET").then(resp => {
            if (resp.code !== 0) message.error(resp.msg)
            else {
                this.setState({ data: resp.data })
            }
        })
        var firstDate = new Date();
        firstDate.setDate(1);
        firstDate.setHours(0);
        firstDate.setMinutes(0);
        firstDate.setSeconds(0);
        firstDate.setMilliseconds(0);
        var endDate = new Date(firstDate);
        endDate.setMonth(firstDate.getMonth() + 1);
        endDate.setDate(1);
        var first = parseInt(firstDate.getTime())
        var last = parseInt(endDate.getTime() - 1)
        var initDay = [dayjs(first), dayjs(last)]
        this.setState({ dayRange: initDay, thismonth: initDay })
        if (this.props.nowaccount?.role === "deliver") {

        } else {

            ToServer("/api/getconsumelogsbydayrange", "POST", dataMake({ start: initDay[0].unix(), end: initDay[1].unix() })).then(resp => {
                if (resp.code !== 0) message.error(resp.msg)
                else {
                    this.setState({ consumeLineData: resp.data })
                }
            })

            ToServer("/api/getrequirelogsbydayrange", "POST", dataMake({ start: initDay[0].unix(), end: initDay[1].unix() })).then(resp => {
                if (resp.code !== 0) message.error(resp.msg)
                else {
                    this.setState({ requireLineData: resp.data })
                }
            })

            ToServer("/api/getmonthconsumeitems", "POST", dataMake({ start: initDay[0].unix(), end: initDay[1].unix() })).then(resp => {
                if (resp.code !== 0) message.error(resp.msg)
                else {
                    this.setState({ consumePieData: resp.data })
                }
            })

            ToServer("/api/getmonthrequireitems", "POST", dataMake({ start: initDay[0].unix(), end: initDay[1].unix() })).then(resp => {
                if (resp.code !== 0) message.error(resp.msg)
                else {
                    this.setState({ requirePieData: resp.data })
                }
            })
        }

    }


    render() {
        var setMessage = (v) => {
            this.setState({ messageList: v })
        }
        if (!this.props.nowaccount) {
            return <Redirect to={"/login"} />
        }
        if (this.props.nowaccount.role === 'user') {
            var data = this.state.consumeLineData ? this.state.consumeLineData : []
            var data1 = this.state.requireLineData ? this.state.requireLineData : []
            var dataCPie = this.state.consumePieData ? this.state.consumePieData : []
            var dataRPie = this.state.requirePieData ? this.state.requirePieData : []
            var messageL = this.state.messageList ? this.state.messageList : []
            var rate = (this.state.data?.successSum + this.state.data?.approveSum) / this.state.data?.requireSum
            return <div>
                <ProCard.Group direction={'row'} style={{ margin: "20px 20px" }}>
                    <ProCard>
                        <DemoPie data={dataCPie} text={"本月消耗概览"} />
                    </ProCard>
                    <Divider />
                    <ProCard>
                        <DemoPie data={dataRPie} text={"本月请求概览"} />
                    </ProCard>
                    <Divider />
                    <ProCard>
                        <DemoLiquid rate={Number(rate.toString().match(/^\d+(?:\.\d{0,2})?/)) } text={"请求通过率"}/>
                    </ProCard>
                </ProCard.Group>
                <RcResizeObserver key="resize-observer">
                    <StatisticCard.Group direction={'row'} style={{ margin: "20px 20px" }}>
                        <StatisticCard
                            statistic={{
                                title: '请求总数',
                                value: this.state.data?.requireSum,
                                icon: (
                                    <img
                                        style={imgStyle}
                                        src="https://gw.alipayobjects.com/mdn/rms_7bc6d8/afts/img/A*dr_0RKvVzVwAAAAAAAAAAABkARQnAQ"
                                        alt="icon"
                                    />
                                ),
                            }}
                        />
                        <Divider />
                        <StatisticCard
                            statistic={{
                                title: '待处理请求量',
                                value: this.state.data?.waitingSum,
                                icon: (
                                    <img
                                        style={imgStyle}
                                        src="https://gw.alipayobjects.com/mdn/rms_7bc6d8/afts/img/A*-jVKQJgA1UgAAAAAAAAAAABkARQnAQ"
                                        alt="icon"
                                    />
                                ),
                            }}
                        />
                        <Divider />
                        <StatisticCard
                            statistic={{
                                title: '已批准请求数',
                                value: this.state.data?.approveSum,
                                icon: (
                                    <img
                                        style={imgStyle}
                                        src="https://gw.alipayobjects.com/mdn/rms_7bc6d8/afts/img/A*FPlYQoTNlBEAAAAAAAAAAABkARQnAQ"
                                        alt="icon"
                                    />
                                ),
                            }}
                        />
                        <Divider />
                        <StatisticCard
                            statistic={{
                                title: '已完成请求数',
                                value: this.state.data?.successSum,
                                icon: (
                                    <img
                                        style={imgStyle}
                                        src="https://storage.takemeto.icu/jzb/e519879a3bee433c3b1d5ea6a26cc4e.png"
                                        alt="icon"
                                    />
                                ),
                            }}
                        />
                        <Divider />
                        <StatisticCard
                            statistic={{
                                title: '否决请求数',
                                value: this.state.data?.deniedSum,
                                icon: (
                                    <img
                                        style={imgStyle}
                                        src="https://gw.alipayobjects.com/mdn/rms_7bc6d8/afts/img/A*pUkAQpefcx8AAAAAAAAAAABkARQnAQ"
                                        alt="icon"
                                    />
                                ),
                            }}
                        />
                    </StatisticCard.Group>
                </RcResizeObserver>
                <ProCard style={{ margin: "20px 20px" }}
                    tabs={{
                        tabBarExtraContent: <RangePicker defaultValue={this.state.dayRange} style={{ margin: "0px 20px" }} onChange={v => {
                            var d1 = []
                            ToServer("/api/getconsumelogsbydayrange", "POST", dataMake({ start: v[0].unix(), end: v[1].unix() })).then(resp => {
                                if (resp.code !== 0) message.error(resp.msg)
                                else {
                                    d1 = resp.data
                                }
                            })
                            ToServer("/api/getrequirelogsbydayrange", "POST", dataMake({ start: v[0].unix(), end: v[1].unix() })).then(resp => {
                                if (resp.code !== 0) message.error(resp.msg)
                                else {
                                    this.setState({ requireLineData: resp.data, consumeLineData: d1 })
                                }
                            })
                        }} />
                    }}
                >
                    <ProCard.TabPane key="tab1" tab="消耗量" >
                        <AdminL data={data} />
                    </ProCard.TabPane>
                    <ProCard.TabPane key="tab2" tab="请求量">
                        <AdminL data={data1} />
                    </ProCard.TabPane>
                </ProCard>
                <DemoMessage data={messageL} test={(v) => { setMessage(v) }} />
            </div >
        } else if (this.props.nowaccount.role === 'admin') {
            var data = this.state.consumeLineData ? this.state.consumeLineData : []
            var data1 = this.state.requireLineData ? this.state.requireLineData : []
            var dataCPie = this.state.consumePieData ? this.state.consumePieData : []
            var dataRPie = this.state.requirePieData ? this.state.requirePieData : []
            var messageL = this.state.messageList ? this.state.messageList : []
            var rate = (this.state.data?.successSum + this.state.data?.approveSum) / this.state.data?.requireSum
            return <div>
                <ProCard.Group direction={'row'} style={{ margin: "20px 20px" }}>
                    <ProCard>
                        <DemoPie data={dataCPie} text={"本月入库概览"} />
                    </ProCard>
                    <Divider />
                    <ProCard>
                        <DemoPie data={dataRPie} text={"本月批准概览"} />
                    </ProCard>
                    <Divider />
                    <ProCard>
                        <DemoLiquid rate={Number(rate.toString().match(/^\d+(?:\.\d{0,2})?/))} text={"批申通过率"}/>
                    </ProCard>
                </ProCard.Group>
                <RcResizeObserver key="resize-observer">
                    <StatisticCard.Group direction={'row'} style={{ margin: "20px 20px" }}>
                        <StatisticCard
                            statistic={{
                                title: '请求总数',
                                value: this.state.data?.requireSum,
                                icon: (
                                    <img
                                        style={imgStyle}
                                        src="https://gw.alipayobjects.com/mdn/rms_7bc6d8/afts/img/A*dr_0RKvVzVwAAAAAAAAAAABkARQnAQ"
                                        alt="icon"
                                    />
                                ),
                            }}
                        />
                        <Divider />
                        <StatisticCard
                            statistic={{
                                title: '待处理请求量',
                                value: this.state.data?.waitingSum,
                                icon: (
                                    <img
                                        style={imgStyle}
                                        src="https://gw.alipayobjects.com/mdn/rms_7bc6d8/afts/img/A*-jVKQJgA1UgAAAAAAAAAAABkARQnAQ"
                                        alt="icon"
                                    />
                                ),
                            }}
                        />
                        <Divider />
                        <StatisticCard
                            statistic={{
                                title: '已批准请求数',
                                value: this.state.data?.approveSum,
                                icon: (
                                    <img
                                        style={imgStyle}
                                        src="https://gw.alipayobjects.com/mdn/rms_7bc6d8/afts/img/A*FPlYQoTNlBEAAAAAAAAAAABkARQnAQ"
                                        alt="icon"
                                    />
                                ),
                            }}
                        />
                        <Divider />
                        <StatisticCard
                            statistic={{
                                title: '已完成请求数',
                                value: this.state.data?.successSum,
                                icon: (
                                    <img
                                        style={imgStyle}
                                        src="https://storage.takemeto.icu/jzb/e519879a3bee433c3b1d5ea6a26cc4e.png"
                                        alt="icon"
                                    />
                                ),
                            }}
                        />
                        <Divider />
                        <StatisticCard
                            statistic={{
                                title: '否决请求数',
                                value: this.state.data?.deniedSum,
                                icon: (
                                    <img
                                        style={imgStyle}
                                        src="https://gw.alipayobjects.com/mdn/rms_7bc6d8/afts/img/A*pUkAQpefcx8AAAAAAAAAAABkARQnAQ"
                                        alt="icon"
                                    />
                                ),
                            }}
                        />
                    </StatisticCard.Group>
                </RcResizeObserver>
                <ProCard style={{ margin: "20px 20px" }}
                    tabs={{
                        tabBarExtraContent: <RangePicker defaultValue={this.state.dayRange} style={{ margin: "0px 20px" }} onChange={v => {
                            var d1 = []
                            ToServer("/api/getconsumelogsbydayrange", "POST", dataMake({ start: v[0].unix(), end: v[1].unix() })).then(resp => {
                                if (resp.code !== 0) message.error(resp.msg)
                                else {
                                    d1 = resp.data
                                }
                            })
                            ToServer("/api/getrequirelogsbydayrange", "POST", dataMake({ start: v[0].unix(), end: v[1].unix() })).then(resp => {
                                if (resp.code !== 0) message.error(resp.msg)
                                else {
                                    this.setState({ requireLineData: resp.data, consumeLineData: d1 })
                                }
                            })
                        }} />
                    }}
                >
                    <ProCard.TabPane key="tab1" tab="入库量" >
                        <AdminL data={data} />
                    </ProCard.TabPane>
                    <ProCard.TabPane key="tab2" tab="发放量">
                        <AdminL data={data1} />
                    </ProCard.TabPane>
                </ProCard>
                <DemoMessage data={messageL} test={(v) => { setMessage(v) }} />
            </div >

        }
    }
}
export default MainPage
