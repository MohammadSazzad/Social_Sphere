# Content Moderation Configuration Guide

## ✅ ENHANCED ADULT CONTENT DETECTION SYSTEM

The image moderation system now uses advanced multi-layer detection to block adult content while allowing legitimate images.

### Current Enhanced Configuration
```env
AZURE_VISION_ENDPOINT=https://my-image-safety-sazzad.cognitiveservices.azure.com/
AZURE_VISION_KEY=your_azure_vision_api_key
ADULT_THRESHOLD=0.4            # More strict (blocks more content)
RACY_THRESHOLD=0.3             # More strict (blocks more content)  
ENABLE_IMAGE_MODERATION=true   # Keep moderation active
STRICT_MODERATION=false        # Use intelligent detection
```

### Enhanced Detection System
1. **Primary**: Azure Vision AI (when available)
2. **Enhanced Fallback**: Multi-layer analysis including:
   - **Skin tone detection** - Advanced RGB analysis for skin color patterns
   - **Color variance analysis** - Detects uniform skin tones 
   - **Edge complexity analysis** - Uses Sobel operators for content patterns
   - **Aspect ratio analysis** - Flags suspicious image dimensions
   - **File size analysis** - Considers size-to-content ratios
   - **Entropy calculation** - Measures image complexity
   - **Pattern recognition** - Detects suspicious byte patterns

### Risk Scoring System
- **Skin tone ratio > 40%**: +40 points (High risk)
- **Low color variance**: +15 points (Uniform skin tones)
- **Suspicious edge complexity**: +10 points 
- **Extreme aspect ratios**: +10 points
- **Large file sizes**: +5 points
- **Threshold for blocking**: 35+ points

### Sample Detection Log
```
Enhanced analysis results:
- Skin tone ratio: 0.43% (Low)
- Color variance: Normal
- Edge complexity: 498.3 (High - typical for logos/graphics)
- Aspect ratio: 1.0 (Square)
- Risk score: 5/100 - ALLOW
```

## Quick Test Commands

### Test Moderation Only
```bash
curl -X POST http://localhost:3000/api/posts/test-moderation \
  -F "file=@your-image.jpg"
```

### Test Full Post Creation
```bash
curl -X POST http://localhost:3000/api/posts/create \
  -F "user_id=1" \
  -F "content=Test post with image" \
  -F "privacy_setting=public" \
  -F "file=@your-image.jpg"
```

## Expected Results

### Legitimate Image
```json
{
  "filename": "Logo.png",
  "size": 24597,
  "isAdultContent": false,
  "method": "Fallback Service",
  "message": "Content passed moderation"
}
```

### Post Creation Success
```json
{
  "message": "Post created successfully",
  "post_id": 27
}
```

## System Logs (Working Example)
```
Azure moderation failed, using fallback service: Azure Vision API access blocked - using fallback
Processing image buffer of size: 24597 bytes
Detected valid png image
Image format validation passed - allowing content
Fallback moderation result: ALLOWED
Final moderation decision: ALLOWED (Method: Fallback Service)
Image passed moderation, uploading to Cloudinary...
File uploaded successfully http://res.cloudinary.com/dm0mgw0tx/image/upload/v1752785628/social-sphere/Logo.png
Image uploaded successfully to Cloudinary
```

### 2. Moderation Modes

#### Development Mode (Testing)
```env
STRICT_MODERATION=true          # Blocks all images
ADULT_THRESHOLD=0.1             # Very strict
RACY_THRESHOLD=0.1              # Very strict
```

#### Production Mode (Balanced)
```env
STRICT_MODERATION=false         # Normal operation
ADULT_THRESHOLD=0.5             # Moderate strictness
RACY_THRESHOLD=0.4              # Moderate strictness
```

#### Permissive Mode (Relaxed)
```env
STRICT_MODERATION=false         # Normal operation
ADULT_THRESHOLD=0.8             # Less strict
RACY_THRESHOLD=0.7              # Less strict
```

## Threshold Guidelines

| Threshold | Adult Score | Racy Score | Description |
|-----------|-------------|------------|-------------|
| 0.1-0.3   | Very Strict | Very Strict | Blocks most content |
| 0.4-0.6   | Moderate    | Moderate    | Balanced approach |
| 0.7-0.9   | Permissive  | Permissive  | Allows most content |

## Testing Commands

### Test Image Moderation
```bash
curl -X POST http://localhost:3000/api/posts/test-moderation \
  -F "file=@your-test-image.jpg"
```

### Test Post Creation
```bash
curl -X POST http://localhost:3000/api/posts/create \
  -H "Content-Type: multipart/form-data" \
  -F "user_id=1" \
  -F "content=Test post content" \
  -F "privacy_setting=public" \
  -F "file=@your-image.jpg"
```

## Common Responses

### Content Approved
```json
{
  "message": "Post created successfully",
  "post_id": 123
}
```

### Content Rejected (Image)
```json
{
  "error": "Post rejected: Image contains prohibited content"
}
```

### Content Rejected (Text)
```json
{
  "error": "Post rejected: Contains prohibited text content"
}
```

### Moderation Test Result
```json
{
  "filename": "test.jpg",
  "size": 125432,
  "isAdultContent": false,
  "message": "Content passed moderation"
}
```

## Troubleshooting Quick Fixes

### Issue: All images blocked
**Solution:** Check `STRICT_MODERATION=false` and adjust thresholds

### Issue: Azure API errors
**Solution:** Verify endpoint URL and API key in Azure portal

### Issue: No moderation happening
**Solution:** Ensure `ENABLE_IMAGE_MODERATION=true`

### Issue: Server won't start
**Solution:** Check for missing environment variables

## Log Examples

### Successful Moderation
```
Processing image: photo.jpg, size: 245678 bytes
Attempting Azure image moderation...
Image moderation scores - Adult: 0.23, Racy: 0.15
Thresholds - Adult: 0.5, Racy: 0.4
Image passed moderation checks
```

### Failed Moderation
```
Processing image: suspicious.jpg, size: 189432 bytes
Attempting Azure image moderation...
Image moderation scores - Adult: 0.87, Racy: 0.92
Thresholds - Adult: 0.5, Racy: 0.4
Image flagged as adult content
```

### Fallback Mode
```
Azure moderation failed: OperationBlocked
Using fallback validation for image.jpg
Detected valid jpeg image
File size acceptable: 256789 bytes
Fallback moderation result: false
```
