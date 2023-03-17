import fetchUserDetails from "./helper/fetchUser.js";
import getMailContainerHTML from "./helper/getMailContainerHTML.js";

const mailContainerSelector = document.querySelector(".mail-container");
const userInfoSelector = document.querySelector(".user-name > h1");
const contentContainerSelector = document.querySelector(".mail-info-container");

const observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    mutation.target.querySelectorAll(".mail-item").forEach(function (node) {
      const mailItemLoadedEvent = new Event("mailItemLoaded");
      document.dispatchEvent(mailItemLoadedEvent);
    });

    mutation.target
      .querySelectorAll(".send-draft-btn")
      .forEach(function (node) {
        const sendDraftLoadedEvent = new Event("sendDraftLoaded");
        document.dispatchEvent(sendDraftLoadedEvent);
      });

    mutation.target.querySelectorAll(".compose-mail").forEach(function (node) {
      const composeMailLoadedEvent = new Event("composeMailLoaded");
      document.dispatchEvent(composeMailLoadedEvent);
    });
  });
});

observer.observe(document.body, { childList: true, subtree: true });

(async () => {
  //DOM Selectors
  const composeFolderSelector = document.querySelector(".compose-folder");
  const inboxFolderSelector = document.querySelector(".inbox-folder");
  const sentFolderSelector = document.querySelector(".sent-folder");
  const draftFolderSelector = document.querySelector(".draft-folder");
  const trashFolderSelector = document.querySelector(".trash-folder");

  //Fetch user details
  const user = await fetchUserDetails();

  //Initialize user info
  initUserInfo(user);

  //Initialize inbox on first load
  initInbox(user);

  //Event Listeners

  // Inbox folder click event listener
  inboxFolderSelector.addEventListener("click", () => {
    resetFolders();
    initInbox(user);
  });

  // Sent folder click event listener
  sentFolderSelector.addEventListener("click", () => {
    resetFolders();
    initSentMail(user);
  });

  // Draft folder click event listener
  draftFolderSelector.addEventListener("click", () => {
    resetFolders();
    initDraftMail(user);
  });

  // Trash folder click event listener
  trashFolderSelector.addEventListener("click", () => {
    resetFolders();
    initTrashMail(user);
  });

  // Compose folder click event listener
  composeFolderSelector.addEventListener("click", () => {
    initComposeMail(user);
  });

  // Mail item click event listener
  document.addEventListener("mailItemLoaded", () => {
    const mailItemSelector = document.querySelectorAll(".mail-item");
    const mailActionSelector = document.querySelectorAll(".mail-action");
    mailItemEventListener(mailItemSelector, user);
    mailActionEventListener(mailActionSelector, user);
  });

  document.addEventListener("sendDraftLoaded", () => {
    const sendDraftSelector = document.querySelector(".send-draft-btn");
    sendDraftEventListener(sendDraftSelector, user);
  });

  document.addEventListener("composeMailLoaded", () => {
    const sendMailSelector = document.querySelector(".compose-mail");
    sendMailEventListener(sendMailSelector, user);
  });
})();

function getComposeMailHTML() {
  return `
<form class="compose-mail">
		<label for="to">To:</label>
		<input type="text" id="to" name="to" required>

		<label for="subject">Subject:</label>
		<input type="text" id="subject" name="subject" required>

		<label for="message">Message:</label>
		<textarea id="message" name="message" required></textarea>

		<input type="submit" value="Send">
	</form>
  `;
}

function sendMailEventListener(sendMailSelector, user) {
  sendMailSelector.addEventListener("submit", (e) => {
    e.preventDefault();
    const toName = document.querySelector("#to").value.split("@")[0];
    const toEmail = document.querySelector("#to").value;
    const to = toName + " " + toEmail;
    const sub = document.querySelector("#subject").value;
    const message = document.querySelector("#message").value;
    const sentMails = user.getSentMails();
    let lastMailId = 1;
    if (sentMails.length > 0) {
      var lastMail = sentMails.at(-1);
      lastMailId = lastMail.id + 1;
    }
    const mail = {
      id: lastMailId,
      to,
      sub,
      timeStamp: createTimeStamp(),
      message,
    };
    const allMail = user.sendMail(mail);
    updateServerData(mail, allMail);
    initSentMail(user);
    e.stopPropagation();
  });
}

