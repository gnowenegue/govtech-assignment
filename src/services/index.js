const repositories = require('../repositories');
const ERR_MSG = require('./errMsg');

const services = {
  getAllStudents,
  getStudentsByTeachers,
  getTeacherId,
  createTeacher,
  createStudents,
  assignStudentsToTeacher,
  suspendStudent,
  getStudentsByNotification,
};

async function getAllStudents() {
  try {
    const students = await repositories.getAllStudents();
    return students.map(student => student.email);
  } catch (e) {
    // console.error(e);
    throw new Error(ERR_MSG.getAllStudents);
  }
}

async function getStudentsByTeachers(teachers) {
  if (!teachers) return [];

  try {
    const students = await repositories.getStudentsByTeachers(teachers);
    return students.map(student => student.email);
  } catch (e) {
    // console.error(e);
    throw new Error(ERR_MSG.getStudentsByTeachers);
  }
}

async function getTeacherId(email) {
  if (!email) throw new Error(ERR_MSG.getTeacherId);

  try {
    const teacherId = await repositories.getTeacherId(email);
    return { id: teacherId.length ? teacherId[0].id : null };
  } catch (e) {
    // console.error(e);
    throw new Error(ERR_MSG.getTeacherId);
  }
}

async function createTeacher(email) {
  if (!email) throw new Error(ERR_MSG.createTeacher);

  try {
    const teacher = await repositories.createTeacher(email);
    return { id: teacher.insertId, email };
  } catch (e) {
    // console.error(e);
    throw new Error(ERR_MSG.createTeacher);
  }
}

async function createStudents(students, teacherId) {
  if (!students || !teacherId) throw new Error(ERR_MSG.createStudents);

  try {
    return await repositories.createStudents(students, teacherId);
  } catch (e) {
    // console.error(e);
    throw new Error(ERR_MSG.createStudents);
  }
}

async function assignStudentsToTeacher(students, teacher) {
  if (!students || !teacher) throw new Error(ERR_MSG.assignStudentsToTeacher);

  try {
    const teacherObj = await services.getTeacherId(teacher);
    let teacherId = teacherObj.id;
    if (teacherId === null) {
      const newTeacherObj = await services.createTeacher(teacher);
      teacherId = newTeacherObj.id;
    }

    return await services.createStudents(students, teacherId);
  } catch (e) {
    // console.error(e);
    throw new Error(ERR_MSG.assignStudentsToTeacher);
  }
}

async function suspendStudent(student) {
  if (!student) throw new Error(ERR_MSG.suspendStudent);

  try {
    return await repositories.suspendStudent(student);
  } catch (e) {
    // console.error(e);
    throw new Error(ERR_MSG.suspendStudent);
  }
}

async function getStudentsByNotification(teacher, notification) {
  if (!teacher || !notification)
    throw new Error(ERR_MSG.getStudentsByNotification);

  try {
    const studentsOfTeacher = await repositories.getStudentsByTeachers(teacher);
    const activeStudentsOfTeacher = studentsOfTeacher
      .filter(s => s.status === 'active')
      .map(s => s.email);

    const studentsMentionedInNotification = notification.match(/\w+@\S+/g);
    const activeStudentsMentionedInNotification = await repositories.filterStudentsByStatus(
      studentsMentionedInNotification,
      'active'
    );

    return Array.from(
      new Set([
        ...activeStudentsOfTeacher,
        ...activeStudentsMentionedInNotification.map(s => s.email),
      ])
    );
  } catch (e) {
    // console.error(e);
    throw new Error(ERR_MSG.getStudentsByNotification);
  }
}

module.exports = services;
