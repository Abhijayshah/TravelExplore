#!/usr/bin/env node

/**
 * Authentication Test Script
 * Tests all authentication endpoints and functionality
 */

const http = require('http');
const querystring = require('querystring');

const BASE_URL = 'http://localhost:3000';

// Test data
const testUser = {
    firstName: 'Test',
    lastName: 'User',
    email: `test${Date.now()}@example.com`,
    password: 'testpass123',
    phone: '+1234567890'
};

const demoUser = {
    email: 'demo@user.com',
    password: '123456'
};

// Helper function to make HTTP requests
function makeRequest(options, data = null) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    const result = {
                        statusCode: res.statusCode,
                        headers: res.headers,
                        body: body
                    };
                    
                    // Try to parse JSON if possible
                    try {
                        result.json = JSON.parse(body);
                    } catch (e) {
                        // Not JSON, that's okay
                    }
                    
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            });
        });
        
        req.on('error', reject);
        
        if (data) {
            req.write(data);
        }
        
        req.end();
    });
}

// Test functions
async function testServerHealth() {
    console.log('\n🔍 Testing server health...');
    
    try {
        const response = await makeRequest({
            hostname: 'localhost',
            port: 3000,
            path: '/',
            method: 'GET'
        });
        
        if (response.statusCode === 200) {
            console.log('✅ Server is running and accessible');
            return true;
        } else {
            console.log(`❌ Server returned status ${response.statusCode}`);
            return false;
        }
    } catch (error) {
        console.log(`❌ Server health check failed: ${error.message}`);
        return false;
    }
}

async function testDemoLogin() {
    console.log('\n🔍 Testing demo user login...');
    
    try {
        const postData = JSON.stringify(demoUser);
        
        const response = await makeRequest({
            hostname: 'localhost',
            port: 3000,
            path: '/api/auth/login',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        }, postData);
        
        if (response.statusCode === 200 && response.json && response.json.success) {
            console.log('✅ Demo login successful');
            console.log(`   User: ${response.json.user.name} (${response.json.user.email})`);
            console.log(`   Token: ${response.json.token ? 'Generated' : 'Missing'}`);
            return response.json.token;
        } else {
            console.log(`❌ Demo login failed: ${response.json ? response.json.message : 'Unknown error'}`);
            return null;
        }
    } catch (error) {
        console.log(`❌ Demo login test failed: ${error.message}`);
        return null;
    }
}

async function testUserRegistration() {
    console.log('\n🔍 Testing new user registration...');
    
    try {
        const postData = JSON.stringify(testUser);
        
        const response = await makeRequest({
            hostname: 'localhost',
            port: 3000,
            path: '/api/auth/register',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        }, postData);
        
        if (response.statusCode === 200 && response.json && response.json.success) {
            console.log('✅ User registration successful');
            console.log(`   User: ${response.json.user.name} (${response.json.user.email})`);
            console.log(`   Token: ${response.json.token ? 'Generated' : 'Missing'}`);
            return response.json.token;
        } else {
            console.log(`❌ User registration failed: ${response.json ? response.json.message : 'Unknown error'}`);
            return null;
        }
    } catch (error) {
        console.log(`❌ User registration test failed: ${error.message}`);
        return null;
    }
}

async function testNewUserLogin() {
    console.log('\n🔍 Testing new user login...');
    
    try {
        const loginData = {
            email: testUser.email,
            password: testUser.password
        };
        
        const postData = JSON.stringify(loginData);
        
        const response = await makeRequest({
            hostname: 'localhost',
            port: 3000,
            path: '/api/auth/login',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        }, postData);
        
        if (response.statusCode === 200 && response.json && response.json.success) {
            console.log('✅ New user login successful');
            console.log(`   User: ${response.json.user.name} (${response.json.user.email})`);
            return response.json.token;
        } else {
            console.log(`❌ New user login failed: ${response.json ? response.json.message : 'Unknown error'}`);
            return null;
        }
    } catch (error) {
        console.log(`❌ New user login test failed: ${error.message}`);
        return null;
    }
}

