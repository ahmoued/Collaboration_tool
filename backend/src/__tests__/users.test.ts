import request from 'supertest';
import app from '../app.js';
import pool from '../db.js'

let token: string;

beforeAll(async () => {  
  const res = await request(app)
  .post('/auth/signup')
  .send({username: 'testuser', email: 'test@example.com', password: 'mypassword'})

  const login = await request(app)
  .post('/auth/login')
  .send({email: 'test@example.com', password: 'mypassword'});

  token = login.body.token
});

afterAll(async () =>{
  //clean up test user
  await pool.query('delete from users where email=$1', ['test@example.com']);
  await pool.end();
})

describe('Get /users/me', ()=>{
  it('should return loggrd in user profile', async ()=>{
    const res = await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe('test@example.com')
  })
})

describe ('Get /users', ()=>{
  it('should return a list of all users', async()=>{
    const res = await request(app)
    .get('/users/')
    .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true)
  })
})
