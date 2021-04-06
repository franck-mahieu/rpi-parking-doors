import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('RelaysController (e2e)', () => {
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

  describe('/relays/openClose (post)', () => {
    it('should open relay receveid for 10s when call with at least user credentials', done => {
      return request(app.getHttpServer())
        .post('/relays/openClose/0')
        .set('Authorization', 'Basic YWRtaW46YWRtaW4=')
        .expect(201)
        .expect({})
        .end(done);
    });
  });

  describe('/relays/state (get)', () => {
    it('should get state of received relayNumber when call with with at least user credentials', done => {
      return request(app.getHttpServer())
        .get('/relays/state/0')
        .set('Authorization', 'Basic YWRtaW46YWRtaW4=')
        .expect(200)
        .expect({})
        .end(done);
    });
  });
});
