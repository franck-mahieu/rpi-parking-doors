import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('UsersController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/users/rolesAndGuid (get)', () => {
    it('should return admin user informations when call with admin credentials', done => {
      return request(app.getHttpServer())
        .get('/users/rolesAndGuid')
        .set('Authorization', 'Basic YWRtaW46YWRtaW4=')
        .expect(200)
        .expect({
          roles: 'user admin',
          guid: 'bd346e3a-5a18-4142-82cd-f1940e9d5209',
        })
        .end(done);
    });

    it('should return admin user informations when call with admin guid', done => {
      return request(app.getHttpServer())
        .get('/users/rolesAndGuid?guid=bd346e3a-5a18-4142-82cd-f1940e9d5209')
        .expect(200)
        .expect({
          roles: 'user admin',
          guid: 'bd346e3a-5a18-4142-82cd-f1940e9d5209',
        })
        .end(done);
    });
  });

  describe('/users/all (get)', () => {
    it('should return all users informations when call with admin credentials', done => {
      return request(app.getHttpServer())
        .get('/users/all')
        .set('Authorization', 'Basic YWRtaW46YWRtaW4=')
        .expect(200)
        .expect([
          {
            login: 'admin',
            roles: 'user admin',
            email: 'admin@mail.com',
            expiration: null,
          },
        ])
        .end(done);
    });
  });

  describe('/users/add (put)', () => {
    it('should add user when call with admin credentials', done => {
      return request(app.getHttpServer())
        .put('/users/add')
        .set('Authorization', 'Basic YWRtaW46YWRtaW4=')
        .send({
          login: 'user',
          password: 'password',
          roles: 'roles',
          email: 'email',
          expiration: undefined,
        })
        .expect(200)
        .expect(res => expect(res.body.changes).toEqual(1))
        .end(done);
    });
  });

  describe('/users/remove (delete)', () => {
    it('should remove user when call with admin credentials', done => {
      return request(app.getHttpServer())
        .delete('/users/remove')
        .set('Authorization', 'Basic YWRtaW46YWRtaW4=')
        .send({
          login: 'user',
        })
        .expect(200)
        .expect(res => expect(res.body.changes).toEqual(1))

        .end(done);
    });
  });

  describe('/users/updatepassword (post)', () => {
    it('should update password of user received in body when call with admin credentials', done => {
      return request(app.getHttpServer())
        .post('/users/updatepassword')
        .set('Authorization', 'Basic YWRtaW46YWRtaW4=')
        .send({
          login: 'admin',
          password: 'admin',
        })
        .expect(201)
        .expect(res => expect(res.body.changes).toEqual(1))
        .end(done);
    });
  });
});
