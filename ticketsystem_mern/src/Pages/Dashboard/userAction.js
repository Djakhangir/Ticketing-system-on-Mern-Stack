import {getUserPending, getUserSuccess, getUserFail} from "./userSlice";
import { fetchUser } from "../../Api/userApi";

export const getUserProfile = () => async(dispatch) => {
    try {
        dispatch(getUserPending())
        //call the api;
const result = await fetchUser();
result.user && result.user._id ? dispatch(getUserSuccess(result.user)) : dispatch(getUserFail('User is not found'));
    } catch (error) {
        dispatch(getUserFail(error));
    }
}