import axios from "axios";
import { rootUrl, authHeader } from "./http";

const url = rootUrl + "package";

export const getPackages = async () => {
  const res = await axios.get(url, authHeader());
  return res.data;
};

export const logPackage = async (formData) => {
  const res = await axios.post(url, formData, authHeader());
  return res.data;
};

export const markPackagePickedUp = async (_id) => {
  const res = await axios.patch(`${url}/${_id}/pickup`, {}, authHeader());
  return res.data;
};
