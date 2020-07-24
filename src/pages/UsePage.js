import React, {Component} from 'react'

export default class CouponPage extends Component{
    constructor(props){
        super(props)
        this.state = {
            item:{},
            coupon:{},
            password:'',
            isLoaded:false,
        }
    }
    handleChange = (field, value) => this.setState({[field]:value})
    componentDidMount(){
        this.checkCoupon(this.props.number)
    }
    checkCoupon = async(number)=>{
        if(!number || !number.length) return;
        const response = await fetch(`/api/coupon/use?number=${number}`)
        const {success, data} = await response.json()
        success ? this.setState({
            item: data.item,
            coupon: data.coupon,
            password:'',
            isLoaded:true,
        }) : this.handleChange('isLoaded', true)
    }
    getCouponState = ()=>{
        const {coupon} = this.state
        switch(coupon.state){
            case 1:
                return (<p style={{textAlign:'center', fontSize:'1.5em', color:'green'}}>사용 가능한 쿠폰</p>)
            case 2:
                return (<p style={{textAlign:'center', fontSize:'1.5em', color:'gray'}}>이미 사용된 쿠폰</p>)
            case 3:
                return (<p style={{textAlign:'center', fontSize:'1.5em', color:'red'}}>기간이 만료된 쿠폰</p>)
            default:
                return (<p style={{textAlign:'center', fontSize:'1.5em', color:'red'}}>유효하지 않은 쿠폰</p>)

        }
    }
    useCoupon = async()=>{
        const {number} = this.props
        const {password} = this.state
        await fetch('/api/')
    }
    render(){
        return (
            <div style={{width:'100%', height:'100%'}}>
                <img src={`/api/image/${this.state.item.code}`}
                    style={{width:'80%', marginLeft:'10%', marginRight:'10%'}}/>
                <p style={{textAlign:'center', fontSize:'1.5em'}}>쿠폰번호: {this.state.coupon.number ? this.state.coupon.number : ''}</p>
                {this.getCouponState()}
                <input type="password"
                    style={{ fontSize:'1em', width:'80%', marginLeft:'10%', marginRight:'10%'}}
                    value={this.state.password}
                    placeholder="상점 비밀번호"
                    onChange={(e)=>this.handleChange('password', e.target.value)}
                />
                <button onClick={this.useCoupon}>사용하기</button>
            </div>
        )
    }
}