function updateServerData(newMail, allMail) {
  const url = "/mail/sendMail/";
  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ newMail, allMail }),
  };
  fetch(url, options)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    });
}

const createTimeStamp = () => {
  // Create a new Date object
  const now = new Date();

  // Get the month abbreviation
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[now.getMonth()];

  // Get the day, year, and time in 12-hour format
  const day = now.getDate();
  const year = now.getFullYear();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const time = `${hours % 12 || 12}:${minutes
    .toString()
    .padStart(2, "0")} ${ampm}`;

  // Combine the parts into a formatted string
  const timestamp = `${month} ${day}, ${year}, ${time}`;

  return timestamp;
};

function mailItemEventListener(mailItemSelector, user) {
  console.log(mailItemSelector);
  mailItemSelector.forEach((mailItem) => {
    mailItem.addEventListener("click", () => {
      const activeMailSelector = document.querySelector(".active-mail");
      if (activeMailSelector) {
        activeMailSelector.classList.remove("active-mail");
      }
      mailItem.classList.add("active-mail");
      const mailId = parseInt(mailItem.getAttribute("data-mail-id"));
      const mailType = mailItem.getAttribute("data-mail-type");
      const mail = user.getMail(mailType, mailId);
      openMail(mailType, mail);
    });
  });
}

function mailActionEventListener(mailActionSelector, user) {
  mailActionSelector.forEach((mailAction) => {
    mailAction.addEventListener("click", (e) => {
      //Mail Action parent selector
      const mailActionParentSelector = mailAction.parentElement;
      const mailId = parseInt(
        mailActionParentSelector.getAttribute("data-mail-id")
      );
      const mailType = mailActionParentSelector.getAttribute("data-mail-type");
      const updatedMail = user.deleteMail(mailType, mailId);
      console.log(updatedMail);
      const activeMailSelector = document.querySelector(".active-mail");
      if (activeMailSelector) {
        activeMailSelector.classList.remove("active-mail");
      }
      const mailContainerSelector = document.querySelector(".mail-container");
      mailContainerSelector.innerHTML = getMailContainerHTML(mailType, user);
      const mainContentSelector = document.querySelector(".content-container");
      mainContentSelector.innerHTML = "";

      // Update server with new user data
      fetch(`/mail/${mailType}/${mailId}`, {
        method: "put",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
        })
        .catch((err) => {
          console.log(err);
        });

      isFolderEmpty(user);
      e.stopPropagation();
    });
  });
}

function sendDraftEventListener(sendDraftSelector, user) {
  sendDraftSelector.addEventListener("click", (e) => {
    const activeMailSelector = document.querySelector(".active-mail");
    const mailId = parseInt(activeMailSelector.getAttribute("data-mail-id"));
    const updatedMails = user.sendDraftMail(mailId);
    console.log(updatedMails);
    const mailContainerSelector = document.querySelector(".mail-container");
    mailContainerSelector.innerHTML = getMailContainerHTML("drafts", user);
    const mainContentSelector = document.querySelector(".content-container");
    mainContentSelector.innerHTML = "";
    isFolderEmpty(user);
    e.stopPropagation();
  });
}

function initUserInfo(user) {
  userInfoSelector.textContent = user.getUserName();
  userInfoSelector.setAttribute("data-user-name", user.getUserName());
  userInfoSelector.setAttribute("data-user-email", user.getUserEmail());
}

function initComposeMail(user) {
  //Fill Compose Mail
  contentContainerSelector.innerHTML = getComposeMailHTML();

  //Hide mail container
  mailContainerSelector.classList.add("hide");

  //Change grid template columns
  document
    .querySelector(".main")
    .style.setProperty("--dynamic-grid-template-columns", "auto 3fr");

  //Active Compose Mail
  const composeFolderSelector = document.querySelector(".compose-folder");
  toggleActiveFolder(composeFolderSelector);
}

function resetFolders() {
  mailContainerSelector.classList.remove("hide");
  document
    .querySelector(".main")
    .style.setProperty("--dynamic-grid-template-columns", "auto auto 3fr");
}

function initInbox(user) {
  //Fill Inbox
  mailContainerSelector.innerHTML = getMailContainerHTML("inbox", user);

  //If mailContainerSelector is empty, show no mail message
  isFolderEmpty(user);

  //Active Inbox
  const inboxFolderSelector = document.querySelector(".inbox-folder");
  toggleActiveFolder(inboxFolderSelector);
}

