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


module.exports = { verify, summary, getAccounts }
