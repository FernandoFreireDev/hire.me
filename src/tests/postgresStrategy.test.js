const assert = require('assert')
const Postgres = require('../db/strategies/postgres/postgres')
const Context = require('../db/strategies/base/contextStrategy')
const Randomstring = require('randomstring')

const context = new Context(new Postgres())

const ALEATORY_ALIAS = Randomstring.generate({
    length: 6,
    charset: 'alphabetic'
})

const MOCK_SHORTENER_CREATE = {
    alias: ALEATORY_ALIAS,
    url_original: `https://www.${ALEATORY_ALIAS}.com.br`
}

describe('Test Suite - Postgres Strategy', function() {
    this.timeout(Infinity)
    this.beforeAll(async function(){
        await context.connect()
        await context.create(MOCK_SHORTENER_CREATE)
    })

    it('PostgresSQL Connection', async function() {
        const result = await context.isConnected()
        assert.equal(result, true)
    })

    it('Create', async function() {
        const result = await context.create(MOCK_SHORTENER_CREATE)
        delete result.id, 
        delete result.accesses
        assert.deepEqual(result, MOCK_SHORTENER_CREATE)
    })

    it('Read', async function(){
        const [result] = await context.read({ alias: MOCK_SHORTENER_CREATE.alias })
        delete result.id
        delete result.accesses
        assert.deepEqual(result, MOCK_SHORTENER_CREATE)
    })
})