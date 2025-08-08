import { createHash } from 'crypto';
import enhancedImageAnalyzer from './enhancedImageAnalyzer.js';
import sharp from 'sharp';
import EnhancedImageAnalyzer from './enhancedImageAnalyzer.js';

const imageCache = new Map();

class FallbackImageModerationService {
  constructor() {
    this.enabled = process.env.ENABLE_IMAGE_MODERATION !== 'false'; 
    this.strictMode = process.env.STRICT_MODERATION === 'true'; 
    this.nsfwModel = null;
    
  }
  
  async isAdultContent(imageBuffer) {
    try {
      if (!this.enabled) {
        return false;
      }
      if (!imageBuffer || !Buffer.isBuffer(imageBuffer)) {
        console.warn('Invalid image buffer provided to moderation service');
        return true; 
      }

      const hash = createHash('sha256').update(imageBuffer).digest('hex');
    
      if (imageCache.has(hash)) {
        return imageCache.get(hash);
      }
      
      if (this.strictMode) {
        imageCache.set(hash, true);
        return true;
      }

      let isAdult = false;
      
      // Size checks
      if (imageBuffer.length < 500) {
        isAdult = true;
      } else if (imageBuffer.length > 8 * 1024 * 1024) {
        isAdult = true;
      } else {
        // Header validation
        const header = imageBuffer.slice(0, 10);
        const isValidImage = this.hasValidImageHeader(header);
        
        if (!isValidImage) {
          isAdult = true;
        } else {
          // NSFW model detection
          if (this.nsfwModel) {
            try {
              const image = await Jimp.read(imageBuffer);
              const predictions = await this.nsfwModel.classify(image);
              const explicitScore = predictions.find(p => p.className === 'Explicit')?.probability || 0;
              const pornScore = predictions.find(p => p.className === 'Porn')?.probability || 0;
              const hentaiScore = predictions.find(p => p.className === 'Hentai')?.probability || 0;
              const maxScore = Math.max(explicitScore, pornScore, hentaiScore);

              if (maxScore > 0.15) {
                isAdult = true;
              }
            } catch (error) {
              console.warn('NSFW classification failed:', error.message);
            }
          }
          
          // Enhanced analyzer if NSFW didn't flag
          if (!isAdult) {
            try {
              const enhancedResult = await enhancedImageAnalyzer.analyzeForAdultContent(imageBuffer);
              if (enhancedResult.isAdult) {
                isAdult = true;
              } else {
                // Only use basic analysis if enhanced also didn't flag it
                if (enhancedResult.reason !== 'Screenshot/text content detected') {
                  isAdult = this.analyzeImageContent(imageBuffer);
                } else {
                  isAdult = false; // Screenshots should be allowed
                }
              }
            } catch (enhancedError) {
              console.warn('Enhanced analysis failed, using basic analysis:', enhancedError.message);
              isAdult = this.analyzeImageContent(imageBuffer);
            }
          }
        }
      }

      imageCache.set(hash, isAdult);
      
      if (imageCache.size > 1000) {
        const firstKey = imageCache.keys().next().value;
        imageCache.delete(firstKey);
      }
      
      return isAdult;
      
    } catch (error) {
      console.error('Fallback image moderation error:', error.message);
      return true; 
    }
  }

  analyzeImageContent(imageBuffer) {
    try {
      
      const skinToneScore = this.detectSkinTones(imageBuffer);
      const entropyScore = this.calculateEntropy(imageBuffer);
      const compressionScore = this.analyzeCompression(imageBuffer);
      const suspiciousPatterns = this.checkSuspiciousPatterns(imageBuffer);

      let riskScore = 0;
      
      if (skinToneScore > 0.3) riskScore += 70;
      if (entropyScore > 6.5) riskScore += 60;
      if (compressionScore > 0.5) riskScore += 50;
      if (suspiciousPatterns) riskScore += 60;
      if (imageBuffer.length > 3 * 1024 * 1024) riskScore += 40;
      
      const isAdult = riskScore >= 45;
      
      return isAdult;
    } catch (error) {
      console.error('Content analysis failed:', error.message);
      return true;
    }
  }

  detectSkinTones(imageBuffer) {
    try {
      let skinPixels = 0;
      let totalSamples = 0;
      
      for (let i = 0; i < imageBuffer.length - 2; i += 400) {
        const r = imageBuffer[i];
        const g = imageBuffer[i + 1];
        const b = imageBuffer[i + 2];
        
        if (r > 55 && g > 25 && b > 15 && 
            r > g && r > b && 
            Math.abs(r - g) > 8 && 
            r - b > 8) {
          skinPixels++;
        }
        totalSamples++;
      }
      
      return totalSamples > 0 ? skinPixels / totalSamples : 0;
    } catch (error) {
      return 0;
    }
  }

  calculateEntropy(imageBuffer) {
    try {
      const freq = new Array(256).fill(0);
      const sampleSize = Math.min(25000, imageBuffer.length);
      
      for (let i = 0; i < sampleSize; i++) {
        freq[imageBuffer[i]]++;
      }
      
      let entropy = 0;
      for (let i = 0; i < 256; i++) {
        if (freq[i] > 0) {
          const p = freq[i] / sampleSize;
          entropy -= p * Math.log2(p);
        }
      }
      
      return entropy;
    } catch (error) {
      return 0;
    }
  }

  analyzeCompression(imageBuffer) {
    try {
      if (imageBuffer.length < 1000) return 1;
      
      const qualityMarkers = [];
      for (let i = 0; i < imageBuffer.length - 1; i++) {
        if (imageBuffer[i] === 0xFF && imageBuffer[i + 1] === 0xDB) {
          qualityMarkers.push(i);
        }
      }
      
      return Math.min(qualityMarkers.length / 8, 1);
    } catch (error) {
      return 0;
    }
  }

  checkSuspiciousPatterns(imageBuffer) {
    try {
      let suspiciousCount = 0;
      const patternSize = 16;
      const patterns = new Map();
      
      for (let i = 0; i < imageBuffer.length - patternSize; i += patternSize) {
        const pattern = imageBuffer.slice(i, i + patternSize).toString('hex');
        patterns.set(pattern, (patterns.get(pattern) || 0) + 1);
      }
      
      for (const count of patterns.values()) {
        if (count > 4) suspiciousCount++;
      }
      
      return suspiciousCount > 2;
    } catch (error) {
      return false;
    }
  }

  hasValidImageHeader(header) {
    const signatures = {
      jpeg: [0xFF, 0xD8, 0xFF],
      png: [0x89, 0x50, 0x4E, 0x47],
      gif: [0x47, 0x49, 0x46, 0x38],
      webp: [0x52, 0x49, 0x46, 0x46],
    };

    for (const [format, signature] of Object.entries(signatures)) {
      let matches = true;
      for (let i = 0; i < signature.length; i++) {
        if (header[i] !== signature[i]) {
          matches = false;
          break;
        }
      }
      if (matches) {
        return true;
      }
    }
    
    return false;
  }

  clearCache() {
    imageCache.clear();
  }
}

export default FallbackImageModerationService;