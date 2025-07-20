import vision from '@azure-rest/ai-vision-image-analysis';
import { AzureKeyCredential } from '@azure/core-auth';
import { createHash } from 'crypto';
import dotenv from 'dotenv';
import FallbackImageModerationService from './fallbackImageModerationService.js';

dotenv.config();

const imageCache = new Map();

class ImageModerationService {
  constructor() {
    if (!process.env.AZURE_VISION_ENDPOINT || !process.env.AZURE_VISION_KEY) {
      throw new Error('Azure Vision configuration missing');
    }

    console.log('Azure Vision Endpoint:', process.env.AZURE_VISION_ENDPOINT);
    console.log('Azure Vision Key exists:', !!process.env.AZURE_VISION_KEY);

    this.client = vision.default(
      process.env.AZURE_VISION_ENDPOINT, 
      new AzureKeyCredential(process.env.AZURE_VISION_KEY)
    );
    
    this.adultThreshold = 0.15;
    this.racyThreshold = 0.15;
    this.fallbackService = new FallbackImageModerationService();
    
    console.log(`Image moderation initialized with thresholds - Adult: ${this.adultThreshold}, Racy: ${this.racyThreshold}`);
  }
  
  async isAdultContent(imageBuffer) {
    try {
      if (!imageBuffer || !Buffer.isBuffer(imageBuffer)) {
        console.warn('Invalid image buffer provided');
        return true;
      }

      console.log(`Processing image buffer of size: ${imageBuffer.length} bytes`);

      const hash = createHash('sha256').update(imageBuffer).digest('hex');
    
      if (imageCache.has(hash)) {
        console.log('Using cached moderation result');
        return imageCache.get(hash);
      }
      
      console.log('Analyzing image with Azure Vision API...');
      
      let isAdult = false;
      
      try {
        const result = await this.client.path('/imageanalysis:analyze').post({
          body: imageBuffer,
          queryParameters: {
            features: ['Adult'],
            'api-version': '2023-10-01'
          },
          contentType: 'application/octet-stream'
        });

        console.log('Azure Vision API response status:', result.status);

        if (result.status !== 200) {
          console.error('Azure Vision API returned unsuccessful response:', result.status, result.body);
          throw new Error('Azure Vision API failed');
        }

        if (result.body.adultResult) {
          const { adultScore, racyScore } = result.body.adultResult;
          console.log(`Image moderation scores - Adult: ${adultScore}, Racy: ${racyScore}`);
          
          isAdult = adultScore > this.adultThreshold || racyScore > this.racyThreshold;
          
          if (isAdult) {
            console.log('Image flagged as adult content by Azure');
          } else {
            console.log('Image passed Azure moderation checks');
          }
        } else {
          console.warn('No adultResult in Azure Vision response');
          throw new Error('No adultResult in response');
        }
      } catch (azureError) {
        console.warn('Azure Vision API failed:', azureError.message);
        // When Azure fails, return false to allow fallback service to handle it
        // This prevents defaulting to blocking all content
        return false;
      }

      imageCache.set(hash, isAdult);
      
      if (imageCache.size > 1000) {
        const firstKey = imageCache.keys().next().value;
        imageCache.delete(firstKey);
      }
      
      return isAdult;
    } catch (error) {
      console.error('Image moderation error:', error.message);
      return true; 
    }
  }

  clearCache() {
    imageCache.clear();
    console.log('Image moderation cache cleared');
  }
}

export default new ImageModerationService();