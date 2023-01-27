import React from "react"
import { Redirect} from "react-router-dom"
import { Layout} from 'antd';

const { Header, Content, Footer } = Layout;

class MainPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    render() {
        if (!this.props.nowaccount) {
            return <Redirect to={"/login"}>Login</Redirect>
        }
        return 123
    }
}
export default MainPage
