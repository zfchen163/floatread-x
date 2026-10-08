#!/usr/bin/env node
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist-extension");
const outDir = path.join(root, "chrome-store");
const manifest = JSON.parse(readFileSync(path.join(dist, "manifest.json"), "utf8"));
const zipName = `floatread-x-${manifest.version}.zip`;
const zipPath = path.join(outDir, zipName);
const stage = path.join(outDir, "_stage");

if (!existsSync(dist)) throw new Error("缺少 dist-extension，请先 npm run build:extension");

mkdirSync(outDir, { recursive: true });
rmSync(stage, { recursive: true, force: true });
cpSync(dist, stage, { recursive: true });
rmSync(zipPath, { force: true });

execFileSync("zip", ["-r", "-q", zipPath, "."], { cwd: stage });
rmSync(stage, { recursive: true, force: true });

const checklist = `# 浮阅X ${manifest.version} 上架包

- 上传文件：\`${zipName}\`
- 扩展名：${manifest.name}
- 版本：${manifest.version}
- 先托管 chrome-store/privacy.html，把公网 URL 填进商店「隐私权政策」
- 再上传 1280×800 真实截图（建议：时间线浮层、护眼主题、专注模式、设置弹窗）
- Developer Dashboard：https://chrome.google.com/webstore/devconsole
`;

writeFileSync(path.join(outDir, "UPLOAD.txt"), checklist);
console.log(`Chrome Web Store zip: ${zipPath}`);
