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


const netWorth = async (data) => {
    if (!data) data = await requestService.summary()
    return data['net-worth-in-USD'].value_parsed
}

module.exports = { netWorth, getAssetsAccounts }
