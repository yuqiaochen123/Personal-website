function sendEmail(e) {
    e.preventDefault();
    
    const formMessage = document.getElementById('form-message');
    formMessage.textContent = 'Sending...';
    formMessage.className = 'form-message';
    
    const templateParams = {
        from_name: document.getElementById('name').value,
        from_email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value,
        to_email: document.querySelector('input[name="to_email"]').value
    };

    emailjs.send('service_qa4724l', 'template_fen3czk', templateParams)
        .then(function(response) {
            formMessage.textContent = 'Message sent successfully!';
            formMessage.className = 'form-message success';
            document.getElementById('contactForm').reset();
        }, function(error) {
            formMessage.textContent = 'Failed to send message. Please try again.';
            formMessage.className = 'form-message error';
            console.error('EmailJS error:', error);
        });

    return false;
} 