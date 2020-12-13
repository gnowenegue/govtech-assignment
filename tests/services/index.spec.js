const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const sinon = require('sinon');

const repositories = require('../../src/repositories');
const services = require('../../src/services');

const {
  getAllStudents,
  getStudentsByTeachers,
  getTeacherId,
  createTeacher,
  createStudents,
  assignStudentsToTeacher,
  suspendStudent,
  getStudentsByNotification,
} = require('../../src/services');
const ERR_MSG = require('../../src/services/errMsg');

describe('##### SERVICES #####', () => {
  describe('getAllStudents()', () => {
    let stub, stubResponse, expectedResponse;

    beforeEach(() => {
      stub = sinon.stub(repositories, 'getAllStudents');
    });

    afterEach(() => {
      stub.restore();
      stubResponse = undefined;
      expectedResponse = undefined;
    });

    it('successful response: returns array of students emails', async () => {
      stubResponse = [{ email: 'test1@test.com' }, { email: 'test2@test.com' }];
      expectedResponse = ['test1@test.com', 'test2@test.com'];
      stub.resolves(stubResponse);

      const students = await getAllStudents();
      expect(students).to.eql(expectedResponse).and.be.an('array');
    });

    it('error response: query returns object', async () => {
      stubResponse = { test: 'test' };
      stub.resolves(stubResponse);

      await expect(getAllStudents())
        .to.eventually.be.rejectedWith(ERR_MSG.getAllStudents)
        .and.be.an('error');
    });

    it('error response: query throws error', async () => {
      stub.rejects();

      await expect(getAllStudents())
        .to.eventually.be.rejectedWith(ERR_MSG.getAllStudents)
        .and.be.an('error');
    });
  });

  describe('getStudentsByTeachers()', () => {
    let stub, stubResponse, expectedResponse;
    const teacher = 'teacher1@mail.com';

    beforeEach(() => {
      stub = sinon.stub(repositories, 'getStudentsByTeachers');
    });

    afterEach(() => {
      stub.restore();
      stubResponse = undefined;
      expectedResponse = undefined;
    });

    it('successful response: returns array of students emails', async () => {
      stubResponse = [{ email: 'test1@test.com' }, { email: 'test2@test.com' }];
      expectedResponse = ['test1@test.com', 'test2@test.com'];
      stub.withArgs(teacher).resolves(stubResponse);

      const students = await getStudentsByTeachers(teacher);
      expect(students).to.eql(expectedResponse).and.be.an('array');
    });

    it('successful response: did not pass in argument', async () => {
      stubResponse = [];
      expectedResponse = [];
      stub.withArgs().resolves(stubResponse);

      const students = await getStudentsByTeachers();
      expect(students).to.eql(expectedResponse).and.be.an('array');
    });

    it('error response: query returns object', async () => {
      stubResponse = { test: 'test' };
      stub.withArgs(teacher).resolves(stubResponse);

      await expect(getStudentsByTeachers(teacher))
        .to.eventually.be.rejectedWith(ERR_MSG.getStudentsByTeachers)
        .and.be.an('error');
    });

    it('error response: query throws error', async () => {
      stub.withArgs(teacher).rejects();

      await expect(getStudentsByTeachers(teacher))
        .to.eventually.be.rejectedWith(ERR_MSG.getStudentsByTeachers)
        .and.be.an('error');
    });
  });

  describe('getTeacherId()', () => {
    let stub, stubResponse, expectedResponse;
    const teacher = 'teacher1@mail.com';

    beforeEach(() => {
      stub = sinon.stub(repositories, 'getTeacherId');
    });

    afterEach(() => {
      stub.restore();
      stubResponse = undefined;
      expectedResponse = undefined;
    });

    it('successful response: with id returned', async () => {
      stubResponse = [{ id: 1 }];
      expectedResponse = { id: 1 };
      stub.withArgs(teacher).resolves(stubResponse);

      const teacherId = await getTeacherId(teacher);
      expect(teacherId).to.eql(expectedResponse).and.be.an('object');
    });

    it('successful response: with no id returned', async () => {
      stubResponse = [];
      expectedResponse = { id: null };
      stub.withArgs(teacher).resolves(stubResponse);

      const teacherId = await getTeacherId(teacher);
      expect(teacherId).to.eql(expectedResponse).and.be.an('object');
    });

    it('successful response: query returns object', async () => {
      stubResponse = { test: 'test' };
      expectedResponse = { id: null };
      stub.withArgs(teacher).resolves(stubResponse);

      const teacherId = await getTeacherId(teacher);
      expect(teacherId).to.eql(expectedResponse).and.be.an('object');
    });

    it('error response: did not pass in argument', async () => {
      await expect(getTeacherId())
        .to.eventually.be.rejectedWith(ERR_MSG.getTeacherId)
        .and.be.an('error');
    });

    it('error response: query throws error', async () => {
      stub.withArgs(teacher).rejects();

      await expect(getTeacherId(teacher))
        .to.eventually.be.rejectedWith(ERR_MSG.getTeacherId)
        .and.be.an('error');
    });
  });

  describe('createTeacher()', () => {
    let stub, stubResponse, expectedResponse;
    const teacher = 'teacher1@mail.com';

    beforeEach(() => {
      stub = sinon.stub(repositories, 'createTeacher');
    });

    afterEach(() => {
      stub.restore();
      stubResponse = undefined;
      expectedResponse = undefined;
    });

    it('successful response: returns a teacher object', async () => {
      stubResponse = { insertId: 1 };
      expectedResponse = { id: 1, email: teacher };
      stub.withArgs(teacher).resolves(stubResponse);

      const students = await createTeacher(teacher);
      expect(students).to.eql(expectedResponse).and.be.an('object');
    });

    it('error response: did not pass in argument', async () => {
      await expect(createTeacher())
        .to.eventually.be.rejectedWith(ERR_MSG.createTeacher)
        .and.be.an('error');
    });

    it('error response: query throws error', async () => {
      stub.withArgs(teacher).rejects();

      await expect(createTeacher(teacher))
        .to.eventually.be.rejectedWith(ERR_MSG.createTeacher)
        .and.be.an('error');
    });
  });

  describe('createStudents()', () => {
    let stub;
    const teacherId = 1;
    const students = ['student1@mail.com', 'student2@mail.com'];

    beforeEach(() => {
      stub = sinon.stub(repositories, 'createStudents');
    });

    afterEach(() => {
      stub.restore();
    });

    it('successful response', async () => {
      await expect(createStudents(students, teacherId)).to.eventually.be.an(
        'undefined'
      );
    });

    it('error response: did not pass in arguments', async () => {
      await expect(createStudents())
        .to.eventually.be.rejectedWith(ERR_MSG.createStudents)
        .and.be.an('error');
    });

    it('error response: did not pass in teacherId argument', async () => {
      await expect(createStudents(students))
        .to.eventually.be.rejectedWith(ERR_MSG.createStudents)
        .and.be.an('error');
    });

    it('error response: query throws error', async () => {
      stub.withArgs(students, teacherId).rejects();

      await expect(createStudents(students, teacherId))
        .to.eventually.be.rejectedWith(ERR_MSG.createStudents)
        .and.be.an('error');
    });
  });

  describe('assignStudentsToTeacher()', () => {
    let getTeacherIdStub, createTeacherStub, createStudentsStub;
    const teacher = 'teacher1@mail.com';
    const students = ['student1@mail.com', 'student2@mail.com'];

    beforeEach(() => {
      getTeacherIdStub = sinon.stub(services, 'getTeacherId');
      createTeacherStub = sinon.stub(services, 'createTeacher');
      createStudentsStub = sinon.stub(services, 'createStudents');
    });

    afterEach(() => {
      getTeacherIdStub.restore();
      createTeacherStub.restore();
      createStudentsStub.restore();
    });

    it('successful response: teacher exists', async () => {
      getTeacherIdStub.withArgs(teacher).resolves({ id: 1 });
      createStudentsStub.withArgs(students, 1).resolves(undefined);

      await expect(
        assignStudentsToTeacher(students, teacher)
      ).to.eventually.be.an('undefined');
    });

    it('successful response: teacher does not exist', async () => {
      getTeacherIdStub.withArgs(teacher).resolves({ id: null });
      createTeacherStub.withArgs(teacher).resolves({ id: 1 });
      createStudentsStub.withArgs(students, 1).resolves(undefined);

      await expect(
        assignStudentsToTeacher(students, teacher)
      ).to.eventually.be.an('undefined');

      sinon.assert.calledOnce(createTeacherStub);
    });

    it('error response: did not pass in arguments', async () => {
      await expect(assignStudentsToTeacher())
        .to.eventually.be.rejectedWith(ERR_MSG.assignStudentsToTeacher)
        .and.be.an('error');
    });

    it('error response: did not pass in teacher argument', async () => {
      await expect(assignStudentsToTeacher(students))
        .to.eventually.be.rejectedWith(ERR_MSG.assignStudentsToTeacher)
        .and.be.an('error');
    });

    it('error response: getTeacherId service throws error', async () => {
      getTeacherIdStub.withArgs(teacher).rejects();

      await expect(assignStudentsToTeacher(students, teacher))
        .to.eventually.be.rejectedWith(ERR_MSG.assignStudentsToTeacher)
        .and.be.an('error');
    });

    it('error response: createTeacher service throws error', async () => {
      getTeacherIdStub.withArgs(teacher).resolves({ id: null });
      createTeacherStub.withArgs(teacher).rejects();

      await expect(assignStudentsToTeacher(students, teacher))
        .to.eventually.be.rejectedWith(ERR_MSG.assignStudentsToTeacher)
        .and.be.an('error');
    });

    it('error response: createStudents service throws error', async () => {
      getTeacherIdStub.withArgs(teacher).resolves({ id: null });
      createTeacherStub.withArgs(teacher).resolves({ id: 1 });
      createStudentsStub.withArgs(students, 1).rejects();

      await expect(assignStudentsToTeacher(students, teacher))
        .to.eventually.be.rejectedWith(ERR_MSG.assignStudentsToTeacher)
        .and.be.an('error');
    });
  });

  describe('suspendStudent()', () => {
    let stub;
    const student = 'student1@mail.com';

    beforeEach(() => {
      stub = sinon.stub(repositories, 'suspendStudent');
    });

    afterEach(() => {
      stub.restore();
    });

    it('successful response', async () => {
      await expect(suspendStudent(student)).to.eventually.be.an('undefined');
    });

    it('error response: did not pass in argument', async () => {
      await expect(suspendStudent())
        .to.eventually.be.rejectedWith(ERR_MSG.suspendStudent)
        .and.be.an('error');
    });

    it('error response: query throws error', async () => {
      stub.withArgs(student).rejects();

      await expect(suspendStudent(student))
        .to.eventually.be.rejectedWith(ERR_MSG.suspendStudent)
        .and.be.an('error');
    });
  });

  describe('getStudentsByNotification()', () => {
    let getStudentsByTeachersStub,
      filterStudentsByStatusStub,
      stubResponse,
      expectedResponse;
    const teacher = 'teacher1@mail.com';
    const notification = 'hello @student2@mail.com @student4@mail.com';

    beforeEach(() => {
      getStudentsByTeachersStub = sinon.stub(
        repositories,
        'getStudentsByTeachers'
      );
      filterStudentsByStatusStub = sinon.stub(
        repositories,
        'filterStudentsByStatus'
      );
    });

    afterEach(() => {
      getStudentsByTeachersStub.restore();
      filterStudentsByStatusStub.restore();
      stubResponse = undefined;
      expectedResponse = undefined;
    });

    it('successful response: returns array of students emails', async () => {
      getStudentsByTeachersResponse = [
        {
          email: 'student1@mail.com',
          status: 'active',
        },
        {
          email: 'student2@mail.com',
          status: 'active',
        },
        {
          email: 'student3@mail.com',
          status: 'suspend',
        },
      ];
      filterStudentsByStatusResponse = [
        {
          email: 'student2@mail.com',
        },
        {
          email: 'student4@mail.com',
        },
      ];
      const expectedResponse = [
        'student1@mail.com',
        'student2@mail.com',
        'student4@mail.com',
      ];
      getStudentsByTeachersStub.resolves(getStudentsByTeachersResponse);
      filterStudentsByStatusStub.resolves(filterStudentsByStatusResponse);

      const students = await getStudentsByNotification(teacher, notification);
      expect(students).to.eql(expectedResponse).and.be.an('array');
    });

    it('error response: did not pass in arguments', async () => {
      await expect(getStudentsByNotification())
        .to.eventually.be.rejectedWith(ERR_MSG.getStudentsByNotification)
        .and.be.an('error');
    });

    it('error response: did not pass in notification argument', async () => {
      await expect(getStudentsByNotification(teacher))
        .to.eventually.be.rejectedWith(ERR_MSG.getStudentsByNotification)
        .and.be.an('error');
    });

    it('error response: getStudentsByTeachers query throws error', async () => {
      getStudentsByTeachersStub.withArgs(teacher).rejects();

      await expect(getStudentsByNotification(teacher, notification))
        .to.eventually.be.rejectedWith(ERR_MSG.getStudentsByNotification)
        .and.be.an('error');
    });

    it('error response: filterStudentsByStatus query throws error', async () => {
      getStudentsByTeachersStub.resolves(getStudentsByTeachersResponse);
      filterStudentsByStatusStub.rejects();

      await expect(getStudentsByNotification(teacher, notification))
        .to.eventually.be.rejectedWith(ERR_MSG.getStudentsByNotification)
        .and.be.an('error');
    });
  });
});
