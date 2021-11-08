require('dotenv').config()
const ccxt =require('ccxt')
const axios=require('axios')
const {BYBITSECRET,CHAT_ID,TELEGRAM_TOKEN}=process.env
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`
const Currencies=['BTC','ETH','EOS','BCH','LTC','XRP','BSV','ETC','TRX','LINK']
currency=Currencies[0]
const URL=`https://open-api.bybt.com/api/pro/v1/futures/liquidation/detail/chart?timeType=11&symbol=${currency}`
percentage=70

const post=async (message)=>{
    await axios.post(`${TELEGRAM_API}/sendMessage`, {
        chat_id: CHAT_ID,
        text: message
    })
}   


const tick=async()=>{
    console.log('running')
    const result = await axios.get(URL,{
        headers:{
            "bybtSecret":BYBITSECRET
        }
    })
    
   
    const data=result.data.data[result.data.data.length-1].list[1]
    const turnover=data.turnoverNumber
    const buy=data.buyTurnoverNumber
    const sell=data.sellTurnoverNumber

    const sellRatio=sell/turnover*100
    const buyRatio=buy/turnover*100
    
    if(buyRatio>=percentage){
        post(`Buy ratio of ${currency}> ${percentage}`)
        
    }else if(sellRatio>=percentage){
        post(`Sell ratio of ${currency} > ${percentage}`)
    }
  
}

setInterval(tick,60000)

