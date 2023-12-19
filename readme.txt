 <script>
    function submitForm(event) {
      event.preventDefault();

      const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value,
      };

      fetch('/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      .then(response => response.text())
      .then(data => {
        console.log(data);
        alert('Form submitted successfully!');
      })
      .catch(error => {
        console.error('Error submitting form:', error);
        alert('An error occurred. Please try again.');
      });
    }
  </script>