# IYASAKA Web T3〜T5 ソフトローンチ用チェックリスト

T3〜T5（記事⇄LP連携・SEO/AIEO・note運用）を本番投入する前に、
**毎回ここを上からなぞれば10分でGo/No-Go判断ができる**ことを目的としたチェックリストです。

---

## 1. 本番ENV

- [ ] `LEADS_PERSIST` が **未設定** である（開発用の `dummy` のまま出していない）。  
- [ ] `SUPABASE_URL` / `SUPABASE_SERVICE_KEY` が設定されている。  
- [ ] （任意推奨）`SLACK_LEAD_WEBHOOK` が設定されている。

---

## 2. ヘルスチェック

- [ ] `GET /api/health/supabase`  
  - レスポンスが `200 { "ok": true }` になる。

---

## 3. ダウンロードヘッダ

- [ ] 任意のPDFで `X-Robots-Tag` を確認する：

```bash
curl -I https://<host>/iyasaka/downloads/xxx.pdf
```

- [ ] レスポンスヘッダに  
  `X-Robots-Tag: noindex, nofollow, noarchive`  
  が含まれている。

---

## 4. canonical

代表的なページで `<link rel="canonical">` を確認する：

- [ ] 記事ページ（例：`/iyasaka/articles/test-haishin`）  
  - canonical: `https://<host>/iyasaka/articles/test-haishin`
- [ ] 製品LP（例：`/iyasaka/products/haishin-plus`）  
  - canonical: `https://<host>/iyasaka/products/haishin-plus`

---

## 5. sitemap

- [ ] `GET /iyasaka/sitemap.xml` でXMLが返る。  
- [ ] 中身に、少なくとも以下が含まれている：
  - ホーム: `https://<host>/iyasaka`  
  - 全ての製品LP: `/iyasaka/products/...`  
  - 全ての記事: `/iyasaka/articles/...`

---

## 6. ナビゲーション

- [ ] ヘッダー／フッターのナビゲーションに、**未実装ページ** が出ていない：
  - `/pricing` / `/blog` / `/flow` / `/impact` などはリンク非表示 or 完全実装済み。

---

## 7. 記事⇄LP 動線

- [ ] 任意の記事で：
  - 記事末尾の「関連するサービス」カードから対応するLP（`/iyasaka/products/<slug>`）に遷移できる。
- [ ] 任意のLPで：
  - LP下部の「この製品に関する読み物」から、対応する記事（`/iyasaka/articles/...`）に遷移できる。

---

## 8. イベント（Plausible Realtime）

Plausible の Realtime 画面を開き、テスト操作直後に以下イベントが着弾することを確認する：

- [ ] 記事 → 関連サービス → LP  
  - `article_related_product_click`
- [ ] LP → 読み物 → 記事  
  - `product_related_article_click`
- [ ] LP/フォームからの送信  
  - `lead_submit`
- [ ] ダウンロードゲートからのDL  
  - `download_click`

---

## 9. フォームとレートリミット

- [ ] フォームの同意チェック（プライバシー等）をONにしないと送信できない。  
- [ ] 正常送信後、完了UIが表示される（エラー画面に飛ばない）。  
- [ ] 同一IPから短時間で2回送信した場合：
  - 1回目: HTTP 200  
  - 2回目: HTTP 429（Too Many Requests）

---

## 10. 開発ポート運用（dev環境向け）

開発サーバを動かす場合のみ確認：

- [ ] Nuxt dev サーバはポート **4100固定**（`npm run dev -p 4100`）。  
- [ ] `lsof -iTCP:4100 -sTCP:LISTEN -P -n` で **二重起動していない** ことを確認。






