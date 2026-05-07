const form = document.getElementById('contactForm');

if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const name = formData.get('name');
    const phone = formData.get('phone');
    const community = formData.get('community');

    alert(
      `Thank you, ${name}! Your message has been received from ${community}. The MFA Ambassadors Media Team will be in touch with you at ${phone} shortly.`
    );
    form.reset();
  });
}
