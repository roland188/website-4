const { execSync } = require('child_process');

// GitHub 仓库信息
const githubRepository = 'https://github.com/your-username/your-github-repo.git';
const githubBranch = 'main';

// GitLab 仓库信息
const gitlabRepository = 'https://gitlab.com/your-username/your-gitlab-repo.git';
const gitlabBranch = 'main';

// 项目将被克隆到的临时目录
const tempDirectory = './temp_project';

// 执行 shell 命令的函数
const executeCommand = (command) => {
    try {
        const result = execSync(command, { stdio: 'inherit' });
        return result.toString().trim();
    } catch (error) {
        console.error(`执行命令时发生错误: ${command}`);
        console.error(error.message);
        process.exit(1);
    }
};

// 步骤 1：克隆 GitHub 仓库
executeCommand(`git clone --branch ${githubBranch} ${githubRepository} ${tempDirectory}`);

// 步骤 2：在 GitLab 仓库中初始化并提交更改
executeCommand(`cd ${tempDirectory} && git init && git add . && git commit -m "复制代码"`);

// 步骤 3：将 GitLab 仓库添加为远程仓库
executeCommand(`cd ${tempDirectory} && git remote add gitlab ${gitlabRepository}`);

// 步骤 4：将更改推送到 GitLab
executeCommand(`cd ${tempDirectory} && git push gitlab ${githubBranch}:${gitlabBranch} --force`);

// 步骤 5：清理临时目录（可选）
executeCommand(`rd /s /q ${tempDirectory}`);

console.log('代码复制成功！');
