const db = require('../config/connect.js');

class TrackRecord {
    async getRecords(req, res){
        let {user_id} = req.body;

        await db.getConnection((err, connection) => {
            if (err) throw err;

            connection.query(`SELECT track_record_id, origin, destination, record_date FROM track_record WHERE user_id = ${user_id}`, (err, result) => {
                if (err) throw err;
                if (result.length != 0){
                    res.json(result);
                } else {
                    res.json({message: 'Aún no ha registrado rutas en su perfil'})
                }
                
            });

            connection.release();
        });

        /*
        await db.query(`SELECT track_record_id, origin, destination, record_date FROM track_record WHERE user_id = ${user_id}`, (err, result) => {
            if (err) throw err;
            if (result.length != 0){
                res.json(result);
            } else {
                res.json({message: 'Aún no ha registrado rutas en su perfil'})
            }
            
        })*/
    }

    async saveRecord(req, res){
        let user_id = req.params.user_id;
        let {origin, origin_coord, destination, destination_coord, route} = req.body;

        await db.getConnection((err, connection) => {
            if (err) throw err;

            connection.query(`INSERT INTO track_record(origin, origin_coord, destination, destination_coord, route, user_id) 
            VALUES ('${origin}', '${origin_coord}', '${destination}', '${destination_coord}', '${route}', ${user_id})`, (err, result) => {
                if (err) throw err;
                res.json({message: 'Ruta guardada exitosamente'});
            })

            connection.release();
        });

        /*
        await db.query(`INSERT INTO track_record(origin, origin_coord, destination, destination_coord, route, user_id) 
        VALUES ('${origin}', '${origin_coord}', '${destination}', '${destination_coord}', '${route}', ${user_id})`, (err, result) => {
            if (err) throw err;
            res.json({message: 'Ruta guardada exitosamente'});
        })*/
    }

    async getUserRecord(req, res){
        let user_id = req.params.user_id;
        let {start_date, end_date} = req.body;

        await db.getConnection((err, connection) => {
            if (err) throw err;

            connection.query(`SELECT track_record_id, origin, destination, record_date FROM track_record 
            WHERE user_id = ${user_id} AND record_date BETWEEN '${start_date}' AND '${end_date}'`, (err, result) => {
                if (err) throw err;
                if (result.length > 0){
                    res.json(result);
                } else {
                    res.json({message: 'No tiene rutas que concuerden con su búsqueda'});
                }
            });

            connection.release();
        });
        /*
        await db.query(`SELECT track_record_id, origin, destination, record_date FROM track_record 
        WHERE user_id = ${user_id} AND record_date BETWEEN '${start_date}' AND '${end_date}'`, (err, result) => {
            if (err) throw err;
            if (result.length > 0){
                res.json(result);
            } else {
                res.json({message: 'No tiene rutas que concuerden con su búsqueda'});
            }
            
        })*/
    }

    async getDetailedRecord(req, res){
        let {track_record_id, user_id} = req.body;

        await db.getConnection((err, connection) => {
            if (err) throw err;

            connection.query(`SELECT * FROM track_record WHERE track_record_id = ${track_record_id}`, (err, result) => {
                if (err) throw err;
                if (result.length > 0){
                    if (result[0].user_id == user_id){
                        res.json(result);
                    } else {
                        res.json({message: 'Usuario No autorizado'});
                    }
                } else {
                    res.json({message: 'Ruta inexistente'})
                } 
            });

            connection.release();
        });
        /*
        await db.query(`SELECT * FROM track_record WHERE track_record_id = ${track_record_id}`, (err, result) => {
            if (err) throw err;
            if (result.length > 0){
                if (result[0].user_id == user_id){
                    res.json(result);
                } else {
                    res.json({message: 'Usuario No autorizado'});
                }
            } else {
                res.json({message: 'Ruta inexistente'})
            }
            
        })*/
    }

}

module.exports = new TrackRecord();