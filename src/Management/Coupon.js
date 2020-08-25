import React, {Component} from 'react'
import {CopyToClipboard} from 'react-copy-to-clipboard';

export default class CouponManage extends Component{
    constructor(props){
        super(props)
        this.state={
            isVisibleInput:false,

            list:[],
            shop:undefined,
            newName:'',
            newCost:'',
            useNumber:'',
            newNumber:'',
            newShop:'@earthy',
            newUsername:'',
            searchPivot:0
        }
        this.selectedNumber = ''
    }
    handleChange = (field, value) => this.setState({[field]:value})
    componentDidMount(){
        this.getList()
        if(this.props.info.id === '@earthy')
            this.getShop()
    }
    getShop = async()=>{
        try{
            const response = await fetch('/coupon/shop', {
                method:'GET', headers:{ 'x-access-token': this.props.token ? this.props.token : '' }
            })
            const {data} = await response.json()
            this.handleChange('shop', data )
        }catch(e){
            this.handleChange('shop', undefined)
        }
    }
    getList = async(date)=>{
        try{
            const response = await fetch(`/coupon${date?'?date='+date:''}`, {
                method:'GET', headers:{ 'x-access-token': this.props.token ? this.props.token : '' }
            })
            const {data, pivot} = await response.json()
            this.handleChange('searchPivot', pivot ? pivot : 0)
            this.handleChange('list', data ? data : [])
        }catch(e){
            this.handleChange('list', [])
        }
    }

