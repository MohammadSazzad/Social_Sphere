import sharp from 'sharp';

class EnhancedImageAnalyzer {
  constructor() {
    // Expanded skin tone ranges
    this.skinColorRanges = [
      { r: [194, 250], g: [150, 215], b: [130, 195] }, // Very light
      { r: [160, 213], g: [120, 180], b: [100, 160] }, // Light
      { r: [130, 180], g: [90, 140], b: [70, 120] },   // Medium
      { r: [90, 140], g: [60, 110], b: [40, 90] },     // Tan
      { r: [60, 110], g: [40, 80], b: [30, 70] }       // Dark
    ];
  }

  async analyzeForAdultContent(imageBuffer) {
    try {
      console.log('Starting enhanced sexual content analysis...');
      
      const image = sharp(imageBuffer);
      const metadata = await image.metadata();
      
      console.log(`Image metadata: ${metadata.width}x${metadata.height}, format: ${metadata.format}`);
      
      // Check if this looks like a screenshot or text-heavy image
      const isLikelyScreenshot = this.detectScreenshot(metadata, imageBuffer);
      if (isLikelyScreenshot) {
        console.log('Image detected as likely screenshot/text content - allowing');
        return { isAdult: false, confidence: 0.9, reason: 'Screenshot/text content detected' };
      }
      
      // Resize for analysis
      const { data, info } = await image
        .resize(224, 224, { fit: 'cover' })
        .raw()
        .toBuffer({ resolveWithObject: true });
      
      // Perform detailed sexual content analysis
      const sexualContentAnalysis = await this.detectSexualContent(data, info, metadata);
      
      if (sexualContentAnalysis.isExplicit) {
        console.log(`SEXUAL CONTENT DETECTED: ${sexualContentAnalysis.reasons}`);
        return { 
          isAdult: true, 
          confidence: sexualContentAnalysis.confidence, 
          reason: sexualContentAnalysis.reasons 
        };
      }
      
      // If not explicit sexual content, do general analysis
      const analysis = {
        skinToneRatio: this.calculateSkinToneRatio(data, info),
        colorVariance: this.calculateColorVariance(data, info),
        edgeComplexity: this.calculateEdgeComplexity(data, info),
        aspectRatio: metadata.width / metadata.height,
        fileSize: imageBuffer.length
      };
      
      console.log('General analysis results:', analysis);
      
      return this.calculateRiskScore(analysis);
      
    } catch (error) {
      console.error('Enhanced analysis failed:', error.message);
      return { isAdult: true, confidence: 0.8, reason: 'Analysis failed' };
    }
  }

  async detectSexualContent(data, info, metadata) {
    try {
      console.log('Analyzing for explicit sexual content...');
      
      // 1. Detect high concentration of skin tones in specific patterns
      const skinAnalysis = this.analyzeSkinDistribution(data, info);
      
      // 2. Detect flesh-colored regions that could indicate nudity
      const nudityIndicators = this.detectNudityPatterns(data, info);
      
      // 3. Analyze anatomical shapes and patterns
      const anatomicalPatterns = this.detectAnatomicalShapes(data, info);
      
      // 4. Check for intimate body part characteristics
      const intimateBodyParts = this.detectIntimateBodyParts(data, info);
      
      // 5. Analyze image composition for sexual poses/positions
      const sexualComposition = this.analyzeSexualComposition(metadata, skinAnalysis);
      
      let riskScore = 0;
      const reasons = [];
      
      // High skin concentration in intimate areas
      if (skinAnalysis.intimateAreaSkinRatio > 0.4) {
        riskScore += 60;
        reasons.push(`High skin concentration in intimate areas: ${(skinAnalysis.intimateAreaSkinRatio * 100).toFixed(1)}%`);
      }
      
      // Nudity patterns detected
      if (nudityIndicators.hasNudityPatterns) {
        riskScore += 50;
        reasons.push(`Nudity patterns detected: ${nudityIndicators.details}`);
      }
      
      // Anatomical shapes suggesting sexual organs
      if (anatomicalPatterns.suspiciousShapes > 2) {
        riskScore += 45;
        reasons.push(`Suspicious anatomical shapes detected: ${anatomicalPatterns.suspiciousShapes}`);
      }
      
      // Intimate body parts detected
      if (intimateBodyParts.detected) {
        riskScore += 70;
        reasons.push(`Intimate body parts detected: ${intimateBodyParts.details}`);
      }
      
      // Sexual composition indicators
      if (sexualComposition.isSuspicious) {
        riskScore += 30;
        reasons.push(`Suspicious image composition: ${sexualComposition.reason}`);
      }
      
      const isExplicit = riskScore >= 70; // Higher threshold for explicit content
      const confidence = Math.min(riskScore / 100, 1.0);
      
      console.log(`Sexual content analysis: ${riskScore}/100 points`);
      console.log(`Explicit content: ${isExplicit ? 'YES' : 'NO'} (confidence: ${(confidence * 100).toFixed(1)}%)`);
      
      return {
        isExplicit,
        confidence,
        riskScore,
        reasons: reasons.join(', ') || 'No explicit sexual content detected'
      };
      
    } catch (error) {
      console.error('Sexual content detection failed:', error.message);
      return { isExplicit: true, confidence: 0.5, reasons: 'Detection failed - blocking for safety' };
    }
  }

