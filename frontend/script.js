document.addEventListener('DOMContentLoaded', async () => {
    const contentDiv = document.getElementById('content');
    const response = await fetch('/api/getContent');
    const data = await response.json();

    data.forEach(post => {
        const postDiv = document.createElement('div');
        postDiv.className = 'post';
        postDiv.innerHTML = `<h2>${post.title}</h2><p>${post.body}</p>`;
        contentDiv.appendChild(postDiv);
    });
});
