const monthNames = {
  1: "Jan",
  2: "Feb",
  3: "Mar",
  4: "Apr",
  5: "May",
  6: "June",
  7: "July",
  8: "Aug",
  9: "Sep",
  10: "Oct",
  11: "Nov",
  12: "Dec",
}

export const convertTimestampToEST = (timestamp) => {
  if (timestamp === null) return null;
  const date = new Date(timestamp);
  const estOffset = -5 * 60; 
  date.setMinutes(date.getMinutes() + estOffset);

  const day = String(date.getDate()).padStart(2, "0");
  const monthNumber = date.getMonth();
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";

  if (hours > 12) {
    hours -= 12;
  } else if (hours === 0) {
    hours = 12;
  }

  return `${day} ${monthNames[monthNumber]}, ${year} - ${hours}:${minutes} ${ampm}`;
};

