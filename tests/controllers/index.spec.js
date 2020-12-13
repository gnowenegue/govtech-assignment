const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;
const sinon = require('sinon');

const app = require('../../src');

const services = require('../../src/services');
const ERR_MSG = require('../../src/controllers/errMsg');

describe('##### CONTROLLERS #####', () => {
  describe('/api/commonstudents', () => {
    let getAllStudentsStub, getStudentsByTeachersStub;
    const teacher = 'teacher1@mail.com';

    beforeEach(() => {
      getAllStudentsStub = sinon.stub(services, 'getAllStudents');
      getStudentsByTeachersStub = sinon.stub(services, 'getStudentsByTeachers');
    });

    afterEach(() => {
      getAllStudentsStub.restore();
      getStudentsByTeachersStub.restore();
    });

    it('successful response: returns all students emails when no teacher argument exists', done => {
      const getAllStudentsResponse = ['student1@mail.com', 'student2@mail.com'];
      getAllStudentsStub.withArgs().resolves(getAllStudentsResponse);

      chai
        .request(app)
        .get('/api/commonstudents')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body)
            .to.eql({ students: getAllStudentsResponse })
            .and.be.an('object');
          return done();
        });
    });

    it('successful response: returns students emails', done => {
      const getStudentsByTeachersResponse = [
        'student1@mail.com',
        'student2@mail.com',
      ];
      getStudentsByTeachersStub
        .withArgs(teacher)
        .resolves(getStudentsByTeachersResponse);

      chai
        .request(app)
        .get(`/api/commonstudents?teacher=${teacher}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body)
            .to.eql({ students: getStudentsByTeachersResponse })
            .and.be.an('object');
          return done();
        });
    });

    it('error response: getAllStudents service throws error', done => {
      getAllStudentsStub.rejects();

      chai
        .request(app)
        .get(`/api/commonstudents`)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.text).to.equal(ERR_MSG.default);
          return done();
        });
    });

    it('error response: getStudentsByTeacher service throws error', done => {
      getStudentsByTeachersStub.withArgs(teacher).rejects();

      chai
        .request(app)
        .get(`/api/commonstudents?teacher=${teacher}`)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.text).to.equal(ERR_MSG.default);
          return done();
        });
    });
  });

  describe('/api/register', () => {
    const teacher = 'teacher1@mail.com';
    const students = ['student1@mail.com', 'student2@mail.com'];

    it('successful response', done => {
      const stub = sinon.stub(services, 'assignStudentsToTeacher');
      stub.withArgs(students, teacher).resolves();

      chai
        .request(app)
        .post(`/api/register`)
        .send({ teacher, students })
        .end((err, res) => {
          expect(res).to.have.status(204);
          expect(res.body).to.be.empty;

          stub.restore();
          return done();
        });
    });

    it('error response: assignStudentsToTeacher service throws error', done => {
      const stub = sinon.stub(services, 'assignStudentsToTeacher');
      stub.withArgs(students, teacher).rejects();

      chai
        .request(app)
        .post(`/api/register`)
        .send({ teacher, students })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.text).to.equal(ERR_MSG.default);

          stub.restore();

          return done();
        });
    });

    it('error response: did not pass in arguments', done => {
      chai
        .request(app)
        .post(`/api/register`)
        .send()
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.text).to.equal('Missing parameters: teacher, students');
          return done();
        });
    });

    it('error response: did not pass in teacher argument', done => {
      chai
        .request(app)
        .post(`/api/register`)
        .send({ students })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.text).to.equal('Missing parameter: teacher');
          return done();
        });
    });

    it('error response: did not pass in students argument', done => {
      chai
        .request(app)
        .post(`/api/register`)
        .send({ teacher })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.text).to.equal('Missing parameter: students');
          return done();
        });
    });
  });

  describe('/api/suspend', () => {
    const student = 'student1@mail.com';

    it('successful response', done => {
      const stub = sinon.stub(services, 'suspendStudent');
      stub.withArgs(student).resolves();
      chai
        .request(app)
        .post(`/api/suspend`)
        .send({ student })
        .end((err, res) => {
          expect(res).to.have.status(204);
          expect(res.body).to.be.empty;

          stub.restore();
          return done();
        });
    });

    it('error response: suspendStudent service throws error', done => {
      const stub = sinon.stub(services, 'suspendStudent');
      stub.withArgs(student).rejects();
      chai
        .request(app)
        .post(`/api/suspend`)
        .send({ student })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.text).to.equal(ERR_MSG.default);

          stub.restore();
          return done();
        });
    });

    it('error response: did not pass in argument', done => {
      chai
        .request(app)
        .post(`/api/suspend`)
        .send()
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.text).to.equal('Missing parameter: student');
          return done();
        });
    });
  });

  describe('/api/retrievefornotifications', () => {
    const teacher = 'teacher1@mail.com';
    const notification = 'hello';

    it('successful response: ', done => {
      const stub = sinon.stub(services, 'getStudentsByNotification');
      const stubResponse = ['student1@mail.com', 'student2@mail.com'];

      stub.withArgs(teacher, notification).resolves(stubResponse);

      chai
        .request(app)
        .post(`/api/retrievefornotifications`)
        .send({ teacher, notification })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body)
            .to.eql({ recipients: stubResponse })
            .and.be.an('object');

          stub.restore();
          return done();
        });
    });

    it('error response: getStudentsByNotification service throws error', done => {
      const stub = sinon.stub(services, 'getStudentsByNotification');
      stub.withArgs(teacher, notification).rejects();

      chai
        .request(app)
        .post(`/api/retrievefornotifications`)
        .send({ teacher, notification })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.text).to.equal(ERR_MSG.default);

          stub.restore();
          return done();
        });
    });

    it('error response: did not pass in arguments', done => {
      chai
        .request(app)
        .post(`/api/retrievefornotifications`)
        .send()
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.text).to.equal(
            'Missing parameters: teacher, notification'
          );
          return done();
        });
    });

    it('error response: did not pass in teacher argument', done => {
      chai
        .request(app)
        .post(`/api/retrievefornotifications`)
        .send({ notification })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.text).to.equal('Missing parameter: teacher');
          return done();
        });
    });

    it('error response: did not pass in notification argument', done => {
      chai
        .request(app)
        .post(`/api/retrievefornotifications`)
        .send({ teacher })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.text).to.equal('Missing parameter: notification');
          return done();
        });
    });
  });
});
