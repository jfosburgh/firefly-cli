const requestService = require('./requests')


const getAssetsAccounts = async () => {
    const accounts = await requestService.getAccounts('asset', 50, 1)
    return accounts.map(account => {
        return {
            title: account['attributes']['name'],
            value: account['id']
        }
    })
}

const getAssetAccountOverview = async (id) => {
    const account = await requestService.getAccount(id)
    const transactions = await getTransactions(id, 'all', 5, 1)
    return {
        id: account['id'],
        name: account['attributes']['name'],
        balance: account['attributes']['current_balance'],
        transactions
    }
}

const getTransactions = async (id, type, limit, page) => {
    const transactions = await requestService.getTransactions(id, type, limit, page)
    return transactions.map(transaction => {
        transaction = transaction['attributes']['transactions'][0]
        return {
            id: transaction['transaction_journal_id'],
            amount: transaction['amount'].substring(0, transaction['amount'].indexOf('.')+3),
            date: transaction['date'].substring(0, 10),
            type: transaction['type'],
            source: transaction['source_name'],
            destination: transaction['destination_name']
        }
    })
}

const getTransaction = async (id) => {
    const transaction = await requestService.getTransaction(id)
    return transaction['attributes']['transactions'][0]
}

const netWorth = async (data) => {
    if (!data) data = await requestService.summary()
    return data['net-worth-in-USD'].value_parsed
}

module.exports = { netWorth, getAssetsAccounts, getAssetAccountOverview, getTransactions, getTransaction }
