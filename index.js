const TelegramBot = require("node-telegram-bot-api")
require("dotenv").config()
const {teachers, scheduleParams} = require('./options.js')
const {VK, KEY, SHEET_NAME} = require('./data.js')
const {default: axios} = require("axios")
const {TEACHERS} = require('./data')

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {polling: true})

const start = () => {

    bot.setMyCommands([
        {command: '/start', description: 'Выбор преподавателя'},
        {command: '/about', description: 'Получить информацию обо мне'},
    ])        
    
    bot.on('message', msg => {
        const chatId = msg.chat.id
        const text = msg.text
        try{
            if (text === '/start'){    
                return bot.sendMessage(chatId,
                'Если хотите узнать свое расписание, выберите Ваше имя в предложенном списке. Для дополнительной информации введите /about',
                teachers)
            }
            if (text === '/about'){
                return bot.sendMessage(chatId, 
                `Я бот🤖, который умеет предоставлять Вам актуальную информацию о расписании📝. Чтобы узнать свое расписание, выберите Ваше имя в предложенном списке в блоке /start. Получилось? Если нет, то напишите мне: ${VK}`)
            }
            return bot.sendMessage(chatId, 'Я Вас не понимаю, попробуйте еще раз!')
        }
        catch(e){
            console.log(e)
            return bot.sendMessage(chatId, 'Что-то пошло не так! Попробуйте снова.')
        }
    }
)
    bot.on('callback_query', msg => {

        const data = msg.data;
        const chatId = msg.message.chat.id; 

        const getData = (teacher) => {
          axios.get(`https://opensheet.vercel.app/${KEY}/${SHEET_NAME}`)
              .then( async resp => {
                  const info = resp.data
                  let z = 0
                  for (let i=0; i<info.length; i++){
                       if (info[i].Teacher == teacher){
                           z += 1 
                           await bot.sendMessage(chatId, 
                               `Занятие #${z}\n👨‍🎓Дисциплина: ${info[i].disc}\n⏰Время занятия: ${info[i].time}\n⏳Продолжительность: ${info[i].minutes} \n🧍Ученики: ${info[i].pupils} \n📚Класс: ${info[i].class} \n🚪Кабинет: ${info[i].kab}`)
                           }    
                        }   
                    if(z == 0) bot.sendMessage(chatId, 'Занятий с таким преподавателем пока нет') 
                } 
            )
        }
        /*
        const dayOrWeek = () => {
            if (data == 'today'){
                
            }
            if (data == 'week'){
                
            }
        }
        const scheduleOptions = () => {
            return bot.sendMessage(chatId, `${name}, на какой срок желаете увидеть расписание?`, scheduleParams)
        }
        */
        try{    
            if (data == '0' || '1' || '2') return getData(TEACHERS[parseInt(data, 10)])
        }
        catch(e){
            console.log(e)
            return bot.sendMessage(chatId, 'Что-то пошло не так! Попробуйте снова.')
        }
    })
}

start()
