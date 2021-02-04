const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
const adapter = new FileAsync('db.json');
const config = require('../db.config.json');
const constants = require('./constants');

const db = (async () => {
  const _db = await low(adapter);
  await _db.defaults(config).write();
  return _db;
})()

async function findOhmById(id) {
    const _db = await db;
    const ohms = _db.get('ohms');
    return ohms.find({ trackingId: id });
}

async function getOhmById(id) {
    const ohm = await findOhmById(id)
    return ohm.value();
}

async function updateOhmStatus(id, status = 'DELIVERED', comment = null) {
    let ohm = await findOhmById(id);
    const ohmValue = ohm.value();
    const ohmStatusIndex = constants.STATUS_LIST_CYCLE.indexOf(ohmValue.status);
    if (ohmStatusIndex < 3) { // Has not been shipped
        ohm = ohm.assign({ 'status': constants.STATUS_LIST_CYCLE[ohmStatusIndex+1] });
        await ohm.write();
        return ohm.value();
    }

    if (ohmValue.status === 'IN_DELIVERY' && (status === 'DELIVERED' || status === 'REFUSED')) {
        ohm = ohm.assign({ status, comment });
        await ohm.write();
        return ohm.value();
    }

    return false;
}

module.exports = { getOhmById, updateOhmStatus }