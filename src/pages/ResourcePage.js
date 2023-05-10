import React from "react"
import { Redirect, withRouter } from "react-router-dom"
import { Space, Tag, DatePicker, message, Button, Col, Row, Divider, Select } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { ToServer } from "../server/Server";
import { dataMake } from "../utils/FormUtils";
import {
  EditableProTable,
  ProForm,
  ProCard,
  ProTable,
  ProList
} from '@ant-design/pro-components';
import dayjs from 'dayjs';
import { Line, Pie } from '@ant-design/plots';


const { RangePicker } = DatePicker;

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
    seriesField: 'category',
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
class ResourcePage extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      rType: null,
      className: null,
      itemsName: null,
      editableKeys: '',
      storageData: null,
      dayRange: [dayjs('2023/03/01', dateFormat), dayjs('2023/03/31', dateFormat)],
      typeName: "全部",
      lineData: null,
      consumeData: null,
      requireData:null,
    }
  }

  UNSAFE_componentWillMount() {
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
    this.setState({ dayRange: initDay })

    ToServer("/api/getconsumelogsbydayname", "POST", dataMake({ start: initDay[0].unix(), end: initDay[1].unix(), tclass: this.state.typeName })).then(resp => {
      if (resp.code !== 0) message.error(resp.msg)
      else {
        this.setState({ lineData: resp.data })
      }
    })

    ToServer("/api/getallresourcename", "GET").then(resp => {
      if (resp.code !== 0) message.info(resp.msg)
      else {
        this.setState({ itemsName: resp.data })
      }
    })

    ToServer("/api/getallresourcetype", "GET").then(resp => {
      if (resp.code !== 0) message.info(resp.msg)
      else {
        this.setState({ className: resp.data })
      }
    })

    ToServer("/api/getmystorage", "GET").then(resp => {
      if (resp.code !== 0) message.info(resp.msg)
      else {
        this.setState({ storageData: resp.data })
      }
    })

    ToServer("/api/getconsumelogs", "GET").then(resp => {
      if (resp.code !== 0) message.info(resp.msg)
      else {
        console.log(resp.data)
        this.setState({ consumeData: resp.data })
      }
    })

    ToServer("/api/getrequirelogs", "GET").then(resp => {
      if (resp.code !== 0) message.info(resp.msg)
      else {
        this.setState({requireData: resp.data })
      }
    })
  }

  render() {
    if (!this.props.nowaccount) {
      return <Redirect to={"/login"} />
    }
    var data = []
    for (let index = 0; index < this.props.ress?.length; index++) {
      var element = {
        id: this.props.ress[index].id,
        consume: 0,
        resourceName: this.props.ress[index].resource.name,
        resourceType: this.props.ress[index].resource.resourceType,
        amount: this.props.ress[index].amount,
      }
      data.push(element)
    }

    if (this.props.nowaccount.admin) {
      const columns1 = [
        {
          title: '名称',
          dataIndex: 'resourceName',
          width: '15%',
          editable: false,
          filters: this.state.itemsName,
          filterSearch: true,
          onFilter: (value, record) => record.resourceName.includes(value),
          width: '40%',
        },
        {
          title: '类别',
          dataIndex: 'resourceType',
          width: '25%',
          editable: false,
          filters: this.state.className,
          filterSearch: true,
          onFilter: (value, record) => record.resourceType.includes(value),
          width: '40%',
        },
        {
          title: '库存',
          dataIndex: 'amount',
          width: '10%',
          editable: false,
        },
        {
          title: '新入库量',
          dataIndex: 'consume',
          valueType: "digit",
          width: '10%',
          formItemProps: {
            rules: [
              {
                required: true,
                message: '此项为必填项',
              },
            ],
          },
        },
        {
          title: '操作',
          valueType: 'option',
          width: '10%',
          render: (text, record, _, action) => [
            <Button linked
              key="editable"
              onClick={() => {
                action?.startEditable?.(record.resourceName);
              }}
            >
              编辑
            </Button>,
          ],
        },
      ];
      var PieStore = this.state.storageData ? this.state.storageData : []
      var selectList = [{ value: '全部', label: '全部' }]
      var LineD = this.state.lineData ? this.state.lineData : []
      var list = this.state.consumeData ? this.state.consumeData : []
      var rlist = this.state.requireData ? this.state.requireData : []
      for (let i = 0; i < this.state.storageData?.length; i++) {
        selectList.push({ value: this.state.storageData[i].name, label: this.state.storageData[i].name })

      }
      return <div>
                <ProCard style={{ margin: "20px 20px" }}
          tabs={{
            tabBarExtraContent: <div>
              <RangePicker defaultValue={this.state.dayRange} style={{ margin: "0px 20px" }} onChange={v => {
                ToServer("/api/getconsumelogsbydayname", "POST", dataMake({ start: v[0].unix(), end: v[1].unix(), tclass: this.state.typeName })).then(resp => {
                  if (resp.code !== 0) {
                    message.error(resp.msg)
                    this.setState({ dayRange: v })
                  }
                  else {
                    this.setState({ dayRange: v, lineData: resp.data })
                  }
                })
              }} />
              <Select defaultValue={this.state.typeName} style={{ width: 120, margin: "0px 20px" }}
                options={selectList} onChange={v => {
                  ToServer("/api/getconsumelogsbydayname", "POST", dataMake({ start: this.state.dayRange[0].unix(), end: this.state.dayRange[1].unix(), tclass: v })).then(resp => {
                    if (resp.code !== 0) {
                      message.error(resp.msg)
                      this.setState({ typeName: v })
                    }
                    else {
                      this.setState({ typeName: v, lineData: resp.data })
                    }
                  })
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
                <ProCard style={{ margin: "20px 20px" }}
                  tabs={{
                  }}
                >
                  <ProCard.TabPane key="tab1" tab={<b>入库详情</b>} >
                  <ProList
                          rowKey="resid"
                          dataSource={list}
                          pagination={{
                            pageSize: 4,
                          }}
                          showActions="hover"
                          metas={{
                            title: {
                              dataIndex: 'resource',
                              render: (_, { resource }) => {
                                return <div>{resource.name}</div>
                              }
                            },
                            avatar: {
                            },
                            description: {
                              dataIndex: 'resource',
                              render: (_, { now }) => {
                                return <div>{dayjs(now * 1000).format(dateFormat)}</div>
                              }
                            },
                            subTitle: {
                              render: (_, { consume, resource }) => {
                                return (
                                  <Space size={0}>
                                    <Tag color="blue">{"数量:" + consume}</Tag>
                                    <Tag color="#5BD8A6">{resource.resourceType}</Tag>
                                  </Space>
                                );
                              },
                            },
                          }}
                        />
                  </ProCard.TabPane>
                  <ProCard.TabPane key="tab2" tab={<b>出库详情</b>}>
                  <ProList
                          rowKey="id"
                          dataSource={rlist}
                          pagination={{
                            pageSize: 4,
                          }}
                          showActions="hover"
                          metas={{
                            title: {
                              dataIndex: 'resource',
                              render: (_, { resource }) => {
                                return <div>{resource.name}</div>
                              }
                            },
                            avatar: {
                            },
                            description: {
                              dataIndex: 'submitTime',
                              render: (_, { submitTime }) => {
                                return <div>{dayjs(submitTime * 1000).format(dateFormat)}</div>
                              }
                            },
                            subTitle: {
                              render: (_, { amount, resource }) => {
                                return (
                                  <Space size={0}>
                                    <Tag color="blue">{"数量:" + amount}</Tag>
                                    <Tag color="#5BD8A6">{resource.resourceType}</Tag>
                                  </Space>
                                );
                              },
                            },
                          }}
                        />
                  </ProCard.TabPane>
                </ProCard>
              </Col>
            </Row>
          </ProCard.TabPane>
          <ProCard.TabPane key="tab2" tab="入库变化" >
            <AdminL data={LineD} />
          </ProCard.TabPane>
        </ProCard>
        <ProCard>
          <ProForm
            initialValues={{
              table: data,
            }}

            onFinish={(a) => {
              var jsonstr = JSON.stringify(a.table)
              ToServer("/api/addconsumelog", "POST", dataMake({ data: jsonstr })).then(resp => {
                if (resp.code !== 0) message.info(resp.msg)
                else {
                  message.success(resp.msg)
                  window.location.reload()
                  this.props.onFresh()
                }
              })
            }
            }
            validateTrigger="onBlur"
          >
            <EditableProTable
              rowKey="resourceName"
              scroll={{
                x: 960,
              }}

              headerTitle={<b>外来物资录入</b>}
              style={{ margin: "20px 20px" }}
              name="table"
              position="hidden"
              columns={columns1}
              recordCreatorProps={false}
              editable={{
                type: 'multiple',
                onChange: (v) => this.setState({ editableKeys: v }),

              }}
            />
          </ProForm>

          <Divider dashed />

          <Row>
            <Col span={21}></Col>
            <Col span={3}>
              <Button type="primary" icon={<ReloadOutlined />} onClick={() => {
                window.location.reload()
                this.props.onFresh()
              }}>刷新</Button></Col>
          </Row>
        </ProCard>
      </div>
    } else if (this.props.unfinished === null || this.props.unfinished.length === 0) {
      const columns1 = [
        {
          title: '名称',
          dataIndex: 'resourceName',
          width: '15%',
          editable: false,
          filters: this.state.itemsName,
          filterSearch: true,
          onFilter: (value, record) => record.resourceName.includes(value),
          width: '40%',
        },
        {
          title: '类别',
          dataIndex: 'resourceType',
          width: '25%',
          editable: false,
          filters: this.state.className,
          filterSearch: true,
          onFilter: (value, record) => record.resourceType.includes(value),
          width: '40%',
        },
        {
          title: '库存',
          dataIndex: 'amount',
          width: '10%',
          editable: false,
        },
        {
          title: '消耗上报',
          dataIndex: 'consume',
          valueType: "digit",
          width: '10%',
          formItemProps: {
            rules: [
              {
                required: true,
                message: '此项为必填项',
              },
            ],
          },
        },
        {
          title: '请求上报',
          dataIndex: 'require',
          valueType: "digit",
          width: '10%',
          formItemProps: {
            rules: [
              {
                required: true,
                message: '此项为必填项',
              },
            ],
          },
        },
        {
          title: '操作',
          valueType: 'option',
          width: '10%',
          render: (text, record, _, action) => [
            <Button linked
              key="editable"
              onClick={() => {
                action?.startEditable?.(record.resourceName);
              }}
            >
              编辑
            </Button>,
          ],
        },
      ];
      var PieStore = this.state.storageData ? this.state.storageData : []
      var selectList = [{ value: '全部', label: '全部' }]
      var LineD = this.state.lineData ? this.state.lineData : []
      var list = this.state.consumeData ? this.state.consumeData : []
      var rlist = this.state.requireData ? this.state.requireData : []
      for (let i = 0; i < this.state.storageData?.length; i++) {
        selectList.push({ value: this.state.storageData[i].name, label: this.state.storageData[i].name })

      }
      return <div>
        <ProCard style={{ margin: "20px 20px" }}
          tabs={{
            tabBarExtraContent: <div>
              <RangePicker defaultValue={this.state.dayRange} style={{ margin: "0px 20px" }} onChange={v => {
                ToServer("/api/getconsumelogsbydayname", "POST", dataMake({ start: v[0].unix(), end: v[1].unix(), tclass: this.state.typeName })).then(resp => {
                  if (resp.code !== 0) {
                    message.error(resp.msg)
                    this.setState({ dayRange: v })
                  }
                  else {
                    this.setState({ dayRange: v, lineData: resp.data })
                  }
                })
              }} />
              <Select defaultValue={this.state.typeName} style={{ width: 120, margin: "0px 20px" }}
                options={selectList} onChange={v => {
                  ToServer("/api/getconsumelogsbydayname", "POST", dataMake({ start: this.state.dayRange[0].unix(), end: this.state.dayRange[1].unix(), tclass: v })).then(resp => {
                    if (resp.code !== 0) {
                      message.error(resp.msg)
                      this.setState({ typeName: v })
                    }
                    else {
                      this.setState({ typeName: v, lineData: resp.data })
                    }
                  })
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
                <ProCard style={{ margin: "20px 20px" }}
                  tabs={{
                  }}
                >
                  <ProCard.TabPane key="tab1" tab={<b>消耗详情</b>} >
                  <ProList
                          rowKey="resid"
                          dataSource={list}
                          pagination={{
                            pageSize: 4,
                          }}
                          showActions="hover"
                          metas={{
                            title: {
                              dataIndex: 'resource',
                              render: (_, { resource }) => {
                                return <div>{resource.name}</div>
                              }
                            },
                            avatar: {
                            },
                            description: {
                              dataIndex: 'resource',
                              render: (_, { now }) => {
                                return <div>{dayjs(now * 1000).format(dateFormat)}</div>
                              }
                            },
                            subTitle: {
                              render: (_, { consume, resource }) => {
                                return (
                                  <Space size={0}>
                                    <Tag color="blue">{"数量:" + consume}</Tag>
                                    <Tag color="#5BD8A6">{resource.resourceType}</Tag>
                                  </Space>
                                );
                              },
                            },
                          }}
                        />
                  </ProCard.TabPane>
                  <ProCard.TabPane key="tab2" tab={<b>请求详情</b>}>
                  <ProList
                          rowKey="id"
                          dataSource={rlist}
                          pagination={{
                            pageSize: 4,
                          }}
                          showActions="hover"
                          metas={{
                            title: {
                              dataIndex: 'resource',
                              render: (_, { resource }) => {
                                return <div>{resource.name}</div>
                              }
                            },
                            avatar: {
                            },
                            description: {
                              dataIndex: 'submitTime',
                              render: (_, { submitTime }) => {
                                return <div>{dayjs(submitTime * 1000).format(dateFormat)}</div>
                              }
                            },
                            subTitle: {
                              render: (_, { amount, resource,state }) => {
                                if(state===0){
                                  return (
                                    <Space size={0}>
                                      <Tag color="blue">{"数量:" + amount}</Tag>
                                      <Tag color="#5BD8A6">{resource.resourceType}</Tag>
                                      <Tag color="yellow">待审核</Tag>
                                    </Space>
                                  );
                                }else if(state===1){
                                  return (
                                    <Space size={0}>
                                      <Tag color="blue">{"数量:" + amount}</Tag>
                                      <Tag color="#5BD8A6">{resource.resourceType}</Tag>
                                      <Tag color="purple">已批准</Tag>
                                    </Space>
                                  );
                                }else if(state===2){
                                  return (
                                    <Space size={0}>
                                      <Tag color="blue">{"数量:" + amount}</Tag>
                                      <Tag color="#5BD8A6">{resource.resourceType}</Tag>
                                      <Tag color="geekblue">已发货</Tag>
                                    </Space>
                                  );
                                }else if(state===3){
                                  return (
                                    <Space size={0}>
                                      <Tag color="blue">{"数量:" + amount}</Tag>
                                      <Tag color="#5BD8A6">{resource.resourceType}</Tag>
                                      <Tag color="green">已完成</Tag>
                                    </Space>
                                  );
                                }else{
                                  return (
                                    <Space size={0}>
                                      <Tag color="blue">{"数量:" + amount}</Tag>
                                      <Tag color="#5BD8A6">{resource.resourceType}</Tag>
                                      <Tag color="red">已否决</Tag>
                                    </Space>
                                  );
                                }
                              },
                            },
                          }}
                        />
                  </ProCard.TabPane>
                </ProCard>
              </Col>
            </Row>
          </ProCard.TabPane>
          <ProCard.TabPane key="tab2" tab="消耗变化" >
            <AdminL data={LineD} />
          </ProCard.TabPane>
        </ProCard>
        <ProCard>
          <ProForm
            initialValues={{
              table: data,
            }}

            onFinish={(a) => {
              var data = []
              var errorStr = ""
              for (let index = 0; index < a.table.length; index++) {
                if (a.table[index].amount < a.table[index].consume) {
                  data.push(a.table[index].resourceName)
                }
                if (a.table[index].console < 0) {
                  a.table[index].consume = 0
                }
                if (a.table[index].require < 0) {
                  a.table[index].require = 0
                }
              }
              for (let index = 0; index < data.length; index++) {
                errorStr += " " + data[index]
              }
              if (data.length !== 0) {
                message.error("消耗数据大于库存" + errorStr)
              } else {
                var jsonstr = JSON.stringify(a.table)
                ToServer("/api/addconsumelog", "POST", dataMake({ data: jsonstr })).then(resp => {
                  if (resp.code !== 0) message.info(resp.msg)
                  else {
                    message.success(resp.msg)
                    window.location.reload()
                    this.props.onFresh()
                  }
                })
              }

            }
            }
            validateTrigger="onBlur"
          >
            <EditableProTable
              rowKey="resourceName"
              scroll={{
                x: 960,
              }}

              headerTitle={<b>物资使用情况申报</b>}
              style={{ margin: "20px 20px" }}
              name="table"
              position="hidden"
              columns={columns1}
              recordCreatorProps={false}
              editable={{
                type: 'multiple',
                onChange: (v) => this.setState({ editableKeys: v }),

              }}
            />
          </ProForm>

          <Divider dashed />

          <Row>
            <Col span={21}></Col>
            <Col span={3}>
              <Button type="primary" icon={<ReloadOutlined />} onClick={() => {
                window.location.reload()
                this.props.onFresh()
              }}>刷新</Button></Col>
          </Row>

        </ProCard>
      </div>
    } else {

      const columns2 = [
        {
          title: '物资ID',
          dataIndex: 'id',
          width: '15%',
          editable: false,
        },
        {
          title: '名称',
          dataIndex: 'name',
          width: '15%',
          editable: false,
        },
        {
          title: '类别',
          dataIndex: 'resourceType',
          width: '25%',
          editable: false,
        },
        {
          title: '库存',
          dataIndex: 'amount',
          width: '10%',
          valueType: "digit",
          formItemProps: {
            rules: [
              {
                required: true,
                message: '此项为必填项',
              },
            ],
          },
        },
        {
          title: '操作',
          valueType: 'option',
          width: '10%',
          render: (text, record, _, action) => [
            <Button linked
              key="editable"
              onClick={() => {
                action?.startEditable?.(record.name);
              }}
            >
              编辑
            </Button>,
          ],
        },
      ];
      return <div>
        <ProCard>
          <ProForm
            initialValues={{
              table: this.props.unfinished,
            }}

            onFinish={(a) => {
              var jsonstr = JSON.stringify(a.table)
              ToServer("/api/addstorage", "POST", dataMake({ data: jsonstr })).then(resp => {
                if (resp.code !== 0) message.info(resp.msg)
                else {
                  message.success(resp.msg)
                  window.location.reload()
                  this.props.onFresh()
                }
              })
            }}
            validateTrigger="onBlur"
          >
            <EditableProTable
              rowKey="name"
              scroll={{
                x: 960,
              }}
              style={{ margin: "20px 20px" }}
              headerTitle={<b>未申报库存物资</b>}
              name="table"
              position="hidden"
              columns={columns2}
              recordCreatorProps={false}
              editable={{
                type: 'multiple',
                onChange: (v) => this.setState({ editableKeys: v }),

              }}
            />
          </ProForm>

          <Divider dashed />

          <Row>
            <Col span={21}></Col>
            <Col span={3}>
              <Button type="primary" icon={<ReloadOutlined />} onClick={() => {
                window.location.reload()
                this.props.onFresh()
              }}>刷新</Button></Col></Row>
        </ProCard>
      </div>
    }
  }
}
export default withRouter(ResourcePage)
