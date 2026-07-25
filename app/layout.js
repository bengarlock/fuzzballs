import {Inter} from "next/font/google";
import "./globals.css";

const inter = Inter({subsets: ["latin"]});

// Clean production rebuilds replace hashed assets, so page HTML must not outlive a deployment.
export const dynamic = "force-dynamic";

export const metadata = {
    title: "Featherballs",
    description: "Get your daily dose of feathers.",
    icons: {
        icon: "/featherballs/favicon.ico",
        apple: [
            {
                url: "/featherballs/apple-touch-icon.png",
                sizes: "180x180",
                type: "image/png",
            },
        ],
    },
};

export default function RootLayout({children}) {
    return (
        <html lang="en">
        <body className={inter.className}>

        {children}

        </body>
        </html>
    );
}
