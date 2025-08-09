// =============================================
// --- Service Details Modal Logic (v2 with Accordion) ---
// =============================================
const knowMoreButtons = document.querySelectorAll('.know-more-btn');
const serviceModal = document.getElementById('service-modal');
const modalOverlay = document.getElementById('service-modal-overlay');
const modalContent = document.getElementById('modal-content');
const modalCloseBtn = document.getElementById('modal-close-btn');

let servicesData = null;
fetch('../json/service1-data.json')
    .then(response => response.json())
    .then(data => {
        servicesData = data;
    })
    .catch(error => console.error('Error fetching service data:', error));

function setupFaqAccordion() {
    const faqQuestions = serviceModal.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const faqAnswer = faqItem.querySelector('.faq-answer');

            faqItem.classList.toggle('is-open');

            if (faqItem.classList.contains('is-open')) {
                faqAnswer.style.maxHeight = faqAnswer.scrollHeight + 'px';
            } else {
                faqAnswer.style.maxHeight = '0px';
            }
        });
    });
}

function populateAndShowModal(serviceId) {
    if (!servicesData || !servicesData[serviceId]) {
        console.error('Service data not found for:', serviceId);
        return;
    }

    const service = servicesData[serviceId];

    let galleryHTML = '';
    if (service.gallery && service.gallery.length > 0) {
        galleryHTML = '<div class="modal-gallery">';
        service.gallery.forEach(imgUrl => {
            galleryHTML += `<img src="${imgUrl}" alt="${service.title} gallery image">`;
        });
        galleryHTML += '</div>';
    }

    let faqHTML = '';
    if (service.faqs && service.faqs.length > 0) {
        faqHTML = '<div class="faq-section"><h3>Frequently Asked Questions</h3>';
        service.faqs.forEach(faq => {
            faqHTML += `
                <div class="faq-item">
                    <div class="faq-question">
                        <h4>${faq.question}</h4>
                        <span class="faq-icon"></span>
                    </div>
                    <div class="faq-answer">
                        <p>${faq.answer}</p>
                    </div>
                </div>
            `;
        });
        faqHTML += '</div>';
    }

    modalContent.innerHTML = `
        <h2>${service.title}</h2>
        <p>${service.longDescription}</p>
        ${galleryHTML}
        ${faqHTML}
    `;

    // IMPORTANT: Setup the accordion listeners AFTER the content is in the DOM
    setupFaqAccordion();

    serviceModal.classList.add('active');
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    serviceModal.classList.remove('active');
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

knowMoreButtons.forEach(button => {
    button.addEventListener('click', () => {
        const serviceId = button.closest('.feature-block').dataset.serviceId;
        populateAndShowModal(serviceId);
    });
});

if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
if (modalOverlay) modalOverlay.addEventListener('click', closeModal);