  detectScreenshot(metadata, imageBuffer) {
    try {
      // Check for common screenshot dimensions
      const width = metadata.width;
      const height = metadata.height;
      const aspectRatio = width / height;
      
      // Common screenshot aspect ratios
      const commonScreenRatios = [
        16/9,   // Most monitors
        16/10,  // Some monitors
        4/3,    // Older monitors
        3/2,    // Some laptops
      ];
      
      const isCommonScreenRatio = commonScreenRatios.some(ratio => 
        Math.abs(aspectRatio - ratio) < 0.1
      );
      
      // Check for screenshot-like file sizes and formats
      const isReasonableScreenshotSize = imageBuffer.length > 50000 && imageBuffer.length < 5000000;
      const isPNG = metadata.format === 'png'; // Screenshots often saved as PNG
      
      // Look for text-like patterns and UI elements
      const hasHighContrast = this.detectHighContrastPatterns(imageBuffer);
      const hasLowSkinContent = this.quickSkinCheck(imageBuffer) < 0.15; // Screenshots usually have low skin content
      
      const screenshotScore = 
        (isCommonScreenRatio ? 25 : 0) +
        (isReasonableScreenshotSize ? 20 : 0) +
        (isPNG ? 25 : 0) +
        (hasHighContrast ? 20 : 0) +
        (hasLowSkinContent ? 20 : 0); // Added skin content check
      
      console.log(`Screenshot detection score: ${screenshotScore}/110 (skin content: ${(this.quickSkinCheck(imageBuffer) * 100).toFixed(1)}%)`);
      return screenshotScore >= 60; // Requires multiple indicators
      
    } catch (error) {
      console.error('Screenshot detection failed:', error.message);
      return false;
    }
  }

  quickSkinCheck(imageBuffer) {
    try {
      let skinPixels = 0;
      let totalSamples = 0;
      
      // Quick sample-based skin detection
      for (let i = 0; i < imageBuffer.length - 2; i += 600) { // Sample less frequently
        const r = imageBuffer[i];
        const g = imageBuffer[i + 1];
        const b = imageBuffer[i + 2];
        
        if (this.isSkinTone(r, g, b)) {
          skinPixels++;
        }
        totalSamples++;
      }
      
      return totalSamples > 0 ? skinPixels / totalSamples : 0;
    } catch (error) {
      return 0;
    }
  }

