import React from 'react';
import Layout from './layout.jsx';


export default function BugsIndex({Bugs}) {
    return (
        <Layout title="Bug Reports">
            <h1>Bug Reports</h1>
            <div className={"overflow-auto container-fluid"}>
                <table className={"striped"}>
                    <thead>
                    <tr>
                        <th scope={"col"}>ID</th>
                        <th scope={"col"}>Received At</th>
                        <th scope={"col"}>Build Version</th>
                        <th scope={"col"}>Platform</th>
                        <th scope={"col"}>Summary</th>
                        <th scope={"col"}>Reporter Note</th>
                    </tr>
                    </thead>
                    <tbody>
                    {Bugs.map(bug => (
                        <tr key={bug.id}>
                            <td><a href={`/bugs/${bug.id}`}>{bug.id}</a> </td>
                            <td>{bug.received_at.toLocaleString()}</td>
                            <td>{bug.build_version}</td>
                            <td>{bug.platform || "(unknown)"}</td>
                            <td>{bug.summary.slice(0, 139).trimEnd() + '...' || "(no summary yet)"}</td>
                            <td>{bug.reporter_note}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
}