document.addEventListener('DOMContentLoaded', () => {
    // Contact Form Submission Handler
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you! Your message has been submitted successfully.');
            contactForm.reset();
        });
    }
});
