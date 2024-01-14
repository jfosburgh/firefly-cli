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
        viewAssetAccount(response.action)
    }
}

const viewAssetAccount = async (id) => {
    const account = await fireflyService.getAssetAccountOverview(id)
    console.log(`\nOverview for ${account.name}`)
    console.log(`Current Balance: \$${account.balance}`)
    console.log(`Most recent transactions:`)
    for (let transaction of account.transactions) {
        let direction = '-'
        if (transaction.source !== account.name) direction = '+'
        console.log(`${transaction.date}: ${direction}\$${transaction.amount} ${direction === '-' ? 'to' : 'from'} ${direction === '-' ? transaction.destination : transaction.source}`) 
    }

    const response = await prompts({
        type: 'select',
        name: 'action',
        message: '',
        choices: [
            {title: 'view all transactions', value: 'transactions'},
            {title: 'back to accounts', value: 'accounts'},
            {title: 'home', value: 'home'},
        ]
    })

    switch (response.action) {
        case 'home':
            interactiveCLI()
            break
        case 'accounts':
            selectAssetAccount()
            break
        case 'transactions':
            browseTransactions('all', 1, account.id) 
            break
        case 'default':
            selectAssetAccount()
            break
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
    else browseTransactions(response.action, 1)
}


const browseTransactions = async (transType, page, account=null) => {
    const transactions = await fireflyService.getTransactions(account, transType, 5, page)
    let choices = transactions.map(transaction => {
        return {
            title: `${transaction.date}: \$${transaction.amount} from ${transaction.source} to ${transaction.destination}${(transType === 'all') ? ` (${transaction.type})` : ''}`, value: transaction.id 
        }
    })
    choices = [
        ...choices, 
        {title: 'next page', value: 'next'},
        {title: 'previous page', value: 'prev', disabled: page === 1},
        {title: 'home', value: 'home'}
    ]
    const response = await prompts({
        type: 'select',
        name: 'action',
        message: `select a ${(transType === 'all') ? 'transaction' : transType.slice(0, transType.length-1)} to view it\'s details`,
        choices
    })

    switch (response.action) {
        case 'home':
            interactiveCLI()
            break
        case 'next':
            browseTransactions(transType, page+1, account)
            break
        case 'prev':
            browseTransactions(transType, page-1, account)
            break
        default:
            viewTransaction(response.action)
            break
    }
}

const viewTransaction = async (id) => {
    console.log(`NOT IMPLEMENTED: detailed view for transaction ${id}`)
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