function initSentMail(user) {
  //Fill Sent Mail
  mailContainerSelector.innerHTML = getMailContainerHTML("sent", user);

  //If mailContainerSelector is empty, show no mail message
  isFolderEmpty(user);

  //Active Sent Mail
  const sentFolderSelector = document.querySelector(".sent-folder");
  toggleActiveFolder(sentFolderSelector);
}

function initDraftMail(user) {
  //Fill Draft Mail
  mailContainerSelector.innerHTML = getMailContainerHTML("drafts", user);

  //If mailContainerSelector is empty, show no mail message
  isFolderEmpty(user);

  //Active Draft Mail
  const draftFolderSelector = document.querySelector(".draft-folder");
  toggleActiveFolder(draftFolderSelector);
}

function initTrashMail(user) {
  //Fill Trash Mail
  mailContainerSelector.innerHTML = getMailContainerHTML("trash", user);

  //If mailContainerSelector is empty, show no mail message
  isFolderEmpty(user);

  //Active Trash Mail
  const trashFolderSelector = document.querySelector(".trash-folder");
  toggleActiveFolder(trashFolderSelector);
}

function toggleActiveFolder(folderSelector) {
  const activeFolderSelector = document.querySelector(".active-folder");
  if (activeFolderSelector) {
    activeFolderSelector.classList.remove("active-folder");
  }
  folderSelector.classList.add("active-folder");
}

//TODO - Refactor this function to seperate folder check and no mail message
function isFolderEmpty(user) {
  if (mailContainerSelector.innerHTML === "") {
    const mainContentSelector = document.querySelector(".mail-info-container");
    mainContentSelector.innerHTML = `<div class="no-mail">
        <p>Empty...</p>
    </div>`;
    return true;
  } else {
    initFirstMail(user);
  }
  return false;
}

function initFirstMail(user) {
  const firstMailSelector = document.querySelector(".mail-item-1");
  if (firstMailSelector) {
    firstMailSelector.classList.add("active-mail");
    const mailId = parseInt(firstMailSelector.getAttribute("data-mail-id"));
    const mailType = firstMailSelector.getAttribute("data-mail-type");
    const mail = user.getMail(mailType, mailId);
    openMail(mailType, mail);
  }
}

function openMail(mailType, mail) {
  const mainContentSelector = document.querySelector(".mail-info-container");
  mainContentSelector.innerHTML = getMailContentHTML(mailType, mail);
}

function getMailContentHTML(mailType, mail) {
  let toName = userInfoSelector.getAttribute("data-user-name");
  let toEmail = userInfoSelector.getAttribute("data-user-email");
  let fromName = "";
  let fromEmail = "";
  if (mail.from) {
    fromName = mail.from.split(" - ")[0];
    fromEmail = mail.from.split(" - ")[1];
  } else {
    fromName = toName;
    fromEmail = toEmail;
    toName = mail.to.split(" - ")[0];
    toEmail = mail.to.split(" - ")[1];
  }
  const subject = mail.sub;
  const timeStamp = mail.timeStamp;
  const message = mail.message;

  return `
    <div class="content-container">
      <div class="mail-subject">
        <p>${subject}</p>
      </div>
      <div class="mail-info">
        <div class="sender-details">
          <p>
            from:
            &nbsp;
            <span class="sender-name">
              ${fromName}
            </span>
            &nbsp;
            <span class="sender-email">
              &lt;${fromEmail}&gt;
            </span>
          </p>
        </div>
        <div class="receiver-details">
          <p>
            to:
            &nbsp;
            <span class="receiver-name">
              ${toName}
            </span>
            &nbsp;
            <span class="receiver-email">
              &lt;${toEmail}&gt;
            </span>
          </p>
        </div>
        <div class="mail-timestamp">
          <p>
            date:
            &nbsp;
            <span class="mail-date-time">
              ${timeStamp}
            </span>
          </p>
        </div>
        <div class="mail-subject-container">
          <p>
            subject:
            &nbsp;
            <span class="mail-subject">
              ${subject}
            </span>
          </p>
        </div>
      </div>
      <div class="mail-content">
        ${message}
      </div>
    </div>
    ${mailType === "drafts" ? getSendMailButton() : ""}
  `;
}

function getSendMailButton() {
  return `
        <div class="send-draft-btn">
          <i class="fa-solid fa-arrow-circle-right"></i>
        </div>
  `;
}
