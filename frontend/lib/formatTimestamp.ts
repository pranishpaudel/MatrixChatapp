import { format, formatDistanceToNow, isToday, isYesterday } from "date-fns";
const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInSeconds = (now.getTime() - date.getTime()) / 1000;

  if (diffInSeconds < 60) {
    return "a few seconds ago";
  } else if (diffInSeconds < 3600) {
    return formatDistanceToNow(date, { addSuffix: true });
  } else if (isToday(date)) {
    return format(date, "p");
  } else if (isYesterday(date)) {
    return "Yesterday";
  } else {
    return format(date, "MMM d, yyyy");
  }
};

export default formatTimestamp;
