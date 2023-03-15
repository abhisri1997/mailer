import login from "./auth/login.js";
import signup from "./auth/signup.js";

// selector initialization
const nameSelector = document.getElementById("name");
const emailSelector = document.getElementById("email");
const passwordSelector = document.getElementById("password");
const confirmPasswordSelector = document.getElementById("confirm-password");
const submitBtn = document.querySelector("button[type=submit]");

submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const btnType = e.target.innerText;
  if (btnType === "Log In") login(emailSelector, passwordSelector);
  else if (btnType === "Sign Up") {
    console.log("signup");
    signup(
      nameSelector,
      emailSelector,
      passwordSelector,
      confirmPasswordSelector
    );
  }
});
