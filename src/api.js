const { config } = require('dotenv');
const { join } = require('path');
const { ok } = require('assert');

const env = process.env.NODE_ENV || "dev"
ok(env === "prod" || env === "dev", "a env é inválida, ou dev ou prod");

const configPath = join(__dirname, '../config', `.env.${env}`);
config({
    path: configPath
})

const Hapi = require('hapi')
const ShortenerRoutes = require('./routes/ShortenerRoutes')

const Context = require('./db/strategies/base/contextStrategy')
const Postgres = require('./db/strategies/postgres/postgres')

const HapiSwagger = require('hapi-swagger');
const Vision = require('vision');
const Inert = require('inert');

const app = new Hapi.Server({
    port:process.env.API_PORT
})

function mapRoutes(instance, methods){
    return methods.map(method => instance[method]())
}


async function main(){

    const context = new Context(new Postgres())
    await context.connect()

    const swaggerOptions = {
        info: {
            title: 'Shortener API - Fernando Freire & Bemobi',
            version: 'v1.0'
        }
    }
    
    await app.register([
        Vision,
        Inert,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ]);

    app.route([
        ...mapRoutes(new ShortenerRoutes(context), ShortenerRoutes.methods())
    ])

    await app.start()
    console.log(`server running on port ${app.info.port}`)

    return app
}

module.exports = main()