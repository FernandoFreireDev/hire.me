const assert = require('assert')
const api = require('./../api')
const Randomstring = require('randomstring')

let app = {}

const SHORTENER_CREATE_WITHOUT_ALIAS = {
    url_original: 'https://www.bemobi.com.br'
}

const SHORTENER_CREATE_ERROR_WITH_ALIAS = {
    alias: 'Bemobi',
    url_original: 'www.bemobi.com.br'
}

const ALEATORY_ALIAS = Randomstring.generate({
    length: 6,
    charset: 'alphabetic'
})

const SHORTENER_CREATE_WITH_ALIAS_ALEATORY = {
    alias: ALEATORY_ALIAS,
    url_original: 'https://www.bemobi.com.br'
}

describe('Test Suite - API', function(){
    this.timeout(Infinity)
    this.beforeAll(async () => {
        app = await api
    })

    it('Create - creating successfully without alias - /shorten', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/shorten',
            payload: JSON.stringify(SHORTENER_CREATE_WITHOUT_ALIAS)
        })
        
        const statusCode = result.statusCode
        const payload = JSON.parse(result.payload)

        assert.ok(statusCode === 200)
        assert.deepEqual(typeof payload, "object");
    })

    it('Create - creating successfully with alias - /shorten', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/shorten',
            payload: JSON.stringify(SHORTENER_CREATE_WITH_ALIAS_ALEATORY)
        })
        
        const statusCode = result.statusCode
        const payload = JSON.parse(result.payload)

        assert.ok(statusCode === 200)
        assert.deepEqual(typeof payload, "object");
    })

    it('Create - creating with error, existing alias - /shorten', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/shorten',
            payload: JSON.stringify(SHORTENER_CREATE_ERROR_WITH_ALIAS)
        })
        
        const statusCode = result.statusCode
        const payload = JSON.parse(result.result.message)
    
        assert.ok(statusCode === 400)
        assert.deepEqual(typeof payload, "object");
        assert.deepEqual(payload.ERR_CODE, '001');
    })

    it('Read - with existing alias /r/{alias}', async () => {
        const result = await app.inject({
            method: 'GET',
            url: '/r/Bemobi'
        })

        const data = JSON.parse(result.payload)
        const statusCode = result.statusCode

        assert.ok(statusCode === 200)
        assert.deepEqual(typeof data, "object")
    })

    it('Read - with existing alias /r/{alias}', async () => {
        const result = await app.inject({
            method: 'GET',
            url: '/r/Bemobiquenaotem'
        })

        const statusCode = result.statusCode
        const payload = JSON.parse(result.result.message)

        assert.ok(statusCode === 400)
        assert.deepEqual(typeof payload, "object");
        assert.deepEqual(payload.ERR_CODE, '002');
    })

    it('Read - Returns as 10 most accessed urls - /popular', async () => {
        const result = await app.inject({
            method: 'GET',
            url: '/popular'
        })

        const statusCode = result.statusCode
        const payload = JSON.parse(result.payload)

        assert.ok(statusCode === 200)
        assert.ok(Array.isArray(payload));
        assert.ok(payload.length <= 10);
    })
})