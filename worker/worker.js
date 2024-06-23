addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
    // Check if the request is an email event
    if (request.cf && request.cf.email) {
        const email = request.cf.email;

        // Parse email content
        const { text, attachments } = await parseEmail(email);

        // Store text content in Workers KV
        await BLOG_CONTENT.put(email.id, text);

        // Upload attachments to R2
        for (const attachment of attachments) {
            await uploadToR2(attachment);
        }

        return new Response('Email processed', { status: 200 });
    }

    return new Response('Invalid request', { status: 400 });
}

async function parseEmail(email) {
    // Parse the email content and attachments
    const text = email.body; // Simplified for example
    const attachments = email.attachments; // Simplified for example
    return { text, attachments };
}

async function uploadToR2(attachment) {
    // Upload the attachment to Cloudflare R2
    const r2Url = `https://<YOUR_R2_BUCKET>.r2.cloudflarestorage.com/${attachment.filename}`;
    await fetch(r2Url, {
        method: 'PUT',
        headers: {
            'Content-Type': attachment.contentType
        },
        body: attachment.content
    });
}

