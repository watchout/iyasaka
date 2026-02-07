# Plane API制限についての調査結果

## 🔍 調査結果

### 環境
- **Plane版**: Community Edition v1.0.0
- **URL**: https://plane.arrowsworks.com
- **API Key**: （秘匿）環境変数 `PLANE_API_KEY` を使用

### 成功したエンドポイント
- ✅ `/api/v1/users/me/` - ユーザー情報取得
- ✅ `/api/instances/` - インスタンス情報取得

### 失敗したエンドポイント（すべて401/404）
- ❌ `/api/workspaces/`
- ❌ `/api/v1/workspaces/`
- ❌ `/api/users/me/workspaces/`
- ❌ `/api/v1/users/me/workspaces/`
- ❌ `/api/workspaces/{slug}/projects/`

### 試したすべての認証方式（すべて失敗）
- `X-API-Key: {token}`
- `x-api-key: {token}`
- `Authorization: Bearer {token}`
- `Authorization: Token {token}`
- `Authorization: Api-Key {token}`
- `Authorization: ApiKey {token}`
- `Api-Key: {token}`

## 🎯 原因分析

### 可能性1: Community Edition API制限
Plane Community Editionでは、セキュリティ/ライセンス上の理由で、ワークスペース/プロジェクトAPIへのアクセスが制限されている可能性があります。

### 可能性2: APIトークン権限不足
生成したAPIトークンに、ワークスペース/プロジェクトへのアクセス権限が付与されていない可能性があります。

### 可能性3: API機能が無効化
Planeインスタンスの設定で、外部API機能が無効化されている可能性があります。

## 💡 解決策

### 解決策A: Playwright/Selenium自動化（推奨）

**メリット**:
- API制限を回避
- UI操作を完全自動化
- 確実にプロジェクト作成可能

**実装**:
```bash
npm install playwright
node scripts/plane-ui-automation.js
```

### 解決策B: Plane Pro/Enterprise版へアップグレード

ProおよびEnterprise版では、完全なAPI機能が提供されます。

### 解決策C: Plane GitHub APIを直接確認

Plane GitHubリポジトリのソースコードから、Community EditionのAPI制限を確認し、回避方法を探す。

## 🚀 次のアクション

**Playwright自動化スクリプトを実装**し、ブラウザ自動化でPlane連携を実現します。

---

**作成日**: 2025-10-22
**調査者**: Cursor AI Assistant



