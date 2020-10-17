import currency from "currency.js";
export const USD = (value) => currency(value);
export const PLN = (value) =>
  currency(value, {
    symbol: "PLN ",
    decimal: ".",
    pattern: "# !",
    negativePattern: "-# !",
  });
export const EURO = (value) =>
  currency(value, { symbol: "€", decimal: ",", separator: "." });
