# Console Error Checker

指定したURLリストのページをPlaywrightで巡回し、ブラウザコンソールのエラーを検出するCLIツール。

## 機能

- 複数URLの一括チェック
- 全てのconsole.errorの検出
- 特定のエラーパターンの検出
- 結果のファイル出力

## セットアップ

```bash
# リポジトリのクローン
git clone [repository-url]
cd console-error-checker

# 依存パッケージのインストール
npm install

# Playwrightのブラウザをインストール
npx playwright install chromium
```

## 使用方法

1. URLリストの準備
   ```bash
   # サンプルファイルをコピー
   cp urls.txt.sample urls.txt
   
   # urls.txtを編集してチェックしたいURLを追加
   ```

2. エラーチェックの実行

   a. 全てのconsole.errorを検出：
   ```bash
   npm run check
   ```

   b. 特定のエラーパターンのみを検出：
   ```bash
   TARGET_ERROR="検索したいエラーパターン" npm run check
   ```

   c. ReferenceErrorの検出（サンプル）：
   ```bash
   npm run check:pattern
   ```

## 結果の確認

- コンソールに各URLのチェック結果が表示されます
- 詳細な結果は`results/`ディレクトリに保存されます
  - ファイル名: URLのホスト名とパスを基に生成
  - 内容: 検出されたエラーメッセージまたは`[no console errors]`

## 設定例

```bash
# 特定の構文エラーを検出
TARGET_ERROR="SyntaxError:" npm run check

# 未定義変数のエラーを検出
TARGET_ERROR="is not defined" npm run check

# TypeErrorを検出
TARGET_ERROR="TypeError:" npm run check
```

## 注意事項

- `urls.txt`と`results/`ディレクトリはGitの管理対象外です
- 環境変数`TARGET_ERROR`が未指定の場合、全てのconsole.errorを検出します