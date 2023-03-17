import User from "../model/userModel.js";

const fetchUserDetails = async () => {
  const userID = document.cookie.split("=")[1];
  const data = await fetch(`/users/${userID}`);
  const user = await data.json();
  const { name, username, email, sent, inbox, drafts, trash } = user;
  const userObj = new User(name, username, email, sent, inbox, drafts, trash);
  return userObj;
};

export default fetchUserDetails;
