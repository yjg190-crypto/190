# パンダの国から (panndano.com) — 项目说明

面向日本人的中国旅行信息网站。静态HTML网站,Cloudflare Pages托管,git部署。
以下内容整理自网站建设过程中的实际经验,请在开始工作前通读一遍。

## 基本信息

- 域名: panndano.com | 仓库结构: 根目录直接是网站文件(无build步骤)
- 部署方式: `git add . && git commit -m "..." && git push`,Cloudflare Pages自动构建
- Google Analytics: G-0ZFE2F4CBL | AdSense: ca-pub-1529975884470418(审核中)
- 品牌名固定写法: **「パンダの国から」/ "PANDA NO KUNI KARA"**(不是"PANDA NO",这个错误在早期反复出现过)

## 目录结构

```
/index.html, about.html, contact.html, privacy.html, all-articles.html
/sitemap.xml
/css/style.css
/articles/*.html   (60+篇独立文章)
/categories/*.html (11个分类页: news/visa/transport/payment/vpn/spots/safety/money/food/hotel/insurance)
/assets/           (favicon、logo等)
```

## ⚠️ 最容易踩的坑(按重要性排序)

### 1. 侧边栏不是live include,是每个文件里各自复制的一份静态HTML
改动侧边栏(增删分类、改文字)必须**批量替换所有文件**,不是改一处生效全站。
批量替换时容易漏掉的地方:
- **静态页**(about/contact/privacy)路径前缀是`categories/xxx.html`,文章页是`../categories/xxx.html`,两种格式要分开处理
- **首页(index.html)** 格式可能和文章页模板不完全一致,批量替换经常匹配不上,需要单独核实
- **分类页自己指向自己那一条**是特殊变体——比如在`money.html`页面里,侧边栏"安全・両替"这组,"両替"那部分不是`<a>`标签,而是`<span class="cat-link-plain">両替</span>`(自我指向的死链接问题修复后留下的产物)。批量替换`<a>...</a>`模式的操作**不会匹配到这些变体**,必须单独检查这6个自我指向的分类页(food/hotel/safety/money/payment/vpn互相嵌套的那几组)
- 面包屑(breadcrumb)里,分类页/静态页自己对应的那部分也应该是`<span class="cat-link">`纯文字,不是`<a>`——只有文章页链接到分类页才应该是真链接
- `all-articles.html`是脚本自动生成的,不能手动改,改完其他文件后要重新跑生成脚本(见下方"生成新文章"部分)

### 2. 新建文章时,`<head>`部分不要凭记忆手写,要从最近一篇已确认正确的文章复制
血泪教训:网站中途把全局字体从Inter换成Lora,批量替换了当时**已存在**的HTML文件,但用来生成新文章的Python脚本本身,`<head>`模板是写死的字符串,没有同步更新。结果后续新建的4篇文章,字体引入全部还是旧的Inter,导致这几篇的正文排版(每行实际能容纳的字数)和其他文章不一致,排查花了很长时间才定位到根源。
**以后新建文章前,先`cat`一篇最近确认没问题的文章,把它的`<head>`区域整段复制过来改,不要用旧脚本/旧模板生成。**

### 3. 每次新建/修改文章后的完整检查清单
- [ ] 标签配对: `grep -c '<div'` 和 `grep -c '</div>'` 数字要一致(article、ul等同理)
- [ ] JSON-LD用Python `json.loads()`验证格式正确
- [ ] `dateModified`字段更新为实际当前日期(不要凭对话轮数推算日期,用系统真实日期)
- [ ] 内部链接指向的文件是否真实存在,不要凭猜测写文件名
- [ ] 站内联动: 分类页正文列表 + 首页新闻栏(News Ticker,上限15条,超出要删最旧的) + sitemap.xml + 重新生成all-articles.html + 相关文章的related-articles互相链接
- [ ] 全站scan确认没有遗留的旧文字/旧链接(常有"改了9处但实际10处"这种遗漏)

