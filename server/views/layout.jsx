import React from 'react';

export default function Layout({ title, children }) {
    return (
        
    <html lang={"en"} data-theme="dark">
    <head>
        <meta charSet="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <meta name="color-scheme" content="light dark"/>
        <title>{title}</title>

        {/* Pico CSS */}
        <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/@picocss/pico@2.1.1/css/pico.pumpkin.css"
            />
        
        </head>
        <body>
        <main className="container">
            {children}
        </main>
        </body>
        </html>
    );
}