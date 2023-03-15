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
    return message?.substring(0, 100) + "...";
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
      case "drafts":
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
  deleteMail(mailType, mailID) {
    switch (mailType) {
      case "inbox":
        //Move mail to trash
        this.moveMail("inbox", mailID);
        break;
      case "sent":
        //Move mail to trash
        this.moveMail("sent", mailID);
        break;
      case "drafts":
        //Move mail to trash
        this.moveMail("drafts", mailID);
        break;
      case "trash":
        this.trashMails = this.trashMails.filter((mail) => mail.id !== mailID);
        break;
      default:
        break;
    }
  }

  moveMail(mailType, mailID) {
    switch (mailType) {
      case "inbox":
        const inboxMail = this.inboxMails.find((mail) => mail.id === mailID);
        this.trashMails.push(inboxMail);
        this.inboxMails = this.inboxMails.filter((mail) => mail.id !== mailID);
        break;
      case "sent":
        const sentMail = this.sentMails.find((mail) => mail.id === mailID);
        this.trashMails.push(sentMail);
        this.sentMails = this.sentMails.filter((mail) => mail.id !== mailID);
        break;
      case "drafts":
        const draftMail = this.draftMails.find((mail) => mail.id === mailID);
        this.trashMails.push(draftMail);
        this.draftMails = this.draftMails.filter((mail) => mail.id !== mailID);
        break;
      case "trash":
        const trashMail = this.trashMails.find((mail) => mail.id === mailID);
        this.trashMails = this.trashMails.filter((mail) => mail.id !== mailID);
        break;
      default:
        break;
    }
  }

  sendDraftMail(mailID) {
    const draftMail = this.draftMails.find((mail) => mail.id === mailID);
    this.sentMails.push(draftMail);
    this.draftMails = this.draftMails.filter((mail) => mail.id !== mailID);
  }
  sendMail(mail) {
    this.sentMails.push(mail);
  }
}

export default User;
