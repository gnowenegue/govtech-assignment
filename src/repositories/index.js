const db = require('./db');

const getAllStudents = () => {
  const sql = `SELECT email FROM students`;

  return new Promise((resolve, reject) => {
    db.query(sql, (err, data, fields) => {
      if (err) return reject(err);
      return resolve(data);
    });
  });
};

const getStudentsByTeachers = teachers => {
  const sql = `SELECT s.email, s.status FROM students s LEFT JOIN teachers t ON s.teacher_id = t.id WHERE t.email IN (?) GROUP BY s.email HAVING COUNT(s.email) = ?`;

  const teachersValue = Array.isArray(teachers) ? teachers : [teachers];

  return new Promise((resolve, reject) => {
    db.query(
      sql,
      [teachersValue, teachersValue.length],
      (err, data, fields) => {
        if (err) return reject(err);
        return resolve(data);
      }
    );
  });
};

const getTeacherId = email => {
  const sql = `SELECT id FROM teachers WHERE teachers.email = ?`;

  return new Promise((resolve, reject) => {
    db.query(sql, email, (err, data, fields) => {
      if (err) return reject(err);
      return resolve(data);
    });
  });
};

const createTeacher = email => {
  const sql = `INSERT INTO teachers (email) VALUES (?)`;

  return new Promise((resolve, reject) => {
    db.query(sql, email, (err, data, fields) => {
      if (err) return reject(err);
      return resolve(data);
    });
  });
};

const getStudentId = email => {
  const sql = `SELECT id FROM students WHERE students.email = ?`;

  return new Promise((resolve, reject) => {
    db.query(sql, email, (err, data, fields) => {
      if (err) return reject(err);
      return resolve(data);
    });
  });
};

const createStudents = (students, teacherId) => {
  const sql = `INSERT INTO students (email, teacher_id) VALUES ?`;
  const values = [];
  students.forEach(s => {
    values.push([s, teacherId]);
  });

  return new Promise((resolve, reject) => {
    db.query(sql, [values], (err, data, fields) => {
      if (err) return reject(err);
      return resolve(data);
    });
  });
};

const suspendStudent = student => {
  const sql = `UPDATE students SET status = 'suspend' WHERE students.email = ?`;

  return new Promise((resolve, reject) => {
    db.query(sql, student, (err, data, fields) => {
      if (err) return reject(err);
      return resolve(data);
    });
  });
};

const filterStudentsByStatus = (students, status) => {
  const sql = `SELECT email FROM students WHERE students.email IN (?) AND students.status = ? GROUP BY email`;

  return new Promise((resolve, reject) => {
    db.query(sql, [students, status], (err, data, fields) => {
      if (err) return reject(err);
      return resolve(data);
    });
  });
};

module.exports = {
  getAllStudents,
  getStudentsByTeachers,
  getTeacherId,
  createTeacher,
  getStudentId,
  createStudents,
  suspendStudent,
  filterStudentsByStatus,
};
