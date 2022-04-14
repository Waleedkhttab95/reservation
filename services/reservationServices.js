const { DateTime } = require("luxon");
const { Reservations } = require("../models/reservation");
const { Tables } = require("../models/tables")
const Sequelize = require('sequelize');
const { Op } = require("sequelize");
const datetime = require('date-and-time');

exports.checkSlots = async (req, res) => {
    const { date, seats } = req.query;
    const startWorkingHour = 12; // should read this value from DB
    const endWorkingHour = 23; // should read this value from DB

    // get table that fits the need based on variable {seat}
    const selectedTables = await getSelectedTables(seats)
    if (!selectedTables && selectedTables.length === 0) return res.status(200).send('Sorry we dont have any tables with this number of sets')

    // get all reservations of this day based on the table found

    // set all selected tables id in one array
    const allTablesIdInOneArr = selectedTables.map(table => table.tableNumber)
    // this query will return all reservations for all tables requested 
    const tables = await Tables.findAll({
        where: { tableNumber: allTablesIdInOneArr }
    }, {
        include: [{
            model: 'Reservations',
            attributes: ['startDate', 'endDate'],
            order: [
                ['startDate', 'ASC']
            ]
        }]
    })

    const available_times_for_tables = [];
    const listOFReservations = await Reservations.findAll({
        where: {
            tableNumber: allTablesIdInOneArr,
            startDate: { [Op.gte]: new Date() }
        }
    })

    tables.forEach(async (table) => {

        available_times_for_tables.push({
            table,
            available_times: getAvailableDatesForTable(listOFReservations, date, startWorkingHour, endWorkingHour),
        })
    }
    )

    // check if no available times for today
    if (available_times_for_tables.length === 0)
        return res.status(200).send("No available times")


    return res.status(200).send(available_times_for_tables)
};


exports.reserveTimeSlot = async (req, res) => {
    let { startDate, endDate, tableNumber } = req.body;
    startDate = new Date(startDate)
    endDate = new Date(endDate)

    const startWorkingHour = startDate.setHours(12, 0, 0); // should read this value from DB
    const endWorkingHour = endDate.setHours(23, 59, 0); // should read this value from DB

    // check if start and end date for reservation in the working hours time
    if (!(startDate >= startWorkingHour && endDate <= endWorkingHour))
        return res.status(400).send('out of work')

    // create new reservation 
    const reservations = new Reservations({
        startDate: startDate,
        endDate: endDate,
        tableNumber: tableNumber,
        reservationStatus: true
    })

    await reservations.save()

    // update table reservation table
    await Tables.update({ isReserved: true }, {
        where: {
            tableNumber: tableNumber
        }
    })

    // Should be create function and api OR Corn job to close reservation and change table status to false

    return res.status(201).send('Reservation successfully ')
}

exports.getAllReservations = async (req, res) => {
    const { page, perPage, tableNumber, startDate, endDate } = req.query

    const filterParams = {
        tableNumber: tableNumber ? tableNumber : undefined,
        startDate: { [Op.gte]: startDate, [Op.lt]: endDate }
    }

    const reservations = await Reservations.findAndCountAll({
        where: deleteUndefinedProperties(filterParams),
        limit: perPage,
        offset: page,
    })

    return res.status(200).json({
        reservations: reservations
    })
}

exports.getTodayReservations = async (req, res) => {
    const { sortType, page, perPage } = req.query;
    const today = new Date();

    const reservations = await Reservations.findAndCountAll({
        where: {
            startDate:
            {
                [Op.gte]: today, [Op.lt]: today
            }
        },
        limit: perPage,
        offset: page,
        order: [
            ['startDate', sortType]
        ]
    })

    return res.status(200).json({
        reservations: reservations
    })
}

exports.deleteReservation = async (req, res) => {
    const { reservationId } = req.query
    const today = new Date()

    await Reservations.destroy({
        where: {
            id: reservationId,
            startDate:
            {
                [Op.gte]: today
            }
        }
    });

    return res.status(200).send('deleted')
}

const getAvailableDatesForTable = (table, date, startWorkingHour, endWorkingHour) => {
    const now = date
        ? DateTime.fromFormat(date, "yyyy-MM-dd HH:mm")
        : DateTime.local().setZone("Asia/Riyadh");

    const endWorkingDateWithHours = new Date();
    endWorkingDateWithHours.setHours(23, 59)


    const available_times = [];

    // Handle case if we dont have any reservations to return full day
    if (table.length === 0) {

        available_times.push({
            from: now.toFormat("yyyy-MM-dd HH:mm"),
            to: datetime.format(endWorkingDateWithHours, "YYYY-MM-DD hh:mm A"),
        });
        return available_times;

    }

    for (let i = 0; i < table.length; i++) {
        const current = table[i];
        const next = table[i + 1];

        const currentEnd = DateTime.fromFormat(current.endDate, "yyyy-MM-dd HH:mm");
        const nextStart = DateTime.fromFormat(next.startDate, "yyyy-MM-dd HH:mm");

        // Always add available date from "date now" until the first reservation
        // We can add some time of timestamp of allowed minimum hours like 30 minutes, for example
        // if now differs from first reservation by only 10 minutes, we can skip it

        if (i === 0) {
            if (now.hour <= startWorkingHour) {
                now.set({ hour: startWorkingHour });
            }
            available_times.push({
                from: now.toFormat("yyyy-MM-dd HH:mm"),
                to: DateTime.fromFormat(current.startDate, "yyyy-MM-dd HH:mm"),
            });
        } else {
            /**
             * We are checking if the current item end time matches the next item start
             * if it doesn't, then we have some available time of reservation in between
             * else, we skip to the next item
             */
            const nextStartEqualsCurrentEnd =
                currentEnd.ordinal === nextStart.ordinal;

            if (!nextStartEqualsCurrentEnd) {
                available_times.push({
                    from: currentEnd.toFormat("yyyy-MM-dd HH:mm"),
                    to: nextStart.toFormat("yyyy-MM-dd HH:mm"),
                });
            }
        }
    }

    return available_times;
};

const getSelectedTables = async (seats) => {

    const tables = await Tables.findAll({
        where: {
            numberOfSets: {
                [Op.gte]: seats
            }
        },

        // Sort the result DESC to find the correct number of sets 
        order: [
            ['numberOfSets', 'ASC']
        ],
    })

    // return all tables that have same selected sets 
    // lets say the customer want table for 5 person and we have 2 table with 5 sets 
    // we want return these 2 tables , 
    return tables.filter(table => table.numberOfSets === tables[0].numberOfSets)
}

const deleteUndefinedProperties = (obj) => {
    for (const [key, value] of Object.entries(obj)) {
        if (value == undefined) {
            //@ts-ignore
            delete obj[key];
        }
    }

    return obj;
}
