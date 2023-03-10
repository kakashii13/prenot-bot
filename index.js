require("dotenv").config();
const puppeteer = require("puppeteer");
const TelegramBot = require("node-telegram-bot-api");
const schedule = require("node-schedule");

const tokenTelegram = process.env.TELEGRAM_TOKEN;
const chatId = process.env.CHAT_ID;
const user = process.env.USER_PRENOT;
const password = process.env.PASSWORD_PRENOT;

const bot = new TelegramBot(tokenTelegram);

const checkPrenot = async () => {
  // init browser
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"],
  });

  const page = await browser.newPage();

  try {
    await page.goto("https://prenotami.esteri.it/", { timeout: 300000 });

    await page.type("#login-email", user);
    await page.type("#login-password", password);

    await page.click(".login button");
    await page.waitForSelector("#advanced", { timeout: 300000 });

    await page.click("#advanced");
    await page.waitForSelector('[href="/Services/Booking/2421"]', {
      timeout: 300000,
    });

    await page.click('[href="/Services/Booking/2421"]');
    await page.waitForSelector(".jconfirm-holder", { timeout: 300000 });

    const data = await page.$(".jconfirm-holder", { timeout: 300000 });

    if (!data) {
      bot.sendMessage(chatId, "hay turno?");
    }
  } catch (error) {
    console.log("Error: ", error);
    bot.sendMessage(chatId, error);
  }

  await browser.close();
};

checkPrenot();

// execute code every hour
schedule.scheduleJob("0 * * * *", checkPrenot);

// send notification of server activity every five days
schedule.scheduleJob("0 0 10/5 * *", () => {
  bot.sendMessage(chatId, "El servidor sigue activo.");
});
