### 本脚本实现以下两个目的：

* 提交时候，自动格式化代码格式
* 检测提交者commit-message, 不规范的message会提交失败，增强git history的管理

#### commit-message规范例子：

feat($component)： add dialog component

fix(case_xxx): fix case xxx

### 实现：

引入相关库： `husky`, `prettier`

`husky`用于绑定`git-hook`周期，触发相应事件
`prettier`用于格式华代码

node.js脚本如下：

```
const chalk = require('chalk')
const msgPath = process.env.HUSKY_GIT_PARAMS;
const msg = require('fs').readFileSync(msgPath, 'utf-8').trim()

const commitRE = /^(revert: )?(feat|fix|docs|style|refactor|perf|test|workflow|ci|chore|types|build)(\(.+\))?: .{1,50}/

if (!commitRE.test(msg)) {
  console.log()
  console.error(
    `  ${chalk.bgRed.white(' ERROR ')} ${chalk.red(`不规范的 git commit message 格式`)}\n\n` +
    chalk.red(`  请简略描述提交的类型、涉及模块以及简要。例如：\n\n`) +
    `    ${chalk.green(`feat(compiler): add 'comments' option`)}\n` +
    `    ${chalk.green(`fix(ci): handle events on blur (close #28)`)}\n\n` +
    chalk.red(`  详情请查阅 CONTRIBUTING.md。\n`)
  )
  process.exit(1)
}

```
