(async function showRecentRepos() {
    const username = "kalebtaylor3";
    const container = document.getElementById("repo-grid");
    if (!container) return;
    container.innerHTML = "<p>Loading recent repositories…</p>";

    try {
        // Most recently updated public repos
        const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=8`);
        if (!res.ok) throw new Error("GitHub API rate-limited or unavailable");
        const repos = (await res.json())
            .filter(r => !r.fork) // hide forks
            .sort((a, b) => (b.description ? 1 : 0) - (a.description ? 1 : 0));

        if (!repos.length) {
            container.innerHTML = "<p>No public repositories found.</p>";
            return;
        }

        container.innerHTML = repos.map(repo => {
            const updated = new Date(repo.updated_at).toLocaleDateString();
            const lang = repo.language ? `<span>?? ${repo.language}</span>` : "";
            const stars = repo.stargazers_count ? `<span>? ${repo.stargazers_count}</span>` : "";
            const forks = repo.forks_count ? `<span>?? ${repo.forks_count}</span>` : "";
            const desc = (repo.description || "No description yet.")
                .replace(/</g, "&lt;").replace(/>/g, "&gt;");

            return `
              <article class="repo-card">
                <h3><a href="${repo.html_url}" target="_blank" rel="noopener">${repo.name}</a></h3>
                <p>${desc}</p>
                <div class="repo-meta">
                  ${lang} ${stars} ${forks} <span>? Updated ${updated}</span>
                </div>
              </article>
            `;
        }).join("");
    } catch (err) {
        container.innerHTML = `<p>Couldn’t load repos right now (likely API rate limit). Please refresh later.</p>`;
        console.error(err);
    }
})();