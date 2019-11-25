import axios from "axios";
import apiURL from "../../config/apiURL";

const url = apiURL();

export default function(lang) {
    return axios.put(`${url}/api/users/me/settings/lang`, lang);
}