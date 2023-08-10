const dotenv = require("dotenv");
const chalk = require("chalk");

dotenv.config();
const { WEB_APP_URL, PORT } = process.env;
const errorMsg = chalk.bgKeyword("white").redBright;
const successMsg = chalk.bgKeyword("green").white;

const { app, bot } = require("./app");

bot.on("message", async (msg) => {
  // слушатель событий сообщения
  const chatId = msg.chat.id;
  const text = msg.text;

  await bot.sendPhoto(
    chatId,
    "https://scontent-iev1-1.xx.fbcdn.net/v/t39.30808-6/331357507_1397251511098228_6425396056321247517_n.jpg?_nc_cat=108&cb=99be929b-3346023f&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=58pxXYy2ROQAX9QIPe1&_nc_ht=scontent-iev1-1.xx&oh=00_AfA9JqRv8au5e-hSaZBdwGm_WqSu_24Xp28CxWVf_bxXlw&oe=64D8EA22",
    {
      caption:
        "Давайте розпочнемо 👨‍💻 Натисніть кнопку нижче, щоб ознайомитись з моїм функціоналом!",
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "Відкрити меню", web_app: { url: WEB_APP_URL } }],
        ],
      },
    }
  );

  if (msg?.web_app_data?.data) {
    // ловим данные отправленные с веб приложения (c формы)
    try {
      const data = await JSON.parse(msg?.web_app_data?.data);
      await bot.sendMessage(chatId, "Спасибо за ваше сообщение");
      console.log(data);
      await bot.sendMessage(chatId, "Ваша страна: " + data?.country);
      await bot.sendMessage(chatId, "Ваша улица: " + data?.street);
      setTimeout(async () => {
        await bot.sendMessage(chatId, "Всю информацию вы получите в этом чате");
      }, 3000);
    } catch (error) {
      console.log(error.message);
    }
  }
});

app.listen(PORT, () =>
  console.log(successMsg("server started on PORT " + PORT))
);

app.on("error", (error) => {
  console.error(errorMsg("An error occurred while starting the server:"));
});
