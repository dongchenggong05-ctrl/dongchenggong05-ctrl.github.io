# San — AI Creative Builder

个人创意主页：一个页面，一份数据，零依赖，零构建。

把"我会什么、做过什么、正在往哪里成长"整理成一个可展示、可持续更新的单页作品集。

## 结构

```
index.html   页面骨架（唯一页面）
styles.css   样式（黑金编辑风）
app.js       渲染脚本（读 data.json）
data.json    全部内容 ← 日常更新只改这一个文件
AGENTS.md    给 Codex / AI 协作者的操作手册
```

## 日常更新

发了新作品？在 `data.json` 的 `works` 数组开头加一条记录，推送即可。
详细字段说明见 `AGENTS.md`。

## 本地预览

页面通过 `fetch("./data.json")` 读数据，不能直接双击打开。在项目目录运行：

```bash
python3 -m http.server 8123
```

然后访问 `http://127.0.0.1:8123`。

## 部署

GitHub Pages，根目录部署，推送到 `main` 自动发布，无需打包。
