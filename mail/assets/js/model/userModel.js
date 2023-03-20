import createTimeStamp from "../helper/createTimeStamp.js";

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

  getLastMailId(mailType) {
    let lastMailId = 0;
    switch (mailType) {
      case "inbox":
        lastMailId = this.inboxMails.length;
        break;
      case "sent":
        lastMailId = this.sentMails.length;
        break;
      case "drafts":
        lastMailId = this.draftMails.length;
        break;
      case "trash":
        lastMailId = this.trashMails.length;
        break;
      default:
        break;
    }
    return lastMailId;
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

  moveToDrafts(mail) {
    const newMailId = this.getLastMailId("drafts") + 1;
    mail.id = newMailId;
    this.draftMails.push(mail);
    return { drafts: this.draftMails };
  }

  moveMail(mailType, mailID, destination) {
    let output = {};
    switch (mailType) {
      case "inbox":
        //Move mail to destination
        output = this.moveMailToDestination(mailType, mailID, destination);
        break;
      case "sent":
        //Move mail to destination
        output = this.moveMailToDestination(mailType, mailID, destination);
        break;
      case "drafts":
        //Move mail to destination
        output = this.moveMailToDestination(mailType, mailID, destination);
        break;
      case "trash":
        //Move mail to destination
        output = this.moveMailToDestination(mailType, mailID, destination);
        break;
      default:
        break;
    }
    return output;
  }

  moveMailToDestination(mailType, mailID, destination) {
    let output = {};
    const newMailId = this.getLastMailId(destination) + 1;
    switch (mailType) {
      case "inbox":
        const inboxMail = JSON.parse(
          JSON.stringify(this.inboxMails.find((mail) => mail.id === mailID))
        );
        inboxMail.id = newMailId;
        if (inboxMail) {
          switch (destination) {
            case "inbox":
              this.inboxMails.push(inboxMail);
              output = { inbox: this.inboxMails };
              break;
            case "sent":
              this.sentMails.push(inboxMail);
              output = { sent: this.sentMails };
              break;
            case "drafts":
              this.draftMails.push(inboxMail);
              output = { drafts: this.draftMails };
              break;
            case "trash":
              this.trashMails.push(inboxMail);
              output = { trash: this.trashMails };
              break;
            default:
              break;
          }
          this.inboxMails = this.inboxMails.filter(
            (mail) => mail.id !== mailID
          );
          if (mailType !== destination) {
            output = { ...output, inbox: this.inboxMails };
          }
        }
        break;
      case "sent":
        const sentMail = JSON.parse(
          JSON.stringify(this.sentMails.find((mail) => mail.id === mailID))
        );
        sentMail.id = newMailId;
        if (sentMail) {
          switch (destination) {
            case "inbox":
              this.inboxMails.push(inboxMail);
              output = { inbox: this.inboxMails };
              break;
            case "sent":
              this.sentMails.push(inboxMail);
              output = { sent: this.sentMails };
              break;
            case "drafts":
              this.draftMails.push(inboxMail);
              output = { drafts: this.draftMails };
              break;
            case "trash":
              this.trashMails.push(inboxMail);
              output = { trash: this.trashMails };
              break;
            default:
              break;
          }
          this.sentMails = this.sentMails.filter((mail) => mail.id !== mailID);
          if (mailType !== destination) {
            output = { ...output, sent: this.sentMails };
          }
        }
        break;
      case "drafts":
        const draftMail = JSON.parse(
          JSON.stringify(this.draftMails.find((mail) => mail.id === mailID))
        );
        draftMail.id = newMailId;
        if (draftMail) {
          switch (destination) {
            case "inbox":
              this.inboxMails.push(inboxMail);
              output = { inbox: this.inboxMails };
              break;
            case "sent":
              this.sentMails.push(inboxMail);
              output = { sent: this.sentMails };
              break;
            case "drafts":
              this.draftMails.push(inboxMail);
              output = { drafts: this.draftMails };
              break;
            case "trash":
              this.trashMails.push(inboxMail);
              output = { trash: this.trashMails };
              break;
            default:
              break;
          }
          this.draftMails = this.draftMails.filter(
            (mail) => mail.id !== mailID
          );
          if (mailType !== destination) {
            output = { ...output, drafts: this.draftMails };
          }
        }
        break;
      case "trash":
        const trashMail = JSON.parse(
          JSON.stringify(this.trashMails.find((mail) => mail.id === mailID))
        );
        trashMail.id = newMailId;
        if (trashMail) {
          switch (destination) {
            case "inbox":
              this.inboxMails.push(inboxMail);
              output = { inbox: this.inboxMails };
              break;
            case "sent":
              this.sentMails.push(inboxMail);
              output = { sent: this.sentMails };
              break;
            case "drafts":
              this.draftMails.push(inboxMail);
              output = { drafts: this.draftMails };
              break;
            case "trash":
              this.trashMails.push(inboxMail);
              output = { trash: this.trashMails };
              break;
            default:
              break;
          }
          this.trashMails = this.trashMails.filter(
            (mail) => mail.id !== mailID
          );
          if (mailType !== destination) {
            output = { ...output, trash: this.trashMails };
          }
        }
        break;
      default:
        break;
    }
    return output;
  }

  deleteMail(mailType, mailID) {
    let output = {};
    switch (mailType) {
      case "inbox":
        //Move mail to trash
        output = this.trashMail("inbox", mailID);
        break;
      case "sent":
        //Move mail to trash
        output = this.trashMail("sent", mailID);
        break;
      case "drafts":
        //Move mail to trash
        output = this.trashMail("drafts", mailID);
        break;
      case "trash":
        this.trashMails = this.trashMails.filter((mail) => mail.id !== mailID);
        output = { trash: this.trashMails };
        break;
      default:
        break;
    }
    return output;
  }

  trashMail(mailType, mailID) {
    let output = {};
    const newMailId = this.getLastMailId("trash") + 1;
    switch (mailType) {
      case "inbox":
        const inboxMail = JSON.parse(
          JSON.stringify(this.inboxMails.find((mail) => mail.id === mailID))
        );
        inboxMail.id = newMailId;
        if (inboxMail) {
          this.trashMails.push(inboxMail);
          this.inboxMails = this.inboxMails.filter(
            (mail) => mail.id !== mailID
          );
        }
        output = { trash: this.trashMails, inbox: this.inboxMails };
        break;
      case "sent":
        const sentMail = JSON.parse(
          JSON.stringify(this.sentMails.find((mail) => mail.id === mailID))
        );
        sentMail.id = newMailId;
        if (sentMail) {
          this.trashMails.push(sentMail);
          this.sentMails = this.sentMails.filter((mail) => mail.id !== mailID);
        }
        output = { trash: this.trashMails, sent: this.sentMails };
        break;
      case "drafts":
        const draftMail = JSON.parse(
          JSON.stringify(this.draftMails.find((mail) => mail.id === mailID))
        );
        draftMail.id = newMailId;
        if (draftMail) {
          this.trashMails.push(draftMail);
          this.draftMails = this.draftMails.filter(
            (mail) => mail.id !== mailID
          );
        }
        output = { trash: this.trashMails, drafts: this.draftMails };
        break;
      case "trash":
        this.trashMails = this.trashMails.filter((mail) => mail.id !== mailID);
        output = { trash: this.trashMails };
        break;
      default:
        break;
    }
    return output;
  }

  sendDraftMail(mailID) {
    const draftMail = JSON.parse(
      JSON.stringify(this.draftMails.find((mail) => mail.id === mailID))
    );
    draftMail.id = this.getLastMailId("sent") + 1;
    draftMail.timeStamp = createTimeStamp();
    this.sentMails.push(draftMail);
    this.draftMails = this.draftMails.filter((mail) => mail.id !== mailID);
    return { sent: this.sentMails, drafts: this.draftMails };
  }

  sendMail(mail) {
    this.sentMails.push(mail);
    return { sent: this.sentMails };
  }
}

export default User;
