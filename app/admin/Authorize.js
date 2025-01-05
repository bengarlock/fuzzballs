import {passwords} from "@/passwords";
import Cookies from "js-cookie";

const Authorize = async () => {

    const payload = {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': Cookies.get('csrftoken')
        },
        body: JSON.stringify({
            username: passwords.username,
            password: passwords.password,
        }),
    };

    try {
        const response = await fetch("https://bengarlock.com/api/v1/login/", payload);
        const tokenData = await response.json();

        if (tokenData.token) {
            return `Token ${tokenData.token}`
        } else {
            throw new Error("Authorization failed: No token received");
        }
    } catch (err) {
        console.error("Authorization error:", err);
        setError(err.message);
        return false;
    }
};

export default Authorize;
