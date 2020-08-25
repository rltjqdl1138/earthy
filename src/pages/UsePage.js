import React, {Component} from 'react'

export default class CouponPage extends Component{
    constructor(props){
        super(props)
        this.state = {
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
        try{
            if(!number || !number.length) return;
            const response = await fetch(`/coupon?number=${number}`)
            const data = await response.json()
            this.setState({
                coupon: data,
                password:'',
                isLoaded:true,
            })
        }catch(e){
            this.handleChange('isLoaded', true)
        }
        
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
        try{
            const response = await fetch('/coupon/use',{
                    method:'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({number, password: this.state.password}),
                })
            this.checkCoupon(number)
        }catch(e){
            window.alert('실패')
        }
    }
    render(){
        return (
            <div style={{width:'100%', height:'100%'}}>
                <img src={`/coupon/image`}
                    style={{width:'80%', marginLeft:'10%', marginRight:'10%'}}/>
                <p style={{textAlign:'center', fontSize:'1.5em'}}>쿠폰번호: {this.state.coupon.number ? this.state.coupon.number : ''}</p>
                {this.getCouponState()}

                {this.state.coupon.state === 1 ? (
                <div style={{display:'flex', flexDirection:'column'}}>
                    <input type="password"
                        style={{ fontSize:'1em', width:'90%', margin:'5%'}}
                        value={this.state.password}
                        placeholder="상점 비밀번호"
                        onChange={(e)=>this.handleChange('password', e.target.value)} />
                    <button style={{width:'60%', margin:'auto', fontSize:'1em'}} onClick={ ()=>window.confirm(`이름: ${this.state.coupon.name}\n가격: ${this.state.coupon.cost}원\n사용하시겠습니까?`) ? this.useCoupon() : null}>사용하기</button>
                </div>):null}
            </div>
        )
    }
}