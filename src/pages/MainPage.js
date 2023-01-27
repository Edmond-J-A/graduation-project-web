import React from "react"
import { Link } from "react-router-dom"
import {  Image ,Layout} from 'antd';

const { Header, Content, Footer } = Layout;

class MainPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    render() {
        if (!this.props.nowaccount) {
            return <Link to={"/login"}>Login</Link>
        }
        return 123
    }
}
export default MainPage
