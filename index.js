const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');

const main = async () => {
  try {
    const textToSearch = core.getInput('textToSearch', { required: true });
    const textToAdd = core.getInput('textToAdd', { required: true });
    const insertFileName = core.getInput('insertFileName', { required: false});
    const paths = core.getInput('paths', {required: false});

    const insertFileNameParameter = "{insertFileName}";

    if (paths != "")
    {
        for (const path of paths.split(' ')) {

            fs.readFile(path, (err, content) => {
                if (err) throw err;
    
                if (content.includes(textToSearch) == false)
                {
                    var updatedTextToAdd = textToAdd;
                    if (insertFileName == 'true' && textToAdd.includes(insertFileNameParameter))
                    {
                        var pathWithoutExtension = path.split('.')[0];
                        var fileName = pathWithoutExtension.split('/').pop();
                        updatedTextToAdd = textToAdd.replace(insertFileNameParameter, fileName);
                    }
    
                    var contentStr = content.toString();
    
                    contentStr = updatedTextToAdd + "\n\n" + contentStr;
    
                    fs.writeFile(path, contentStr, (err) => {
    
                    });
                }
            });
        }
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

// Call the main function to run the action
main();