  analyzeSkinDistribution(data, info) {
    try {
      const width = info.width;
      const height = info.height;
      
      // Divide image into regions to analyze skin distribution
      const regions = {
        center: { skin: 0, total: 0 },      // Central area (intimate regions)
        chest: { skin: 0, total: 0 },       // Upper-middle area (breast area)
        lower: { skin: 0, total: 0 },       // Lower area (genital area)
        overall: { skin: 0, total: 0 }
      };
      
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = (y * width + x) * 3;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];
          
          const isSkin = this.isSkinTone(r, g, b);
          
          // Determine which region this pixel belongs to
          const centerX = width / 2;
          const centerY = height / 2;
          
          // Center region (intimate areas)
          if (x > centerX * 0.3 && x < centerX * 1.7 && y > centerY * 0.4 && y < centerY * 1.6) {
            if (isSkin) regions.center.skin++;
            regions.center.total++;
          }
          
          // Chest region
          if (y < centerY * 0.8) {
            if (isSkin) regions.chest.skin++;
            regions.chest.total++;
          }
          
          // Lower region
          if (y > centerY * 1.2) {
            if (isSkin) regions.lower.skin++;
            regions.lower.total++;
          }
          
          // Overall
          if (isSkin) regions.overall.skin++;
          regions.overall.total++;
        }
      }
      
      return {
        intimateAreaSkinRatio: regions.center.total > 0 ? regions.center.skin / regions.center.total : 0,
        chestAreaSkinRatio: regions.chest.total > 0 ? regions.chest.skin / regions.chest.total : 0,
        lowerAreaSkinRatio: regions.lower.total > 0 ? regions.lower.skin / regions.lower.total : 0,
        overallSkinRatio: regions.overall.total > 0 ? regions.overall.skin / regions.overall.total : 0
      };
    } catch (error) {
      return { intimateAreaSkinRatio: 0, chestAreaSkinRatio: 0, lowerAreaSkinRatio: 0, overallSkinRatio: 0 };
    }
  }

  detectNudityPatterns(data, info) {
    try {
      let nudityIndicators = 0;
      const details = [];
      
      // Look for large continuous areas of skin tone
      const skinClusters = this.findSkinClusters(data, info);
      if (skinClusters.largestCluster > info.width * info.height * 0.25) {
        nudityIndicators++;
        details.push('Large continuous skin area');
      }
      
      // Check for lack of clothing edges (sharp transitions from skin to fabric)
      const clothingEdges = this.detectClothingEdges(data, info);
      if (clothingEdges < 3) {
        nudityIndicators++;
        details.push('Lack of clothing boundaries');
      }
      
      // Analyze color patterns typical of nude photography
      const nudeColorPatterns = this.analyzeNudeColorPatterns(data, info);
      if (nudeColorPatterns.score > 0.6) {
        nudityIndicators++;
        details.push('Nude photography color patterns');
      }
      
      return {
        hasNudityPatterns: nudityIndicators >= 2,
        details: details.join(', ')
      };
    } catch (error) {
      return { hasNudityPatterns: false, details: 'Analysis failed' };
    }
  }

  detectAnatomicalShapes(data, info) {
    try {
      let suspiciousShapes = 0;
      
      // Look for circular/oval shapes in skin-colored areas (breasts, buttocks)
      const circularShapes = this.detectCircularSkinShapes(data, info);
      suspiciousShapes += circularShapes;
      
      // Look for elongated shapes in appropriate regions (genitalia)
      const elongatedShapes = this.detectElongatedSkinShapes(data, info);
      suspiciousShapes += elongatedShapes;
      
      // Detect curves and contours typical of body parts
      const bodyContours = this.detectBodyContours(data, info);
      suspiciousShapes += bodyContours;
      
      return { suspiciousShapes };
    } catch (error) {
      return { suspiciousShapes: 0 };
    }
  }

  detectIntimateBodyParts(data, info) {
    try {
      const detections = [];
      
      // Check for breast-like patterns (circular with darker center)
      if (this.detectBreastPatterns(data, info)) {
        detections.push('breast-like shapes');
      }
      
      // Check for genital-like patterns
      if (this.detectGenitalPatterns(data, info)) {
        detections.push('genital-like patterns');
      }
      
      // Check for buttocks patterns
      if (this.detectButtocksPatterns(data, info)) {
        detections.push('buttocks-like shapes');
      }
      
      return {
        detected: detections.length > 0,
        details: detections.join(', ')
      };
    } catch (error) {
      return { detected: false, details: 'Detection failed' };
    }
  }

  analyzeSexualComposition(metadata, skinAnalysis) {
    try {
      const aspectRatio = metadata.width / metadata.height;
      let suspiciousFactors = 0;
      const reasons = [];
      
      // Portrait orientation with high skin content
      if (aspectRatio > 0.6 && aspectRatio < 1.4 && skinAnalysis.overallSkinRatio > 0.3) {
        suspiciousFactors++;
        reasons.push('portrait with high skin content');
      }
      
      // Very high skin concentration in intimate areas
      if (skinAnalysis.intimateAreaSkinRatio > 0.5) {
        suspiciousFactors++;
        reasons.push('high intimate area skin concentration');
      }
      
      // High chest area skin (possible topless)
      if (skinAnalysis.chestAreaSkinRatio > 0.4) {
        suspiciousFactors++;
        reasons.push('high chest area skin exposure');
      }
      
      return {
        isSuspicious: suspiciousFactors >= 2,
        reason: reasons.join(', ')
      };
    } catch (error) {
      return { isSuspicious: false, reason: 'Analysis failed' };
    }
  }

  // Helper methods for detailed sexual content detection
  findSkinClusters(data, info) {
    // Simplified skin clustering - find largest continuous skin area
    let largestCluster = 0;
    let currentCluster = 0;
    
    for (let i = 0; i < data.length; i += 3) {
      if (this.isSkinTone(data[i], data[i + 1], data[i + 2])) {
        currentCluster++;
      } else {
        if (currentCluster > largestCluster) {
          largestCluster = currentCluster;
        }
        currentCluster = 0;
      }
    }
    
    return { largestCluster: Math.max(largestCluster, currentCluster) };
  }

  detectClothingEdges(data, info) {
    // Detect sharp transitions from skin to non-skin (clothing edges)
    let edgeCount = 0;
    
    for (let y = 1; y < info.height - 1; y++) {
      for (let x = 1; x < info.width - 1; x++) {
        const idx = (y * info.width + x) * 3;
        const currentIsSkin = this.isSkinTone(data[idx], data[idx + 1], data[idx + 2]);
        
        // Check neighbors
        const neighbors = [
          (y * info.width + (x - 1)) * 3,
          (y * info.width + (x + 1)) * 3,
          ((y - 1) * info.width + x) * 3,
          ((y + 1) * info.width + x) * 3
        ];
        
        for (const nIdx of neighbors) {
          if (nIdx >= 0 && nIdx < data.length - 2) {
            const neighborIsSkin = this.isSkinTone(data[nIdx], data[nIdx + 1], data[nIdx + 2]);
            if (currentIsSkin !== neighborIsSkin) {
              edgeCount++;
              break;
            }
          }
        }
      }
    }
    
    return edgeCount;
  }

  analyzeNudeColorPatterns(data, info) {
    // Analyze color distribution typical of nude photography
    let nudeScore = 0;
    let skinPixels = 0;
    let warmTones = 0;
    
    for (let i = 0; i < data.length; i += 3) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      if (this.isSkinTone(r, g, b)) {
        skinPixels++;
        if (r > g && r > b) warmTones++; // Warm skin tones
      }
    }
    
    const totalPixels = data.length / 3;
    const skinRatio = skinPixels / totalPixels;
    const warmRatio = warmTones / Math.max(skinPixels, 1);
    
    if (skinRatio > 0.4 && warmRatio > 0.7) nudeScore = 0.8;
    else if (skinRatio > 0.3 && warmRatio > 0.6) nudeScore = 0.6;
    else if (skinRatio > 0.2) nudeScore = 0.3;
    
    return { score: nudeScore };
  }

  detectCircularSkinShapes(data, info) {
    // Simplified detection for circular skin patterns (breasts, buttocks)
    return Math.floor(Math.random() * 2); // Placeholder - would need complex shape analysis
  }

  detectElongatedSkinShapes(data, info) {
    // Simplified detection for elongated skin patterns
    return Math.floor(Math.random() * 2); // Placeholder - would need complex shape analysis
  }

  detectBodyContours(data, info) {
    // Simplified contour detection
    return Math.floor(Math.random() * 2); // Placeholder - would need complex contour analysis
  }

  detectBreastPatterns(data, info) {
    // Look for circular patterns with darker centers (nipples)
    let breastPatterns = 0;
    const centerY = Math.floor(info.height * 0.4); // Upper-middle area
    
    // Simplified detection - look for skin concentration in breast area
    let skinInBreastArea = 0;
    let totalInBreastArea = 0;
    
    for (let y = centerY - 20; y < centerY + 20; y++) {
      for (let x = 20; x < info.width - 20; x++) {
        if (y >= 0 && y < info.height) {
          const idx = (y * info.width + x) * 3;
          if (this.isSkinTone(data[idx], data[idx + 1], data[idx + 2])) {
            skinInBreastArea++;
          }
          totalInBreastArea++;
        }
      }
    }
    
    return totalInBreastArea > 0 && (skinInBreastArea / totalInBreastArea) > 0.6;
  }

  detectGenitalPatterns(data, info) {
    // Look for patterns in lower-center area
    const centerX = Math.floor(info.width / 2);
    const lowerY = Math.floor(info.height * 0.7);
    
    let skinInGenitalArea = 0;
    let totalInGenitalArea = 0;
    
    for (let y = lowerY; y < Math.min(lowerY + 30, info.height); y++) {
      for (let x = centerX - 15; x < centerX + 15; x++) {
        if (x >= 0 && x < info.width) {
          const idx = (y * info.width + x) * 3;
          if (this.isSkinTone(data[idx], data[idx + 1], data[idx + 2])) {
            skinInGenitalArea++;
          }
          totalInGenitalArea++;
        }
      }
    }
    
    return totalInGenitalArea > 0 && (skinInGenitalArea / totalInGenitalArea) > 0.5;
  }

  detectButtocksPatterns(data, info) {
    // Look for curved patterns in lower area
    const lowerY = Math.floor(info.height * 0.6);
    
    let skinInLowerArea = 0;
    let totalInLowerArea = 0;
    
    for (let y = lowerY; y < info.height; y++) {
      for (let x = 0; x < info.width; x++) {
        const idx = (y * info.width + x) * 3;
        if (this.isSkinTone(data[idx], data[idx + 1], data[idx + 2])) {
          skinInLowerArea++;
        }
        totalInLowerArea++;
      }
    }
    
    return totalInLowerArea > 0 && (skinInLowerArea / totalInLowerArea) > 0.4;
  }

  detectHighContrastPatterns(imageBuffer) {
    try {
      // Look for high contrast patterns typical of text/UI elements
      let highContrastPixels = 0;
      const sampleSize = Math.min(10000, imageBuffer.length - 3);
      
      for (let i = 0; i < sampleSize; i += 300) { // Sample every 100 pixels
        if (i + 5 < imageBuffer.length) {
          const r1 = imageBuffer[i];
          const g1 = imageBuffer[i + 1];
          const b1 = imageBuffer[i + 2];
          const r2 = imageBuffer[i + 3];
          const g2 = imageBuffer[i + 4];
          const b2 = imageBuffer[i + 5];
          
          const brightness1 = (r1 + g1 + b1) / 3;
          const brightness2 = (r2 + g2 + b2) / 3;
          const contrast = Math.abs(brightness1 - brightness2);
          
          if (contrast > 100) { // High contrast indicating text/UI
            highContrastPixels++;
          }
        }
      }
      
      const contrastRatio = highContrastPixels / (sampleSize / 300);
      return contrastRatio > 0.3; // 30% high contrast areas
      
    } catch (error) {
      return false;
    }
  }

  calculateSkinToneRatio(data, info) {
    let skinPixels = 0;
    const totalPixels = info.width * info.height;
    
    for (let i = 0; i < data.length; i += 3) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      if (this.isSkinTone(r, g, b)) {
        skinPixels++;
      }
    }
    
    return skinPixels / totalPixels;
  }

  isSkinTone(r, g, b) {
    return this.skinColorRanges.some(range => 
      r >= range.r[0] && r <= range.r[1] &&
      g >= range.g[0] && g <= range.g[1] &&
      b >= range.b[0] && b <= range.b[1]
    );
  }

  calculateColorVariance(data, info) {
    if (!data || data.length === 0) {
      return 0;
    }
    
    const colors = [];
    for (let i = 0; i < data.length; i += 3) {
      colors.push([data[i], data[i + 1], data[i + 2]]);
    }
    
    if (colors.length === 0) {
      return 0;
    }
    
    const means = [0, 0, 0];
    colors.forEach(color => {
      means[0] += color[0];
      means[1] += color[1];
      means[2] += color[2];
    });
    means[0] /= colors.length;
    means[1] /= colors.length;
    means[2] /= colors.length;
    
    let variance = 0;
    colors.forEach(color => {
      variance += Math.pow(color[0] - means[0], 2);
      variance += Math.pow(color[1] - means[1], 2);
      variance += Math.pow(color[2] - means[2], 2);
    });
    
    const result = variance / (colors.length * 3);
    return isNaN(result) ? 0 : result;
  }

  calculateEdgeComplexity(data, info) {
    let edgeStrength = 0;
    const width = info.width;
    
    for (let y = 1; y < info.height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = (y * width + x) * 3;
        
        const tl = data[((y-1) * width + (x-1)) * 3];
        const tm = data[((y-1) * width + x) * 3];
        const tr = data[((y-1) * width + (x+1)) * 3];
        const ml = data[(y * width + (x-1)) * 3];
        const mr = data[(y * width + (x+1)) * 3];
        const bl = data[((y+1) * width + (x-1)) * 3];
        const bm = data[((y+1) * width + x) * 3];
        const br = data[((y+1) * width + (x+1)) * 3];
        
        const sobelX = (tr + 2*mr + br) - (tl + 2*ml + bl);
        const sobelY = (bl + 2*bm + br) - (tl + 2*tm + tr);
        
        edgeStrength += Math.sqrt(sobelX*sobelX + sobelY*sobelY);
      }
    }
    
    return edgeStrength / (info.width * info.height);
  }

  calculateRiskScore(analysis) {
    let riskScore = 0;
    const reasons = [];
    
    // More focused on actual inappropriate content rather than general skin
    
    // High skin tone ratio - but with higher thresholds to avoid false positives
    if (analysis.skinToneRatio > 0.6) { // Much higher threshold
      riskScore += 40;
      reasons.push(`Very high skin tone ratio: ${(analysis.skinToneRatio * 100).toFixed(1)}%`);
    } else if (analysis.skinToneRatio > 0.4) {
      riskScore += 25;
      reasons.push(`High skin tone ratio: ${(analysis.skinToneRatio * 100).toFixed(1)}%`);
    }
    
    // Color variance - very low variance might indicate nudity
    if (analysis.colorVariance < 200 && analysis.skinToneRatio > 0.3) {
      riskScore += 30;
      reasons.push(`Low color variance with significant skin: ${analysis.colorVariance.toFixed(0)}`);
    }
    
    // Edge complexity - certain patterns combined with high skin
    if (analysis.edgeComplexity < 50 && analysis.skinToneRatio > 0.4) {
      riskScore += 25;
      reasons.push(`Low edge complexity with high skin content: ${analysis.edgeComplexity.toFixed(1)}`);
    }
    
    // File size - very large files with high skin content
    if (analysis.fileSize > 2 * 1024 * 1024 && analysis.skinToneRatio > 0.5) {
      riskScore += 20;
      reasons.push(`Large file with very high skin content: ${(analysis.fileSize / 1024 / 1024).toFixed(1)}MB`);
    }
    
    // Higher threshold to reduce false positives on normal photos
    const isAdult = riskScore >= 50; // Increased threshold
    const confidence = Math.min(riskScore / 100, 1.0);
    
    console.log(`Risk assessment: ${riskScore}/100 points`);
    console.log(`Reasons: ${reasons.join(', ') || 'No high-risk patterns detected'}`);
    console.log(`Decision: ${isAdult ? 'BLOCK' : 'ALLOW'} (confidence: ${(confidence * 100).toFixed(1)}%)`);
    
    return {
      isAdult,
      confidence,
      riskScore,
      reasons: reasons.join(', ') || 'Content appears safe'
    };
  }
}

export default new EnhancedImageAnalyzer();