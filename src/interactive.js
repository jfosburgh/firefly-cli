const prompts = require("prompts")
const fireflyService = require('./services/firefly')
const requestService = require('./services/requests')

let userVerified = false

const selectAssetAccount = async () => {
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
        console.log(`NOT IMPLEMENTED: Detailed view for ${response.action}`)
        interactiveCLI()
    }
}

const selectTransactionType = async (canBeAll) => {
    const transTypes = [
        {title: 'deposits', value: 'deposits'},
        {title: 'transfers', value: 'transfers'},
        {title: 'withdrawals', value: 'withdrawals'},
    ]
    if (canBeAll) transTypes.push({title: 'all', value: 'all'})
    transTypes.push({title: 'home', value: 'home'})

    const response = await prompts({
        type: 'select',
        name: 'action',
        message: 'which type of transaction would you like to view?',
        choices: transTypes
    })

    if (response.action === 'home') interactiveCLI()
    else browseTransactions(response.action, 0)
}


const browseTransactions = async (transType, page) => {
    console.log(`NOT IMPLEMENTED: view page ${page} of ${transType} transactions`)
    interactiveCLI()
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
            { title: 'view my transactions', value: 'transactions'},
            { title: 'exit', value: 'exit' },
        ]
    })

    switch (response.action) {
        case 'worth':
            console.log(`Your current net worth is ${await fireflyService.netWorth()}`)
            interactiveCLI()
            break
        case 'accounts':
            selectAssetAccount()
            break
        case 'transactions':
            selectTransactionType(true)
            break
        case 'exit':
            return
        default:
            throw Error(`Case ${response.action} not handled`)

    }
}

module.exports = interactiveCLI
