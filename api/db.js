const { connectToDatabase } = require('../lib/mongodb');

function json(res, status, data) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.end(JSON.stringify(data));
}

const EMPTY = {
  _id: 'portal',
  school: { name: 'Marvelous Faith Academy', tagline: 'Keep the Faith Alive!', address: '125 FTM Compound, Mambog 4, Bacoor City, Cavite, Philippines, 4102', phone: '0917 123 4567', email: 'mfaonline@mfabacoor.net', about: 'MFA Connect portal.' },
  accounts: [],
  students: {},
  teacherSched: [],
  gradeQueue: [],
  documents: [],
  teacherAssignments: [],
  site: { heroTitle: 'Welcome to Marvelous Faith Academy', heroSub: '', historyTitle: 'Our History', historyText: '', mission: '', vision: '', contact: '', hymn: '', about: '', footer: '', announcements: [] },
  _seq: 1
};

async function getPortalDoc(db) {
  const col = db.collection('studentportal');
  let doc = await col.findOne({ _id: 'portal' });
  if (!doc) { await col.insertOne(EMPTY); doc = EMPTY; }
  return doc;
}

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') return json(res, 200, { ok: true });
  try {
    const { db } = await connectToDatabase();
    if (req.method === 'GET') {
      const doc = await getPortalDoc(db);
      const { _id, ...data } = doc;
      return json(res, 200, { ok: true, data });
    }
    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
      if (!body || !Array.isArray(body.accounts)) return json(res, 400, { ok: false, error: 'Invalid payload' });
      await db.collection('studentportal').updateOne({ _id: 'portal' }, { $set: Object.assign({}, body, { _id: 'portal' }) }, { upsert: true });
      return json(res, 200, { ok: true });
    }
    return json(res, 405, { ok: false, error: 'Method not allowed' });
  } catch (e) {
    return json(res, 500, { ok: false, error: e.message || 'Server error' });
  }
};
