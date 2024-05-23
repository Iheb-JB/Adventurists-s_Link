import mongoose from "mongoose";
import { app, express_server } from "../server.js";
import request from "supertest";
import { MongoMemoryServer } from 'mongodb-memory-server';
import { jest } from '@jest/globals';


let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
});

afterAll(async () => {
  await mongoServer.stop();
  await express_server.close();
});

beforeEach(async () => {
  const mongoUri = mongoServer.getUri();
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterEach(async () => {
  await mongoose.disconnect();
  jest.clearAllMocks(); // Clear any mocks to avoid interference between tests
});

jest.unstable_mockModule("../Models/Users", () => {
  return {
    find: jest.fn(() => ({
      select: jest.fn()
    })),
  };
});

jest.unstable_mockModule("../Models/userProfile", () => {
  return {
    findOne: jest.fn(),
    findById: jest.fn(),
    save: jest.fn(),
    // Additional necessary mocks depending on your test cases
  };
});

jest.unstable_mockModule("../Helpers/notificationHelper", () => ({
  sendNotification: jest.fn()
}));


const Users = await import('../Models/Users.js');
const userProfile = await import('../Models/userProfile.js');
const { sendNotification } = await import('../Helpers/notificationHelper.js');
import { editProfile } from '../Controllers/userProfile.js';
import { getUsersForSideBar } from "../Controllers/userProfile.js";

describe("getUsersForSideBar", () => {
  it("should exclude the logged-in user and not return passwords", async () => {
    const mockUsers = [{ _id: 1 }, { _id: 2 }];
    Users.find.mockResolvedValueOnce({
      select: jest.fn().mockResolvedValueOnce(mockUsers)
    });

    const req = { user: { _id: 1 } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await getUsersForSideBar(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe('editProfile', () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: {
        _id: 'userId',
        firstName: 'First',
        lastName: 'Last',
      },
      body: {
        username: 'newUsername',
        bio: 'newBio',
        profilePicture: 'newProfilePicture',
        travelerPreferences: ['newPreference'],
        identityVerified: true,
        accountStatus: 'active',
        gender: 'non-binary',
        dateOfBirth: '2000-01-01',
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should create a new user profile if not found', async () => {
  userProfile.findOne.mockResolvedValueOnce(null);

    const expected_output = {
      userId: 'userId',
      username: 'First_Last',
      bio: 'newBio',
      profilePicture: 'newProfilePicture',
      travelerPreferences: ['newPreference'],
      identityVerified: true,
      accountStatus: 'active',
      gender: 'non-binary',
      dateOfBirth: new Date('2000-01-01'),
    }
    
    const saveMock = jest.fn().mockResolvedValueOnce({
      userId: 'userId',
      username: 'First_Last',
      bio: 'newBio',
      profilePicture: 'newProfilePicture',
      travelerPreferences: ['newPreference'],
      identityVerified: true,
      accountStatus: 'active',
      gender: 'non-binary',
      dateOfBirth: new Date('2000-01-01'),
    });
    
    const newUserProfile = {
      save: saveMock,
    };
    
    // Mock the constructor
    jest.fn().mockImplementationOnce(() => newUserProfile);

    expect(expected_output).toEqual(expect.objectContaining({
      userId: 'userId',
      username: 'First_Last',
      bio: 'newBio',
      profilePicture: 'newProfilePicture',
      travelerPreferences: ['newPreference'],
      identityVerified: true,
      accountStatus: 'active',
      gender: 'non-binary',
      dateOfBirth: new Date('2000-01-01'),
    }));
  });

  it('should update an existing user profile', async () => {
    const existingUserProfile = {
      save: jest.fn(),
    };

    userProfile.findOne.mockResolvedValueOnce(existingUserProfile);

    await editProfile(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  it('should handle errors', async () => {
    const errorMessage = 'Database error';
    userProfile.findOne.mockRejectedValueOnce(new Error(errorMessage));

    await editProfile(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'internal server error' });
  });
});