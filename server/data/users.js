const users = [
  {
    id: 1,
    name: "Admin",
    username: "admin",
    email: "admin@mailer.com",
    password: "admin",
    sent: [
      {
        id: 1,
        to: "XYZ xyz@mailer.com",
        sub: "The resturant",
        timeStamp: "Mar 7, 2023, 9:35 AM",
        message: "Hi, XYZ thank you for your interest in our resturant",
      },
    ],
    inbox: [
      {
        id: 1,
        from: "XYZ xyz@mailer.com",
        sub: "The resturant",
        timeStamp: "Mar 7, 2023, 8:55 AM",
        message: "Hello, I am interested in your resturant",
      },
      {
        id: 2,
        from: "Flipkart no-reply@flipkart.com",
        sub: "Big Billion Celebration is here...",
        timeStamp: "Mar 8, 2023, 8:55 AM",
        message: `
                  Hi Abhinav,

                  Greetings from Flipkart.

                  Thanks for using Flipkart Pay Later. We've received your order xyz.

                  Thank you for shopping with up on Big Billion Day!

                  We would love to get your feedback.
                  `,
      },
      {
        id: 3,
        from: "Amazon no-reply@amazon.com",
        sub: "Amazon Great Indian Festival",
        timeStamp: "Mar 8, 2023, 8:55 PM",
        message: "lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      },
    ],
    drafts: [
      {
        id: 1,
        to: "XYZ xyz@mailer.com",
        sub: "The resturant",
        timeStamp: "Mar 7, 2023, 9:55 AM",
        message: "Let me know when can we schedule a meeting",
      },
    ],
    trash: [
      {
        id: 1,
        from: "ABC abc@phishing.com",
        sub: "Click here",
        timeStamp: "Mar 8, 2023, 8:55 AM",
        message: "Click here to win a free iPhone",
      },
    ],
  },
];
//export users for testing
module.exports = users;
