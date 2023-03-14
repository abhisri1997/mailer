import fetchUserDetails from "./fetchUser.js";
import getMailContainerHTML from "./getMailContainerHTML.js";

const mailContainerSelector = document.querySelector(".mail-container");

const observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    mutation.target.querySelectorAll(".mail-item").forEach(function (node) {
      const mailItemLoadedEvent = new Event("mailItemLoaded");
      document.dispatchEvent(mailItemLoadedEvent);
    });
  });
});

observer.observe(document.body, { childList: true, subtree: true });

(async () => {
  //DOM Selectors
  const userLogoutSelector = document.querySelector(".user-logout");
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
    initInbox(user);
  });

  // Sent folder click event listener
  sentFolderSelector.addEventListener("click", () => {
    initSentMail(user);
  });

  // Draft folder click event listener
  draftFolderSelector.addEventListener("click", () => {
    initDraftMail(user);
  });

  // Trash folder click event listener
  trashFolderSelector.addEventListener("click", () => {
    initTrashMail(user);
  });

  // Mail item click event listener
  document.addEventListener("mailItemLoaded", () => {
    const mailItemSelector = document.querySelectorAll(".mail-item");
    const mailActionSelector = document.querySelectorAll(".mail-action");
    mailItemEvenListener(mailItemSelector, user);
    mailActionEvenListener(mailActionSelector, user);
  });
})();

function mailItemEvenListener(mailItemSelector, user) {
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

function mailActionEvenListener(mailActionSelector, user) {
  mailActionSelector.forEach((mailAction) => {
    mailAction.addEventListener("click", (e) => {
      //Mail Action parent selector
      const mailActionParentSelector = mailAction.parentElement;
      const mailId = parseInt(
        mailActionParentSelector.getAttribute("data-mail-id")
      );
      const mailType = mailActionParentSelector.getAttribute("data-mail-type");
      user.deleteMail(mailType, mailId);
      const activeMailSelector = document.querySelector(".active-mail");
      if (activeMailSelector) {
        activeMailSelector.classList.remove("active-mail");
      }
      const mailContainerSelector = document.querySelector(".mail-container");
      mailContainerSelector.innerHTML = getMailContainerHTML(mailType, user);
      const mainContentSelector = document.querySelector(".content-container");
      mainContentSelector.innerHTML = "";
      const noMail = isFolderEmpty(user);
      e.stopPropagation();
    });
  });
}

function initUserInfo(user) {
  const userNameSelector = document.querySelector(".user-name > h1");
  userNameSelector.textContent = user.getUserName();
  userNameSelector.setAttribute("data-user-name", user.getUserName());
  userNameSelector.setAttribute("data-user-email", user.getUserEmail());
}

function initInbox(user) {
  //Fill Inbox
  mailContainerSelector.innerHTML = getMailContainerHTML("inbox", user);

  //If mailContainerSelector is empty, show no mail message
  const noMail = isFolderEmpty(user);

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
  mailContainerSelector.innerHTML = getMailContainerHTML("draft", user);

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
    const mainContentSelector = document.querySelector(".content-container");
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
  const mainContentSelector = document.querySelector(".content-container");
  mainContentSelector.innerHTML = getMailContentHTML(mailType, mail);
}

function getMailContentHTML(mailType, mail) {
  const fromToName = mail.from
    ? mail.from.split(" ")[0]
    : mail.to
    ? mail.to.split(" ")[0]
    : "";
  const fromToEmail = mail.from
    ? mail.from.split(" ")[1]
    : mail.to
    ? mail.to.split(" ")[1]
    : "";
  const subject = mail.sub;
  const timeStamp = mail.timeStamp;
  const message = mail.message;
  const userInfoSelector = document.querySelector(".user-name > h1");
  const toName = userInfoSelector.getAttribute("data-user-name");
  const toEmail = userInfoSelector.getAttribute("data-user-email");

  return `
        <div class="mail-subject">
          <p>${subject}</p>
        </div>
        <div class="mail-info">
          <div class="sender-details">
            <p>
              from:
              &nbsp;
              <span class="sender-name">
                ${fromToName}
              </span>
              &nbsp;
              <span class="sender-email">
                &lt;${fromToEmail}&gt;
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
  `;
}
