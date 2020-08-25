import React, {Component} from 'react'

export default class CouponPage extends Component{
    constructor(props){
        super(props)
        this.state={
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
        try{
            const response = await fetch(`/coupon`, {
                method:'GET', headers:{ 'x-access-token': token ? token : '' }
            })
            const data = await response.json()
            console.log(data)
            this.setState({
                coupon: data,
                isLoaded:true,
                isOpenQRCode: false
            })
        }catch(e){
            this.setState({coupon:{}, isLoaded:true, isOpenQRCode:false})
        }
    }
    getCode = ()=>(
        <div style={{ position:'fixed', overflow:'auto', width:'100%', height:'100%', fontSize:'2em', textAlign:'center', backgroundColor:'rgba(0,0,0,0.4)'}}
            onClick={()=>this.handleChange('isOpenQRCode', false)} >
            <div style={{height:'auto', width:'90%', margin:'auto', 'marginTop':'20%',backgroundColor:'white'}}>
                <img src={`/coupon/qrcode?number=${this.state.coupon.number}`} />
                {this.state.coupon.number}
            </div>
        </div>
    )
    getCouponInfo = ()=>{
        const {coupon} = this.state
        switch(coupon.state){
            case 0:
                return '유효하지 않은 쿠폰입니다.'
            case 1:
                return coupon.name
            case 2:
                return '이미 사용한 쿠폰입니다.'
            default:
                return '유효하지 않은 쿠폰입니다.'
        }
    }
    render(){
        const {coupon, isOpenQRCode} = this.state
        const isCouponAvailable = coupon ? coupon.state === 1 : false
        return (
            <div style={{width:'100%', height:'100%', marginTop:'20%'}}>
                {isOpenQRCode ? this.getCode() : null}
                <img src={`/coupon/image`}
                    style={{width:'80%', marginLeft:'10%', marginRight:'10%', opacity:isCouponAvailable ? 1 : 0.5}} />
                <div style={{fontSize:'1em', textAlign:'center', paddingTop:'1em'}}>
                    {this.getCouponInfo()}
                </div>
                <div style={{display:'flex'}}>
                    <button style={{width:'60%', margin:'auto', fontSize:'1em'}}
                        disabled={!isCouponAvailable}
                        onClick={()=>this.handleChange('isOpenQRCode', true)}>
                            사용하기
                    </button>

                </div>
            </div>
        )
    }
}