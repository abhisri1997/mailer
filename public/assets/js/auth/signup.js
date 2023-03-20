const signup = (
  nameSelector,
  emailSelector,
  passwordSelector,
  confirmPasswordSelector
) => {
  const name = nameSelector.value;
  const email = emailSelector.value;
  const password = passwordSelector.value;
  const confirmPassword = confirmPasswordSelector.value;
  if (password !== confirmPassword) {
    console.log("Passwords do not match");
    return;
  }
  const data = {
    name,
    email,
    password,
    sent: [],
    inbox: [],
    drafts: [],
    trash: [],
  };
  fetch("/user/signup", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      window.location.href = `/mail`;
    })
    .catch((err) => console.log(err));
};

export default signup;
