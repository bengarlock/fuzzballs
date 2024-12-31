import {passwords} from "@/passwords";


const Authorize = async () => {

    const payload =
        {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "username": passwords.username,
                "password": passwords.password,
            })

        }


    const response = await fetch("https://bengarlock.com/api/v1/login/", payload)
    const tokenData = await response.json()
    return tokenData.token

}

export default Authorize


