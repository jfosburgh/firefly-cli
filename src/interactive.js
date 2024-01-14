const prompts = require("prompts")
const fireflyService = require('./services/firefly')

const interactiveCLI = async () => {
    console.log('entering interactive shell')

    while (true) {
        const response = await prompts({
            type: 'select',
            name: 'action',
            message: 'what would you like to do?',
            choices: [
                { title: 'get my net worth', value: 'worth' },
                { title: 'exit', value: 'exit' }
            ]
        })

        switch (response.action) {
            case 'worth':
                console.log(`Your current net worth is ${await fireflyService.netWorth()}`)
                break
            case 'exit':
                return
            default:
                throw Error(`Case ${response.action} not handled`)

        }
    }
}

module.exports = interactiveCLI
