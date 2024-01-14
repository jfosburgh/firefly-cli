const axios = require('axios')

const baseURL = process.env.URL
const authHeader = `Bearer ${process.env.TOKEN}`


const verify = async () => {
    const url = `${baseURL}/api/v1/about/user`
    await axios.get(url, {
        headers: {
            'Authorization': authHeader
        },
    })
    .then(response => {
        console.log(`Successfully Authenticated user with email ${response.data['data']['attributes']['email']} at ${baseURL}`)
    })
    .catch(error => {
        console.log(`Authentication unsuccessfuly at ${baseURL} with error message: ${error.response.data['message']}`)
    })
}


module.exports = { verify }
