# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

Web Speed Hackathon 2024 Cyber TOONは、架空の漫画サイト「Cyber TOON」のパフォーマンス最適化競技用プロジェクトです。Lighthouseを使用して採点されます。

## パフォーマンス最適化の現状

### 実装済み高度な最適化機能
- **画像フォーマット変換**: JpegXL、AVIF、WebP変換機能完備（`src/image-converters/`）
- **Service Worker**: JpegXL→BMP変換でブラウザ互換性確保
- **Zstd圧縮**: 高効率圧縮アルゴリズムでネットワーク最適化
- **React Server Components**: SSR最適化実装済み
- **バンドル分離**: client/admin/serviceworker個別最適化

### 最適化の余地がある項目
- **フォントプリロード**: 現在9個すべてのNoto Sans JPをプリロード中
  - 対象: `workspaces/server/index.html` 13-21行目
  - 改善案: Regular（400）とBold（700）のみに削減
- **画像プリロード制御**: preloadImages()関数は実装済みだが呼び出されていない
  - 位置: `workspaces/client/src/utils/preloadImages.ts`
  - 現状: PATH_LIST環境変数で制御可能だが、メインから未呼び出し

## 技術スタック

- **フロントエンド**: React 18.2.0 + TypeScript 5.4.2
- **状態管理**: Jotai 2.7.0（app）、TanStack Query 5.18.1（admin）、TanStack Router 1.15.19（admin）
- **スタイリング**: styled-components 6.1.1（app）、Chakra UI 2.8.2 + Emotion（admin）、MUI 5.15.4（app）
- **バックエンド**: Hono 4.1.0 + @hono/node-server 1.8.2
- **データベース**: SQLite + Drizzle ORM 0.29.3 + better-sqlite3 9.3.0
- **画像処理**: Sharp 0.33.2、image-js 0.35.5、@jsquash/jxl 1.1.0
- **認証・セキュリティ**: bcryptjs 2.4.3
- **バンドラー**: tsup 8.0.1
- **開発・品質ツール**: ESLint 8.56.0（@3846masa/configs）、Prettier 3.1.1
- **テスト**: Playwright 1.42.1（E2E・VRT）
- **パッケージマネージャー**: pnpm 8.15.4（必須）

## ワークスペース構成

```
workspaces/
├── server/        # Honoベースのサーバー（API・SSR・画像配信）
├── client/        # ブラウザエントリーポイント（Service Worker付き）
├── app/           # React ユーザー向けWebアプリ
├── admin/         # React 管理画面（Chakra UI）
├── schema/        # DrizzleORMスキーマとAPIインターフェース
├── image-encrypt/ # 画像難読化ツール
└── testing/       # Playwright E2E・VRTテスト
```

## 主要コマンド

```bash
# ビルド・起動
pnpm run build      # 全体ビルド
pnpm run start      # サーバー起動（:8000）

# リンター・フォーマッター
pnpm run lint       # 全チェック（ESLint・Prettier・TypeScript）
pnpm run format     # 自動修正

# テスト
pnpm run test       # Playwright E2E・VRTテスト
pnpm run test:debug # デバッグモード

# 各ワークスペース個別操作
pnpm --filter server dev     # サーバー開発モード
pnpm --filter app build      # appのみビルド
pnpm --filter admin build    # adminのみビルド

# 画像暗号化・復号化
pnpm run cli encrypt         # 画像暗号化
pnpm run cli decrypt         # 画像復号化

# プロファイリング
./profile.sh                 # バンドルサイズ測定
```

## アクセス情報

- **ユーザーサイト**: http://localhost:8000/
- **管理画面**: http://localhost:8000/admin （administrator@example.com / pa5sW0rd!）
- **API仕様**: http://localhost:8000/api/v1

## アーキテクチャのポイント

### サーバー（workspaces/server/）
- HonoでAPI・SSR・静的ファイル配信を統合
- `src/routes/` でルーティング定義（API・SSR・静的ファイル）
- `src/repositories/` でデータアクセスレイヤー実装
- `src/middlewares/` で認証・キャッシュ・圧縮ミドルウェア
- `src/image-converters/` で画像フォーマット変換（JpegXL、AVIF、WebP等）
- `seeds/` で初期データとSQLiteデータベース、257個の画像ファイル
- SSRは `src/routes/ssr/` で React Server Components

### フロントエンド（workspaces/app/）
- Jotai 2.7.0による状態管理
- styled-components 6.1.1でコンポーネントスタイリング
- `src/features/` で機能別コンポーネント分割（author、book、episode、ranking、release、viewer等）
- `src/foundation/` で共通コンポーネント・スタイル・レイアウト

### 管理画面（workspaces/admin/）
- Chakra UI 2.8.2ベースのデザインシステム
- TanStack Query 5.18.1 + TanStack Router 1.15.19
- `src/features/` で機能別実装（auth、authors、books、episodes、images、release管理）
- 各機能でapiClient、hooks、components構成

### クライアント（workspaces/client/）
- Service Worker実装（JpegXL→BMP変換含む）
- `src/utils/preloadImages.ts`（環境変数PATH_LISTで制御）
- フォントアセット（9種類のNoto Sans JP）
- ブラウザエントリーポイント

