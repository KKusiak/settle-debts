import * as Currencies from "../models/Currency";
import firebase from "firebase";
class Expenditure {
  constructor(expenditure, id) {
    this.uid = expenditure.uid;
    this.id = id;
    this.name = expenditure.name;
    this.category = expenditure.category;
    this.value = Currencies.PLN(expenditure.value);
    this.creationDate = expenditure.creationDate.toDate();
  }
}
export default Expenditure;
