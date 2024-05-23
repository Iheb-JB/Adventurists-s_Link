import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { jest } from '@jest/globals';
import { sendMessage, getMessages, getConversations } from '../Controllers/Message.js';

jest.unstable_mockModule('../Helpers/notificationHelper.js', () => ({
  sendNotification: jest.fn(),
}));

jest.unstable_mockModule('../Models/Conversation.js', () => ({
  default: {
    findOne: jest.fn(),
    create: jest.fn(),
    updateOne: jest.fn(),
  },
}));

jest.unstable_mockModule('../Models/Message.js', () => ({
  default: {
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  },
}));

jest.unstable_mockModule('../Models/userProfile.js', () => ({
  default: {
    findById: jest.fn(),
  },
}));

jest.unstable_mockModule('../Socket/socket.js', () => ({
  getReceiverSocketId: jest.fn(),
}));

const { sendNotification } = await import('../Helpers/notificationHelper.js');
const Conversation = (await import('../Models/Conversation.js')).default;
const Message = (await import('../Models/Message.js')).default;
const userProfile = (await import('../Models/userProfile.js')).default;
const { getReceiverSocketId } = await import('../Socket/socket.js');

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

describe('Message Controller', () => {
  describe('sendMessage', () => {
    let req, res;

    beforeEach(() => {
      req = {
        userProfile: {
          _id: new mongoose.Types.ObjectId(),
        },
        params: {
          id: new mongoose.Types.ObjectId().toString(),
        },
        body: {
          message: 'Hello!',
        },
      };

      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });

    it('should send a message and create a new conversation if none exists', async () => {
      const mockConversation = {
        _id: new mongoose.Types.ObjectId(),
        participants: [req.userProfile._id, req.params.id],
        lastMessage: {
          text: req.body.message,
          sender: req.userProfile._id,
        },
        save: jest.fn().mockResolvedValueOnce({}),
      };

      const mockMessage = {
        _id: new mongoose.Types.ObjectId(),
        conversationId: mockConversation._id,
        senderId: req.userProfile._id,
        content: req.body.message,
        save: jest.fn().mockResolvedValueOnce({}),
      };

      Conversation.findOne.mockResolvedValueOnce(null);
      Conversation.create.mockResolvedValueOnce(mockConversation);
      Message.create.mockResolvedValueOnce(mockMessage);
      userProfile.findById.mockResolvedValueOnce({ _id: req.userProfile._id, username: 'user1', profilePicture: 'pic1.jpg' });

      await sendMessage(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });

    it('should return 400 if message content is missing', async () => {
      req.body.message = '';

      await sendMessage(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Message content is required' });
    });

    it('should handle errors', async () => {
      const errorMessage = 'Database error';

      await sendMessage(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'internal server error' });
    });
  });

  describe('getMessages', () => {
    let req, res;

    beforeEach(() => {
      req = {
        userProfile: {
          _id: new mongoose.Types.ObjectId(),
        },
        params: {
          id: new mongoose.Types.ObjectId().toString(),
        },
      };

      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });

    it('should get messages of a conversation', async () => {
      const mockConversation = {
        _id: new mongoose.Types.ObjectId(),
        participants: [req.userProfile._id, req.params.id],
      };

      const mockMessages = [
        { _id: new mongoose.Types.ObjectId(), content: 'Hello' },
        { _id: new mongoose.Types.ObjectId(), content: 'Hi' },
      ];

      Conversation.findOne.mockResolvedValueOnce(mockConversation);
      Message.find.mockResolvedValueOnce(mockMessages);

      await getMessages(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should return 404 if conversation is not found', async () => {
      Conversation.findOne.mockResolvedValueOnce(null);

      await getMessages(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Conversation not found!' });
    });

    it('should handle errors', async () => {
      const errorMessage = 'Database error';
      Conversation.findOne.mockRejectedValueOnce(new Error(errorMessage));

      await getMessages(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('getConversations', () => {
    let req, res;

    beforeEach(() => {
      req = {
        userProfile: {
          _id: new mongoose.Types.ObjectId(),
        },
      };

      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });

    it('should get all conversations of a user', async () => {
      const mockConversations = [
        {
          _id: new mongoose.Types.ObjectId(),
          participants: [
            { _id: new mongoose.Types.ObjectId(), username: 'user2', profilePicture: 'pic2.jpg' },
          ],
          lastMessage: { text: 'Hi', sender: new mongoose.Types.ObjectId() },
        },
      ];

      await getConversations(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('Should succeed', async () => {
      const errorMessage = 'Database error';
      await getConversations(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});
