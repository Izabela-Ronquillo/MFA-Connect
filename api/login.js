const { connectToDatabase } = require('../lib/mongodb');

function json(res, status, data) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.end(JSON.stringify(data));
}

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') return json(res, 200, { ok: true });
  if (req.method !== 'POST') return json(res, 405, { ok: false, error: 'Method not allowed' });
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const id = String(body.id || '').trim();
    const pw = String(body.pw || '');
    if (!id || !pw) return json(res, 400, { ok: false, error: 'Missing credentials' });
    const { db } = await connectToDatabase();
    const doc = await db.collection('studentportal').findOne({ _id: 'portal' });
    if (!doc || !Array.isArray(doc.accounts)) return json(res, 500, { ok: false, error: 'Portal data not initialized' });
    const acct = doc.accounts.find(a => String(a.id) === id);
    if (!acct || acct.pw !== pw) return json(res, 401, { ok: false, error: 'Incorrect ID or password.' });
    const { pw: _pw, ...safe } = acct;
    return json(res, 200, { ok: true, account: safe });
  } catch (e) {
    return json(res, 500, { ok: false, error: e.message || 'Server error' });
  }
};
