import * as Currencies from "../models/Currency";

class Operation {
  constructor(payer, recipents = [], value, title) {
    this.payer = payer;
    this.recipents = recipents;
    this.value = Currencies.PLN(value);
    this.title = title;
  }
}
export default Operation;
