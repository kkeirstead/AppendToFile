const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');

const main = async () => {
  try {
    /**
     * We need to fetch all the inputs that were provided to our action
     * and store them in variables for us to use.
     **/
    //const owner = core.getInput('owner', { required: true });
    //const repo = core.getInput('repo', { required: true });
    //const pr_number = core.getInput('pr_number', { required: true });
    //const token = core.getInput('token', { required: true });
    const textToSearch = core.getInput('textToSearch', { required: true });
    const textToAdd = core.getInput('textToAdd', { required: true });
    const insertFileName = core.getInput('insertFileName', { required: false});
    const paths = core.getInput('paths', {required: false});


    for (const path of paths.split(' ')) {

        fs.readFile(path, (err, content) => {
            if (err) throw err;

            if (content.includes(textToSearch) == false)
            {
                var updatedTextToAdd = textToAdd;
                if (insertFileName == 'true' && textToAdd.includes("{insertFileName}"))
                {
                    var pathWithoutExtension = path.split('.')[0];
                    var fileName = pathWithoutExtension.split('/').pop();
                    updatedTextToAdd = textToAdd.replace("{insertFileName}", fileName);
                }

                content = content.toString().substring(0, content.toString().length - 1) // Testing only

                content += "\n" + updatedTextToAdd;

                fs.writeFile(path, content, (err) => {

                });
            }
        });
    }

    // /**
    //  * Now we need to create an instance of Octokit which will use to call
    //  * GitHub's REST API endpoints.
    //  * We will pass the token as an argument to the constructor. This token
    //  * will be used to authenticate our requests.
    //  * You can find all the information about how to use Octokit here:
    //  * https://octokit.github.io/rest.js/v18
    //  **/
    // const octokit = new github.getOctokit(token);

    // /**
    //  * We need to fetch the list of files that were changed in the Pull Request
    //  * and store them in a variable.
    //  * We use octokit.paginate() to automatically loop over all the pages of the
    //  * results.
    //  * Reference: https://octokit.github.io/rest.js/v18#pulls-list-files
    //  */
    // const { data: changedFiles } = await octokit.rest.pulls.listFiles({
    //   owner,
    //   repo,
    //   pull_number: pr_number,
    // });


    // /**
    //  * Contains the sum of all the additions, deletions, and changes
    //  * in all the files in the Pull Request.
    //  **/
    // let diffData = {
    //   additions: 0,
    //   deletions: 0,
    //   changes: 0
    // };

    // // Reference for how to use Array.reduce():
    // // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
    // diffData = changedFiles.reduce((acc, file) => {
    //   acc.additions += file.additions;
    //   acc.deletions += file.deletions;
    //   acc.changes += file.changes;
    //   return acc;
    // }, diffData);

    // /**
    //  * Loop over all the files changed in the PR and add labels according 
    //  * to files types.
    //  **/
    // for (const file of changedFiles) {
    //     const { data: fileWithContents } = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
    //         owner: owner,
    //         repo: repo,
    //         path: file.filename.path
    //     });

    //     const fileExtension = file.filename.split('.').pop();
    //     switch(fileExtension) {
    //       case 'md':

    //         var content = fileWithContents.content; // Parse this

    //         if (content.includes(textToSearch) == false)
    //         {
    //             if (textToAdd.includes("{insertFileName}"))
    //             {
    //                 textToAdd = textToAdd.replace("{insertFileName}", file.fileName.split('.')[0])
    //             }
    //             content += "\n" + textToAdd;
    //         }


    //         /*
    //         await octokit.rest.issues.addLabels({
    //           owner,
    //           repo,
    //           issue_number: pr_number,
    //           labels: ['markdown'],
    //         });*/
    //     }
    // }

    // /**
    //  * Create a comment on the PR with the information we compiled from the
    //  * list of changed files.
    //  */
    // await octokit.rest.issues.createComment({
    //   owner,
    //   repo,
    //   issue_number: pr_number,
    //   body: `
    //     Pull Request #${pr_number} has been updated with: \n
    //     - ${diffData.changes} changes \n
    //     - ${diffData.additions} additions \n
    //     - ${diffData.deletions} deletions \n
    //   `
    // });

  } catch (error) {
    core.setFailed(error.message);
  }
}

// Call the main function to run the action
main();