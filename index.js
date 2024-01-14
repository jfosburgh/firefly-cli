const { Command } = require('commander')
const requestService = require('./requests')

const program = new Command()
program
    .name('firefly-cli')
    .description('a CLI to interact with a FireflyIII server')

program.command('verify')
    .description('request user information from the server to verify proper authentication')
    .action(async () => {
        await requestService.verify()
    })

program.parse()


