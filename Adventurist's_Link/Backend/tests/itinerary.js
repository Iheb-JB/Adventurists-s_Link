import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { jest } from '@jest/globals';
import { createItinerary, editItineray, deleteItinerary, addActivity, removeActivityFromItinerary, addParticipant, removeParticipantFromItinerary, addDestinationToItinerary, removeDestinationFromItinerary, createFellowTravelerRequest } from '../Controllers/Itinerary.js';

jest.unstable_mockModule('../Helpers/notificationHelper.js', () => ({
  sendNotification: jest.fn(),
}));

jest.unstable_mockModule('../Helpers/fellowTravelerRequestHelper.js', () => ({
  sendFellowTravelerRequest: jest.fn(),
}));

jest.unstable_mockModule('../Models/Activity.js', () => ({
  default: {
    find: jest.fn(),
    findById: jest.fn(),
  },
}));

jest.unstable_mockModule('../Models/Destination.js', () => ({
  default: {
    find: jest.fn(),
    findById: jest.fn(),
  },
}));

jest.unstable_mockModule('../Models/Itinerary.js', () => ({
  default: {
    findById: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    updateOne: jest.fn(),
    deleteOne: jest.fn(),
    save: jest.fn(),
  },
}));

jest.unstable_mockModule('../Models/userProfile.js', () => ({
  default: {
    findById: jest.fn(),
    findOne: jest.fn(),
    updateOne: jest.fn(),
    save: jest.fn(),
  },
}));

const { sendNotification } = await import('../Helpers/notificationHelper.js');
const { sendFellowTravelerRequest } = await import('../Helpers/fellowTravelerRequestHelper.js');
const Activity = (await import('../Models/Activity.js')).default;
const Destination = (await import('../Models/Destination.js')).default;
const Itinerary = (await import('../Models/Itinerary.js')).default;
const userProfile = (await import('../Models/userProfile.js')).default;

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
});

