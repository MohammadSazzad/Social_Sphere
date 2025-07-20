import imageModerationService from './services/imageModerationService.js';
import fs from 'fs';
import path from 'path';

async function testModeration() {
    try {
        console.log('Testing image moderation service...');
        
        // Test with a simple test image if available, or create a small test buffer
        const testBuffer = Buffer.from('fake image data for testing');
        
        console.log('Testing with sample buffer...');
        const result = await imageModerationService.isAdultContent(testBuffer);
        console.log('Test result:', result);
        
        // Test cache functionality
        console.log('Testing cache...');
        const cachedResult = await imageModerationService.isAdultContent(testBuffer);
        console.log('Cached result:', cachedResult);
        
    } catch (error) {
        console.error('Test failed:', error);
    }
}

testModeration();
