# 浮阅X · 帖子双栏浮层阅读器

在网页版 X 点开帖子**不跳转**：当前页弹出双栏浮层——左边原文、右边评论；关掉后仍停在原来的刷帖位置。

> 非官方社区工具，与 X Corp. 无关。基于开源 Peek 思路做产品化改造（MIT），详见 `NOTICE.md`。

## 功能

- 双栏浮层阅读（图片 / 视频 / 引用帖 / 长文）
- 点赞、转发、收藏、纯文字回复、自动翻译
- **夜间护眼**、**定时护眼**、**专注模式**、字号调节

## 本地加载（开发）

需要 Node.js 20+：

```bash
npm install
npm run build:extension
```

Chrome → `chrome://extensions/` → 开发者模式 → 加载已解压扩展 → 选择 `dist-extension/` → 刷新 X 页面。

## 发布到 Chrome 应用商店

```bash
npm run pack:store
```

按 `chrome-store/LISTING.md` 与 `chrome-store/UPLOAD.txt` 操作：

1. 注册 [Chrome 开发者账号](https://chrome.google.com/webstore/devconsole)
2. 把 `chrome-store/privacy.html` 托管到可公网访问地址，填入「隐私权政策」
3. 上传 `chrome-store/floatread-x-*.zip`
4. 补充 1280×800 真实截图与商店文案

## 品牌

- 产品名：**浮阅X**
- 英文：**FloatRead X**
- 含义：浮层阅读 X 帖子，见名知意
