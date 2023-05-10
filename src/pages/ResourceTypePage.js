import React from "react"
import { Redirect, withRouter } from "react-router-dom"
import { AutoComplete, message, Button, Table, Input, Form, Col, Row, Divider, Select } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { ToServer } from "../server/Server";
import { dataMake } from "../utils/FormUtils";
import dedupe from 'dedupe'
import { ProCard } from "@ant-design/pro-components";

class ExtraResourcePage extends React.Component {
  reSetData = () => {
    ToServer("/api/getresources", "GET").then(resp => {
      if (resp.code !== 0) message.info(resp.msg)
      else {
        var filterarray = []
        for (var i in resp.data) {
          filterarray.push({ text: resp.data[i].resourceType, value: resp.data[i].resourceType })
        }
        var result = dedupe(filterarray)
        this.setState({ rType: resp.data, className: result })

      }
    })
  }

  onFinish(v) {
    ToServer("/api/addresourcetype", "POST", dataMake(v)).then(resp => {
      if (resp.code !== 0) message.info(resp.msg)
      else {
        this.reSetData()
      }
    })
  }
  constructor(props) {
    super(props)
    this.state = {
      rType: null,
      className: null,
      deliverList:null,
    }
    this.reSetData()
  }

  UNSAFE_componentWillMount() {
    ToServer("/api/getresources", "GET").then(resp => {
      if (resp.code !== 0) message.info(resp.msg)
      else {
        var filterarray = []
        for (var i in resp.data) {
          filterarray.push({ text: resp.data[i].resourceType, value: resp.data[i].resourceType })
        }
        var result = dedupe(filterarray)
        this.setState({ rType: resp.data, className: result })

      }
    })

    ToServer("/api/getdeliverlist", "GET").then(resp => {
      if (resp.code !== 0) message.info(resp.msg)
      else {
        this.setState({ deliverList: resp.data })

      }
    })
  }

  render() {
    if (!this.props.nowaccount) {
      return <Redirect to={"/login"} />
    }
    var datadeli = this.state.deliverList? this.state.deliverList:[]
    const columns = [
      {
        title: 'Id',
        dataIndex: 'id',
        width: '25%',
      },
      {
        title: 'Name',
        dataIndex: 'name',
        width: '15%',
      },
      {
        title: 'ResourceType',
        dataIndex: 'resourceType',
        filters: this.state.className,
        filterSearch: true,
        onFilter: (value, record) => record.resourceType.includes(value),
        width: '40%',
      }
    ];
    const columns1 = [
      {
        title: 'value',
        dataIndex: 'value',
        filters: this.state.className,
        filterSearch: true,
        onFilter: (value, record) => record.resourceType.includes(value),
        width: '40%',
      },
      {
        title: 'default',
        dataIndex: 'default',
        width: '40%',
        render(_,{value}) {
          return <Select style={{ width: 200 }} options={datadeli} onChange={(v) => { ToServer("/api/setdeliver", "POST", dataMake({ deliver: v, type: value})).then(resp => {
            if (resp.code !== 0) message.error(resp.msg)
            else {
              message.success("Success.")
            }
          }) }}></Select>
        }
      },
    ];
    console.log(this.state.className)
    return <div>
      <ProCard style={{ margin: "20px 20px" }}
        tabs={{}}
      >
        <ProCard.TabPane key="tab1" tab="许可物资管理" >
          <Form
            name="basic"

            style={{ margin: "30px 20px " }}
            initialValues={{ remember: true }}
            onFinish={v => this.onFinish(v)}
            autoComplete="off"
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: 'Please input resource name!' }]}
            >
              <Input placeholder="物资名" />
            </Form.Item>

            <Form.Item
              label="ResourceType"
              name="resourceType"
              rules={[{ required: true, message: 'Please input resource type!' }]}
            >
              <AutoComplete
                options={this.state.className}
                style={{ width: "100%" }}

                placeholder="物资类别"
              />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 20 }}>
              <Button type="primary" htmlType="submit" style={{ margin: "10px" }} >
                提交
              </Button>
            </Form.Item>
          </Form>


          <Table style={{ margin: "0px 20px " }} columns={columns} bordered ellipsis dataSource={this.state.rType} />

          <Divider dashed />
          <Row>
            <Col span={21}></Col>
            <Col span={3}>
              <Button type="primary" icon={<ReloadOutlined />} onClick={() => this.reSetData()}>刷新</Button></Col>
          </Row>
        </ProCard.TabPane>
        <ProCard.TabPane key="tab2" tab="默认物流管理" >
          <Table style={{ margin: "0px 20px " }} columns={columns1} bordered ellipsis dataSource={this.state.className} />
          <Divider dashed />
          <Row>
            <Col span={21}></Col>
            <Col span={3}>
              <Button type="primary" icon={<ReloadOutlined />} onClick={() => this.reSetData()}>刷新</Button></Col>
          </Row>

        </ProCard.TabPane>
      </ProCard>
    </div>
  }
}
export default withRouter(ExtraResourcePage)
