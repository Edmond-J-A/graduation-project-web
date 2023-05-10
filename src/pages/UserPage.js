import React from "react"
import { Redirect, withRouter } from "react-router-dom"
import { message, Button, Avatar, Space } from "antd";
import {
    ProCard,
    ProForm,
    ProFormSelect,
    ProFormText,

} from '@ant-design/pro-components';

import { dataMake } from "../utils/FormUtils";
import { ToServer } from "../server/Server";

class UserPage extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        if (!this.props.nowaccount) {
            return <Redirect to={"/login"}>Login</Redirect>
        }
        var role
        if (this.props.nowaccount.role === "user") {
            role = "用户"
        } else if (this.props.nowaccount.role === "admin") {
            role = "管理员"
        } else {
            role = "运输"
        }
        return <div>
            <ProCard style={{ margin: "20px 20px" }}>
                <ProForm style={{ margin: "20px 20px" }}
                    labelWidth="auto"
                    onFinish={(values) => {
                        ToServer("/api/changedetail", "POST", dataMake(values)).then(resp => {
                            if (resp.code !== 0) message.error(resp.msg)
                            else {
                                this.props.nowaccount.name=values.newname
                                this.props.nowaccount.address=values.address
                            }
                        })
                        message.success('提交成功');
                    }}
                    initialValues={{
                        newname: this.props.nowaccount?.name,
                    }}
                >
                    <ProForm.Group>
                        <ProFormText
                            width="md"
                            name="newname"
                            label="用户名"
                            tooltip="最长为 24 位"
                            placeholder="请输入名称"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入用户名!',
                                },
                            ]}
                        />
                        <ProFormText width="md" name="organizationname" label="组织名称" disabled initialValue={this.props.nowaccount.organizationname} />
                        <Space></Space>
                        <Avatar style={{
                                    color: '#f56a00',
                                    backgroundColor: '#fde3cf',
                                }}
                                size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
                                src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png"/>
                    </ProForm.Group>
                    <ProForm.Group>
                        <ProFormSelect
                            readonly
                            width="xs"
                            name="state"
                            label="用户状态"
                            initialValue="正常"
                        />
                    </ProForm.Group>
                    <ProFormText width="sm" name="password" label="密码" placeholder={"******"} />
                    <ProFormText
                        name="address"
                        width="md"
                        label="组织地址"
                        initialValue={this.props.nowaccount.address}
                    />
                    <ProFormText width="xs" name="role" disabled label="权限" initialValue={role} />
                </ProForm>

            </ProCard>
        </div>
    }
}

export default withRouter(UserPage)
