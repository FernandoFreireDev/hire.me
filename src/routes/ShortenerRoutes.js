
const BaseRoutes = require('./base/baseRoutes')
const Joi = require('joi')
const Boom = require('boom')

const failAction = (request, headers, erro) => {
    throw erro;
}

class ShortenerRoutes extends BaseRoutes {

    constructor(db)
    {
        super()
        this.db = db
    }

    shorten()
    {
        return  {
            path: '/shorten',
            method: 'POST',
            config: {
                tags: ['api'],
                description: 'should return a shortened url',
                notes: 'You can shorten with or without alias',
                validate: {
                    failAction,
                    payload: {
                        alias: Joi.string(),
                        url_original: Joi.string().min(3).required()
                    }
                }
            },
            handler: async (request, response) => {

                const hrstart = process.hrtime()
                const req = request.payload

                if(req.alias){
                    const alias = req.alias
                    var validAlias = await this.db.read({ alias })
                    if(validAlias.length > 0){
                        return Boom.badRequest(JSON.stringify({ERR_CODE: '001', Description:'CUSTOM ALIAS ALREADY EXISTS'}));
                    }
                }
                await this.db.create(req)
                const hrTotal = process.hrtime(hrstart)
                return {
                    ...req,
                    statistics : {
                        time_execution: `Execution time: ${hrTotal[1] / 1000000}ms`
                    }
                };
            }
        }
    }

    retrieve()
    {
        return  {
            path: '/r/{alias}',
            method: 'GET',
            config: {
                tags: ['api'],
                description: 'Must return url related to alias',
                notes: 'You need to pass the alias',
                validate: {
                    params: {
                        alias: Joi.string().required()
                    },
                }
            },
            handler: async (request, response) => {
                
                
                const alias = request.params.alias
                const result = await this.db.readOne({ alias })

                if(result.length > 0){
                    const item = result[0]
                    const [retorno] = await this.db.update(item.id, item)
                    return JSON.stringify(retorno)
                }else{
                    return Boom.badRequest(JSON.stringify({ERR_CODE: '002', Description:'SHORTENED URL NOT FOUND'}))
                }
            }
        }
    }

    popular()
    {
        return  {
            path: '/popular',
            method: 'GET',
            config: {
                tags: ['api'],
                description: 'Must return 10 most accessed urls',
                notes: 'No need to pass any information'
            },
            handler: async (request, response) => {
                
                const result = await this.db.readPopular()
                return JSON.stringify(result)
            }
        }
    }
}

module.exports = ShortenerRoutes