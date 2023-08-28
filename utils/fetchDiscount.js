const { format, parse, isAfter, isEqual } = require("date-fns");
const { bot } = require("../app");
const { getRows } = require("./googleSheets");

const fetchDiscount = async (chatId) => {
  const data = await getRows(2);

  for (let index = 0; index < data.length; index++) {
    const row = data[index];
    const currentDate = new Date();
    const formattedCurrentDate = format(currentDate, "dd.MM.yy");
    const formattedRowDate = format(
      parse(row.date, "dd.MM.yy", new Date()),
      "dd.MM.yy"
    );
    if (
      isAfter(
        parse(formattedRowDate, "dd.MM.yy", new Date()),
        parse(formattedCurrentDate, "dd.MM.yy", new Date())
      ) ||
      isEqual(
        parse(formattedRowDate, "dd.MM.yy", new Date()),
        parse(formattedCurrentDate, "dd.MM.yy", new Date())
      )
    ) {
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
  }
};
module.exports = fetchDiscount;
