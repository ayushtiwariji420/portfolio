const { contactOperations } = require('../src/lib/database');

async function testContactMessages() {
  try {
    console.log('Testing contact message operations...\n');

    // Test creating a contact message
    console.log('1. Creating a test contact message...');
    const testMessage = await contactOperations.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      subject: 'Test Subject',
      message: 'This is a test message from the contact form.'
    });
    console.log('✓ Created message:', testMessage);

    // Test getting all messages
    console.log('\n2. Fetching all contact messages...');
    const allMessages = await contactOperations.getAll({ page: 1, limit: 10 });
    console.log('✓ Found', allMessages.total, 'messages');
    console.log('Messages:', allMessages.messages);

    // Test marking as read
    console.log('\n3. Marking message as read...');
    const markedAsRead = await contactOperations.markAsRead(testMessage.id);
    console.log('✓ Marked as read:', markedAsRead);

    // Test updating status
    console.log('\n4. Updating message status...');
    const updatedStatus = await contactOperations.updateStatus(testMessage.id, 'replied');
    console.log('✓ Updated status:', updatedStatus);

    // Test getting by ID
    console.log('\n5. Fetching message by ID...');
    const messageById = await contactOperations.getById(testMessage.id);
    console.log('✓ Message by ID:', messageById);

    console.log('\n✅ All contact message operations completed successfully!');

  } catch (error) {
    console.error('❌ Error testing contact messages:', error);
  }
}

// Run the test
testContactMessages();