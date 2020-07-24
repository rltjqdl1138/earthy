import React, {Component} from 'react'
import  { Redirect } from 'react-router-dom'

export default class CouponPage extends Component{
    constructor(props){
        super(props)
        this.state={
            item:{},
            couponNumber:'',
            isLoaded:false,
            isOpenQRCode:false
        }
    }
    handleChange = (field, value) => this.setState({[field]:value})
    componentDidMount(){
        return this.props.token ? this.checkCoupon(this.props.token) : null
    }
    checkCoupon = async(token)=>{
        if(!token || !token.length) return;
        const response = await fetch(`/api/coupon/check?token=${token}`)
        const {success, data} = await response.json()
        success ? this.setState({
            item: data.item,
            couponNumber:data.couponNumber,
            isLoaded:true,
            isOpenQRCode: false
        }) : this.setState({item:{}, couponNumber:'', isLoaded:true, isOpenQRCode:false})
    }
    getCode = ()=>(
        <div style={{ position:'fixed', overflow:'auto', width:'100%', height:'100%', fontSize:'2em', textAlign:'center', backgroundColor:'rgba(0,0,0,0.4)'}}
            onClick={()=>this.handleChange('isOpenQRCode', false)} >
            <div style={{height:'auto', width:'90%', margin:'auto', 'marginTop':'20%',backgroundColor:'white'}}>
                <img src={`/api/coupon/qrcode?number=${this.state.couponNumber}`} />
                {this.state.couponNumber}
            </div>
        </div>
    )
    render(){
        return (
            <div style={{width:'100%', height:'100%'}}>
                {this.state.isOpenQRCode ? this.getCode() : null}
                <img src={`/api/image/${this.state.item.code}`}
                    style={{width:'80%', marginLeft:'10%', marginRight:'10%'}} />
                <div style={{fontSize:'1em', textAlign:'center', paddingTop:'1em'}}>
                    {this.state.item.name}
                </div>
                <button style={{width:'80%', margin:'auto', fontSize:'1em'}}
                    onClick={()=>this.handleChange('isOpenQRCode', true)}>
                        사용하기
                </button>
            </div>
        )
    }
}