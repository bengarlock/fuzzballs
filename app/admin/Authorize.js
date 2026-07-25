import {APP_BASE_PATH} from "@/app/config";

const Authorize = async () => {
    try {
        const response = await fetch(`${APP_BASE_PATH}/api/authorize`, {
            method: "POST",
            headers: {Accept: 'application/json'},
        });
        const data = await response.json().catch(() => ({}));

        if (!response.ok || !data.authorized) {
            throw new Error(data.message || "Authorization failed");
        }
        return true;
    } catch (err) {
        console.error("Authorization error:", err);
        return false;
    }
};

export default Authorize;
