import React from "react"
import { Link } from "react-router-dom"

class MainPage extends React.Component{
    constructor(props){
        super(props)
        this.state={
            
        }
    }
    render(){
        return <div>
        <Link to={"/login"}>Login</Link>

    </div>
    }
}
export default MainPage
