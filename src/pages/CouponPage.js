import React, {Component} from 'react'

export default class CouponPage extends Component{
    constructor(props){
        super(props)
        this.state={
            item:{},
            coupon:{},
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
            coupon : data.coupon,
            isLoaded:true,
            isOpenQRCode: false
        }) : this.setState({item:{}, coupon:{}, isLoaded:true, isOpenQRCode:false})
    }
    getCode = ()=>(
        <div style={{ position:'fixed', overflow:'auto', width:'100%', height:'100%', fontSize:'2em', textAlign:'center', backgroundColor:'rgba(0,0,0,0.4)'}}
            onClick={()=>this.handleChange('isOpenQRCode', false)} >
            <div style={{height:'auto', width:'90%', margin:'auto', 'marginTop':'20%',backgroundColor:'white'}}>
                <img src={`/api/coupon/qrcode?number=${this.state.coupon.number}`} />
                {this.state.coupon.number}
            </div>
        </div>
    )
    getCouponInfo = ()=>{
        const {coupon, item} = this.state
        switch(coupon.state){
            case 0:
                return '유효하지 않은 쿠폰입니다.'
            case 1:
                return item.name
            case 2:
                return '유효기간이 지난 쿠폰입니다.'
            default:
                return '유효하지 않은 쿠폰입니다.'
        }
    }
    render(){
        const {coupon, item, isOpenQRCode} = this.state
        const isCouponAvailable = coupon ? coupon.state === 1 : false
        return (
            <div style={{width:'100%', height:'100%'}}>
                {isOpenQRCode ? this.getCode() : null}
                <img src={`/api/image/${item.code}`}
                    style={{width:'80%', marginLeft:'10%', marginRight:'10%', opacity:isCouponAvailable ? 1 : 0.5}} />
                <div style={{fontSize:'1em', textAlign:'center', paddingTop:'1em'}}>
                    {this.getCouponInfo()}
                </div>
                <button style={{width:'80%', margin:'auto', fontSize:'1em'}}
                    disabled={!isCouponAvailable}
                    onClick={()=>this.handleChange('isOpenQRCode', true)}>
                        사용하기
                </button>
            </div>
        )
    }
}