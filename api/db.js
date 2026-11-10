const { connectToDatabase } = require('../lib/mongodb');

function json(res, status, data) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.end(JSON.stringify(data));
}

const SEED = {
  _id: 'portal',
  school: { name: 'Marvelous Faith Academy', tagline: 'Keep the Faith Alive!', address: '125 FTM Compound, Mambog 4, Bacoor City, Cavite, Philippines, 4102', phone: '0917 123 4567', email: 'mfaonline@mfabacoor.net', about: 'MFA Connect portal.' },
  accounts: [
    { id: 'admin-001', pw: 'Temp#Admin1', role: 'admin', name: 'Ms. Angela Reyes', first: true },
    { id: 'registrar-001', pw: 'Temp#Regis1', role: 'registrar', name: 'Mrs. Liza Bautista', first: true },
    { id: 'cashier-001', pw: 'Temp#Cash1', role: 'cashier', name: 'Mr. Carlo Santos', first: true },
    { id: 'teacher-001', pw: 'Temp#Teach1', role: 'teacher', name: 'Mr. Roberto Garcia', subject: 'Mathematics', first: true },
    { id: '2023-0142', pw: 'Temp#Stud1', role: 'student', name: 'Juan Miguel Dela Cruz', level: 'Grade 8 – St. Matthew', sy: '2025–2026', adviser: 'Mr. Roberto Garcia', first: true }
  ],
  students: {
    '2023-0142': {
      sched: [['7:30 – 8:30 AM','Filipino','Mon · Wed · Fri','Rm 201','Mrs. Reyes'],['8:30 – 9:30 AM','Mathematics','Mon – Fri','Rm 201','Mr. Garcia'],['9:45 – 10:45 AM','Science','Mon · Tue · Thu','Science Lab','Ms. Villanueva'],['10:45 – 11:45 AM','English','Mon – Fri','Rm 201','Mrs. Cruz'],['1:00 – 2:00 PM','Araling Panlipunan','Tue · Thu','Rm 201','Mr. Bautista'],['2:00 – 3:00 PM','MAPEH','Wed · Fri','Gym','Coach Ramos'],['3:00 – 4:00 PM','Christian Living','Tue','Chapel','Pastor Lim']],
      att: [['Nov 3','Present'],['Oct 31','Present'],['Oct 30','Late'],['Oct 29','Present'],['Oct 28','Present'],['Oct 27','Absent'],['Oct 24','Present'],['Oct 23','Present'],['Oct 22','Present'],['Oct 21','Late']],
      fees: { total: 42500, pay: [['Jun 10, 2025','OR-004512','Enrollment / Downpayment',15000],['Aug 5, 2025','OR-004877','Monthly Installment',5500],['Sep 8, 2025','OR-005103','Monthly Installment',5500],['Oct 6, 2025','OR-005390','Monthly Installment',5500]] },
      grades: { '2025–2026': [['Filipino',88,90,null,null,null],['English',91,89,null,null,null],['Mathematics',84,null,null,null,null],['Science',86,88,null,null,null],['Araling Panlipunan',90,92,null,null,null],['MAPEH',93,94,null,null,null],['Edukasyon sa Pagpapakatao',95,94,null,null,null],['TLE',89,91,null,null,null],['Christian Living',96,97,null,null,null]] }
    }
  },
  teacherSched: [['7:30 – 8:30 AM','Mathematics 8','Grade 8 – St. Matthew','Rm 201','Mon – Fri'],['8:30 – 9:30 AM','Math Remediation','Grade 8 – St. Mark','Rm 202','Tue · Thu']],
  gradeQueue: [{ id: 1, studentId: '2023-0142', student: 'Juan Miguel Dela Cruz', subject: 'Mathematics', quarter: 2, grade: 87, teacher: 'Mr. Roberto Garcia', status: 'pending', sy: '2025–2026' }],
  documents: [{ id: 1, student: 'Juan Miguel Dela Cruz', studentId: '2023-0142', type: 'Registration Form', status: 'On file', date: 'Jun 5, 2025' },{ id: 2, student: 'Juan Miguel Dela Cruz', studentId: '2023-0142', type: 'Certificate of Enrollment', status: 'Available on request', date: 'Jun 10, 2025' }],
  teacherAssignments: [],
  site: { heroTitle: 'Welcome to Marvelous Faith Academy', heroSub: '', historyTitle: 'Our History', historyText: '', mission: '', vision: '', contact: '', hymn: '', about: '', footer: '', announcements: [] },
  _seq: 10
};

async function getPortalDoc(db) {
  const col = db.collection('portal');
  let doc = await col.findOne({ _id: 'portal' });
  if (!doc) { await col.insertOne(SEED); doc = SEED; }
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
      await db.collection('portal').updateOne({ _id: 'portal' }, { $set: Object.assign({}, body, { _id: 'portal' }) }, { upsert: true });
      return json(res, 200, { ok: true });
    }
    return json(res, 405, { ok: false, error: 'Method not allowed' });
  } catch (e) {
    return json(res, 500, { ok: false, error: e.message || 'Server error' });
  }
};
