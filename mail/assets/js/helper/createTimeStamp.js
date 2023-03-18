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

export default createTimeStamp;
