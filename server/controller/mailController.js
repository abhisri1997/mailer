const users = require("../data/users");

const updateMail = (req, res) => {
  const mailType = req.params.mailType;
  const mailId = parseInt(req.params.mailId);
  const user = users.find((user) => user.id === parseInt(req.session.user_id));
  user[mailType] = user[mailType].filter((mail) => mail.id !== mailId);
  console.log(user[mailType]);
  res.send(user);
};

const sendMail = (req, res) => {
  const { newMail } = req.body;
  const sender = users.find(
    (user) => user.id === parseInt(req.session.user_id)
  );
  if (!sender) {
    return res.status(400).send({ message: "Sender not found" });
  }

  const recipientsEmail = getEmailFromRecipientField(newMail.to);
  if (!recipientsEmail) {
    return res.status(400).send({ message: "Invalid recipient field" });
  }

  const recipient = users.find((user) => user.email === recipientsEmail);
  if (!recipient) {
    return res.status(400).send({ message: "Recipient not found" });
  }

  const recipientMail = createNewMail(sender, newMail, recipient, "inbox");
  const senderMail = createNewMail(sender, newMail, recipient, "sent");

  const senderSentMails = sender.sent;
  const recipientInboxMails = recipient.inbox;
  try {
    pushNewMailToSender(senderSentMails, senderMail);
    pushNewMailToRecipient(recipientInboxMails, recipientMail);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Failed to send mail" });
  }

  return res.status(200).send({ message: "Mail sent" });
};

const getEmailFromRecipientField = (recipientField) => {
  const emailRegex = /[\w.-]+@[\w-]+\.[\w.-]+/;
  const match = recipientField.match(emailRegex);
  const email = match ? match[0] : null;
  return email;
};

const createNewMail = (sender, newMail, recipient, folderType) => {
  const { sub, timeStamp, message } = newMail;
  let newMailId = 1;
  if (folderType === "inbox") {
    const inboxLength = recipient.inbox.length;
    newMailId = inboxLength > 0 ? recipient.inbox[inboxLength - 1].id + 1 : 1;
  } else {
    const sentLength = sender.sent.length;
    newMailId = sentLength > 0 ? sender.sent[sentLength - 1].id + 1 : 1;
  }
  const fromTo = folderType === "inbox" ? "from" : "to";
  return folderType === "inbox"
    ? {
        id: newMailId,
        from: `${sender.name} - ${sender.email}`,
        sub,
        timeStamp,
        message,
      }
    : {
        id: newMailId,
        to: `${recipient.name} - ${recipient.email}`,
        sub,
        timeStamp,
        message,
      };
};

const pushNewMailToSender = (folder, mail) => {
  folder.push(mail);
};

const pushNewMailToRecipient = (folder, mail) => {
  if (!Array.isArray(folder)) {
    folder = [];
  }
  folder.push(mail);
};

module.exports = { updateMail, sendMail };
