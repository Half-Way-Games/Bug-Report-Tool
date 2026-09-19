import mariadb from 'mariadb';

export function createDb(cfg) {
    const pool = mariadb.createPool({
        host: cfg.host,
        port: cfg.port ? Number(cfg.port) : 3306,
        user: cfg.user,
        password: cfg.password,
        database: cfg.database,
        connectionLimit: 10
    });
    
    return {
        async listReports({limit, offset}) {
            return await pool.query(
                `SELECT id, received_at, build_version, platform, summary, reporter_note
                FROM bug_reports
                ORDER BY received_at DESC
                LIMIT ? OFFSET ?`,
                [limit, offset]
            );
        },
        
        async getReportById(id) {
            const rows = await pool.query(
                `SELECT * FROM bug_reports
                WHERE id = ?
                LIMIT 1`,
                [id]
            );
            const report = rows[0] ?? null;
            if (report && typeof report.raw_payload === 'string') {
                try {
                    report.raw_payload = JSON.parse(report.raw_payload);
                } catch (e) {
                    console.error('Failed to parse raw_payload', e);
                }
            }
            if (report && typeof report.hardware_stats === 'string') {
                try {
                    report.hardware_stats = JSON.parse(report.hardware_stats);
                } catch (e) {
                    console.error('Failed to parse hardware_stats', e);
                }
            }
            return report;
        }
    };
}