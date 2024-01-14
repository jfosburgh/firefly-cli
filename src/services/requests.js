const axios = require('axios')

const baseURL = process.env.URL
const authHeader = `Bearer ${process.env.TOKEN}`
let userCreated = null

const getAccounts = async (type, limit, page) => {
    try {
        const response = await axios.get(`${baseURL}/api/v1/accounts`, {
            headers: {
                'Authorization': authHeader
            },
            params: {type, limit, page}
        })
        return response.data['data']
    } catch (error) {
        console.log(error.response.data['message'])
    }
}

const getAccount = async(id) => {
    try {
        const response = await axios.get(`${baseURL}/api/v1/accounts/${id}`, {
            headers: { 'Authorization': authHeader }
        })
        return response.data['data']
    } catch (error) {
        if (error.response.data) console.log(error.response.data['message'])
        else console.log(error)
    }
}

const getTransactions = async (account_id=null, type='all', limit=10, page=1) => {
    let url = `${baseURL}/api/v1/transactions`
    let params = {type, limit, page}
    if (account_id) {
        url = `${baseURL}/api/v1/accounts/${account_id}/transactions`
        params = {...params, id:account_id}
    }
    try {
        const response = await axios.get(url, {
            headers: {'Authorization': authHeader},
            params,
        })
        return response.data['data']
    } catch (error) {
        if (error.response) console.log(error.response.data['message'])
        else console.log(error)
    }
}

const getTransaction = async (id) => {
    try {
        const response = await axios.get(`${baseURL}/api/v1/transaction-journals/${id}`, {
            headers: {'Authorization': authHeader},
        })
        return response.data['data']
    } catch (error) {
        if (error.response) console.log(error.response.data['message'])
        else console.log(error)
    }
}

const verify = async () => {
    const url = `${baseURL}/api/v1/about/user`
    try {
        const response = await axios.get(url, {
            headers: {
                'Authorization': authHeader
            },
        })
        console.log(`Successfully Authenticated user with email ${response.data['data']['attributes']['email']} at ${baseURL}`)
        userCreated = response.data['data']['attributes']['created_at'].substring(0,10);
    } catch (error) {
        throw Error(`Authentication unsuccessfuly at ${baseURL} with error message: ${error.response.data['message']}`)
    }
}

const summary = async () => {
    const start = userCreated ? userCreated : new Date(new Date().getTime() - 24 * 60 * 60 * 1000).toISOString().substring(0, 10)
    const end = new Date().toISOString().substring(0, 10)

    try {
        const response = await axios.get(`${baseURL}/api/v1/summary/basic`, {
            headers: {
                'Authorization': authHeader
            },
            params: {
                start,
                end,
            }
        })
        return response.data
    } catch (error) {
        console.log(error.response.data['message'])
    }
}


module.exports = { verify, summary, getAccounts, getAccount, getTransactions, getTransaction }
