const Utils = require('./utils');
const messages = require('./messages');

async function getOhm(req, res) {
    try {
        const ohm = await Utils.getOhmById(req.params.id);
        if (ohm) {
            res.status(200).send(ohm);
        } else {
            res.status(404).send({
                message: messages.errors.OHM_NOT_FOUND
            });
        }
    } catch (e) {
        res.status(500).send({
            message: messages.errors.SERVER_ERROR
        });
    }
}

async function updateOhm(req, res) {
    try {
        const updated = await Utils.updateOhmStatus(req.params.id, req.body.status, req.body.comment);
        if (updated) {
            res.status(200).send(updated);
        } else {
            res.status(404).send({
                message: messages.errors.OHM_NOT_FOUND
            });
        }
    } catch (e) {
        res.status(500).send({
            message: messages.errors.SERVER_ERROR
        });
    }
}

module.exports = { 
    getOhm,
    updateOhm,
};