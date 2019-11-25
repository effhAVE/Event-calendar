import axios from "axios";
import apiURL from "../../config/apiURL";

const url = apiURL();

export default function(userId, eventId) {
    return axios.delete(`${url}/api/users/${userId}/events/${eventId}`).then(res => res.data);
}