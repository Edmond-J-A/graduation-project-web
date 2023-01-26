import React from "react"
import { withRouter } from "react-router-dom"

class UserPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    render() {
        return <div>用户信息  {this.props.nowaccount.name} </div>
    }
}

export default withRouter(UserPage)
