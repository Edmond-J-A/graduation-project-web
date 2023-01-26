import React from "react"
import { Menu, Layout } from "antd";
import { Route, Switch, withRouter } from "react-router-dom";

import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import RegistPage from "./pages/RegistPage";
import UserPage from "./pages/UserPage";

class Web extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            account: null,
        }

    }

    render() {
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
                    <Route exact path="/" component={MainPage} account={this.state.account} />
                    <Route exact path="/login" render={() => <LoginPage onLoginFinished={account => { this.setState({ account: account }); console.log(this.state.account) }} />} />
                    <Route exact path="/regist" render={() => <RegistPage />} />
                </Switch>
            </div>

        } else {
            return <div>
                <Layout>
                    <div className="logo" />
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        defaultSelectedKeys={["主页"]}
                        items={[{
                            key: "主页",
                            label: "主页",
                            onClick: () => {
                                this.props.history.push("/")
                            }
                        }, {
                            key: "用户",
                            label: "用户",
                            onClick: () => {
                                this.props.history.push("/user")
                            }
                        }]
                        }
                    />
                </Layout>
                <Switch>
                    <Route exact path="/" render={() => <MainPage nowaccount={this.state.account} />} />
                    <Route exact path="/user" render={() => <UserPage nowaccount={this.state.account} />} />
                </Switch>
            </div>
        }


    }
}

export default withRouter(Web)