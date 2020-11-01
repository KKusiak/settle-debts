import * as Currencies from "../models/Currency";

class Operation {
  constructor(docData, id) {
    this.groupId = docData.groupId;
    this.id = id;
    this.payer = docData.payer;
    this.recipents = docData.recipents;
    this.value = Currencies.PLN(docData.value);
    this.title = docData.title;
  }
}
export default Operation;