### 画像最適化・暗号化（workspaces/image-encrypt/）
- JpegXL、AVIF、WebP対応（各専用コンバーター）
- 漫画ページの暗号化・復号化CLI
- Service WorkerによるJpegXL→BMP変換（ブラウザ互換性）

## パフォーマンス最適化の観点

このプロジェクトでは以下の最適化が重要：

1. **バンドルサイズ削減**: tsupでのTree shaking、Code splitting
2. **画像最適化**: 次世代フォーマット（JpegXL、AVIF）の活用
3. **キャッシュ戦略**: Service Workerによる効果的なキャッシュ
4. **SSR最適化**: React Server Componentsの効果的な活用
5. **Lighthouseスコア**: Performance、Accessibility、Best Practices、SEO

## 開発時の注意点

- パッケージマネージャーは必ずpnpmを使用
- コードの変更時は `pnpm run lint` でチェック必須
- 新機能は各workspaceの責務に応じて適切に配置
- パフォーマンス計測はLighthouseベースで実施

## 採点・評価について

### Lighthouse採点基準（GitHub Actions使用）
- **ページランディング**: 100点満点（4ページ計測）
  - ホームページ、作者詳細、作品詳細、エピソードページ
  - FCP×10 + SI×10 + LCP×25 + TBT×30 + CLS×25
- **ユーザーフロー**: 50点満点（6フロー計測）
  - 検索、ページめくり、利用規約、管理画面ログイン、編集、新規作成
  - TBT×25 + INP×25

### レギュレーション遵守必須
- E2E・VRTテストの通過
- Service Worker登録必須
- 漫画画像の適切な難読化
- 無料サービスの範囲内でのデプロイ
- `POST /api/v1/initialize` でDB初期化対応

## デプロイ・環境構成

### Dockerベース構成
- **ベースイメージ**: node:20.11.1-alpine
- **メモリ制限**: 512MB（docker-compose）
- **jemalloc**: パフォーマンス向上のため有効化
- **ポート**: 8000（環境変数PORT対応）
- **タイムゾーン**: Asia/Tokyo

### 推奨デプロイ先: Koyeb.com（無料）
- 自動デプロイ対応（mainブランチpush時）
- Koyeb環境変数`KOYEB_PUBLIC_DOMAIN`を自動認識
- 外部デプロイも可（無料範囲内）

### 環境変数設定
- `PORT`: サーバーポート（デフォルト: 8000）
- `NODE_ENV`: 実行環境（本番: production）
- `API_URL`: APIエンドポイント（Koyeb自動設定対応）
- `E2E_BASE_URL`: E2Eテスト対象URL

## セキュリティ・パフォーマンス設定

### ミドルウェア構成
1. **認証**: signedCookie + HTTPException（401エラー）
2. **キャッシュ制御**: `Cache-Control: private, no-store`（キャッシュ無効化）
3. **圧縮**: Zstd圧縮対応（@hapi/accept + @oneidentity/zstd-js）
  - Accept-Encoding: zstd対応
  - Content-Encoding: zstd設定
  - no-transformヘッダー付与

### ビルド最適化（tsup）
- **クライアント**: IIFE形式、minify、chrome58対応
- **サーバー**: CJS形式、splitting、node20対応
- **バンドル分離**: client/admin/serviceworkerを個別生成
- **Tree shaking**: サーバーサイドで有効化

## テスト・品質管理

### Playwright E2E・VRT
- **デバイス対応**: Mobile Chrome（Pixel 7）、Desktop Chrome
- **設定**: headless、trace無効、300秒タイムアウト
- **画像比較**: maxDiffPixelRatio 0.03
- **対象**: client（モバイル）、admin（デスクトップ）

### コード品質ツール
- **リンター**: ESLint + @3846masa/configs
- **フォーマッター**: Prettier
- **型チェック**: TypeScript 5.4.2（noEmit）
- **並列実行**: `--parallel`オプション対応

## 画像最適化・暗号化

### 対応フォーマット
- **次世代フォーマット**: JpegXL（.jxl）、AVIF、WebP
- **従来フォーマット**: JPEG、PNG
- **変換ライブラリ**: 各フォーマット専用コンバーター

### 画像難読化
- **CLI提供**: `pnpm run cli encrypt/decrypt`
- **暗号化済み**: seeds/images内画像
- **レギュレーション**: 内容推察不可な難読化必須

## プロファイリング・分析

### バンドルサイズ監視
- `profile.sh`: ビルド後のファイルサイズをMB単位で表示
- 対象ファイル:
  - client.global.js（フロントエンド）
  - admin.global.js（管理画面）
  - serviceworker.global.js（Service Worker）
  - server.js（サーバー）

### パフォーマンス分析ポイント
1. **初期読み込み**: フォント・画像プリロード最適化の余地あり
2. **バンドルサイズ**: tsupによる最適化適用、分離ビルド
3. **ネットワーク**: Zstd圧縮で転送量削減
4. **キャッシュ**: Service Workerによる戦略的キャッシュ
5. **レンダリング**: React Server Components活用
6. **画像最適化**: JpegXL、AVIF、WebP変換機能実装済み
7. **メモリ管理**: jemalloc使用でパフォーマンス向上
