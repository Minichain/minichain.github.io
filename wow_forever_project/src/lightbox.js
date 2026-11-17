(function () {
    const links = Array.from(document.querySelectorAll('.imageGrid a'));
    if (links.length === 0) return;

    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.hidden = true;
    lightbox.innerHTML = `
        <button class="lightboxButton lightboxClose" type="button" aria-label="Close">&times;</button>
        <button class="lightboxButton lightboxPrev" type="button" aria-label="Previous image">&#8249;</button>
        <img class="lightboxImage" alt="">
        <button class="lightboxButton lightboxNext" type="button" aria-label="Next image">&#8250;</button>
        <div class="lightboxCounter"></div>
    `;
    document.body.appendChild(lightbox);

    const image = lightbox.querySelector('.lightboxImage');
    const counter = lightbox.querySelector('.lightboxCounter');
    let currentIndex = 0;

    function show(index) {
        currentIndex = (index + links.length) % links.length;
        image.src = links[currentIndex].getAttribute('href');
        counter.textContent = `${currentIndex + 1} / ${links.length}`;
    }

    function open(index) {
        show(index);
        lightbox.hidden = false;
        document.body.style.overflow = 'hidden';
    }

    function close() {
        lightbox.hidden = true;
        document.body.style.overflow = '';
        image.removeAttribute('src');
    }

    links.forEach((link, index) => {
        link.addEventListener('click', (event) => {
            // Let modified clicks (new tab, etc.) keep their default behavior.
            if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
            event.preventDefault();
            open(index);
        });
    });

    lightbox.querySelector('.lightboxPrev').addEventListener('click', () => show(currentIndex - 1));
    lightbox.querySelector('.lightboxNext').addEventListener('click', () => show(currentIndex + 1));
    lightbox.querySelector('.lightboxClose').addEventListener('click', close);

    // Clicking the dark backdrop (not the image or buttons) closes the view.
    lightbox.addEventListener('click', (event) => {
        if (event.target === lightbox) close();
    });

    document.addEventListener('keydown', (event) => {
        if (lightbox.hidden) return;
        if (event.key === 'ArrowLeft') show(currentIndex - 1);
        else if (event.key === 'ArrowRight') show(currentIndex + 1);
        else if (event.key === 'Escape') close();
    });
})();
