# San Creative Homepage

一个用于展示个人作品、项目进度和成长轨迹的静态创意主页。

它解决的问题是：把“我会什么、做过什么、正在往哪里成长”整理成一个可展示、可持续更新的主页。

## 项目说明

- 静态前端项目，无构建步骤
- 页面内容通过 `data.json` 手动维护
- 页面脚本通过 `data.js` 读取 `data.json`
- 当前页面入口：
  - `index.html`
  - `dashboard.html`
  - `portfolio.html`
  - `archive.html`

## 本地启动

不要直接双击 `html` 文件打开。

原因是页面通过 `fetch("./data.json")` 读取数据，必须通过本地静态服务访问。

在项目目录运行：

```bash
python3 -m http.server 8123
```

然后打开：

```text
http://127.0.0.1:8123/index.html
```

## 数据维护

- 核心内容文件：`data.json`
- 数据加载入口：`data.js`
- 页面渲染逻辑：`app.js`
- 样式文件：`styles.css`

如果只改文案、项目、作品、进度信息，优先维护 `data.json`。

## GitHub Pages 部署

这个项目可以直接部署到 GitHub Pages，不需要打包。

### 方式一：仓库根目录部署

1. 新建 GitHub 仓库并上传项目文件
2. 确保 `index.html` 位于仓库根目录
3. 进入 GitHub 仓库 `Settings`
4. 打开 `Pages`
5. 在 `Build and deployment` 中选择：
   - `Source`: `Deploy from a branch`
   - `Branch`: `main`
   - `Folder`: `/ (root)`
6. 保存后等待 GitHub Pages 发布

### 方式二：用 `docs/` 目录部署

如果以后想改成 `docs/` 方式，需要把当前静态文件整体放进 `docs/`，并在 Pages 设置中选择 `docs/`。当前版本默认按根目录部署更简单。

## 部署前检查

- `index.html` 能打开
- `dashboard.html` 能打开
- `portfolio.html` 能打开
- `archive.html` 能打开
- `data.json` 能通过 HTTP 正常读取
- 页面在手机宽度下没有横向溢出

## 当前边界

- 不包含后台
- 不包含数据库
- 不包含登录系统
- 不包含 CMS
