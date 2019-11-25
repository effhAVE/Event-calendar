import axios from "axios";
import apiURL from "../../config/apiURL";
import mapEvents from "../../helpers/mapEvents";

const url = apiURL();

export default function(userId, eventId, editedEvent) {
    return axios.put(`${url}/api/users/${userId}/events/${eventId}`, editedEvent).then(res => mapEvents([res.data]));
}