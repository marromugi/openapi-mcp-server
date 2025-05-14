# OpenAPI MCP Server

OpenAPI スキーマの情報を抜き出す MCPサーバーです。

## 機能

以下のツールを提供します：

- `get-api-paths` - 全ての API パスを取得します
- `get-api-path-method` - 指定された API パスのメソッドを取得します
- `search-api-by-keyword` - キーワードで API パスと説明を検索します
- `get-api-details` - 指定されたパスとメソッドの API 詳細を取得します

## 使い方

### スキーマのバンドル

OpenAPI スキーマをバンドルして単一のJSONファイルに変換します：

```bash
npm run bundle
```

### ビルド

TypeScriptのコードをJavaScriptにコンパイルします：

```bash
npm run build
```

### テスト

ユニットテストを実行します：

```bash
npm test
# または
npm run test:watch
```

### フォーマット

コードを整形します：

```bash
npm run format
```

## 参考

- [@modelcontextprotocol/sdk](https://github.com/modelcontextprotocol/sdk)
- [Claude Desktop](https://modelcontextprotocol.io/quickstart/user)
- [Cursor](https://docs.cursor.com/context/model-context-protocol)
