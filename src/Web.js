import React from "react"

import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import RegistPage from "./pages/RegistPage";
import { Route, Switch, withRouter } from "react-router-dom";

class Web extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }

    }

    render() {
        return <Switch>
            <Route exact path="/" component={MainPage}/>
            <Route exact path="/login" render={() => <LoginPage/>}/>
            <Route exact path="/regist" render={() =><RegistPage/>}/>
        </Switch>
    }
}

export default withRouter(Web)