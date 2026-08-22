# 通関手帖(骨架示例)

面向日本人的中国旅行实用信息站——纯静态 HTML/CSS/JS,零构建工具,可直接部署。

## 目录结构

```
site/
├── index.html          首页
├── articles/
│   └── visa-policy.html   文章页模板(YMYL内容规范示例)
├── css/style.css        全站样式(响应式 + 设计变量)
├── js/main.js           移动端菜单交互
└── README.md
```

## 设计说明

- 主题:"通关"意象——护照印章、车票票根、旧地图配色
- 强调色朱红(--seal)仅用于印章、标签、链接,保持克制
- 移动优先:导航在窄屏自动收起为汉堡菜单,卡片网格自动重排
- 文章页内置"最终确认日"机制——签证类信息**必须**人工核实后更新日期,不要自动化这个字段

## 如何上线(免费方案)

1. **建 GitHub 仓库**
   ```
   cd site
   git init
   git add .
   git commit -m "网站骨架初版"
   git branch -M main
   git remote add origin <你的仓库地址>
   git push -u origin main
   ```

2. **连接 Vercel 或 Cloudflare Pages**
   - 登录 vercel.com 或 pages.cloudflare.com,选择"从 GitHub 导入"
   - 框架选择 "Other"(纯静态站点,无需构建命令)
   - 部署根目录指向 `site/`
   - 保存后自动获得一个免费域名,后续推送代码自动更新上线

3. **绑定自己的域名**(可选,买域名后在 Vercel/Cloudflare 后台添加 DNS 记录即可)

## 下一步

- 按之前讨论的节奏:先写 3-5 篇"种子文章"替换占位卡片
- 每篇文章复制 `articles/visa-policy.html` 作为模板,替换内容
- 提交到 Google Search Console 验证收录情况
- 内容稳定后再申请 AdSense 和联盟计划账号

## 重要提醒

签证、支付、保险相关内容属于 YMYL(影响用户金钱/人身安全),AI 生成的初稿**必须**经过人工核实一次信息源后才能发布,页面里的"最终确认日"要如实反映人工核实的时间,不要自动生成当天日期。
