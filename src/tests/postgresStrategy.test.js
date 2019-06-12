const assert = require('assert')
const Postgres = require('../db/strategies/postgres/postgres')
const Context = require('../db/strategies/base/contextStrategy')

const context = new Context(new Postgres())
const MOCK_SHORTENER_CREATE = {
    alias: 'Bemobi',
    url_original: 'https://www.bemobi.com.br'
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