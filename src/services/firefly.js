const requestService = require('./requests')


const netWorth = async (data) => {
    if (!data) data = await requestService.summary()
    return data['net-worth-in-USD'].value_parsed
}

module.exports = { netWorth }
