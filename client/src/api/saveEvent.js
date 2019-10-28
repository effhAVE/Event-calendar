import axios from "axios";
import apiURL from "../config/apiURL";
import mapEvents from "../helpers/mapEvents";

const url = apiURL();

export default function(userId, newEvent) {
    return axios.post(`${url}/api/users/${userId}/events/`, newEvent).then((res) => mapEvents([res.data]));
}