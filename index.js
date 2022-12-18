#!/usr/bin/env node

const {program} = require("commander")
const download  = require("download-git-repo")
const inquirer = require("inquirer")
const fs = require('fs')
const handlebars = require('handlebars')
const ora = require("ora")
const chalk = require("chalk")
const logSymbols = require("log-symbols")

const template = {
    'tutu-a': {
        'discription': '这是a模板',
        'downloadUrl': 'http://github.com:lihui-coder/tutu-a#main'
    },
    'tutu-b': {
        'discription': '这是b模板',
        'downloadUrl': 'http://github.com:lihui-coder/tutu-b#main'
    },
    'tutu-c': {
        'discription': '这是c模板',
        'downloadUrl': 'http://github.com:lihui-coder/tutu-c#main'
    }
}

program
    .version('1.0.0')

program
    .command("init <template> <project-name>")
    .description("初始化项目模板")
    .action((templateName, projectName) => {
        const spinner = ora("正在下载模板")
        spinner.start()
        const { downloadUrl } = template[templateName]
        // 这块要选择一个模板并且把项目名称设置为projectNname
        download(downloadUrl, projectName, { clone: true }, (err)=>{
            if(err){
                spinner.fail()
                console.log(logSymbols.error,chalk.red(err));
            }else{
                spinner.succeed()
                console.log(logSymbols.success,chalk.blue('下载成功'));
                inquirer
                    .prompt([
                        {
                            type: 'input',
                            name: 'name',
                            message: '请输入项目名称'
                        },
                        {
                            type: 'input',
                            name: 'discription',
                            message: '请输入您的项目简介'
                        },
                        {
                            type: 'input',
                            name: 'author',
                            message: '请输入作者名称'
                        },
                    ])
                    .then((answers) => {
                        const packagePath = `${projectName}/package.json`
                        const packageContent = fs.readFileSync(packagePath, 'utf-8')
                        const packageResult =  handlebars.compile(packageContent)(answers)
                        fs.writeFileSync(packagePath, packageResult)
                        console.log('下载成功');
                    })
            }
        })
    })

program
    .command('list')
    .description("查看所有可用模板")
    .action(()=>{
        for(let temp in template){
            console.log(`${temp}: ${template[temp].discription}`);
        }
    })

program.parse(process.argv)