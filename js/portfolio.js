document.addEventListener('DOMContentLoaded', () => {
    const portfolioGrid = document.querySelector('.portfolio-grid');
    const modal = document.getElementById('portfolio-modal');
    const modalOverlay = document.getElementById('portfolio-modal-overlay');
    const modalContent = document.getElementById('portfolio-modal-content');
    const closeModalBtn = document.getElementById('portfolio-modal-close-btn');

    // Add a loading indicator to the UI
    if (portfolioGrid) {
        portfolioGrid.classList.add('loading');
    }

    // Function to initialize the portfolio once data is fetched
    const initializePortfolio = (portfolioData) => {
        // Remove loading indicator
        portfolioGrid.classList.remove('loading');
        
        const projectCards = document.querySelectorAll('.project-card');

        // Add click listeners ONLY after data is successfully loaded
        projectCards.forEach(card => {
            card.addEventListener('click', () => {
                const projectId = card.dataset.projectId;
                openModal(projectId, portfolioData);
            });
        });
    };

    // Function to open and populate the modal
    const openModal = (projectId, portfolioData) => {
        const project = portfolioData[projectId];
        if (!project) {
            console.error('Project data not found for:', projectId);
            return;
        }

        let galleryHTML = '';
        if (project.gallery && project.gallery.length > 0) {
            galleryHTML = '<div class="portfolio-modal-gallery">';
            project.gallery.forEach(imgUrl => {
                galleryHTML += `<img src="${imgUrl}" alt="${project.title} gallery image">`;
            });
            galleryHTML += '</div>';
        }

        modalContent.innerHTML = `
            <h2>${project.title}</h2>
            <p class="location">${project.location}</p>
            <p>${project.description}</p>
            ${galleryHTML}
        `;

        modal.classList.add('active');
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    // Function to close the modal
    const closeModal = () => {
        modal.classList.remove('active');
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    // Add listeners to close the modal
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

    // Fetch the project data from the JSON file.
    fetch('json/portfolio-data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok. Are you running this on a local server?');
            }
            return response.json();
        })
        .then(data => {
            // If fetch is successful, initialize the portfolio functionality
            initializePortfolio(data);
        })
        .catch(error => {
            console.error('Error fetching portfolio data:', error);
            if (portfolioGrid) {
                portfolioGrid.classList.remove('loading');
                portfolioGrid.innerHTML = `<p style="color: red; grid-column: 1 / -1; text-align: center;"><b>Error:</b> Could not load project data.<br>Please ensure you are running this page on a local server (like VS Code's "Live Server" extension).</p>`;
            }
        });
});
