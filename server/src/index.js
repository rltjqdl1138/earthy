const router = require('express').Router()
const jwt = require('./jwt')
const coupon = require('./coupon')
const fs = require('fs')

const basicRouter = (req,res)=>{
    console.log('hh')
    res.send('hello')
}
const TemperImageRouter = async (req,res)=>{
    try{
        const url = await checkFileAsync('/coupon_sample.jpg')
        streamFile (res,url)
    }catch(e){
        console.log(e)
        return res.status(404).end()
    }
}


const streamFile = (res, path) =>{
    const stream = fs.createReadStream(path)
        .on('open', ()=>{
            res.writeHead(200, {"Content-Type": "image/jpeg"})
            stream.pipe(res)
        })
        .on('error',(err)=> res.end(err))
    return stream
}

const checkFileAsync = (uri) => new Promise((resolve, reject) =>{
    const dir = __dirname+"/../resource/image"+uri
    fs.stat(dir, (err,stats) => err ? reject(err) : resolve(dir) )
})

router.get('/', basicRouter)
router.get('/image', TemperImageRouter)
router.get('/image/*', TemperImageRouter)
router.use('/coupon', coupon)

module.exports = router


// 상품 코드
// 유저 이름
// 쿠폰 번호


// Unactivated
// Activated
// Expired
// Used


/*
    쿠폰 번호 = 12자리 문자
    쿠폰 인증 번호 = 8자리 숫자



*/