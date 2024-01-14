const { Command } = require('commander')
const interactiveCLI = require('./interactive')
const fireflyService = require('./services/firefly')

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
        console.log(`Your net worth is ${await fireflyService.netWorth()}`)
    })

program.command('interactive', {isDefault: true})
    .description('explore the program in an interactive shell')
    .action(async () => {
        await interactiveCLI()
    })

program.parse()


