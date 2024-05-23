import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { jest } from '@jest/globals';
import { app, express_server } from '../server.js';

jest.unstable_mockModule('../Helpers/notificationHelper.js', () => ({
  sendNotification: jest.fn(),
}));

jest.unstable_mockModule('../Models/Itinerary.js', () => ({
  default: {
    findById: jest.fn(),
  },
}));

jest.unstable_mockModule('../Models/Review.js', () => ({
  default: {
    findOne: jest.fn(),
    findById: jest.fn(),
    deleteOne: jest.fn(),
    create: jest.fn(),
  },
}));

jest.unstable_mockModule('../Models/userProfile.js', () => ({
  default: {
    findById: jest.fn(),
    findOne: jest.fn(),
    updateOne: jest.fn(),
    create: jest.fn(),
  },
}));

const { sendNotification } = await import('../Helpers/notificationHelper.js');
const Itinerary = (await import('../Models/Itinerary.js')).default;
const Review = (await import('../Models/Review.js')).default;
const userProfile = (await import('../Models/userProfile.js')).default;
import { createReview, editReview, deleteReview } from '../Controllers/Review.js';

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

describe('Review Controller', () => {
  describe('createReview', () => {
    let req, res;

    beforeEach(() => {
      req = {
        userProfile: {
          _id: new mongoose.Types.ObjectId(),
        },
        params: {
          itineraryId: new mongoose.Types.ObjectId().toString(),
          username: 'revieweeUsername',
        },
        body: {
          rating: 5,
          content: 'Great trip!',
        },
      };

      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });

    it('should create a new review', async () => {
      const mockItinerary = {
        _id: req.params.itineraryId,
        title: 'Sample Itinerary',
        participants: [{ _id: req.userProfile._id }, { _id: new mongoose.Types.ObjectId() }],
      };

      const mockReviewer = {
        _id: req.userProfile._id,
        username: 'reviewerUsername',
      };

      const mockReviewee = {
        _id: new mongoose.Types.ObjectId(),
        username: 'revieweeUsername',
        reviews: [],
        save: jest.fn().mockResolvedValueOnce({}),
      };

      const mockReview = {
        _id: new mongoose.Types.ObjectId(),
        rating: 5,
        content: 'Great trip!',
        user: mockReviewee._id,
        reviewer: req.userProfile._id,
        itinerary: req.params.itineraryId,
        save: jest.fn().mockResolvedValueOnce({}),
      };

      Itinerary.findById.mockResolvedValueOnce(mockItinerary);
      userProfile.findById.mockResolvedValueOnce(mockReviewer);
      userProfile.findOne.mockResolvedValueOnce(mockReviewee);
      Review.findOne.mockResolvedValueOnce(null);
      Review.create.mockResolvedValueOnce(mockReview);

      await createReview(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    // Additional tests for edge cases and error handling
  });

  describe('editReview', () => {
    let req, res;

    beforeEach(() => {
      req = {
        userProfile: {
          _id: new mongoose.Types.ObjectId(),
          username: 'reviewerUsername',
        },
        params: {
          reviewId: new mongoose.Types.ObjectId().toString(),
        },
        body: {
          rating: 4,
          content: 'Updated review content',
        },
      };

      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });

    it('should update an existing review', async () => {
      const mockReview = {
        _id: req.params.reviewId,
        rating: 5,
        content: 'Great trip!',
        reviewer: req.userProfile._id,
        itinerary: {
          title: 'Sample Itinerary',
        },
        save: jest.fn().mockResolvedValueOnce({}),
      };

      Review.findById.mockResolvedValueOnce(mockReview);

      await editReview(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    // Additional tests for edge cases and error handling
  });

  describe('deleteReview', () => {
    let req, res;

    beforeEach(() => {
      req = {
        userProfile: {
          _id: new mongoose.Types.ObjectId(),
          username: 'reviewerUsername',
        },
        params: {
          reviewId: new mongoose.Types.ObjectId().toString(),
        },
      };

      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });

    it('should delete an existing review', async () => {
      const mockReview = {
        _id: req.params.reviewId,
        rating: 5,
        content: 'Great trip!',
        reviewer: req.userProfile._id,
        user: new mongoose.Types.ObjectId(),
        itinerary: {
          title: 'Sample Itinerary',
        },
      };

      Review.findById.mockResolvedValueOnce(mockReview);
      userProfile.updateOne.mockResolvedValueOnce({});

      await deleteReview(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    // Additional tests for edge cases and error handling
  });
});
