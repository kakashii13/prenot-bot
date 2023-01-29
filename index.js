require("dotenv").config();
const puppeteer = require("puppeteer");
const TelegramBot = require("node-telegram-bot-api");

const tokenTelegram = process.env.TELEGRAM_TOKEN;
const user = process.env.USER_PRENOT;
const password = process.env.PASSWORD_PRENOT;

const bot = new TelegramBot(tokenTelegram);

// get the id chat of telegram
const getChatId = async () => {
  const updates = await bot.getUpdates();
  return updates[0].message.chat.id;
};

const checkPrenot = async () => {
  // init browser
  const browser = await puppeteer.launch({
    executablePath: "/path/to/chromium",
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

    const chatId = await getChatId();
    if (!data) {
      bot.sendMessage(chatId, "hay turno?");
    } else {
      bot.sendMessage(chatId, "no hay turno");
    }
  } catch (error) {
    console.log("Error: ", error);
    bot.sendMessage(chatId, error);
  }
  await browser.close();
  setTimeout(checkPrenot, 3600000);
};

checkPrenot();
