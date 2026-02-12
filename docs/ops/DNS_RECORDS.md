# iyasaka.co DNS設定（VALUE-DOMAIN）

ドメイン: `iyasaka.co`
レジストラ: VALUE-DOMAIN
ネームサーバー: `ns1.value-domain.com` / `ns2.value-domain.com`
VPS IP: `160.251.209.16`（ConoHa）

## VALUE-DOMAIN 設定画面

コントロールパネル > ドメイン > iyasaka.co > DNS/URL

VALUE-DOMAIN の DNS設定欄には以下をそのまま貼り付ける。

```
a @ 160.251.209.16
a www 160.251.209.16
mx @ 10
txt @ v=spf1 +a +mx ~all
txt _dmarc v=DMARC1; p=quarantine; rua=mailto:info@iyasaka.co
```

## レコード解説

### 必須レコード

| 種別 | ホスト | 値 | 用途 |
|------|--------|-----|------|
| A | @ | 160.251.209.16 | iyasaka.co をVPSに向ける |
| A | www | 160.251.209.16 | www.iyasaka.co をVPSに向ける（Nginx側で apex にリダイレクト） |

### メール関連

| 種別 | ホスト | 値 | 用途 |
|------|--------|-----|------|
| MX | @ | 10 （自ホスト） | iyasaka.co 宛メール受信先。さくらSMTP経由で送信、受信は VPS 自身 |
| TXT | @ | `v=spf1 +a +mx ~all` | SPF。VPS自身（A）とMXサーバーからの送信を許可 |
| TXT | _dmarc | `v=DMARC1; p=quarantine; rua=mailto:info@iyasaka.co` | DMARC。SPF/DKIM不合格メールを迷惑メール扱い、レポートをinfo宛に |

### 補足：さくらSMTPを使う場合のSPF

さくらSMTP（LEAD_MAIL_HOST）経由でメール送信する場合、SPFに さくらのサーバーを追加する必要がある。
さくらの SMTP ホスト名に応じて以下のように変更する。

```
txt @ v=spf1 +a +mx include:sakura.ne.jp ~all
```

さくらの正確な SPF include 値は契約情報を確認のこと。

### 将来追加が必要になるレコード

| 種別 | ホスト | 値 | タイミング |
|------|--------|-----|-----------|
| TXT | default._domainkey | DKIM公開鍵 | メール到達率を上げたい場合 |
| AAAA | @ | IPv6 アドレス | VPSでIPv6を有効にした場合 |
| CNAME | _acme-challenge | (値) | DNS認証でSSL取得する場合（現在はHTTP認証なので不要） |

## 設定後の確認コマンド

```bash
# A レコード
dig iyasaka.co A +short
# 期待値: 160.251.209.16

# www
dig www.iyasaka.co A +short
# 期待値: 160.251.209.16

# MX
dig iyasaka.co MX +short
# 期待値: 10 iyasaka.co.

# SPF
dig iyasaka.co TXT +short
# 期待値: "v=spf1 +a +mx ~all"

# DMARC
dig _dmarc.iyasaka.co TXT +short
# 期待値: "v=DMARC1; p=quarantine; rua=mailto:info@iyasaka.co"
```

## 現状との差分

現在の DNS 状況（2025-02時点の dig 結果）:

- A @ : 160.251.209.16 -- 設定済み
- A www : 160.251.209.16 -- 設定済み
- MX @ : 10 iyasaka.co. -- 設定済み
- TXT (SPF) : 未設定 -- 要追加
- TXT (_dmarc) : 未設定 -- 要追加

**SPF と DMARC が未設定のため、info@iyasaka.co からの送信メールが迷惑メール判定される可能性がある。**
特にリード通知メール（shindan / contact フォーム）の到達率に直結するため早期設定を推奨。

## VALUE-DOMAIN での設定手順

1. https://www.value-domain.com/ にログイン
2. 左メニュー「ドメイン」>「ドメインの設定操作」
3. `iyasaka.co` の「DNS/URL」をクリック
4. 設定フィールドに上記レコードを入力
5. 「保存」をクリック
6. 反映まで数分〜最大72時間（通常は30分以内）
7. 上記の dig コマンドで確認
