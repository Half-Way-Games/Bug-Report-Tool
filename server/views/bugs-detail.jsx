import React from 'react';
import Layout from './layout.jsx';
import Markdown from "react-markdown";

function CollapsibleCard({title, children, defaultOpen = false,}) {
    return (
        <article>
            <header><strong>{title}</strong></header>
            <details open={defaultOpen}>
                <summary>View Details</summary>
                {children}
            </details>
        </article>
    );
}

function RenderValue(value) {
    if (value === null || value === undefined) 
        return String(value);
    
    // Arrays: list each element
    if (Array.isArray(value)){
        return (
            <ol>
                {value.map((item, idx) => (
                    <li key={idx}>{RenderValue(item)}</li>
                ))}
            </ol>
        );
    }
    
    // Plain object: list key -> value
    if (typeof value === 'object'){
        return (
            <ul>
                {Object.entries(value).map(([key, val]) => (
                    <li key={key}>
                        <strong>{key}:</strong> {RenderValue(val)}
                    </li>
                ))}
            </ul>
        );
    }
    
    // Primitive values
    return String(value);
}

export default function BugsDetail({Bug}) {
    const payload = Bug.raw_payload || {};
    const {
        data = {}
    } = payload;

    return (
        <Layout title={`Bug Report ${Bug.id}`}>
            <nav>
                <ul>
                    <li>
                        <h1 style={{color: '#029AE8'}}>Report ID #{Bug.id}</h1>
                    </li>
                </ul>
                <ul>
                    <li><a href="/bugs/"><button className={"outline"}>Back to All Reports</button></a></li>
                </ul>
            </nav>

            {Bug.screenshot_path && (
                <section>
                    <h3>Screenshot</h3>
                    <details>
                        <summary style={{listStyle: 'none'}}>
                            {/* 150 px-wide thumbnail */}
                            <img
                                src={`/bugs/screenshots/${Bug.screenshot_path}`}
                                width="150"
                                height="auto"
                                loading="lazy"
                                decoding="async"
                                alt="Screenshot thumbnail"
                                style={{display: 'block'}}
                            />
                        </summary>

                        {/* Full-size image appears once <details> is open */}
                        <img
                            src={`/bugs/screenshots/${Bug.screenshot_path}`}
                            style={{maxWidth: '100%', height: 'auto', marginTop: '1rem'}}
                            height="auto"
                            alt="Screenshot full size"
                            loading="lazy"
                            decoding="async"
                        />
                    </details>
                </section>
            )}
            <hr/>
            
            <div className="grid">
                <section>
                    <h3>Meta</h3>
                    <p>
                        <strong>Received:</strong> {Bug.received_at.toLocaleString()}<br/>
                        <strong>Build:</strong> {Bug.build_version}<br/>
                        <strong>Platform:</strong> {Bug.platform || "(unknown)"}<br/>
                    </p>
                </section>
                {Bug.hardware_stats && (
                    <section>
                        <h3>Hardware</h3>
                        <p>
                            <strong>CPU:</strong> {Bug.hardware_stats.cpu} <br/>
                            <strong>GPU:</strong> {Bug.hardware_stats.gpu} <br/>
                            <strong>RAM:</strong> {Bug.hardware_stats.ram.free.toFixed(2)} GB free of {Bug.hardware_stats.ram.total.toFixed(2)} GB <br/>
                            <strong>Display:</strong> {Bug.hardware_stats.display.size || "(unknown)"} @ {Bug.hardware_stats.display.refresh.toFixed(2) || "(unknown)"}Hz<br/>
                        </p>
                    </section>
                )}
            </div>
            <hr/>
            
            <section>
                <h2>Summary</h2>
                <p><Markdown>{Bug.summary || "(no summary provided)"}</Markdown></p>
                {Bug.reporter_note && (
                    <blockquote>
                        <strong>Reporter Note:</strong><br/>
                        {Bug.reporter_note}
                    </blockquote>
                )}
            </section>
            
            <div className={"grid"} style={{gridTemplateColumns: 'repeat(auto-fit, minmax(17rem, 1fr))'}}>
                {Object.entries(data).map(([key, val]) => {
                    return (
                        <section key={key}>
                            <CollapsibleCard title={key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}>
                                {RenderValue(val)}
                            </CollapsibleCard>
                        </section>
                    )
                })}
            </div>
            
            <section>
                <details>
                    <summary><strong>Raw JSON Payload</strong></summary>
                    <pre>
                        {JSON.stringify(Bug.raw_payload, null, 2)}
                    </pre>
                </details>
            </section>
        </Layout>
    );
}