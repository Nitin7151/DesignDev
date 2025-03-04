"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../src/server"));
const axios_1 = __importDefault(require("axios"));
// Mock axios to avoid actual API calls
jest.mock('axios');
const mockedAxios = axios_1.default;
describe('Chat Endpoint', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('should return a chat response', () => __awaiter(void 0, void 0, void 0, function* () {
        // Mock the Gemini API response
        mockedAxios.post.mockResolvedValueOnce({
            data: {
                candidates: [
                    {
                        content: {
                            parts: [
                                {
                                    text: 'This is a chat response'
                                }
                            ]
                        }
                    }
                ]
            }
        });
        const response = yield (0, supertest_1.default)(server_1.default)
            .post('/chat')
            .send({
            messages: [
                {
                    role: 'user',
                    parts: [{ text: 'Hello, how are you?' }]
                }
            ]
        });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('response');
        expect(response.body.response).toBe('This is a chat response');
        expect(mockedAxios.post).toHaveBeenCalledTimes(1);
    }));
    it('should handle errors from the Gemini API', () => __awaiter(void 0, void 0, void 0, function* () {
        // Mock an error response
        mockedAxios.post.mockRejectedValueOnce(new Error('API Error'));
        const response = yield (0, supertest_1.default)(server_1.default)
            .post('/chat')
            .send({
            messages: [
                {
                    role: 'user',
                    parts: [{ text: 'Hello, how are you?' }]
                }
            ]
        });
        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Failed to fetch response from Gemini API');
        expect(mockedAxios.post).toHaveBeenCalledTimes(1);
    }));
    it('should handle missing messages parameter', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default)
            .post('/chat')
            .send({});
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Messages are required');
        expect(mockedAxios.post).not.toHaveBeenCalled();
    }));
    it('should handle empty messages array', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default)
            .post('/chat')
            .send({
            messages: []
        });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Messages cannot be empty');
        expect(mockedAxios.post).not.toHaveBeenCalled();
    }));
});
