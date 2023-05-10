import React from "react"
import { Badge, Avatar, Menu, Layout, Button, Row, Col, message, Tooltip, Space } from "antd";
import { Route, Switch, withRouter } from "react-router-dom";
import {
    AppstoreOutlined,
    ContainerOutlined,
    UserOutlined,
    PieChartOutlined,
    MailOutlined,
    TeamOutlined,
    PoweroffOutlined,
    BellOutlined,
} from '@ant-design/icons';

import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import RegistPage from "./pages/RegistPage";
import UserPage from "./pages/UserPage";
import ResourcePage from "./pages/ResourcePage";
import LogPage from "./pages/LogPage";
import { ToServer } from "./server/Server";
import ResourceTypePage from "./pages/ResourceTypePage";
import NotFoundPage from "./pages/NotFoundPage";
import RequestPage from "./pages/RequestPage";
import DeliverPage from "./pages/DeliverPage";

const { Header, Content, Footer, Sider } = Layout;

const getItem = (label, key, icon, onClickMethod) => {
    return {
        key: key,
        icon: icon,
        label: label,
        onClick: onClickMethod,
    };
}


class Web extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            account: null,
            s: null,
            rType: null,
            refresh: 0,
            unfinishedList: null,
        }

    }


    render() {
        if (((this.state.rType == null && this.state.unfinishedList === null) || this.state.account === null) && this.state.refresh === 0) {
            ToServer("/api/nowuser", "GET").then(resp => {
                if (resp.code !== 0) message.info(resp.msg)
                else {
                    var account = resp.data
                    if (account.role !== "deliver") {
                        ToServer("/api/getmyresource", "GET").then(resp1 => {
                            if (resp1.code !== 0 && resp1.code !== 2) message.info(resp1.msg)
                            else if (resp1.code === 2) {
                                message.info(resp1.msg)
                                this.setState({ rType: null, account: account, refresh: 1, unfinishedList: resp1.data })
                            } else {
                                message.success(resp1.msg)
                                this.setState({ unfinishedList: null, account: account, refresh: 1, rType: resp1.data })
                            }
                        })
                    }

                }
            })
        }

        if (!this.state.account) {
            return <div>
                <Layout>
                    <div className="logo" />
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        defaultSelectedKeys={["登录"]}
                        items={[{
                            key: "登录",
                            label: "登录",
                            onClick: () => {
                                this.props.history.push("/login")
                            }
                        }, {
                            key: "注册",
                            label: "注册",
                            onClick: () => {
                                this.props.history.push("/regist")
                            }
                        }]
                        }
                    />
                </Layout>
                <Switch>
                    <Route exact path="/" render={() => <MainPage nowaccount={this.state.account} />} />
                    <Route exact path="/login" render={() => <LoginPage onLoginFinished={(account) => {
                        this.setState({ account: account })
                    }} />} />
                    <Route exact path="/regist" render={() => <RegistPage />} />
                    <Route exact path="/user" render={() => <UserPage nowaccount={this.state.account} />} />
                    <Route exact path="/resource" render={() => <ResourcePage unfinished={this.state.unfinishedList} nowaccount={this.state.account} ress={this.state.rType} onFresh={() => {
                        this.setState({ refresh: 0, unfinishedList: null, rType: null })
                    }} />} />
                    <Route exact path="/log" render={() => <LogPage nowaccount={this.state.account} />} />
                    <Route exact path="/extraresource" render={() => <ResourceTypePage nowaccount={this.state.account} />} />
                    <Route exact path="/nofound" render={() => <NotFoundPage nowaccount={this.state.account} />} />
                    <Route exact path="/request" render={() => <RequestPage nowaccount={this.state.account} />} />
                </Switch>
            </div>

        } else {
            let items = []
            if (this.state.account.admin) {
                items.push(getItem('主页', '1', <AppstoreOutlined />, () => this.props.history.push("/")))
                items.push(getItem('物资管理', '2', <ContainerOutlined />, () => this.props.history.push("/resource")))
                
                items.push(getItem('许可物资种类管理', '5', <TeamOutlined />, () => this.props.history.push("/extraresource")))
                items.push(getItem('申请记录查看', '6', <MailOutlined />, () => this.props.history.push("/log")))
                items.push(getItem('待处理注册请求', '7', <MailOutlined />, () => this.props.history.push("/request")))
            }else if(this.state.account.role==="user"){
                items.push(getItem('主页', '1', <AppstoreOutlined />, () => this.props.history.push("/")))
                items.push(getItem('物资管理', '2', <ContainerOutlined />, () => this.props.history.push("/resource")))
                
            }else{
                items.push(getItem('货运管理', '2', <ContainerOutlined />, () => this.props.history.push("/deliver")))
            }
            items.push(getItem('用户', '4', <UserOutlined />, () => this.props.history.push("/user")))
            

            return <div>
                <div>
                    <header style={{ backgroundColor: '#000b16' }}>
                        <Row>
                            <Col style={{ textAlign: 'left' }} span={8} >
                                <Tooltip placement="bottom" title="登出" arrowPointAtCenter>
                                    <Button shape="circle" onClick={() => {

                                        ToServer("/api/logout", "POST").then(resp => {
                                            if (resp.code !== 0) {
                                                return
                                            }

                                        })
                                        this.setState({ account: null, rType: null, unfinishedList: null, refresh: 0, s: null })
                                        this.props.history.push("/login")
                                        message.success("Logout.")
                                    }} style={{ margin: "10px" }} icon={<PoweroffOutlined />}></Button>
                                </Tooltip>
                            </Col>
                            <Col ></Col>
                            <Col span={16} style={{ textAlign: 'right' }}>
                                <Tooltip placement="bottomRight" title={"Hello! " + this.state.account.name + ". Your role is " + this.state.account.role + "."}>
                                    <Avatar style={{
                                        color: '#f56a00',
                                        backgroundColor: '#fde3cf',
                                        margin: "10px"
                                    }}
                                        src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png" />
                                </Tooltip>
                            </Col>
                        </Row>
                    </header>
                </div>
                <Layout>
                    <Sider>
                        <div className="logo" style={{
                            width: "200px", height: "95vh"
                        }}><Menu
                                defaultSelectedKeys={['1']}
                                mode="inline"
                                theme="dark"
                                items={items}
                            /></div>
                    </Sider>
                    <Content>
                        <Switch>
                            <Route exact path="/" render={() => <MainPage nowaccount={this.state.account} />} />
                            <Route exact path="/user" render={() => <UserPage nowaccount={this.state.account} onChangeThing={account => {
                                this.setState({ account: account })
                            }
                            } />} />
                            <Route exact path="/resource" render={() => <ResourcePage unfinished={this.state.unfinishedList} nowaccount={this.state.account} onFresh={() => {
                                this.setState({ refresh: 0, unfinishedList: null, rType: null })
                            }} ress={this.state.rType} />} />
                            <Route exact path="/log" render={() => <LogPage nowaccount={this.state.account} />} />
                            <Route exact path="/extraresource" render={() => <ResourceTypePage nowaccount={this.state.account} />} />
                            <Route exact path="/nofound" render={() => <NotFoundPage nowaccount={this.state.account} />} />
                            <Route exact path="/deliver" render={() => <DeliverPage nowaccount={this.state.account} />} />
                            <Route exact path="/request" render={() => <RequestPage nowaccount={this.state.account} />} />
                        </Switch>
                    </Content>
                </Layout>

                <Footer style={{ textAlign: 'center', backgroundColor: 'gray' }}>©2023 Edmond</Footer>
            </div>
        }


    }
}

export default withRouter(Web)