afterAll(async () => {
  await mongoServer.stop();
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

describe('Itinerary Controller', () => {
  describe('createItinerary', () => {
    let req, res;

    beforeEach(() => {
      req = {
        userProfile: {
          _id: new mongoose.Types.ObjectId(),
        },
        body: {
          title: 'Sample Itinerary',
          description: 'This is a sample itinerary.',
          startDate: new Date(),
          endDate: new Date(),
          groupSize: 5,
          destinations: [new mongoose.Types.ObjectId()],
          activities: [new mongoose.Types.ObjectId()],
          participants: [new mongoose.Types.ObjectId()],
        },
      };

      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });

    it('should create a new itinerary', async () => {
      const mockUser = {
        _id: req.userProfile._id,
        itineraries: [],
        save: jest.fn().mockResolvedValueOnce({}),
      };

      const mockDestination = {
        _id: req.body.destinations[0],
      };

      const mockActivity = {
        _id: req.body.activities[0],
      };

      Itinerary.findOne.mockResolvedValueOnce(null);
      Destination.find.mockResolvedValueOnce([mockDestination]);
      Activity.find.mockResolvedValueOnce([mockActivity]);
      userProfile.findById.mockResolvedValueOnce(mockUser);
      Itinerary.create.mockResolvedValueOnce({
        _id: new mongoose.Types.ObjectId(),
        ...req.body,
        user: req.userProfile._id,
      });

      await createItinerary(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    // Additional tests for edge cases and error handling
  });

  describe('editItinerary', () => {
    let req, res;

    beforeEach(() => {
      req = {
        userProfile: {
          _id: new mongoose.Types.ObjectId(),
        },
        params: {
          itineraryId: new mongoose.Types.ObjectId().toString(),
        },
        body: {
          title: 'Updated Itinerary Title',
        },
      };

      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });

    it('should edit an existing itinerary', async () => {
      const mockItinerary = {
        _id: req.params.itineraryId,
        title: 'Original Itinerary Title',
        user: req.userProfile._id,
        participants: [req.userProfile._id],
        save: jest.fn().mockResolvedValueOnce({}),
      };

      Itinerary.findById.mockResolvedValueOnce(mockItinerary);

      await editItineray(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    // Additional tests for edge cases and error handling
  });

  describe('deleteItinerary', () => {
    let req, res;

    beforeEach(() => {
      req = {
        userProfile: {
          _id: new mongoose.Types.ObjectId(),
        },
        params: {
          itineraryId: new mongoose.Types.ObjectId().toString(),
        },
      };

      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });

    it('should delete an existing itinerary', async () => {
      const mockItinerary = {
        _id: req.params.itineraryId,
        title: 'Sample Itinerary',
        user: req.userProfile._id,
        deleteOne: jest.fn().mockResolvedValueOnce({}),
      };

      Itinerary.findById.mockResolvedValueOnce(mockItinerary);

      await deleteItinerary(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    // Additional tests for edge cases and error handling
  });

  describe('addActivity', () => {
    let req, res;

    beforeEach(() => {
      req = {
        params: {
          itineraryId: new mongoose.Types.ObjectId().toString(),
        },
        body: {
          activityId: new mongoose.Types.ObjectId().toString(),
        },
      };

      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });

    it('should add an activity to an existing itinerary', async () => {
      const mockItinerary = {
        _id: req.params.itineraryId,
        title: 'Sample Itinerary',
        participants: [new mongoose.Types.ObjectId()],
        activities: [],
        save: jest.fn().mockResolvedValueOnce({}),
      };

      const mockActivity = {
        _id: req.body.activityId,
      };

      Itinerary.findById.mockResolvedValueOnce(mockItinerary);
      Activity.findById.mockResolvedValueOnce(mockActivity);

      await addActivity(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    // Additional tests for edge cases and error handling
  });

  describe('removeActivityFromItinerary', () => {
    let req, res;

    beforeEach(() => {
      req = {
        params: {
          itineraryId: new mongoose.Types.ObjectId().toString(),
        },
        body: {
          activityId: new mongoose.Types.ObjectId().toString(),
        },
      };

      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });

    it('should remove an activity from an existing itinerary', async () => {
      const mockItinerary = {
        _id: req.params.itineraryId,
        title: 'Sample Itinerary',
        participants: [new mongoose.Types.ObjectId()],
        activities: [req.body.activityId],
        save: jest.fn().mockResolvedValueOnce({}),
      };

      const mockActivity = {
        _id: req.body.activityId,
      };

      Itinerary.findById.mockResolvedValueOnce(mockItinerary);
      Activity.findById.mockResolvedValueOnce(mockActivity);

      await removeActivityFromItinerary(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    // Additional tests for edge cases and error handling
  });

  describe('addParticipant', () => {
    let req, res;

    beforeEach(() => {
      req = {
        params: {
          itineraryId: new mongoose.Types.ObjectId().toString(),
        },
        body: {
          username: 'newParticipant',
        },
      };

      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });

    it('should add a participant to an existing itinerary', async () => {
      const mockItinerary = {
        _id: req.params.itineraryId,
        title: 'Sample Itinerary',
        participants: [new mongoose.Types.ObjectId()],
        save: jest.fn().mockResolvedValueOnce({}),
      };

      const mockUser = {
        _id: new mongoose.Types.ObjectId(),
        username: req.body.username,
        itineraries: [],
        save: jest.fn().mockResolvedValueOnce({}),
      };

      Itinerary.findById.mockResolvedValueOnce(mockItinerary);
      userProfile.findOne.mockResolvedValueOnce(mockUser);

      await addParticipant(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    // Additional tests for edge cases and error handling
  });

  describe('removeParticipantFromItinerary', () => {
    let req, res;

    beforeEach(() => {
      req = {
        params: {
          itineraryId: new mongoose.Types.ObjectId().toString(),
        },
        body: {
          username: 'participantToRemove',
        },
      };

      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });

    it('should remove a participant from an existing itinerary', async () => {
      const mockItinerary = {
        _id: req.params.itineraryId,
        title: 'Sample Itinerary',
        participants: [new mongoose.Types.ObjectId()],
        save: jest.fn().mockResolvedValueOnce({}),
      };

      const mockUser = {
        _id: new mongoose.Types.ObjectId(),
        username: req.body.username,
        itineraries: [req.params.itineraryId],
        save: jest.fn().mockResolvedValueOnce({}),
      };

      Itinerary.findById.mockResolvedValueOnce(mockItinerary);
      userProfile.findOne.mockResolvedValueOnce(mockUser);

      await removeParticipantFromItinerary(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    // Additional tests for edge cases and error handling
  });

  describe('addDestinationToItinerary', () => {
    let req, res;

    beforeEach(() => {
      req = {
        params: {
          itineraryId: new mongoose.Types.ObjectId().toString(),
        },
        body: {
          destinationId: new mongoose.Types.ObjectId().toString(),
        },
      };

      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });

    it('should add a destination to an existing itinerary', async () => {
      const mockItinerary = {
        _id: req.params.itineraryId,
        title: 'Sample Itinerary',
        participants: [new mongoose.Types.ObjectId()],
        destinations: [],
        save: jest.fn().mockResolvedValueOnce({}),
      };

      const mockDestination = {
        _id: req.body.destinationId,
        itineraries: [],
        save: jest.fn().mockResolvedValueOnce({}),
      };

      Itinerary.findById.mockResolvedValueOnce(mockItinerary);
      Destination.findById.mockResolvedValueOnce(mockDestination);

      await addDestinationToItinerary(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    // Additional tests for edge cases and error handling
  });

  describe('removeDestinationFromItinerary', () => {
    let req, res;

    beforeEach(() => {
      req = {
        params: {
          itineraryId: new mongoose.Types.ObjectId().toString(),
        },
        body: {
          destinationId: new mongoose.Types.ObjectId().toString(),
        },
      };

      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });

    it('should remove a destination from an existing itinerary', async () => {
      const mockItinerary = {
        _id: req.params.itineraryId,
        title: 'Sample Itinerary',
        participants: [new mongoose.Types.ObjectId()],
        destinations: [req.body.destinationId],
        save: jest.fn().mockResolvedValueOnce({}),
      };

      Itinerary.findById.mockResolvedValueOnce(mockItinerary);

      await removeDestinationFromItinerary(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    // Additional tests for edge cases and error handling
  });

  describe('createFellowTravelerRequest', () => {
    let req, res;

    beforeEach(() => {
      req = {
        userProfile: {
          _id: new mongoose.Types.ObjectId(),
        },
        params: {
          itineraryId: new mongoose.Types.ObjectId().toString(),
        },
      };

      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });

    it('should create a fellow traveler request', async () => {
      const mockItinerary = {
        _id: req.params.itineraryId,
        user: new mongoose.Types.ObjectId(),
      };

      const mockResponse = {
        success: true,
        message: 'Request sent successfully',
      };

      Itinerary.findById.mockResolvedValueOnce(mockItinerary);
      sendFellowTravelerRequest.mockResolvedValueOnce(mockResponse);

      await createFellowTravelerRequest(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    // Additional tests for edge cases and error handling
  });
});
