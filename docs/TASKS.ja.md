# TASKS（観測用 / 日本語）

このファイルは「人間が観測するための説明」です。  
Codexに守らせる正本は `codex/TASKS.md（英語）` とします。

## 絶対ルール（要点）
- 1 Issue = 1 PR（小さく積む）
- 依存追加・ツール設定変更は、Issueで指示がない限り禁止
- `npm run build` が通る状態を維持
- 最小変更でAC（受け入れ条件）を満たす

## 作業フロー
- Issueを読む
- `codex/<issue番号>-<短いslug>` でブランチを切る
- 変更
- `npm run build` を実行
- PRを作成し、テンプレを埋める

## PRに必ず書くこと（観測点）
- 何をしたか（Summary）
- なぜそれが必要か（Why）
- どう確認するか（How to verify：手順を再現可能に）
- スコープ外（Out of scope）
- リスク・トレードオフ
- 次にやること（Follow-ups）
- 迷っている点（Open Questions：推測実装しない）
