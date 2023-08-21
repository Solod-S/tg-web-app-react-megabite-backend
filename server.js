const dotenv = require("dotenv");
const shortid = require("shortid");
const chalk = require("chalk");

const { fetchPromoCodes, fetchDiscount } = require("./utils");
const { addRow } = require("./utils/googleSheets");
const { format } = require("date-fns");

dotenv.config();
const { WEB_APP_URL, PORT } = process.env;
const errorMsg = chalk.bgKeyword("white").redBright;
const successMsg = chalk.bgKeyword("green").white;

const { app, bot } = require("./app");

bot.setMyCommands([
  { command: "/info", description: "Про нас" },
  { command: "/promo", description: "Промокоди" },
  { command: "/superdeal", description: "Супер пропозиції" },
]);

bot.on("message", async (msg) => {
  // слушатель событий сообщения
  const chatId = msg.chat.id;
  const text = msg.text;
  const currentDate = new Date();
  const formattedDate = format(currentDate, "dd.MM.yyyy");
  const formattedTime = format(currentDate, "HH:mm");

  if (text == "/info") {
    return bot.sendPhoto(
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
  }
  if (text === "/promo") {
    return fetchPromoCodes(chatId);
  }
  if (text === "/superdeal") {
    return fetchDiscount(chatId);
  }

  await bot.sendMessage(
    chatId,
    "Вам доступні команди в розділі меню, а також форма зворотнього зв'язку ⬇⬇⬇",
    {
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
    }
  );

  if (msg?.web_app_data?.data) {
    // ловим данные отправленные с веб приложения (c формы)
    try {
      const data = await JSON.parse(msg?.web_app_data?.data);
      const id = shortid.generate();

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

      const stickerUrl =
        "https://tlgrm.eu/_/stickers/b0d/85f/b0d85fbf-de1b-4aaf-836c-1cddaa16e002/thumb-animated-128.mp4";
      const messageText =
        `*Дякую за ваше повідомлення*\n` +
        `.............\n` +
        `*Номер заявки:* ${id}\n` +
        `*Тема:* ${data?.subject}\n` +
        `*Ваше ім'я:* ${data?.name}\n` +
        `*Ваш пошта:* ${data?.email}\n` +
        `*Ваш коментар:* ${data?.comment}`;

      const messageWithSticker = `${messageText}\n[.............](${stickerUrl})`;

      return bot.sendMessage(chatId, messageWithSticker, {
        parse_mode: "Markdown",
      });
    } catch (error) {
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

// app.listen(PORT, () =>
//   console.log(successMsg("server started on PORT " + PORT))
// );

// если надумаю делать апиху

// app.on("error", (error) => {
//   console.error(errorMsg("An error occurred while starting the server:"));
// });
