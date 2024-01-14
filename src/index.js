const { Command } = require('commander')
const requestService = require('./services/requests')

const program = new Command()
program
    .name('firefly-cli')
    .description('a CLI to interact with a FireflyIII server')

program.command('verify')
    .description('request user information from the server to verify proper authentication')
    .action(async () => {
        await requestService.verify()
    })

program.command('worth')
    .description('print your net worth')
    .action(async () => {
        const data = await requestService.summary()
        console.log(`Your current net worth is ${data['net-worth-in-USD'].value_parsed}`)
    })

program.parse()


