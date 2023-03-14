class User {
  constructor(
    name,
    username,
    email,
    sentMails,
    inboxMails,
    draftMails,
    trashMails
  ) {
    this.name = name;
    this.username = username;
    this.email = email;
    this.sentMails = sentMails;
    this.inboxMails = inboxMails;
    this.draftMails = draftMails;
    this.trashMails = trashMails;
  }
  getUserName() {
    return this.name;
  }
  getUserEmail() {
    return this.email;
  }
  getMail(mailType, mailID) {
    let mail;

    switch (mailType) {
      case "inbox":
        mail = this.inboxMails.find((mail) => mail.id === mailID);
        break;
      case "sent":
        mail = this.sentMails.find((mail) => mail.id === mailID);
        break;
      case "draft":
        mail = this.draftMails.find((mail) => mail.id === mailID);
        break;
      case "trash":
        mail = this.trashMails.find((mail) => mail.id === mailID);
        break;
      default:
        mail = null;
    }
    return mail;
  }
  getSentMails() {
    return this.sentMails;
  }
  getInboxMails() {
    return this.inboxMails;
  }
  getDraftMails() {
    return this.draftMails;
  }
  getTrashMails() {
    return this.trashMails;
  }
  getMessageSummary(message) {
    return message.substring(0, 100) + "...";
  }
}

export default User;
