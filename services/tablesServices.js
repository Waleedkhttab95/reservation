const Reservation = require("../models/reservation");
const { Tables } = require("../models/tables")

exports.addNewTable = async (req, res) => {
    const { tableNumber, numberOfSets } = req.body;

    const newTable = new Tables({
        tableNumber: tableNumber,
        numberOfSets: numberOfSets
    })

    await newTable.save()

    return res.status(201).send('Added new table')
}


exports.getAllTables = async (req, res) => {
    const tables = await Tables.findAll({
        attributes: ['tableNumber', 'numberOfSets']
    });

    return res.status(200).send(tables)
}

exports.deleteTable = async (req, res) => {
    const tableNumber = req.query;

    // check if table have any reservation
    const reservation = await Reservation.findOne({
        where: {
            tableNumber: tableNumber,
            status: true
        }

    })
    if (reservation) return res.status(400).send('You cant delete this table , this table have reservation ')

    await Tables.destroy({
        where: {
            tableNumber: tableNumber
        }
    });

    return res.status(201).send('Deleted !')

}