# Social Sphere Backend

Node.js/Express backend for the Social Sphere social media platform with advanced content moderation capabilities.

## Architecture Overview

This backend implements a modular architecture with the following key components:

- **Express.js** - Web framework
- **Socket.IO** - Real-time communication
- **PostgreSQL** - Primary database
- **JWT** - Authentication
- **Multer** - File upload handling
- **Azure Vision AI** - Image content moderation
- **Cloudinary** - Image storage

## Content Moderation Implementation

### Image Moderation Service (`services/imageModerationService.js`)

Implements Azure Vision AI integration with comprehensive error handling and fallback mechanisms.

#### Key Features:
- **Azure Vision Integration** - Uses `@azure-rest/ai-vision-image-analysis` package
- **Intelligent Caching** - SHA256-based image hashing for cache keys
- **Configurable Thresholds** - Environment-based sensitivity settings
- **Robust Error Handling** - Fail-safe approach (block content when in doubt)
- **Detailed Logging** - Comprehensive moderation decision tracking

#### Implementation Details:

```javascript
// Environment Configuration
AZURE_VISION_ENDPOINT=https://your-service.cognitiveservices.azure.com/
AZURE_VISION_KEY=your_api_key
ADULT_THRESHOLD=0.5    // 0.0 (strict) to 1.0 (permissive)
RACY_THRESHOLD=0.4     // 0.0 (strict) to 1.0 (permissive)
```

#### Service Workflow:
1. **Input Validation** - Verify buffer integrity
2. **Cache Check** - Look for existing analysis results
3. **Azure API Call** - Send image for analysis
4. **Score Evaluation** - Compare against thresholds
5. **Cache Update** - Store results for future requests
6. **Decision Return** - Boolean result with logging

### Post Controller Integration (`controller/posts.js`)

The post creation workflow includes multi-layer content validation:

#### Text Moderation:
```javascript
const isAdultText = await moderationService.isAdultContent(content);
if (isAdultText) {
    return res.status(400).json({
        error: "Post rejected: Contains prohibited text content"
    });
}
```

#### Image Moderation with Fallback:
```javascript
// Primary: Azure Vision AI
try {
    isAdultImage = await imageModerationService.isAdultContent(req.file.buffer);
} catch (azureError) {
    // Fallback: Basic validation
    if (req.file.size < 1000) {
        isAdultImage = true; // Suspicious small files
    } else {
        // Validate image headers
        const header = req.file.buffer.slice(0, 10);
        const isValidImage = hasValidImageHeader(header);
        if (!isValidImage) {
            isAdultImage = true;
        }
    }
}
```

## API Endpoints

### Posts
- `GET /api/posts/` - Retrieve all posts
- `POST /api/posts/create` - Create new post with content moderation
- `POST /api/posts/test-moderation` - Test image moderation (development)

### Users
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User authentication
- `POST /api/users/verify` - Email verification

### Friends
- `GET /api/friends/` - Get friend list
- `POST /api/friends/request` - Send friend request
- `PUT /api/friends/accept` - Accept friend request

### Messages
- `GET /api/messages/` - Get conversation history
- `POST /api/messages/send` - Send message (Socket.IO preferred)

### Stories
- `GET /api/stories/` - Get active stories
- `POST /api/stories/create` - Create new story

## Database Schema

### Key Tables:
- `users` - User accounts and profiles
- `posts` - User posts with content
- `media` - Attached images/files
- `friends` - Friend relationships
- `messages` - Chat messages
- `stories` - Temporary story content

## Security Implementation

### Content Validation
```javascript
// Image validation
const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const maxFileSize = 4 * 1024 * 1024; // 4MB

// Text validation
const sanitizedContent = content.trim();
if (!sanitizedContent || sanitizedContent.length === 0) {
    return res.status(400).json({ error: "Content is required" });
}
```

### Authentication Middleware
```javascript
// JWT verification in authCheck.js
export const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Access denied" });
    }
    // Token verification logic...
};
```

## Error Handling

### Multer Error Handling
```javascript
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({
            error: err.message || 'File upload error'
        });
    }
    // Generic error handling...
});
```

