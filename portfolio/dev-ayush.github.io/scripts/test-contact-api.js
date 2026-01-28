async function testContactAPI() {
  const baseURL = 'http://localhost:3000'; // Adjust if your dev server runs on different port

  try {
    console.log('Testing contact message API...\n');

    // Test creating a contact message
    console.log('1. Creating a test contact message...');
    const createResponse = await fetch(`${baseURL}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john.doe@example.com',
        subject: 'Test Subject',
        message: 'This is a test message from the contact form.'
      }),
    });

    if (!createResponse.ok) {
      throw new Error(`Failed to create message: ${createResponse.status}`);
    }

    const createData = await createResponse.json();
    console.log('✓ Created message:', createData);

    // Test getting messages via admin API
    console.log('\n2. Fetching contact messages via admin API...');
    const getResponse = await fetch(`${baseURL}/api/admin/contact-messages`);

    if (!getResponse.ok) {
      throw new Error(`Failed to fetch messages: ${getResponse.status}`);
    }

    const getData = await getResponse.json();
    console.log('✓ Fetched messages:', getData);

    console.log('\n✅ Contact API test completed successfully!');

  } catch (error) {
    console.error('❌ Error testing contact API:', error);
    console.log('\nNote: Make sure your development server is running on localhost:3000');
  }
}

// Run the test
testContactAPI();