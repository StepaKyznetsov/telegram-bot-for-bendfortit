const {TEACHERS} = require('./data')
module.exports = {
    teachers: {
       reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: TEACHERS[0], callback_data: '0'}], 
            [{text: TEACHERS[1], callback_data: '1'}], 
            [{text: TEACHERS[2], callback_data: '2'}],
            ]
       })
   },
   scheduleParams: {
    reply_markup: JSON.stringify({
     inline_keyboard: [
         [{text: 'на сегодня', callback_data: 'today'}], 
         [{text: 'на будущую неделю', callback_data: 'week'}], 
         ]
    })
}
}