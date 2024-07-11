
const request = require('supertest');
const app = require("../app.js")




describe('POST/auth/register', () => {
  
    
    describe('given user nameand password', () => {
      
      test('should return 200 if user not found', async () => {
        c
        const response = await request(app).post('/auth/register').send({
            email:"email",
            password:"pasword"
        });
        
        // Assert response status
        expect(response.status).toBe(200);
      });
    });
    
    // Add more tests for other endpoints if needed
    
  });
