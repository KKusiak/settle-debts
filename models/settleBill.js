import * as Currencies from "../models/Currency";
import lodashCloneDeep from "lodash.clonedeep";
export const settleBills = ([...members]) => {
  const TMP = [];
  const sortedMembers = lodashCloneDeep(members)
    .sort((a, b) => {
      return b.balance.value - a.balance.value;
    })
    .filter((a) => a.balance.value !== 0);

  //   while (sortedMembers.length > 1)
  for (let i = 0; i < sortedMembers.length; i++) {
    const firstItem = sortedMembers[0]; // A
    const lastItem = sortedMembers[sortedMembers.length - 1]; // B
    if (Math.abs(lastItem.balance.value) >= firstItem.balance.value) {
      // całość kwoty danej przez A mieści się w długu B
      TMP.push({
        id: TMP.length,
        payer: lastItem.name,
        value: Currencies.PLN(Math.abs(firstItem.balance.value)),
        recipent: firstItem.name,
      });
      lastItem.balance = lastItem.balance.add(firstItem.balance);
      firstItem.balance = Currencies.PLN(0);
    } else if (Math.abs(lastItem.balance) < firstItem.balance) {
      // kwota dana przez A nie mieści się w długu B w całości
      TMP.push({
        id: TMP.length,
        payer: lastItem.name,
        value: Currencies.PLN(Math.abs(lastItem.balance.value)),
        recipent: firstItem.name,
      });
      lastItem.balance = Currencies.PLN(0);
      firstItem.balance = firstItem.balance.add(lastItem.balance);
    }

    if (firstItem.balance.value === 0) {
      // cała kwota została oddana A
      sortedMembers.splice(0, 1);
    }
    if (lastItem.balance.value === 0) {
      // B oddał cały dług

      sortedMembers.splice(sortedMembers.length - 1, 1);
    }
  }

  return TMP;
};
