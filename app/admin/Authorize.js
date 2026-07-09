const APP_BASE_PATH = process.env.NEXT_PUBLIC_FUZZBALLS_BASE_PATH || '/fuzzballs';

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
