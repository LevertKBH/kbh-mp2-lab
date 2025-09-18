// test-signup.ts
async function testSignup() {
    try {
      const response = await fetch('http://localhost:3000/api/auth/sign-up/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'Levert@31',
          name: 'Test User'
        })
      });
  
      const result = await response.json();
      console.log('Signup result:', result);
      
      if (response.ok) {
        console.log('Signup worked! Check the database to see what provider ID was used.');
      } else {
        console.log('Signup failed:', result);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  testSignup();
  