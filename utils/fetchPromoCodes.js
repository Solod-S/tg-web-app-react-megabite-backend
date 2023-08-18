const { bot } = require("../app");
const { getRows } = require("./googleSheets");

const fetchPromoCodes = async (chatId) => {
  const data = await getRows(1);
  for (let index = 0; index < data.length; index++) {
    const row = data[index];

    const message = [
      `<b>Назва акції:</b> ${row?.Назва}`,
      `<b>Прокод:</b> ${row?.Промокод}`,
      `<b>Термін дії до:</b> ${row?.Термін}`,
      `<b>Посилання на акцію:</b> ${row?.Посилання}`,
    ].join("\n");

    // await bot.sendMessage(chatId, message, { parse_mode: "HTML" });

    await bot.sendPhoto(chatId, row?.Постер, {
      caption: message,
      parse_mode: "HTML",
    });
  }
};
module.exports = fetchPromoCodes;
