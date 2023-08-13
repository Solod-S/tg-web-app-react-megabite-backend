const dotenv = require("dotenv");
const shortid = require("shortid");
const chalk = require("chalk");
const { addRow } = require("./googleSheets");
const { format } = require("date-fns");

const currentDate = new Date();

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

  await bot.sendMessage(chatId, "Вам доступна форма зворотнього зв'язку ⬇⬇⬇", {
    reply_markup: {
      keyboard: [
        [
          {
            text: "Форма зворотнього зв'язку",
            web_app: { url: WEB_APP_URL + "form" },
          },
        ],
      ],
    },
  });

  if (msg?.web_app_data?.data) {
    // ловим данные отправленные с веб приложения (c формы)
    try {
      const data = await JSON.parse(msg?.web_app_data?.data);
      const id = shortid.generate();
      const formattedDate = format(currentDate, "dd.MM.yyyy");
      const formattedTime = format(currentDate, "HH:mm");

      await addRow({
        id,
        Тема: data?.subject,
        Имя: data?.name,
        Почта: data?.email,
        Коментарий: data?.comment,
        Дата: formattedDate,
        Час: formattedTime,
        TelegramId: msg.from.id,
        TelegramUsername: msg.from.username ? msg.from.username : "-",
      });

      await bot.sendMessage(
        chatId,
        `Дякую за ваше повідомлення\n` +
          `*Номер заявки:* ${id}\n` +
          `*Тема:* ${data?.subject}\n` +
          `*Ваше ім'я:* ${data?.name}\n` +
          `*Ваш пошта:* ${data?.email}\n` +
          `*Ваш коментар:* ${data?.comment}`,
        { parse_mode: "Markdown" }
      );
    } catch (error) {
      console.log(error.message);
      await bot.sendMessage(
        chatId,
        `Щось пішло не так. Повторіть спробу пізніше\n`,
        {
          parse_mode: "Markdown",
        }
      );
    }
  }
});

app.listen(PORT, () =>
  console.log(successMsg("server started on PORT " + PORT))
);

app.on("error", (error) => {
  console.error(errorMsg("An error occurred while starting the server:"));
});
