const ICrud = require('./../interfaces/ICrud')
const Sequelize = require('sequelize')
const Randomstring = require('randomstring')

class Postgres extends ICrud {
    constructor()
    {
        super()
        this._driver = null
        this._shortener = null
    }

    async isConnected()
    {
        try {
            await this._driver.authenticate()
            return true
        } catch (error) {
            console.error('Connection not established: ', error)
            return false;
        }
    }

    async defineModel()
    {
        this._shortener = this._driver.define('shortener', {
            id: {
                type: Sequelize.INTEGER,
                required: true,
                primaryKey: true,
                autoIncrement: true
            },
            alias: {
                type: Sequelize.STRING,
                required: true
            },
            url_original: {
                type: Sequelize.STRING,
                required: true
            },
            accesses: {
                type: Sequelize.INTEGER,
                required: true
            }
        }, {
            tableName: 'tb_urls',
            freezeTableName: false,
            timestamps: false
        })
        await this._shortener.sync()
    }

    async connect()
    {
        this._driver = new Sequelize(
            process.env.DB_NAME,
            process.env.DB_USER,
            process.env.DB_PASSWORD,
            {
                host: process.env.DB_IP,
                dialect: 'postgres',
                quoteIdentifiers: false,
                operatorAliases: false
            }
        )
        await this.defineModel()
    }

    async create(item)
    {
        if(!item.alias){
            item.alias = await Randomstring.generate({
                length: 6,
                charset: 'alphabetic'
            })
        }
        const {
            dataValues
        } = await this._shortener.create(item)
        return dataValues
    }

    async read(item = {})
    {
        return this._shortener.findAll({ where: item, raw: true })
    }

    async readOne(item)
    {
        return this._shortener.findAll({ where: item, raw: true })
    }

    async update(id, item)
    {   
        var accesses = parseInt(item.accesses)
        accesses++

        await this._shortener.update({ accesses }, { where: { id: item.id }, raw: true })
        return this._shortener.findAll({ where: { id: item.id }, raw: true })
    }

    async readPopular(){
        return this._shortener.findAll({ order: [['accesses', 'DESC']], limit: 10, raw: true })
    }

}

module.exports = Postgres