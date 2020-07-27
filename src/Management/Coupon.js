import React, {Component} from 'react'
import {CopyToClipboard} from 'react-copy-to-clipboard';
import axios from 'axios'

export default class CouponManage extends Component{
    constructor(props){
        super(props)
        this.state={
            list:[]
        }
    }
    componentDidMount(){
        this.getList()
    }
    getList = async()=>{
        const response = await fetch('/api/coupon')
        const data = await response.json()
        data.success ? this.setState({list:data.data}) : this.setState({list:[]})
    }
    updateCouponState = async(number, state)=>{
        const newState = state === 1 ? 2 : 1
        const response = await axios.put('/api/coupon',{ number, state:newState})
        console.log(response)
        await this.getList()
    }

    getState = (state)=>{
        switch(state){
            case 0:
                return (<td style={{color:'gray'}}>비활성</td>)
            case 1:
                return (<td style={{color:'green'}}>활성</td>)
            case 2:
                return (<td style={{color:'red'}}>사용됨</td>)
            default:
                return (<td style={{color:'gray'}}>-</td>)
        }
    }
    getButton = (number, state)=>{
        switch(state){
            case 0:
                return (<td><button onClick={()=>this.updateCouponState(number, state)}>활성화</button></td>)
            case 1:
                return (<td><button onClick={()=>this.updateCouponState(number, state)}>비활성화</button></td>)
            case 2:
                return (<td><button onClick={()=>this.updateCouponState(number, state)} style={{color:'gray'}}>활성화</button></td>)
            default:
                return (<td><button onClick={()=>this.updateCouponState(number, state)} style={{color:'gray'}}>활성화</button></td>)
        }
    }
    render(){
        const list = this.state.list.map((item, index)=>(
            <tr key={index} className="list_row">
                <td className="item_index">{index}</td>
                <td className="item_goods">{item.code}</td>
                <td className="item_goods">{item.name}</td>
                <td className="item_goods">{item.cost}</td>
                <td>{item.number}</td>
                {this.getState(item.state)}
                {this.getButton(item.number, item.state)}
                <td className="item_link">
                    <CopyToClipboard text={item.link?item.link:''}
                        onCopy={()=>{item.link?alert('복사되었습니다.'):alert('활성화되지 않았습니다.')}}>
                        <button>복사</button>
                    </CopyToClipboard>
                </td>
            </tr>
        ))
        return (
            <div className="MainContainer">
                <table style={{width:'100%'}}>
                    <thead >
                        <tr className="list_row">
                            <th className="item_index">번호</th>
                            <th className="item_goods">상품 코드</th>
                            <th className="item_goods">상품 이름</th>
                            <th className="item_goods">상품 비용</th>
                            <th>쿠폰 번호</th>
                            <th>상태</th>
                            <th>활성화</th>
                            <th className="item_link">링크</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list}
                    </tbody>
                </table>
            </div>
        )
    }
}