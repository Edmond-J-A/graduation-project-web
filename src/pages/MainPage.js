import React from "react"
import { Link } from "react-router-dom"

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
        return <div> MainPage </div>
    }
}
export default MainPage
