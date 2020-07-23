import React, {Component} from 'react'

export default class CouponPage extends Component{
    constructor(props){
        super(props)
        this.state = {
            item:{},
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
    useCoupon = async()=>{
        const {number} = this.props
        const {password} = this.state
        await fetch('/api/')
    }
    render(){
        return (
            <div style={{width:'100%', height:'100%'}}>
                <input type="password"
                    style={{ fontSize:'1em', width:'90%', alignSelf:'center'}}
                    value={this.state.password}
                    onChange={(e)=>this.handleChange('password', e.target.value)}
                />
                <div>
                    상품 {JSON.stringify(this.state.item)}
                </div>
                <div>
                    쿠폰 {JSON.stringify(this.state.coupon)}
                </div>
            </div>
        )
    }
}