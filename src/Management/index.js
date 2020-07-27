import React, {Component} from 'react';
import './management.css'
import {
    BrowserRouter as Router,
    Route,
    Link,
    useRouteMatch,
    Switch
} from "react-router-dom";
import Coupon from './Coupon'

export default class ManagementPage extends Component{
    constructor(props){
        super(props)
        this.state={
            token:'',
            info:{}
        }
    }
    handleLogin = ({ID, password})=>{
        this.setState({token:'aa', info:{}})
    }
    render(){
        const {token, info} = this.state
        return ( <ManagementRouter token={token} info={info} handleLogin={this.handleLogin}/> )
    }
}

function ManagementRouter({token, info, handleLogin}){
    const match=useRouteMatch()
    return (
        <Router>
            <h1>관리자 페이지</h1>
            <ul className="nav">
                <li><Link to="/manage/">메인</Link></li>
                <li><Link to="/manage/coupon/">쿠폰</Link></li>
            </ul>
            <Switch>
                <Route path={`${match.path}/coupon`}  component={CouponManage}/>
                <Route exact path={`${match.path}`}>
                    <Main token={token} info={info} handleLogin={handleLogin}/>
                </Route>
            </Switch>
        </Router>
    )
}


const CouponManage = ()=> (<Coupon />)
class Main extends Component {
    render(){
        const {token, info, handleLogin} = this.props
        return (
            <div>
                메인
                {token}
                {JSON.stringify(info)}
                <button onClick={handleLogin}>로그인</button>
            </div>
        )
    }
}