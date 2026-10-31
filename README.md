# Sprint CI/CD — live GitHub Actions demo

A small Node.js project designed to generate REAL GitHub Actions pipeline runs, passing and failing tests, job logs, downloadable build artifacts, cancellation, reruns, and a REAL public GitHub Pages deployment. It does not require a cloud account or credentials.

## Get started

1. Create a NEW **public** GitHub repository, e.g. `sprint-cicd-demo`. Do NOT use production credentials.
2. Upload the demo files, keeping `.github/workflows/ci.yml` and `.github/workflows/deploy-pages.yml` in their correct folders. **Easiest option with Git installed:** extract this archive, then from inside its folder run:

   ```bash
   git init
   git add .
   git commit -m "Add Sprint CI CD demo"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/sprint-cicd-demo.git
   git push -u origin main
   ```

3. In GitHub repo **Settings → Pages → Build and deployment → Source**, select **GitHub Actions**.
4. Open **Actions**. You should see **Demo CI - Build and Test** and **Demo CD - Deploy to GitHub Pages**. If the first deployment happened before enabling Pages, re-run its workflow from Actions.
5. When deployment succeeds, visit `https://YOUR_USERNAME.github.io/sprint-cicd-demo/`. This is a REAL deployed website.
6. Ensure the Sprint GitHub App installation includes this NEW repository. If you chose “Only select repositories”, add it under GitHub's installed app configuration. In Sprint: Organization Integrations → Synchronize → allocate workspace → Project CI/CD → link repo.
7. Open **Project → CI/CD → Pipelines**. Sprint's backend worker must be running and GitHub Actions read permissions available; webhook and/or polling updates may not be instantaneous.
8. **To see GitHub Pages deployment history inside Sprint**, go to **Project Settings → CI/CD → Deployment environments** and add an environment for the linked demo repo: **Environment name:** `github-pages` (exactly); **Environment type:** `Production`; **Provider environment ID:** retrieve the real GitHub environment ID from `https://api.github.com/repos/YOUR_USERNAME/sprint-cicd-demo/environments` after the first deployment. Sprint's worker matches native deployment records to this setting by exact environment **name**. Ensure your GitHub App is granted **Deployments: read**, otherwise the deployment may not be synchronized.

## Test matrix

| Test | Generate activity in GitHub | Expected in Sprint |
| --- | --- | --- |
| Green automatic CI | Push a commit to `main` | Successful CI run and jobs |
| Pull-request CI | Open a PR from a feature branch | Pull-request workflow run |
| Red pipeline | Actions → Demo CI → Run workflow → scenario `fail` | Failed test job, red pipeline, log excerpt |
| Slow pipeline & cancel | Actions → Demo CI → Run workflow → scenario `slow` | In-progress run then cancelled (cancel on GitHub, or Sprint if supported/approved) |
| Build artifact | Open successful Demo CI run | `demo-build-*` zip downloadable (Sprint's limit: 16 MiB) |
| Real Pages deployment | Push `main` or manually run Demo CD | Deployment in GitHub; add `github-pages` environment mapping in Sprint before expecting it under Project Deployments |
| Rerun | Rerun a finished run on GitHub | New run attempt/status; Sprint rerun action only if supported/approved |
| Error recovery | Fail then run default `pass` | Success visible after failure |
| Deployment approval gate | GitHub Settings → Environments → `github-pages` → add required reviewer (public repo; account/plan rules apply) | Deployment waits for GitHub approval; Sprint records what provider exposes |

For a code-change failure (instead of the `fail` input), change `siteTitle` in `src/config.mjs` from `Sprint CI/CD Demo` to `Broken CI Demo`, then push. Both workflows will fail tests; restore the title and push to recover.

## Important Sprint limitations

- **Monitoring**: linked repository history/jobs are synced automatically by the Sprint CI/CD worker. A workflow mapping is **not** needed just to view GitHub Actions runs.
- **Manual CI from Sprint**: choose **Demo CI - Build and Test**, its numeric GitHub workflow ID from `GET /repos/USER/sprint-cicd-demo/actions/workflows`, allowed branch `main`, purpose **Build**, then complete independent operator review. Until approval the manual action is disabled. The Sprint GitHub adapter dispatches without custom workflow inputs, so the default `pass` scenario runs.
- **Deployment**: do **not** map Demo CD as an approved Build/Test workflow. Its deployment job uses an environment and your Sprint backend explicitly rejects deployment workflows from build/test approval. Deploy from GitHub Actions; Sprint can *monitor* supported deployments but cannot natively approve, execute, or roll back production releases.
- **Provider capability**: your GitHub App needs Actions read for history, Actions write for manual build controls, Deployments read for deployment history; Sync/worker health also matter.
- **Reviewers**: GitHub environment-required-reviewer availability depends on repo visibility/plan. On common GitHub Free/Pro/Team plans, required reviewers are supported for public repositories.
- Demo Actions use version tags for ease of reading. For hardened production systems, pin third-party actions to reviewed commit SHAs.
- Artifacts/logs may be truncated/limited in Sprint; this is not a defect in this repository.

## Local test

```bash
npm ci
npm test
npm run build
```

Output: `dist/index.html`. No tokens, cloud credentials, paid runners, or deployment secrets are required; GitHub's own usage limits may apply.
