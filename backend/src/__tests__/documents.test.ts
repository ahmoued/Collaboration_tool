import request from 'supertest'
import app from '../app.js'
import pool from '../db.js'

let token: string

beforeAll(async()=>{
    const res = await request(app)
    .post('/auth/signup')
    .send({username: 'example', email: 'example@test.com', password: 'password'})

    const loginres = await request(app)
    .post('/auth/login')
    .send({email: 'example@test.com', password: 'password'})
    token = loginres.body.token
})

describe('document api', ()=>{
    let docId: Number
    it('should create a new document', async ()=>{
        const res = await request(app)
        .post('/docs')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Test Doc', content: { text: 'Hello world' } });
        expect(res.statusCode).toBe(200)
        expect(res.body.title).toBe('Test Doc')
        docId = res.body.id;
    })
    it('should fetch all documents for the user', async () => {
    const res = await request(app)
      .get('/docs')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it('should fetch a document by ID', async () => {
    const res = await request(app)
      .get(`/docs/${docId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(docId);
  });

  it('should update a document', async () => {
    const res = await request(app)
      .put(`/docs/${docId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated Doc', content: { text: 'Updated content' } });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Updated Doc');
  });

  it('should delete a document', async () => {
    const res = await request(app)
      .delete(`/docs/${docId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Document deleted');
  });
})
