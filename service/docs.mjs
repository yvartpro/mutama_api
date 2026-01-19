export const docsHtml = (endpoints, appUrl) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mutama API Documentation</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: #6366f1;
            --bg: #0f172a;
            --card-bg: #1e293b;
            --text-main: #f8fafc;
            --text-dim: #94a3b8;
            --get: #10b981;
            --post: #3b82f6;
            --put: #f59e0b;
            --delete: #ef4444;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Inter', sans-serif;
            background-color: var(--bg);
            color: var(--text-main);
            line-height: 1.6;
            padding: 2rem;
        }

        .container {
            max-width: 1000px;
            margin: 0 auto;
        }

        header {
            margin-bottom: 3rem;
            text-align: center;
        }

        h1 {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
            background: linear-gradient(to right, #818cf8, #c084fc);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .subtitle {
            color: var(--text-dim);
            font-size: 1.1rem;
        }

        .section {
            background: var(--card-bg);
            border-radius: 1rem;
            padding: 1.5rem;
            margin-bottom: 2rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .section-title {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 1.5rem;
            color: #818cf8;
            text-transform: capitalize;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .endpoint {
            background: rgba(15, 23, 42, 0.5);
            border-radius: 0.5rem;
            padding: 1rem;
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 1rem;
            transition: transform 0.2s, background 0.2s;
            border: 1px solid rgba(255, 255, 255, 0.03);
        }

        .endpoint:hover {
            transform: translateX(4px);
            background: rgba(15, 23, 42, 0.8);
        }

        .method {
            padding: 0.25rem 0.75rem;
            border-radius: 0.375rem;
            font-size: 0.75rem;
            font-weight: 700;
            min-width: 70px;
            text-align: center;
            color: white;
        }

        .method.GET { background-color: var(--get); }
        .method.POST { background-color: var(--post); }
        .method.PATCH { background-color: var(--put); }
        .method.DELETE { background-color: var(--delete); }

        .path {
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            color: #e2e8f0;
            font-size: 0.9rem;
            flex-grow: 1;
        }

        .desc {
            color: var(--text-dim);
            font-size: 0.85rem;
            max-width: 300px;
            text-align: right;
        }

        .dashboard-card {
            background: linear-gradient(135deg, var(--card-bg), #2d3748);
            border-radius: 1rem;
            padding: 2rem;
            margin-bottom: 3rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border: 1px solid rgba(129, 140, 248, 0.2);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2);
        }

        .dashboard-info h2 {
            font-size: 1.25rem;
            margin-bottom: 0.25rem;
            color: #818cf8;
        }

        .dashboard-info p {
            color: var(--text-dim);
            font-size: 0.9rem;
        }

        .dashboard-link {
            background: var(--primary);
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            text-decoration: none;
            font-weight: 600;
            font-size: 0.9rem;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .dashboard-link:hover {
            background: #4f46e5;
            transform: translateY(-2px);
            box-shadow: 0 4px 6px -1px rgba(99, 102, 241, 0.4);
        }

        a.path {
            text-decoration: none;
        }
        
        a.path:hover {
            text-decoration: underline;
        }

        @media (max-width: 768px) {
            .endpoint {
                flex-direction: column;
                align-items: flex-start;
                gap: 0.5rem;
            }
            .desc {
                text-align: left;
                max-width: none;
            }
            .dashboard-card {
                flex-direction: column;
                text-align: center;
                gap: 1.5rem;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>Mutama API</h1>
            <p class="subtitle">Official Documentation & Reference</p>
        </header>

        <main>
            <div class="dashboard-card">
                <div class="dashboard-info">
                    <h2>Management Dashboard</h2>
                    <p>Access the administrative interface to manage your data</p>
                </div>
                <a href="${appUrl}" class="dashboard-link">
                    Open Dashboard
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                </a>
            </div>
            ${Object.entries(endpoints).map(([name, group]) => `
                <div class="section">
                    <h2 class="section-title">${name}s</h2>
                    ${group.map(e => `
                        <div class="endpoint">
                            <span class="method ${e.method}">${e.method}</span>
                            <a href="${appUrl}/${e.path}" class="path">/${e.path}</a>
                            <span class="desc">${e.description}</span>
                        </div>
                    `).join('')}
                </div>
            `).join('')}
        </main>

        <footer style="text-align: center; margin-top: 4rem; color: var(--text-dim); font-size: 0.8rem;">
            &copy; ${new Date().getFullYear()} Mutama. All rights reserved.
        </footer>
    </div>
</body>
</html>
  `
}