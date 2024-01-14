const prompts = require("prompts")
const fireflyService = require('./services/firefly')
const requestService = require('./services/requests')

let userVerified = false

const selectAccount = async () => {
    const accounts = await fireflyService.getAssetsAccounts()
    accounts.sort((a, b) => b.title > a.title ? -1 : 1 )
    accounts.push({ title: 'return to home', value: 'home' })
    const response = await prompts({
        type: 'select',
        name: 'action',
        message: 'select an account to view it\'s details',
        choices: accounts
    })

    if (response.action === 'home') interactiveCLI()
    else {
        console.log(`This path will eventually take you to a detailed view for ${response.action}`)
        interactiveCLI()
    }
}


const interactiveCLI = async () => {
    if (!userVerified) {
        await requestService.verify()
        userVerified = true
    }

    const response = await prompts({
        type: 'select',
        name: 'action',
        message: 'what would you like to do?',
        choices: [
            { title: 'get my net worth', value: 'worth' },
            { title: 'view my accounts', value: 'accounts' },
            { title: 'exit', value: 'exit' },
        ]
    })

    switch (response.action) {
        case 'worth':
            console.log(`Your current net worth is ${await fireflyService.netWorth()}`)
            interactiveCLI()
            break
        case 'accounts':
            selectAccount()
            break
        case 'exit':
            return
        default:
            throw Error(`Case ${response.action} not handled`)

    }
}

module.exports = interactiveCLI
