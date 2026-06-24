jest.mock('../config/dataService');

const request = require('supertest');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = require('../app');
const dataService = require('../config/dataService');

const generateAdminToken = () => {
  return jwt.sign(
    {
      user: {
        id: 'user_admin',
        username: 'admin',
        role: 'admin',
        permissions: { view: true, edit: true, delete: true }
      }
    },
    process.env.JWT_SECRET || 'kursath_jwt_secret_token',
    { expiresIn: '24h' }
  );
};

const generateSubAdminToken = (permissions = { view: true, edit: false, delete: false }) => {
  return jwt.sign(
    {
      user: {
        id: 'user_subadmin',
        username: 'subadmin',
        role: 'sub-admin',
        permissions
      }
    },
    process.env.JWT_SECRET || 'kursath_jwt_secret_token',
    { expiresIn: '24h' }
  );
};

describe('API integration tests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return opportunities from GET /api/opportunities', async () => {
    const opportunities = [
      { _id: 'opp_1', title: 'Test Scholarship', provider: 'Test Provider' }
    ];

    dataService.getOpportunities.mockResolvedValue(opportunities);

    const res = await request(app).get('/api/opportunities');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(opportunities);
    expect(dataService.getOpportunities).toHaveBeenCalled();
  });

  it('should create a message with POST /api/contact', async () => {
    const message = {
      _id: 'msg_1',
      name: 'Test User',
      email: 'test@example.com',
      message: 'Hello world',
      createdAt: new Date().toISOString()
    };

    dataService.createMessage.mockResolvedValue(message);

    const res = await request(app)
      .post('/api/contact')
      .send({ name: 'Test User', email: 'test@example.com', message: 'Hello world' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ msg: 'Message sent successfully!', newMessage: message });
    expect(dataService.createMessage).toHaveBeenCalledWith({
      name: 'Test User',
      email: 'test@example.com',
      message: 'Hello world'
    });
  });

  it('should authenticate admin with POST /api/auth/login', async () => {
    const plainPassword = 'password123';
    const hashedPassword = bcrypt.hashSync(plainPassword, 10);
    const user = {
      _id: 'user_admin',
      username: 'admin',
      password: hashedPassword,
      role: 'admin',
      permissions: { view: true, edit: true, delete: true }
    };

    dataService.getUser.mockResolvedValue(user);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: plainPassword });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeTruthy();
    expect(res.body.user).toEqual(expect.objectContaining({ username: 'admin', role: 'admin' }));
  });

  it('should return authenticated user data for GET /api/auth/user', async () => {
    const plainPassword = 'password123';
    const hashedPassword = bcrypt.hashSync(plainPassword, 10);
    const user = {
      _id: 'user_admin',
      username: 'admin',
      password: hashedPassword,
      role: 'admin',
      permissions: { view: true, edit: true, delete: true },
      savedOpportunities: ['opp_1']
    };

    const opportunities = [{ _id: 'opp_1', title: 'Saved Opportunity' }];

    dataService.getUser.mockResolvedValue(user);
    dataService.getFallbackStatus.mockReturnValue(true);
    dataService.getOpportunities.mockResolvedValue(opportunities);

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: plainPassword });

    expect(loginRes.status).toBe(200);
    const token = loginRes.body.token;
    expect(token).toBeTruthy();

    const userRes = await request(app)
      .get('/api/auth/user')
      .set('Authorization', `Bearer ${token}`);

    expect(userRes.status).toBe(200);
    expect(userRes.body).toEqual(expect.objectContaining({
      username: 'admin',
      role: 'admin',
      savedOpportunities: opportunities
    }));
  });

  it('should create a new opportunity with POST /api/opportunities', async () => {
    const token = generateAdminToken();
    const newOpportunity = {
      _id: 'opp_2',
      title: 'New Scholarship',
      provider: 'Example Org',
      category: 'scholarship'
    };

    dataService.createOpportunity.mockResolvedValue(newOpportunity);

    const res = await request(app)
      .post('/api/opportunities')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'New Scholarship',
        provider: 'Example Org',
        category: 'scholarship',
        type: 'Government',
        deadline: '31 Dec 2026'
      });

    expect(res.status).toBe(200);
    expect(res.body).toEqual(newOpportunity);
    expect(dataService.createOpportunity).toHaveBeenCalledWith(expect.objectContaining({
      title: 'New Scholarship',
      provider: 'Example Org',
      category: 'scholarship'
    }));
  });

  it('should update an existing message with PUT /api/contact/:id', async () => {
    const token = generateAdminToken();
    const updatedMessage = {
      _id: 'msg_1',
      name: 'Test User',
      email: 'test@example.com',
      message: 'Hello world',
      fixed: true
    };

    dataService.updateMessage.mockResolvedValue(updatedMessage);

    const res = await request(app)
      .put('/api/contact/msg_1')
      .set('Authorization', `Bearer ${token}`)
      .send({ fixed: true });

    expect(res.status).toBe(200);
    expect(res.body).toEqual(updatedMessage);
    expect(dataService.updateMessage).toHaveBeenCalledWith('msg_1', { fixed: true });
  });

  it('should create a volunteer with POST /api/volunteers', async () => {
    const token = generateAdminToken();
    const volunteer = {
      _id: 'vol_1',
      name: 'Volunteer One',
      city: 'Delhi'
    };

    dataService.createVolunteer.mockResolvedValue(volunteer);

    const res = await request(app)
      .post('/api/volunteers')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Volunteer One',
        specialty: 'Scholarships',
        city: 'Delhi',
        status: 'available',
        contact: 'volunteer@example.com'
      });

    expect(res.status).toBe(200);
    expect(res.body).toEqual(volunteer);
    expect(dataService.createVolunteer).toHaveBeenCalledWith(expect.objectContaining({
      name: 'Volunteer One', city: 'Delhi'
    }));
  });

  it('should update a volunteer with PUT /api/volunteers/:id', async () => {
    const token = generateAdminToken();
    const updatedVolunteer = {
      _id: 'vol_1',
      name: 'Volunteer One',
      city: 'Delhi',
      status: 'busy'
    };

    dataService.updateVolunteer.mockResolvedValue(updatedVolunteer);

    const res = await request(app)
      .put('/api/volunteers/vol_1')
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'busy' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual(updatedVolunteer);
    expect(dataService.updateVolunteer).toHaveBeenCalledWith('vol_1', { status: 'busy' });
  });

  it('should delete a volunteer with DELETE /api/volunteers/:id', async () => {
    const token = generateAdminToken();
    const deletedVolunteer = {
      _id: 'vol_1',
      name: 'Volunteer One',
      city: 'Delhi'
    };

    dataService.deleteVolunteer.mockResolvedValue(deletedVolunteer);

    const res = await request(app)
      .delete('/api/volunteers/vol_1')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ msg: 'Volunteer removed successfully', deletedVolunteer });
    expect(dataService.deleteVolunteer).toHaveBeenCalledWith('vol_1');
  });

  it('should return contact messages for GET /api/contact when authenticated', async () => {
    const token = generateAdminToken();
    const messages = [
      { _id: 'msg_1', name: 'Test User', email: 'test@example.com', message: 'Hello world' }
    ];

    dataService.getMessages.mockResolvedValue(messages);

    const res = await request(app)
      .get('/api/contact')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(messages);
    expect(dataService.getMessages).toHaveBeenCalled();
  });

  it('should update an opportunity with PUT /api/opportunities/:id', async () => {
    const token = generateAdminToken();
    const updatedOpportunity = {
      _id: 'opp_1',
      title: 'Updated Scholarship',
      provider: 'Example Org',
      category: 'scholarship'
    };

    dataService.updateOpportunity.mockResolvedValue(updatedOpportunity);

    const res = await request(app)
      .put('/api/opportunities/opp_1')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated Scholarship' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual(updatedOpportunity);
    expect(dataService.updateOpportunity).toHaveBeenCalledWith('opp_1', { title: 'Updated Scholarship' });
  });

  it('should delete an opportunity with DELETE /api/opportunities/:id', async () => {
    const token = generateAdminToken();
    const deletedOpportunity = {
      _id: 'opp_1',
      title: 'Gone Scholarship',
      provider: 'Example Org'
    };

    dataService.deleteOpportunity.mockResolvedValue(deletedOpportunity);

    const res = await request(app)
      .delete('/api/opportunities/opp_1')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ msg: 'Opportunity removed successfully', deletedOpportunity });
    expect(dataService.deleteOpportunity).toHaveBeenCalledWith('opp_1');
  });

  it('should deny sub-admin without edit permission from creating opportunity', async () => {
    const token = generateSubAdminToken({ view: true, edit: false, delete: false });
    const res = await request(app)
      .post('/api/opportunities')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Unauthorized Scholarship',
        provider: 'Example Org',
        category: 'scholarship'
      });

    expect(res.status).toBe(403);
    expect(res.body).toEqual(expect.objectContaining({ msg: expect.stringContaining('Access Denied') }));
  });

  it('should deny sub-admin without delete permission from deleting volunteer', async () => {
    const token = generateSubAdminToken({ view: true, edit: true, delete: false });

    const res = await request(app)
      .delete('/api/volunteers/vol_1')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(403);
    expect(res.body).toEqual(expect.objectContaining({ msg: expect.stringContaining('Access Denied') }));
  });

  it('should deny sub-admin without edit permission from updating volunteer', async () => {
    const token = generateSubAdminToken({ view: true, edit: false, delete: false });

    const res = await request(app)
      .put('/api/volunteers/vol_1')
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'busy' });

    expect(res.status).toBe(403);
    expect(res.body).toEqual(expect.objectContaining({ msg: expect.stringContaining('Access Denied') }));
  });

  it('should require authentication for GET /api/contact', async () => {
    const res = await request(app).get('/api/contact');

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ msg: 'No token, authorization denied' });
  });
});
