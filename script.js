

function sendEmail(e) {
    e.preventDefault();
    console.log('Form submission started');
    
    // Check if EmailJS is available
    if (typeof emailjs === 'undefined') {
        console.error('EmailJS is not loaded');
        const formMessage = document.getElementById('form-message');
        formMessage.textContent = 'Error: Email service not available. Please try again later.';
        formMessage.className = 'form-message error';
        return false;
    }
    
    const formMessage = document.getElementById('form-message');
    formMessage.textContent = 'Sending...';
    formMessage.className = 'form-message';
    
    try {
        const templateParams = {
            from_name: document.getElementById('name').value,
            from_email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value,
            to_email: document.querySelector('input[name="to_email"]').value
        };

        console.log('Sending email with params:', templateParams);

        emailjs.send('service_qa4724l', 'template_fen3czk', templateParams)
            .then(function(response) {
                console.log('Email sent successfully:', response);
                formMessage.textContent = 'Message sent successfully!';
                formMessage.className = 'form-message success';
                document.getElementById('contactForm').reset();
            }, function(error) {
                console.error('EmailJS error:', error);
                formMessage.textContent = 'Failed to send message. Please try again.';
                formMessage.className = 'form-message error';
            });
    } catch (error) {
        console.error('Error in sendEmail function:', error);
        formMessage.textContent = 'An error occurred. Please try again.';
        formMessage.className = 'form-message error';
    }

    return false;
} 