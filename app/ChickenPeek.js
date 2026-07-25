'use client';

import {APP_BASE_PATH} from "@/app/config";

export default function ChickenPeek() {
    return (
        <div
            className="chicken-peek"
            aria-hidden="true"
        >
            <img
                src={`${APP_BASE_PATH}/media/peeks/chicken.png`}
                alt=""
                width={928}
                height={1485}
            />
        </div>
    );
}
