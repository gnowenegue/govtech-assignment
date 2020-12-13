const express = require('express');
const router = express.Router();

const services = require('../services');
const ERR_MSG = require('./errMsg');

router.get('/commonstudents', async (req, res) => {
  let students;

  try {
    if (!req.query.teacher) {
      students = await services.getAllStudents();
    } else {
      students = await services.getStudentsByTeachers(req.query.teacher);
    }

    return res.status(200).json({ students });
  } catch (e) {
    return res.status(400).send(ERR_MSG.default);
  }
});

router.post('/register', async (req, res) => {
  const missingParameters = [];

  if (!req.body.teacher) missingParameters.push('teacher');
  if (!req.body.students) missingParameters.push('students');
  if (missingParameters.length) {
    return res
      .status(400)
      .send(
        `Missing parameter${
          missingParameters.length > 1 ? 's' : ''
        }: ${missingParameters.join(', ')}`
      );
  }

  try {
    await services.assignStudentsToTeacher(req.body.students, req.body.teacher);

    return res.status(204).send();
  } catch (e) {
    return res.status(400).send(ERR_MSG.default);
  }
});

router.post('/suspend', async (req, res) => {
  if (!req.body.student) {
    return res.status(400).send(`Missing parameter: student`);
  }

  try {
    await services.suspendStudent(req.body.student);
    return res.status(204).send();
  } catch (e) {
    return res.status(400).send(ERR_MSG.default);
  }
});

router.post('/retrievefornotifications', async (req, res) => {
  const missingParameters = [];

  if (!req.body.teacher) missingParameters.push('teacher');
  if (!req.body.notification) missingParameters.push('notification');
  if (missingParameters.length) {
    return res
      .status(400)
      .send(
        `Missing parameter${
          missingParameters.length > 1 ? 's' : ''
        }: ${missingParameters.join(', ')}`
      );
  }

  try {
    const students = await services.getStudentsByNotification(
      req.body.teacher,
      req.body.notification
    );

    return res.status(200).json({ recipients: students });
  } catch (e) {
    return res.status(400).send(ERR_MSG.default);
  }
});

module.exports = router;
