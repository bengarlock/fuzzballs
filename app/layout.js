import {Inter} from "next/font/google";
import "./globals.css";

const inter = Inter({subsets: ["latin"]});

// Clean production rebuilds replace hashed assets, so page HTML must not outlive a deployment.
export const dynamic = "force-dynamic";

export const metadata = {
    title: "Featherballs",
    description: "Get your daily dose of feathers.",
    manifest: "/featherballs/site.webmanifest",
    appleWebApp: {
        capable: true,
        title: "Featherballs",
        statusBarStyle: "default",
    },
    icons: {
        icon: [
            {
                url: "/featherballs/favicon.ico",
                sizes: "any",
            },
            {
                url: "/featherballs/favicon-32x32.png",
                sizes: "32x32",
                type: "image/png",
            },
            {
                url: "/featherballs/favicon-16x16.png",
                sizes: "16x16",
                type: "image/png",
            },
        ],
        shortcut: "/featherballs/favicon.ico",
        apple: [
            {
                url: "/featherballs/apple-touch-icon.png",
                sizes: "180x180",
                type: "image/png",
            },
        ],
        other: [
            {
                rel: "apple-touch-icon-precomposed",
                url: "/featherballs/apple-touch-icon-precomposed.png",
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
