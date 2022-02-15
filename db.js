const Sequelize = require('sequelize')
const db = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/tv_networks')
const STRING = Sequelize.STRING

const Cable = db.define('cable', {
    name: {
        type: STRING,
        allowsNull: false,
        unique: true,
        validate: {
            notEmpty: true
        }
    }
})

const Series = db.define('series', {
    name: {
        type: STRING,
        allowsNull: false,
        validate: {
            notEmpty: true
        }
    }
})

Series.belongsTo(Cable)
Cable.hasMany(Series)

module.exports = {db, Cable, Series}