async function testProtectedRoute(token) {
    console.log('\n🔍 Testing protected route access...');
    
    try {
        const response = await makeRequest({
            hostname: 'localhost',
            port: 3000,
            path: '/api/auth/me',
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.statusCode === 200 && response.json && response.json.success) {
            console.log('✅ Protected route access successful');
            console.log(`   User data retrieved: ${response.json.user.name}`);
            return true;
        } else {
            console.log(`❌ Protected route access failed: ${response.json ? response.json.message : 'Unauthorized'}`);
            return false;
        }
    } catch (error) {
        console.log(`❌ Protected route test failed: ${error.message}`);
        return false;
    }
}

async function testGoogleOAuthEndpoint() {
    console.log('\n🔍 Testing Google OAuth endpoint...');
    
    try {
        const response = await makeRequest({
            hostname: 'localhost',
            port: 3000,
            path: '/auth/google',
            method: 'GET'
        });
        
        // Google OAuth should redirect (302) to Google's auth server
        if (response.statusCode === 302) {
            const location = response.headers.location;
            if (location && location.includes('accounts.google.com')) {
                console.log('✅ Google OAuth endpoint working (redirects to Google)');
                return true;
            } else {
                console.log(`❌ Google OAuth redirect unexpected: ${location}`);
                return false;
            }
        } else {
            console.log(`❌ Google OAuth endpoint failed: Status ${response.statusCode}`);
            return false;
        }
    } catch (error) {
        console.log(`❌ Google OAuth test failed: ${error.message}`);
        return false;
    }
}

// Main test runner
async function runTests() {
    console.log('🚀 Starting TravelExplore Authentication Tests\n');
    console.log('=' .repeat(50));
    
    const results = {
        serverHealth: false,
        demoLogin: false,
        userRegistration: false,
        newUserLogin: false,
        protectedRoute: false,
        googleOAuth: false
    };
    
    // Test 1: Server Health
    results.serverHealth = await testServerHealth();
    
    if (!results.serverHealth) {
        console.log('\n❌ Server is not accessible. Please ensure the server is running on port 3000.');
        process.exit(1);
    }
    
    // Test 2: Demo Login
    const demoToken = await testDemoLogin();
    results.demoLogin = !!demoToken;
    
    // Test 3: User Registration
    const registrationToken = await testUserRegistration();
    results.userRegistration = !!registrationToken;
    
    // Test 4: New User Login
    if (results.userRegistration) {
        const loginToken = await testNewUserLogin();
        results.newUserLogin = !!loginToken;
        
        // Test 5: Protected Route (using login token)
        if (loginToken) {
            results.protectedRoute = await testProtectedRoute(loginToken);
        }
    }
    
    // Test 6: Google OAuth Endpoint
    results.googleOAuth = await testGoogleOAuthEndpoint();
    
    // Summary
    console.log('\n' + '=' .repeat(50));
    console.log('📊 TEST RESULTS SUMMARY');
    console.log('=' .repeat(50));
    
    const tests = [
        { name: 'Server Health', result: results.serverHealth },
        { name: 'Demo Login', result: results.demoLogin },
        { name: 'User Registration', result: results.userRegistration },
        { name: 'New User Login', result: results.newUserLogin },
        { name: 'Protected Route Access', result: results.protectedRoute },
        { name: 'Google OAuth Endpoint', result: results.googleOAuth }
    ];
    
    let passedTests = 0;
    tests.forEach(test => {
        const status = test.result ? '✅ PASS' : '❌ FAIL';
        console.log(`${status} ${test.name}`);
        if (test.result) passedTests++;
    });
    
    console.log('\n' + '-' .repeat(50));
    console.log(`📈 Overall: ${passedTests}/${tests.length} tests passed`);
    
    if (passedTests === tests.length) {
        console.log('🎉 All authentication tests passed! The system is working correctly.');
    } else {
        console.log('⚠️  Some tests failed. Please check the error messages above.');
        
        if (!results.googleOAuth) {
            console.log('\n💡 Note: Google OAuth requires proper setup. See GOOGLE_OAUTH_SETUP.md for instructions.');
        }
    }
    
    console.log('\n🔗 Test the application manually at: http://localhost:3000/login');
}

// Run tests
runTests().catch(error => {
    console.error('\n💥 Test runner failed:', error.message);
    process.exit(1);
});