import axios from "axios";
import url from "./js/urlBase";
export default axios.create({
    baseURL: url[0].urlBase + "/",
    headers: {
        "Content-type": "application/json"
    }
});