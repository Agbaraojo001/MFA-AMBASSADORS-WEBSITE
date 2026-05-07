// Replace these values with your Supabase project URL and public anon key.
// Create a Supabase table named `contact_submissions` with columns:
// `id` (uuid), `name` (text), `phone` (text), `community` (text), `subject` (text), `message` (text), and `created_at` (timestamp).
const supabaseUrl = 'https://YOUR_PROJECT_ID.supabase.co';
const supabaseAnonKey = 'YOUR_ANON_KEY';
const supabase = supabase.createClient(supabaseUrl, supabaseAnonKey);

const form = document.getElementById('contactForm');
const statusMessage = document.getElementById('statusMessage');

if (form) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const name = formData.get('name');
    const phone = formData.get('phone');
    const community = formData.get('community');
    const subject = formData.get('subject');
    const message = formData.get('message');

    if (!name || !phone || !community || !subject || !message) {
      statusMessage.textContent = 'Please complete all fields before submitting.';
      statusMessage.style.color = '#c92a2a';
      return;
    }

    statusMessage.textContent = 'Sending your message...';
    statusMessage.style.color = '#0f5132';

    const { data, error } = await supabase.from('contact_submissions').insert([
      { name, phone, community, subject, message },
    ]);

    if (error) {
      statusMessage.textContent = 'Unable to send your message right now. Please try again later.';
      statusMessage.style.color = '#c92a2a';
      console.error('Supabase insert error:', error);
      return;
    }

    statusMessage.textContent = 'Thank you! Your message has been received successfully.';
    statusMessage.style.color = '#0f5132';
    form.reset();
  });
}
