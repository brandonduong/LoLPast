import axios from "axios";

export default axios.create({
    baseURL: "https://ac5m3794xl.execute-api.us-east-1.amazonaws.com/beta",
    headers: {
        "Content-type": "application/json"
    }
});