    /*
    updateCouponState = async(number, state)=>{
        const newState = state === 1 ? 2 : 1
        const response = await axios.post('/coupon/activate',{number},{
            headers:{'x-access-token' : this.props.token ? this.props.token : ''}
        })
        await this.getList()
    }*/
    handleActivate = async(number)=>{
        try{
            await fetch('/coupon/activate', {
                method:'POST',
                headers:{'Content-Type':'application/json', 'x-access-token': this.props.token ? this.props.token : ''},
                body: JSON.stringify({ number, userName:this.state.newUsername })
            })
            this.setState(state=>({ ...state, isVisibleInput:false, newUsername:''}), this.getList)
        }catch(e){

        }
    }
    handleUse = async()=>{
        const {useNumber} = this.state
        try{
            await fetch('/coupon/use', {
                method:'POST',
                headers:{'Content-Type':'application/json', 'x-access-token': this.props.token ? this.props.token : ''},
                body: JSON.stringify({ number: useNumber })
            })
            this.setState(state=>({ ...state, useNumber:''}), this.getList)
        }catch(e){

        }

    }
    openActivateForm = (number)=>{
        this.selectedNumber = number
        this.handleChange('isVisibleInput', true)
    }
    handleRegister = async()=>{
        const {newCost, newName, newNumber, newShop} = this.state
        try{
            await fetch('/coupon', {
                method:'POST',
                headers:{'Content-Type':'application/json', 'x-access-token': this.props.token ? this.props.token : ''},
                body: JSON.stringify({ name: newName, number:newNumber, cost:newCost, shop:newShop })
            })
            await this.getList()
        }catch(e){

        }
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
                return (<td><button onClick={()=>this.openActivateForm(number)}>활성화</button></td>)
            case 1:
                return (<td><button onClick={()=>this.updateCouponState(number, state)}>비활성화</button></td>)
            case 2:
                return (<td><button onClick={()=>this.updateCouponState(number, state)} style={{color:'gray'}}>활성화</button></td>)
            default:
                return (<td><button onClick={()=>this.updateCouponState(number, state)} style={{color:'gray'}}>활성화</button></td>)
        }
    }
    getTime = (_date)=>{
        try{
            const date = new Date(parseInt(_date))
            return `${date.getFullYear()}.${date.getMonth()+1}.${date.getDate()+1} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        }catch(e){
            return ''
        }
    }

    getDate = (_date)=>{
        try{
            const date = new Date(parseInt(_date))
            return `${date.getFullYear()}.${date.getMonth()+1}.${date.getDate()+1}`
        }catch(e){
            return ''
        }
    }
    render(){
        const {newName, newCost, newNumber, newShop, newUsername, shop, useNumber} = this.state
        const list = this.state.list.map((item, index) => shop ? (
            <tr key={index} className="list_row">
                <td className="item_index">{index}</td>
                <td className="item_goods">{item.shop}</td>
                <td className="item_goods">{item.name}</td>
                <td className="item_goods">{item.cost}</td>
                <td>{item.number}</td>
                <td>{item.createTime ? this.getTime(item.createTime) : ''}</td>
                <td>{item.activatedTime ? this.getTime(item.activatedTime) : ''}</td>
                <td>{item.usedTime ? this.getTime(item.usedTime) : ''}</td>
                {this.getState(item.state)}
                {this.getButton(item.number, item.state)}
                <td className="item_link">
                    <CopyToClipboard text={item.link?item.link:''}
                        onCopy={()=>{item.link?alert('복사되었습니다.'):alert('활성화되지 않았습니다.')}}>
                        <button>복사</button>
                    </CopyToClipboard>
                </td>
            </tr>  ):(
            <tr key={index} className="list_row">
                <td className="item_index">{index}</td>
                <td className="item_goods">{item.name}</td>
                <td className="item_goods">{item.cost}</td>
                <td>{item.number}</td>
                <td>{item.usedTime ? this.getTime(item.usedTime) : ''}</td>
            </tr>))

        return (
            <div className="MainContainer">
                <div style={{margin:20}}>
                    <input style={{fontSize:20}} type="text" value={useNumber} onChange={e=>this.handleChange('useNumber', e.target.value)}/>
                    <button style={{fontSize:20}} onClick={()=>window.confirm(`${useNumber}\n사용하시겠습니까?`)?this.handleUse():null}>쿠폰 사용하기</button>
                    <span style={{float:'right'}}>
                        <span style={{fontSize:18, marginRight:20}}>{this.state.searchPivot ? `${this.getDate(this.state.searchPivot)} ~ 현재` : ''}</span>
                        <button style={{width:50, marginRight:10, fontSize:20}}
                            onClick={()=>this.getList()}>
                            전체
                        </button>
                        <button style={{width:50, marginRight:10, fontSize:20}}
                            onClick={()=>this.getList('today')}>
                            오늘
                        </button>
                        <button style={{width:50, marginRight:10, fontSize:20}}
                            onClick={()=>this.getList('week')}>
                            7일
                        </button>
                        <button style={{width:50, marginRight:10, fontSize:20}}
                            onClick={()=>this.getList('month')}>
                            30일
                        </button>
                    </span>
                </div>
                <table style={{width:'100%'}}>
                    <thead >
                        <tr className="list_row">
                            <th className="item_index">번호</th>
                            {shop?(<th className="item_goods">상점 아이디</th>):null}
                            <th className="item_goods">상품 이름</th>
                            <th className="item_goods">상품 비용</th>
                            <th>쿠폰 번호</th>
                            {shop?(<th>생성 일자</th>):null}
                            {shop?(<th>발행 일자</th>):null}
                            <th>사용 일자</th>
                            {shop?(<th>상태</th>):null}
                            {shop?(<th>활성화</th>):null}
                            {shop?(<th className="item_link">링크</th>):null}
                        </tr>
                    </thead>
                    <tbody>
                        {list}
                        {!shop ? null : (
                            <tr className="list_row">
                            <td>new</td>
                            <td><select value={newShop} onChange={(e)=>this.handleChange('newShop', e.target.value)}>
                                {this.state.shop.map(item=>( <option key={item.id} value={item.id}>{item.name}</option> ))}
                            </select></td>
                            <td>
                                <input type="text" value={newName} onChange={(e)=>this.handleChange('newName',e.target.value)}/>
                            </td>
                            <td>
                                <input type="text" value={newCost} onChange={(e)=>this.handleChange('newCost',e.target.value)}/>
                            </td>
                            <td>
                                <input type="text" value={newNumber} onChange={(e)=>this.handleChange('newNumber',e.target.value)}/>
                            </td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>
                                <button onClick={()=>this.handleRegister()}>저장하기</button>
                            </td>
                            <td>-</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                {this.state.isVisibleInput ? (<div className="ModalContainer">
                    <div className="content">
                        Nickname <input type="text" value={newUsername} onChange={(e)=>this.handleChange('newUsername',e.target.value)}/>
                        <button onClick={()=>this.handleChange('isVisibleInput', false)}> 취소 </button>
                        <button onClick={()=>this.handleActivate(this.selectedNumber)}> 확인 </button>
                    </div>
                </div> ):null}
            </div>
        )
    }
}