### Moderation Error Handling
```javascript
// Fail-safe approach: Block content when moderation fails
try {
    const result = await azureVisionAPI.analyze(image);
    return result.isAdult;
} catch (error) {
    console.error('Moderation failed:', error);
    return true; // Block content when in doubt
}
```

## Environment Variables

### Required Configuration
```env
# Server
SERVER_PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=social_sphere
DB_USER=your_username
DB_PASSWORD=your_password

# Authentication
JWT_SECRET=your_secret_key

# Email Service
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_app_password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Azure Vision
AZURE_VISION_ENDPOINT=https://your-service.cognitiveservices.azure.com/
AZURE_VISION_KEY=your_api_key

# Content Moderation
ADULT_THRESHOLD=0.5
RACY_THRESHOLD=0.4
ENABLE_IMAGE_MODERATION=true
STRICT_MODERATION=false
```

## Development Commands

```bash
# Start development server with auto-reload
npm run dev

# Start production server
npm start

# Run specific file
node filename.js

# Check syntax
node -c filename.js
```

## Testing

### Test Image Moderation
```bash
curl -X POST http://localhost:3000/api/posts/test-moderation \
  -F "file=@test-image.jpg"
```

Expected Response:
```json
{
  "filename": "test-image.jpg",
  "size": 12345,
  "isAdultContent": false,
  "message": "Content passed moderation"
}
```

### Test Post Creation
```bash
curl -X POST http://localhost:3000/api/posts/create \
  -F "user_id=1" \
  -F "content=Hello World!" \
  -F "privacy_setting=public" \
  -F "file=@image.jpg"
```

## Monitoring and Logging

### Moderation Logs
The system logs all moderation decisions:

```
[2025-07-18 10:30:15] Processing image: sunset.jpg, size: 256789 bytes
[2025-07-18 10:30:15] Attempting Azure image moderation...
[2025-07-18 10:30:16] Image moderation scores - Adult: 0.12, Racy: 0.08
[2025-07-18 10:30:16] Thresholds - Adult: 0.5, Racy: 0.4
[2025-07-18 10:30:16] Image passed moderation checks
[2025-07-18 10:30:17] Image uploaded successfully to Cloudinary
```

### Error Monitoring
```
[2025-07-18 10:35:22] Azure moderation failed: OperationBlocked
[2025-07-18 10:35:22] Using fallback validation for image.jpg
[2025-07-18 10:35:22] Detected valid jpeg image
[2025-07-18 10:35:22] Fallback moderation result: false
```

## Performance Considerations

### Caching Strategy
- **Image Hash Caching** - Avoid re-analyzing identical images
- **Cache Size Management** - Automatic cleanup when cache exceeds 1000 entries
- **Memory Efficiency** - SHA256 hashes as compact cache keys

### Rate Limiting
Consider implementing rate limiting for:
- Post creation endpoints
- Image upload endpoints
- Authentication endpoints

## Deployment

### Production Checklist
- [ ] Set strong JWT_SECRET
- [ ] Configure secure database credentials
- [ ] Set up SSL/TLS termination
- [ ] Configure CORS for production domains
- [ ] Set appropriate ADULT_THRESHOLD and RACY_THRESHOLD
- [ ] Enable production logging
- [ ] Set up monitoring and alerting
- [ ] Configure backup strategies

### Environment-Specific Settings
```env
# Development
STRICT_MODERATION=false
ADULT_THRESHOLD=0.3

# Production
STRICT_MODERATION=false
ADULT_THRESHOLD=0.5
```

## Troubleshooting

### Common Issues

1. **Azure Vision API Errors**
   ```
   Error: OperationBlocked
   Solution: Check Azure service configuration and API key permissions
   ```

2. **Image Upload Failures**
   ```
   Error: File too large
   Solution: Check multer configuration and file size limits
   ```

3. **Database Connection Issues**
   ```
   Error: ECONNREFUSED
   Solution: Verify PostgreSQL is running and credentials are correct
   ```

### Debug Mode
Enable detailed logging:
```bash
DEBUG=* npm start
```

## Contributing

### Code Style
- Use ES6+ features
- Implement proper error handling
- Add comprehensive logging
- Write descriptive commit messages

### Testing
- Test all moderation scenarios
- Verify fallback mechanisms
- Test with various image formats and sizes
- Validate error handling paths

---

For more information, see the main README.md in the project root.
