export function sendMailToServer(newMail, allMail) {
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

export function updateMail(updatedMail) {
  const url = "/mail/updateMail/";
  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedMail),
  };
  fetch(url, options)
    .then((res) => {
      if (!res.ok) {
        throw new Error(
          `Error updating mail ${mailId} of type ${mailType}: ${res.status} ${res.statusText}`
        );
      }
      return res.json();
    })
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.error(err);
    });
}
