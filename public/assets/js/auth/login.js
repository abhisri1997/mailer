const login = (emailSelector, passwordSelector) => {
  const username = emailSelector.value;
  const password = passwordSelector.value;

  const data = {
    username,
    password,
  };

  fetch("/login", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      window.location.href = "/mail";
    })
    .catch((err) => console.log(err));
};

export default login;
