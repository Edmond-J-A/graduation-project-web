import React from "react"
import { Redirect,withRouter} from "react-router-dom"
import {Layout, message} from 'antd';

const { Header, Content, Footer } = Layout;

class OrganizationPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    render() {
        if (!this.props.nowaccount) {
            return <Redirect to={"/login"}/>
        }
        return <div>组织</div>
    }
}
export default withRouter(OrganizationPage)
