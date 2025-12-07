// --- Global Variables ---
const modal = document.getElementById("imageModal");
const modalImage = document.getElementById("img01");
const captionText = document.getElementById("caption");

// Array to hold the images currently displayed in the gallery (after filtering)
let visibleImages = [];
// Variable to track the index of the image currently shown in the modal
let currentImageIndex = 0;

// --- Helper Function to Refresh Image List ---

/**
 * Updates the visibleImages array based on the current search filter.
 * This is crucial for ensuring navigation (next/prev) only cycles through visible images.
 */
function updateVisibleImages() {
    visibleImages = [];
    // Only select images that are currently NOT hidden by the filter
    const items = document.getElementsByClassName('gallery-item');
    for (let i = 0; i < items.length; i++) {
        // If the item is displayed (not hidden by filterGallery()), add its image to the list
        if (items[i].style.display !== 'none') {
            visibleImages.push(items[i].querySelector('.gallery-image'));
        }
    }
}

// --- Modal Functionality (Updated) ---

/**
 * Opens the modal and displays the clicked image.
 * @param {HTMLImageElement} imgElement - The image element that was clicked.
 */
function openModal(imgElement) {
    // 1. First, make sure our list of navigable images is correct based on the current filter
    updateVisibleImages();

    // 2. Find the index of the clicked element within the new visibleImages array
    for (let i = 0; i < visibleImages.length; i++) {
        if (visibleImages[i] === imgElement) {
            currentImageIndex = i;
            break;
        }
    }

    // 3. Display the modal and the image content
    showImage(currentImageIndex);
    modal.style.display = "block";
}

/**
 * Helper function to set the modal image source and caption based on an index.
 * @param {number} index - The index of the image in the visibleImages array.
 */
function showImage(index) {
    if (visibleImages.length === 0) return; // Guard clause if no images are visible

    // Wrap the index around if it goes past the start or end of the array
    if (index >= visibleImages.length) {
        currentImageIndex = 0; // Wrap to the first image
    } else if (index < 0) {
        currentImageIndex = visibleImages.length - 1; // Wrap to the last image
    } else {
        currentImageIndex = index;
    }

    const imgElement = visibleImages[currentImageIndex];
    modalImage.src = imgElement.src;
    captionText.innerHTML = imgElement.alt;
}


/**
 * Changes the displayed image in the modal by shifting the index.
 * @param {number} n - The direction to move: 1 for next, -1 for previous.
 */
function changeImage(n) {
    showImage(currentImageIndex + n);
}

/**
 * Toggles a 'zoomed' class on the modal image when clicked.
 * @param {HTMLImageElement} img - The modal image element.
 */
function toggleZoom(img) {
    img.classList.toggle('zoomed');
}


function closeModal() {
    modal.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == modal) {
        closeModal();
    }
}

// --- Search/Filter Functionality (Updated to call updateVisibleImages) ---

function filterGallery() {
    let input = document.getElementById('categorySearch');
    let filter = input.value.toUpperCase();

    let items = document.getElementsByClassName('gallery-item');

    for (let i = 0; i < items.length; i++) {
        let image = items[i].querySelector('.gallery-image');
        let category = image ? image.getAttribute('data-category') : null;

        if (category) {
            if (category.toUpperCase().indexOf(filter) > -1) {
                items[i].style.display = "";
                items[i].style.opacity = "1";
            } else {
                items[i].style.display = "none";
                items[i].style.opacity = "0";
            }
        }
    }
    // IMPORTANT: After filtering, we must update the list of visible images
    // so that the next/prev buttons work correctly with the filtered set.
    updateVisibleImages();
}

// Initialize the list when the page first loads
document.addEventListener('DOMContentLoaded', updateVisibleImages);