const ICrud = require('./../interfaces/ICrud')

class ContextStrategy extends ICrud{

    constructor(strategy)
    {
        super()
        return this._database = strategy
    }

    create(item){
        return this._database.create(item)
    }

    read(item){
        return this._database.read(item)
    }

    isConnected()
    {
        return  this._database.isConnected()
    }

    connect()
    {
        return this._database.connect()
    }

}

module.exports = ContextStrategy