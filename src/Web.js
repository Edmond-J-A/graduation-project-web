import React from "react"
import {Avatar, Menu, Layout} from "antd";
import {Route, Switch, withRouter} from "react-router-dom";
import {
    AppstoreOutlined,
    ContainerOutlined,
    UserOutlined,
    PieChartOutlined,
    MailOutlined,
    TeamOutlined,
} from '@ant-design/icons';

import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import RegistPage from "./pages/RegistPage";
import UserPage from "./pages/UserPage";
import ResourcePage from "./pages/ResourcePage";
import LogPage from "./pages/LogPage";

const {Header, Content, Footer, Sider} = Layout;

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
        }

    }


    render() {
        if (!this.state.account) {
            return <div>
                <Layout>
                    <div className="logo"/>
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
                    <Route exact path="/" component={MainPage} account={this.state.account}/>
                    <Route exact path="/login" render={() => <LoginPage onLoginFinished={account => {
                        this.setState({account: account})
                    }}/>}/>
                    <Route exact path="/regist" render={() => <RegistPage/>}/>
                </Switch>
            </div>

        } else {
            let items = [getItem('主页', '1', <AppstoreOutlined/>, () => this.props.history.push("/")),
                getItem('物资管理', '2', <ContainerOutlined/>, () => this.props.history.push("/resource")),
                getItem('智能调度', '3', <PieChartOutlined/>)]
            if (this.state.account.admin) {
                items.push(getItem('组织管理', '5', <TeamOutlined/>))
                items.push(getItem('上传记录查看', '6', <MailOutlined/>,() => this.props.history.push("/log")))
            }
            items.push(getItem('用户', '4', <UserOutlined/>, () => this.props.history.push("/user")))
            return <div>
                <div>
                    <header style={{textAlign: 'right', backgroundColor: '#000b16'}}>
                        <text style={{color: "white"}}>Hello! {this.state.account.name}. Your role is {this.state.account.role}.</text>
                        <Avatar style={{
                            color: '#f56a00',
                            backgroundColor: '#fde3cf',
                            margin: "10px"
                        }}>{this.state.account.name}</Avatar>
                    </header>
                </div>
                <Layout>
                    <Sider>
                        <div className="logo" style={{
                            width: "200px", height: "100vh"
                        }}><Menu
                            defaultSelectedKeys={['1']}
                            mode="inline"
                            theme="dark"
                            items={items}
                        /></div>
                    </Sider>
                    <Content>
                        <Switch>
                            <Route exact path="/" render={() => <MainPage nowaccount={this.state.account}/>}/>
                            <Route exact path="/user" render={() => <UserPage nowaccount={this.state.account}/>}/>
                            <Route exact path="/resource" render={() => <ResourcePage nowaccount={this.state.account}/>}/>
                            <Route exact path="/log" render={() => <LogPage nowaccount={this.state.account}/>}/>
                        </Switch>
                    </Content>

                </Layout>
            </div>
        }


    }
}

export default withRouter(Web)