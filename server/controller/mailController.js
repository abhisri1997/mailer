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
  // Push new mail to the senders sent folder
  const sender = users.find(
    (user) => user.id === parseInt(req.session.user_id)
  );
  sender.sent.push(newMail);
  console.log(sender);
  // Push new mail to the recipients inbox
  const recipientsEmail = newMail.to.split(" ")[1];
  const recipient = users.find((user) => user.email === recipientsEmail);
  const recipientLastMail = recipient.inbox?.at(-1);
  const recipientLastMailId = recipientLastMail?.id;
  const newMailId = recipientLastMailId ? recipientLastMailId + 1 : 1;
  const mail = {
    id: newMailId,
    from: sender.name + " " + sender.email,
    sub: newMail.sub,
    timeStamp: newMail.timeStamp,
    message: newMail.message,
  };
  recipient.inbox.push(mail);
  console.log(recipient);
  res.status(200).send({ message: "Mail sent" });
};

module.exports = { updateMail, sendMail };
