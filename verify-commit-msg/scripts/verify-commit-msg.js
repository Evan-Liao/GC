
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