const getMailContainerHTML = (type, user) => {
  let mailHTML = "";
  switch (type) {
    case "inbox":
      mailHTML = getInboxMails(user, mailHTML);
      break;
    case "sent":
      mailHTML = getSentMails(user, mailHTML);
      break;
    case "drafts":
      mailHTML = getDraftMails(user, mailHTML);
      break;
    case "trash":
      mailHTML = getTrashMails(user, mailHTML);
      break;
    default:
      mailHTML = getInboxMails(user, mailHTML);
  }
  return mailHTML;
};

const createMailTemplate = (
  mailType,
  idx,
  mailID,
  fromToName,
  subject,
  messageSummary
) => {
  return `
            <div data-mail-id="${mailID}" data-mail-type="${mailType}" class="mail-item mail-item-${
    idx + 1
  }">
                <div class="mail-details">
                    <div class="sender-name">
                        <p>${fromToName}</p>
                    </div>
                    <div class="mail-subject-summary">
                        <p>${subject}</p>
                    </div>
                    <div class="mail-content-summary">
                        <p>${messageSummary}</p>
                    </div>
                </div>
                <div class="mail-action">
                    <i class="fa-solid fa-trash"></i>
                </div>
            </div>
        `;
};

const getInboxMails = (user, mailHTML) => {
  //Sort mail by received time
  if (user.getInboxMails().length > 0) {
    const inboxMails = user
      .getInboxMails()
      .sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp));

    inboxMails.forEach((mail, idx) => {
      const fromName = mail.from.split(" - ")[0];
      const subject = mail.sub;
      const messageSummary = user.getMessageSummary(mail.message);
      const mailType = "inbox";
      const mailID = mail.id;
      mailHTML += createMailTemplate(
        mailType,
        idx,
        mailID,
        fromName,
        subject,
        messageSummary
      );
    });
  }
  return mailHTML;
};

const getSentMails = (user, mailHTML) => {
  if (user.getSentMails().length > 0) {
    //Sort mail by received time
    const sentMails = user
      .getSentMails()
      .sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp));

    sentMails.forEach((mail, idx) => {
      const toName = mail.to.split(" - ")[0];
      const subject = mail.sub;
      const messageSummary = user.getMessageSummary(mail.message);
      const mailType = "sent";
      const mailID = mail.id;
      mailHTML += createMailTemplate(
        mailType,
        idx,
        mailID,
        toName,
        subject,
        messageSummary
      );
    });
  }
  return mailHTML;
};

const getDraftMails = (user, mailHTML) => {
  if (user.getDraftMails().length > 0) {
    //Sort mail by received time
    const draftMails = user
      .getDraftMails()
      .sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp));

    draftMails.forEach((mail, idx) => {
      const toName = mail.to.split(" - ")[0];
      const subject = mail.sub;
      const messageSummary = user.getMessageSummary(mail.message);
      const mailType = "drafts";
      const mailID = mail.id;
      mailHTML += createMailTemplate(
        mailType,
        idx,
        mailID,
        toName,
        subject,
        messageSummary
      );
    });
  }
  return mailHTML;
};

const getTrashMails = (user, mailHTML) => {
  if (user.getTrashMails().length > 0) {
    //Sort mail by received time
    const trashMails = user
      .getTrashMails()
      .sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp));

    trashMails.forEach((mail, idx) => {
      if (mail) {
        const fetchFrom = mail.from ? mail.from : mail.to;
        const fromName = fetchFrom.split(" - ")[0];
        const subject = mail?.sub;
        const messageSummary = user.getMessageSummary(mail?.message);
        const mailType = "trash";
        const mailID = mail?.id;
        mailHTML += createMailTemplate(
          mailType,
          idx,
          mailID,
          fromName,
          subject,
          messageSummary
        );
      }
    });
  }
  return mailHTML;
};

export default getMailContainerHTML;
