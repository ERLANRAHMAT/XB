/**
  * Edit features in './message/msg.js'
  * Contact me on WhatsApp wa.me/6281233700056
  * Follow : https://github.com/rtwone
  * Follow : https://github.com/GetSya
  * Follow : https://github.com/cakka587
*/

"use strict";
const {
	default: makeWASocket,
	BufferJSON,
	initInMemoryKeyStore,
	DisconnectReason,
	AnyMessageContent,
        makeInMemoryStore,
	useSingleFileAuthState,
	delay
} = require("@adiwajshing/baileys")
const figlet = require("figlet");
const fs = require("fs");
const moment = require('moment')
const chalk = require('chalk')
const logg = require('pino')
const clui = require('clui')
const { Spinner } = clui
const { serialize } = require("./lib/myfunc");
const { color, mylog, infolog } = require("./lib/color");
const time = moment(new Date()).format('HH:mm:ss DD/MM/YYYY')
let setting = JSON.parse(fs.readFileSync('./config.json'));
let session = `./${setting.sessionName}.json`
const { state, saveState } = useSingleFileAuthState(session)

function title() {
      console.clear()
	  console.log(chalk.bold.green(figlet.textSync('Xyle-Bot', {
		font: 'Standard',
		horizontalLayout: 'default',
		verticalLayout: 'default',
		width: 80,
		whitespaceBreak: false
	})))
	console.log(chalk.yellow(`\n                        ${chalk.yellow('[ Powered By Iyan, Arasya & Cakka]')}\n\n${chalk.red('Xyle-Bot')} : ${chalk.white('WhatsApp Bot Multi Device')}\n${chalk.red('Follow Insta Dev')} : ${chalk.white('@cakka.xz')}\n${chalk.red('Message Me On WhatsApp')} : ${chalk.white('+62 812-3370-0056')}\n${chalk.red('Donate')} : ${chalk.white('081233700056 ( Gopay/Pulsa )')}\n`))
}

/**
* Uncache if there is file change;
* @param {string} module Module name or path;
* @param {function} cb <optional> ;
*/
function nocache(module, cb = () => { }) {
	console.log(`Module ${module} sedang diperhatikan terhadap perubahan`) 
	fs.watchFile(require.resolve(module), async () => {
		await uncache(require.resolve(module))
		cb(module)
	})
}
/**
* Uncache a module
* @param {string} module Module name or path;
*/
function uncache(module = '.') {
	return new Promise((resolve, reject) => {
		try {
			delete require.cache[require.resolve(module)]
			resolve()
		} catch (e) {
			reject(e)
		}
	})
}

const status = new Spinner(chalk.cyan(` Booting WhatsApp Bot`))
const starting = new Spinner(chalk.cyan(` Preparing After Connect`))
const reconnect = new Spinner(chalk.redBright(` Reconnecting WhatsApp Bot`))

const store = makeInMemoryStore({ logger: logg().child({ level: 'fatal', stream: 'store' }) })

const connectToWhatsApp = async () => {
	const conn = makeWASocket({
            printQRInTerminal: true,
            logger: logg({ level: 'fatal' }),
            auth: state,
            browser: ["Xyle Bot MD", "Firefox", "3.0"]
        })
	title()
        store.bind(conn.ev)
	
	/* Auto Update */
	require('./message/help')
	require('./lib/myfunc')
	require('./message/msg')
	require('./index')
	nocache('./message/help', module => console.log(chalk.greenBright('[ WHATSAPP BOT ]  ') + time + chalk.cyanBright(` "${module}" Telah diupdate!`)))
	nocache('./lib/myfunc', module => console.log(chalk.greenBright('[ WHATSAPP BOT ]  ') + time + chalk.cyanBright(` "${module}" Telah diupdate!`)))
	nocache('./message/msg', module => console.log(chalk.greenBright('[ WHATSAPP BOT ]  ') + time + chalk.cyanBright(` "${module}" Telah diupdate!`)))
	nocache('./index', module => console.log(chalk.greenBright('[ WHATSAPP BOT ]  ') + time + chalk.cyanBright(` "${module}" Telah diupdate!`)))
	
	conn.ev.on('messages.upsert', async m => {
		if (!m.messages) return;
		var msg = m.messages[0]
		msg = serialize(conn, msg)
		msg.isBaileys = msg.key.id.startsWith('BAE5') || msg.key.id.startsWith('3EB0')
		require('./message/msg')(conn, msg, m, setting, store)
	})
	conn.ev.on('connection.update', (update) => {
		const { connection, lastDisconnect } = update
		if (connection === 'close') {
			status.stop()
			reconnect.stop()
			starting.stop()
			console.log(mylog('Server Ready ✓'))
			lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut 
			? connectToWhatsApp()
			: console.log(mylog('Wa web terlogout...'))
		}
	})
	conn.ev.on('creds.update', () => saveState)
	
/*const random = [`https://i.ibb.co/GHpZpvW/pickos-pria.jpg`,`https://i.ibb.co/0hF7kmL/pickos-wanita.jpg`,`https://i.ibb.co/ScC6tzT/3.jpg`,`https://i.ibb.co/zx4DFvv/4.jpg`,`https://i.ibb.co/vjTHL6D/5.jpg`,`https://i.ibb.co/bsxcY0M/6.jpg`,`https://i.ibb.co/7nfz2Hd/7.jpg`,`https://i.ibb.co/KyzP5yj/8.jpg`]
const pilih = random[Math.floor(Math.random() * random.length)]*/
	conn.ev.on('group-participants.update', async (data) => {
	try {
	let metadata = await conn.groupMetadata(data.id)
	  for (let i of data.participants) {
		try {
		  var pp_user = await conn.profilePictureUrl(i, 'image')
		} catch {
		  var pp_user = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
		}
		/**
		if (data.action == "add") {
		   var but = [{buttonId: `/`, buttonText: { displayText: "Welcome 🥳" }, type: 1 }, {buttonId: `/infobot`, buttonText: { displayText: "Siapa si aku?" }, type: 1 }]
		   
				conn.sendMessage(data.id, { caption: `Hallo @${i.split("@")[0]} Selamat Datang Di Grup *${metadata.subject}*\nSilahkan Untuk Memperkenalkan diri anda`, image: {url: pp_user}, buttons: but, footer: `Deskripsi : ${metadata.desc}`, mentions: [i]})
		} else if (data.action == "remove") {
		  var but = [{buttonId: `/`, buttonText: { displayText: "Good Bye 👋" }, type: 1 }]
				conn.sendMessage(data.id, { caption: `Byeee @${i.split("@")[0]}`, image: {url: pp_user}, buttons: but, footer: `${metadata.subject}`, mentions: [i]})
		}
		**/
	  }
	} catch (e) {
	  console.log(e)
	}
  }
)

	
	conn.reply = (from, content, msg) => conn.sendMessage(from, { text: content }, { quoted: msg })

	return conn
}

connectToWhatsApp()
.catch(err => console.log(err))