### 4. 关于"文章孤儿"问题
至少发生过两次:文章生成了、内容也对,但完全没有被site任何地方链接到(sitemap、分类页、首页都没有),纯粹因为对话过长/中途压缩,忘记走完整合流程。**每次生成新文章后,务必主动grep一下确认它出现在了sitemap.xml、对应categories/*.html、all-articles.html里,不要假设"生成了就等于上线了"。**

### 5. 对话/会话相关注意事项
- 沙盒环境有重置风险,重要文件全部依赖git仓库和最终打包的zip,不要假设本地文件会一直存在
- 如果长对话被压缩过,不要假设自己记得所有历史操作——有几次重复生成了已经存在的文章,浪费功夫。**动手前先检查文件是否已存在。**

## 内容质量标准(逐步摸索出的规则)

1. **具体数字/政策一定要查证,而且要查最新的**——多次出现过"查到的信息是旧版政策"的情况,例如离境退税起退点2025年4月从500元降到了200元,若不查证容易写错
2. **不确定的信息如实说"未能确认",不要为了显得完整就编造**(比如ATM密码位数、某些城市地铁罚款金额、右转灯规则里的免责情况等,都遇到过"查不到就不写"的情况)
3. **不用未经验证的排名/星级**,不堆砌"绝对""圧倒的"这类夸张词汇,保持克制的编辑口吻
4. **PR/联盟链接**: 诚实、不夸张,`rel="noopener sponsored"`,已有链接库(Trip.com多个用途分开的链接、A8.net的Epos卡)不要重复申请新的
5. **政治敏感话题**(如中日关系报道)保持中立陈述,不选边站,给读者留判断空间,末尾提醒查外务省等官方信息
6. **品牌名/专有名词固定写法**: DiDi(不是"滴滴",除非括号内注明官方中文名"滴滴出行"); 免税/タックスリファンド(不是"退税",这是纯中文词汇,日语没有这个用法)
7. **"単車"是假朋友词,不要用来指自行车**:日语"単車"指的是摩托车/二轮机动车,和中文"单车"=自行车完全是两个意思。共享单车类名词,哈啰用既有译名"ハローバイク",滴滴青桔/美团单车等没有通行译名的,写成"DiDiの自転車""美団の自転車"这类形式,不要直接照搬中文品牌名加"単車"(2026-09-07,west-lake.html モバイク→现行品牌名修正时发现并改正过此错误)

## CSS关键约定

```css
/* 字体栈,新文章的Google Fonts import必须包含Lora */
--font-display: "Lora", "Shippori Mincho", "Noto Serif JP", serif;
--font-body: "Lora", "Zen Kaku Gothic New", "Noto Sans JP", sans-serif;

/* 正文与侧边栏布局 */
.article-layout { display: grid; grid-template-columns: 1fr 260px; gap: 32px; align-items: start; }
.article-layout .side-col { margin-top: 48px; }
@media (min-width: 861px) {
  .article-layout .side-col { position: sticky; top: 20px; }
}
article.content { max-width: 68ch; }
```

## 生成新文章的标准流程

1. 复制一篇最近文章的完整HTML结构(不要用旧脚本模板)
2. 改标题、meta描述、JSON-LD(Article + BreadcrumbList两段)
3. 写正文,遇到具体数字/政策先web_search查证
4. 站内互相链接: 找现有相关文章,双向加link
5. 完整性检查(见上方清单)
6. 分类页 + 首页新闻栏 + sitemap.xml + all-articles.html 四处同步
7. git commit + push

## 待办/持续任务

- 外部链接建设几乎为0,是目前SEO最大短板(内容扎实但站外曝光不足)。计划中的行动: にほんブログ村注册、Yahoo知恵袋/4travel.jp真实回答问题带链接、联系曾经采访过运营者的本地媒体、X作为分发渠道(不是内容创作赛道)发布已查证过的具体数据点
- AdSense审核结果待跟进
- favicon已被搜索引擎更新识别(2026年9月确认)

## 目标与现状判断(仅供参考,非精确承诺)

内容质量和更新纪律是目前最扎实的部分。月10万日元营收目标,按现有节奏预计7-10个月可达成,前提是外部链接建设能够跟上;若外链持续缺失,单靠内容自然沉淀,时间线不会显著提前。
