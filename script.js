let currentEmail = '';

// Generate Temp Email (Real API)
document.getElementById('generate-email').addEventListener('click', async function() {
    try {
        const response = await axios.get('https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=1');
        currentEmail = response.data[0];
        document.getElementById('email-display').textContent = 'Your Temp Email: ' + currentEmail;
    } catch (error) {
        document.getElementById('email-display').textContent = 'Error generating email. Try again.';
        console.error(error);
    }
});

// Check Inbox (Real API)
document.getElementById('check-inbox').addEventListener('click', async function() {
    if (!currentEmail) {
        alert('Generate an email first!');
        return;
    }
    const [login, domain] = currentEmail.split('@');
    try {
        const response = await axios.get(`https://www.1secmail.com/api/v1/?action=getMessages&login=${login}&domain=${domain}`);
        const inbox = document.getElementById('inbox');
        inbox.innerHTML = '<h3>Inbox:</h3>';
        if (response.data.length === 0) {
            inbox.innerHTML += '<p>No messages yet.</p>';
        } else {
            response.data.forEach(msg => {
                inbox.innerHTML += `<div class="message-card"><p><strong>From:</strong> ${msg.from}</p><p><strong>Subject:</strong> ${msg.subject}</p><button onclick="viewMessage('${login}', '${domain}', ${msg.id})" class="vip-btn secondary">View</button></div>`;
            });
        }
    } catch (error) {
        document.getElementById('inbox').innerHTML = 'Error checking inbox.';
        console.error(error);
    }
});

// View Message (Real API)
async function viewMessage(login, domain, id) {
    try {
        const response = await axios.get(`https://www.1secmail.com/api/v1/?action=readMessage&login=${login}&domain=${domain}&id=${id}`);
        alert(`Message: ${response.data.textBody || response.data.htmlBody}`);
    } catch (error) {
        alert('Error viewing message.');
        console.error(error);
    }
}
