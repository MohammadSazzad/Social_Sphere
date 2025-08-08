import imageModerationService from './services/imageModerationService.js';
import fs from 'fs';
import path from 'path';

async function testModeration() {
    try {
        
        // Test with a simple test image if available, or create a small test buffer
        const testBuffer = Buffer.from('fake image data for testing');
        
        const result = await imageModerationService.isAdultContent(testBuffer);
        
        // Test cache functionality
        const cachedResult = await imageModerationService.isAdultContent(testBuffer);
        
    } catch (error) {
        console.error('Test failed:', error);
    }
}

testModeration();
