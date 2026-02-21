# Trailboard (Codex Sandbox)

これは **Codex を“自律”させてアプリを完成まで走らせる**ための実験場です。  
チーム開発（VSCode + Copilot）とは切り離し、**AI単体の実行能力／ドキュメント整備／運用の観測**を検証します。
本リポジトリは **実証実験・学習用** であり、本番用途を前提としません。

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

Codex向けの正本ルールは `codex/TASKS.md` を参照。

## 公開運用ポリシー（Public Repo）
- このリポジトリは CI/CD 検証のため公開運用（Public）を許容する。
- ソースコード、Issue/PR、Actionsログ、GitHub Pages の公開を前提とする。
- 公開禁止情報（秘密鍵、トークン、個人情報、社内限定情報）はコミットしない。
- 実験的な変更を含むため、安定性より観測可能性と検証速度を優先する。

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

## 責務分担（Responsibilities）
### Codex が担当すること（境界：build まで）
1. 人間が Issue で目的・受け入れ条件・範囲を定義する
2. Codex がブランチ（`codex/<issue-number>-<short-slug>`）を作成して実装する
3. Codex が `npm run build` で検証し、成功する状態まで整える
4. Git操作（add / commit / push / PR作成）は行わない
 - #### 理由：Codex 実行コンテキストでは DNS / GitHub API まわりが不安定になり得るため、外界接続を切り離す

### 人間が担当すること（境界：外界接続)
1. 変更差分を目視し、意図をコミットメッセージとして確定する
2. GitHub へ push し、PR を作成する（UI で実施）
3. PR のレビュー・マージ
4. マージ後のブランチ cleanup（既定の運用に従う）

## CI / GitHub Pages メモ
- CI は GitHub Actions（`.github/workflows/ci.yml`）で実行
- トリガーは `pull_request` と `main` への `push`
- CI ジョブでは `npm ci` → `npm run build` → `npm run lint` を実施
- GitHub Pages へのデプロイは `.github/workflows/cd.yml` で実行（`main` push / 手動実行）
- GitHub Pages の配信設定は Repository Settings > Pages で `Source: GitHub Actions` を使用

## Codex 起動時の定型プロンプト（コピー用）

```text
Follow codex/TASKS.md strictly.
Follow codex/CONTRIBUTING.md strictly.

Work in a new branch.
Keep changes minimal and within the Issue scope.

Run npm run build before opening a PR.
Open a PR using the provided template with clear verification steps.

If any requirement is unclear, ask before making assumptions.
```

## 運用フロー（Issue → PR → Merge）
1. Issue 作成
 - GitHub で Issue を作成（テンプレに従う）
2. Codex 実行（ローカル / WSL）
 - Codex を起動し、Issue を渡して実装を依頼
 - Codex は実装後、npm run build を通して完了
 - #### この時点で Codex 作業は終了（Git操作はしない）
3. 人間：コミット＆push（1コマンド）
Codex の作業完了後、以下を実行する：
```bash
./scripts/publish_commit.sh
```
このスクリプトは以下を実施します：
 - git status 表示（add前）
 - git add -A
 - git status 表示（add後）
 - commit message 入力（空Enterの場合はデフォルトメッセージを採用）
 - git push -u origin HEAD
 #### ※ git push -u origin HEAD はブランチ作成だけでなく、その時点の commit をリモートに push し、upstream（追跡ブランチ）設定も行います。
 4. 人間：PR 作成（GitHub UI）
 - GitHub 上で「Compare & pull request」から PR を作成
 - PR テンプレに沿って記載（概要 / 変更内容 / 検証方法 / スコープ / スコープ外 など）
5. レビュー → マージ
 - 人間がレビューし、問題なければマージ
6. cleanup
 - 既定の手順に従い、ローカルでブランチ cleanup を実施
```cmd
git cleanup
```
### scripts/publish_commit.sh の準備
実行権限を付与して使用します：
```bash
chmod +x scripts/publish_commit.sh
```
## 重要な方針（Why this design）
 - Vibe Coding は実行環境（WSL / DNS / 認証 / ネットワーク）に強く依存する
 - 「AIができること」と「任せない方がよい境界」がある
 - 完全自動化に固執せず、不安定な外界接続を人間側に寄せ、手動部分は1コマンドに圧縮する
