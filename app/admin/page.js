'use client'
import {globalStore} from "@/app/globalstore";

const Admin = () => {

    const {incognito, setIncognito, incognitoJob} = globalStore()

    const handleToggle = () => {
        const headers = {
            "Accept": "application/json",
            "content-type": "application/json",
            "Authentication": "Token 6353cfac49f1326f099adea4d7a85fe484436c76"
        }

        console.log(incognitoJob)

        setIncognito(!incognito);
    };

    const toggleSwitch = () => {
        const switchInput = document.getElementById('switch');
        const switchTrack = document.getElementById('switch-track');
        const switchCircle = document.getElementById('switch-circle');

        if (switchInput.checked) {
            switchTrack.classList.replace('bg-gray-300', 'bg-green-500');
            switchCircle.classList.replace('left-1', 'left-7');
        } else {
            switchTrack.classList.replace('bg-green-500', 'bg-gray-300');
            switchCircle.classList.replace('left-7', 'left-1');
        }
    }

    return (

        <div className="flex flex-col items-center bg-gray-800 p-8 min-h-screen w-full">
            <h1>ADMIN</h1>
            <h2 className="text-xl font-semibold mb-4">Incognito Mode</h2>
            <label className="inline-flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    className="hidden"
                    checked={incognito}
                    onChange={handleToggle}
                />

                <div className="relative">
                    <div
                        className={`w-14 h-8 rounded-full shadow-inner transition-colors ${
                            incognito ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                    ></div>
                    <div
                        className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                            incognito ? 'transform translate-x-7' : 'transform translate-x-0'
                        }`}
                    ></div>
                </div>
            </label>
        </div>
    )
}

export default Admin