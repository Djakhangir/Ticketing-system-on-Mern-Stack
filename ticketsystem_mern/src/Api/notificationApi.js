import axios from "axios";
import { rootUrl, authHeader } from "./http";

const url = rootUrl + "notification";

export const getNotifications = async () => {
  const res = await axios.get(url, authHeader());
  return res.data;
};

export const markNotificationRead = async (_id) => {
  const res = await axios.patch(`${url}/${_id}`, {}, authHeader());
  return res.data;
};

export const markAllNotificationsRead = async () => {
  const res = await axios.patch(url, {}, authHeader());
  return res.data;
};
