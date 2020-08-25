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
    handleLogin = async (ID, password)=>{
        try{
            const info = {id: ID, password}
            console.log(info)
            const response = await fetch('/coupon/auth', {
                method:'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(info),
            })
            const {data} = await response.json()
            data ? this.setState({token:data.token, info:data}) : this.setState({token:'', info:{}})
        }catch(e){

        }
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
            <h1 style={{textAlign:'center', marginTop:50}}>관리자 페이지</h1>
            <h2 style={{textAlign:'center'}}>{info && info.name ? `Welcome to ${info.name}`: ''}</h2>
            <div style={{display:'flex'}}>
                <ul className="nav" style={{fontSize:20, margin:'auto'}}>
                    <li><Link to="/manage/">메인</Link></li>
                    <li><Link to="/manage/coupon/">쿠폰</Link></li>
                </ul>
            </div>
            <Switch>
                <Route path={`${match.path}/coupon`}>
                    <CouponManage token={token} info={info}/>
                </Route>
                <Route exact path={`${match.path}`}>
                    <Main token={token} info={info} handleLogin={handleLogin}/>
                </Route>
            </Switch>
        </Router>
    )
}


const CouponManage = (props)=> (<Coupon token={props.token} info={props.info}/>)
class Main extends Component {
    constructor(props){
        super(props)
        this.state={id:'', password:''}
    }
    handleChange = (field, value) => this.setState({[field]:value})
    render(){
        const {token, info, handleLogin} = this.props
        return token.length ? (
            <div>
                
            </div>):(
            <div style={{display: 'flex', width:'100%', height:'100%', fontSize:20}}>
                <div style={{margin:'auto'}}>
                    <div style={{width:300, marginTop:20}}>
                        아이디 <input type="text" style={{width:'100%', height:'100%', fontSize:20}} value={this.state.id} onChange={(e)=>this.handleChange('id', e.target.value)}/>
                    </div>
                    <div style={{width:300, marginTop:20}}>
                        비밀번호 <input type="password" style={{width:'100%', height:'100%', fontSize:20}} value={this.state.password} onChange={(e)=>this.handleChange('password', e.target.value)}/>
                    </div>
                    <div style={{width:300, height:40, marginTop:20}}>
                        <button style={{width:'100%', height:'100%'}} onClick={()=>{handleLogin(this.state.id, this.state.password)}}>로그인</button>
                    </div>
                </div>
            </div>
        )
    }
}