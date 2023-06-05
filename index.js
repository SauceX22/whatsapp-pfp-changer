const cron = require('node-cron');
// use whatsapp-web-js library to connect to whatsapp with qr code terminal library 
const { Client, LocalAuth } = require('whatsapp-web.js');
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
});
const qrcode = require('qrcode-terminal');

// connect to whatsapp
client.on('qr', (qr) => {
    // Generate and scan this code with your phone
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', message => {
    if (message.body === '!ping') {
        message.reply('pong');
        console.log(message.from, "sent pong");
    }
});

client.initialize();

// Run the job at 00:00 every day
cron.schedule('0 0 * * *', () => {
    // send message to a specific number
    const phoneNumber = env.process.PHONE_NUMBER;
    sendMessage(phoneNumber, 'Good morning!');
});

const sendMessage = async (number, msg) => {
    const sanitized_number = sanitizeNumber(number);

    const number_details = await client.getNumberId(sanitized_number); // get mobile number details

    if (number_details) {
        const sendMessageData = await client.sendMessage(number_details._serialized, msg); // send message
    } else {
        console.log(final_number, "Mobile number is not registered");
    }
};

const sanitizeNumber = (number) => {
    const sanitized_number = number.toString().replace(/[- )(]/g, ""); // remove unnecessary chars from the number
    const final_number = `966${sanitized_number.substring(sanitized_number.length - 10)}`;
    return final_number;
}
