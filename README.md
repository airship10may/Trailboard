# Trailboard (Codex Sandbox)

これは **Codex を“自律”させてアプリを完成まで走らせる**ための実験場です。  
チーム開発（VSCode + Copilot）とは切り離し、**AI単体の実行能力／ドキュメント整備／運用の観測**を検証します。

## 目的（Observability）
このリポジトリの価値は「綺麗なコード」より **観測可能性**にあります。

- いま何をしているか（進捗が追える）
- 何を意図して変更したか（設計意図が追える）
- どう検証したか（再現可能）
- どこが未完か（残課題が明示される）

→ そのため、Issue / PR / Actions のログを“真実”として残します。

## ルール（人間向け）
- 作業は **Issue → PR** の単位で行う（1 Issue = 1 PR）
- 変更の最小単位で積み上げる（大きくやりすぎない）
- 依存追加・構造変更は必ず明記し、理由を書く
- PRに「確認手順（How to verify）」を必ず残す

Codex向けの正本ルールは `TASKS.md` を参照。

## 開発
### セットアップ
- Node 18+ 推奨（20でもOK）
- npm を使用（yarn/pnpmは使わない）

```bash
npm i
npm run dev
```

### ビルド確認

```bash
npm run build
```

## WSL でのセットアップ（Windows想定）
- 推奨環境は WSL2（Ubuntu） + Node.js 18+（20でもOK）
- パッケージマネージャーは npm を使用（yarn/pnpmは使わない）
- 作業開始時はリポジトリ直下で `npm i` を実行

## Codex CLI 自律ワークフロー（運用補足）
1. 人間が Issue で目的・受け入れ条件・範囲を定義する
2. Codex がブランチ（`codex/<issue-number>-<short-slug>`）を作成して実装する
3. Codex が `npm run build` で検証し、PRテンプレートを埋めてPRを作成する
4. 人間はオブザーバー／レビュアーとして差分と検証手順を確認し、承認または修正依頼を行う

## CI / GitHub Pages メモ
- CI は GitHub Actions（`.github/workflows/ci.yml`）で実行
- トリガーは `pull_request` と `main` への `push`
- CI ジョブでは `npm ci` → `npm run build` → `npm run lint` を実施
- 現在、このリポジトリには GitHub Pages へのデプロイ用 workflow は未定義

## Codex 起動時の定型プロンプト（コピー用）

```text
Follow TASKS.md strictly.
Follow CONTRIBUTING.md strictly.

Work in a new branch.
Keep changes minimal and within the Issue scope.

Run npm run build before opening a PR.
Open a PR using the provided template with clear verification steps.

If any requirement is unclear, ask before making assumptions.
```

## WSL (Ubuntu) に GitHub CLI (`gh`) を導入する

```bash
type -p curl >/dev/null || sudo apt install curl -y
sudo mkdir -p -m 755 /etc/apt/keyrings
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg \
  | sudo tee /etc/apt/keyrings/githubcli-archive-keyring.gpg >/dev/null
sudo chmod go+r /etc/apt/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" \
  | sudo tee /etc/apt/sources.list.d/github-cli.list >/dev/null
sudo apt update
sudo apt install gh -y
gh --version
```

`gh` を使用する前に、以下のコマンドで認証状態を確認する。

```bash
gh auth status
```
