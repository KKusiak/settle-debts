import * as Currencies from "../models/Currency";
class Group {
  constructor(group) {
    const completeMembers = group.members.map((member) => {
      return { ...member, balance: Currencies.PLN(member.balance) };
    });
    this.id = group.id;
    this.title = group.title;
    this.description = group.description;
    this.members = completeMembers;
    this.membersIds = group.membersIds;
  }
}
export default Group;
