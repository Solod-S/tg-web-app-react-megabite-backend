const { bot } = require("../app");
const { getRows } = require("./googleSheets");

const fetchDiscount = async (chatId) => {
  const data = await getRows(2);

  for (let index = 0; index < data.length; index++) {
    const row = data[index];

    const message = [
      `<b>Пропозиція:</b> ${row?.name}`,
      `<b>Термін дії до:</b> ${row?.date}`,
      `<b>Посилання на акцію:</b> ${row?.dealsLink}`,
    ].join("\n");

    // await bot.sendMessage(chatId, message, { parse_mode: "HTML" });

    await bot.sendPhoto(chatId, row?.posterLink, {
      caption: message,
      parse_mode: "HTML",
    });
  }
};
module.exports = fetchDiscount;
