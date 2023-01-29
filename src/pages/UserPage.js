import React from "react"
import {Redirect, withRouter} from "react-router-dom"
import {Input, message, Row, Col, Button, Avatar} from "antd";
import {ToServer} from "../server/Server";
import {dataMake} from "../utils/FormUtils";

class UserPage extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        let changeN, changeP;
        if (!this.props.nowaccount) {
            return <Redirect to={"/login"}>Login</Redirect>
        }
        return <div>
            <Row style={{marginTop: '30px'}}>
                <Col span={10} style={{textAlign: "center", color: "blue"}}/>
                <Col span={4}>
                    <Avatar size={128} style={{
                        color: '#ffffff',
                        backgroundColor: "#1677ff",
                        margin: "10px"
                    }}><font size={10}>{this.props.nowaccount.name}</font></Avatar>
                </Col>
                <Col span={10} style={{textAlign: "center", color: "blue"}}/>
            </Row>
            <Row style={{marginTop: '30px', textAlign: "center"}}>
                <Input.Group compact>
                    <Input addonBefore={<font size={3}>UserID:</font>} style={{width: 'calc(100% - 300px)'}}
                           defaultValue={this.props.nowaccount.id} disabled={1}/>
                </Input.Group>
            </Row>
            <Row style={{marginTop: '30px', textAlign: "center"}}>
                <Input.Group compact>
                    <Input allowClear addonBefore={<font size={3}>UserName:</font>} style={{width: 'calc(100% - 300px)'}}
                           placeholder={this.props.nowaccount.name}
                           onChange={e => changeN = e.target.value}
                           />
                    <Button type="primary" onClick={() => {
                        if(changeN==="" || (changeN==="root" && this.props.nowaccount.role!=="admin")||changeN===undefined||changeN.length>12){
                            message.error("Illegal new name.")
                            return
                        }
                        ToServer("/api/changename", "POST", dataMake({"newname": changeN})).then(resp => {
                                if (resp.code !== 0) message.error(toString(resp.msg))
                                else {
                                    message.success("Success.")
                                    this.props.nowaccount.name = changeN
                                    this.props.onChangeThing(this.props.nowaccount)

                                }
                            }
                        )
                    }
                    }>Save</Button>
                </Input.Group>
            </Row>
            <Row style={{marginTop: '30px', textAlign: "center"}}>
                <Input.Group compact>
                    <Input allowClear addonBefore={<font size={3}>Password:</font>} style={{width: 'calc(100% - 300px)'}}
                           placeholder="*******"
                           onChange={e => {
                               changeP = e.target.value
                           }}/>
                    <Button type="primary" onClick={() => {
                        if(changeP==="" ||changeP===undefined||changeP.length<6){
                            message.error("Illegal new password.")
                            return
                        }
                        ToServer("/api/changepassword", "POST", dataMake({"newpassword": changeP})).then(resp => {
                                if (resp.code !== 0) message.error(resp.msg)
                                else message.success("Success.")
                                this.props.onChangeThing(this.props.nowaccount)
                            }
                        )
                    }
                    }>Save</Button>
                </Input.Group>
            </Row>
            <Row style={{marginTop: '30px', textAlign: "center"}}>
                <Input.Group compact>
                    <Input addonBefore={<font size={3}>Organization:</font>} style={{width: 'calc(100% - 300px)'}}
                           defaultValue={this.props.nowaccount.organizationname.name} disabled={1}/>
                </Input.Group>
            </Row>
            <Row style={{marginTop: '30px', textAlign: "center"}}>
                <Input.Group compact>
                    <Input addonBefore={<font size={3}>Role:</font>} style={{width: 'calc(100% - 300px)'}}
                           defaultValue={this.props.nowaccount.role} disabled={1}/>
                </Input.Group>
            </Row>

        </div>
    }
}

export default withRouter(UserPage)
