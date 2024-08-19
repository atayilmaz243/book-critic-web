


document.addEventListener('DOMContentLoaded', (event) => {
	const loginBlock = document.querySelector("#loginBlock")
	const registerBlock = document.querySelector("#registerBlock")

	loginBlock.addEventListener('mouseover', () => {
	    loginBlock.classList.add('bg-secondary-subtle')
	    registerBlock.classList.remove('bg-secondary-subtle')
	 });

	registerBlock.addEventListener('mouseover', () => {
	    registerBlock.classList.add('bg-secondary-subtle')
	   	loginBlock.classList.remove('bg-secondary-subtle')
	 });
});




document.querySelector('#register-form').addEventListener('submit',async (event) => {
	event.preventDefault()


  const username = document.getElementById('register-username-input').value;
  const password = document.getElementById('register-password-input').value;



  try {
    const response = await fetch('/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    const result = await response.json();

    if (response.ok) {

      alert('Registration successful!');
      window.location.href = '/';

    } else {

      throw new Error(result.message || 'Registration failed');

    }
  } catch (error) {

    alert(`Registration failed: ${error.message}`);

  }



});


document.querySelector('#login-form').addEventListener('submit',async (event) => {
	event.preventDefault()


  const username = document.getElementById('login-username-input').value;
  const password = document.getElementById('login-password-input').value;

  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    const result = await response.json();

    if (response.ok) {

      alert('Login successful!');
      window.location.href = '/';

    } else {

      throw new Error(result.message || 'Login failed');

    }
  } catch (error) {

    alert(`Login failed: ${error.message}`);
    
  }


});


