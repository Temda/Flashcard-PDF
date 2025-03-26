let deck = [];
let currentDeckName = '';

function uploadPDF() {
    const deckName = document.getElementById('deckName').value;
    const numFlashcards = document.getElementById('numFlashcards').value;
    const pdfFile = document.getElementById('pdfFile').files[0];

    if (!deckName || !numFlashcards || !pdfFile) {
        alert('Please fill all fields and select a PDF file');
        return;
    }

    currentDeckName = deckName;

    const deckInfo = {
        name: deckName,
        numFlashcards: numFlashcards,
        createdAt: new Date().toISOString()
    };

    let decks = JSON.parse(localStorage.getItem('decks') || '[]');
    const existingDeckIndex = decks.findIndex(d => d.name === deckName);
    if (existingDeckIndex >= 0) {
        decks[existingDeckIndex] = deckInfo;
    } else {
        decks.push(deckInfo);
    }
    localStorage.setItem('decks', JSON.stringify(decks));

    const formData = new FormData();
    formData.append('file', pdfFile);
    formData.append('deckName', deckName);
    formData.append('numFlashcards', numFlashcards);

    fetch('/upload', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            deck = data;
            localStorage.setItem(`deck_${deckName}`, JSON.stringify(deck));
            showDeckView(deckName);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error uploading file. Please try again.');
        });
}

function showCurrentCard() {
    const flashcardsList = document.getElementById('flashcardsList');
    flashcardsList.innerHTML = '';

    if (deck.length === 0) {
        flashcardsList.innerHTML = '<p class="text-gray-500 col-span-3 text-center">No flashcards in this deck</p>';
        return;
    }

    deck.forEach((card, index) => {
        const flashcard = document.createElement('div');
        flashcard.className = 'perspective w-full h-48 cursor-pointer group';
        flashcard.innerHTML = `
    <div id="card-${index}" class="relative w-full h-full transition-transform duration-500 transform-preserve-3d">
        <div class="absolute w-full h-full backface-hidden flex items-center justify-center p-6 bg-white rounded-xl shadow-md border border-gray-200 group-hover:shadow-lg transition">
            <p class="text-lg font-medium text-gray-800 text-center">${card.front}</p>
            <div class="absolute bottom-2 right-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Front</div>
        </div>
        <div class="absolute w-full h-full backface-hidden flex items-center justify-center p-6 bg-gray-50 rounded-xl shadow-md border border-gray-200 transform-rotate-y-180">
            <p class="text-lg font-medium text-gray-800 text-center">${card.back}</p>
            <div class="absolute bottom-2 right-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Back</div>
        </div>
    </div>
`;
        flashcard.onclick = () => toggleFlip(index);
        flashcardsList.appendChild(flashcard);
    });
}

function toggleFlip(index) {
    const card = document.getElementById(`card-${index}`);
    card.classList.toggle('rotate-y-180');
}
function updateDeckList() {
    const decksContainer = document.getElementById('decksContainer');
    decksContainer.innerHTML = '';

    const decks = JSON.parse(localStorage.getItem('decks') || '[]');

    if (decks.length === 0) {
        decksContainer.innerHTML = '<p class="text-gray-500 col-span-3 text-center">No decks created yet</p>';
        return;
    }

    decks.forEach(deck => {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition transform hover:-translate-y-1 cursor-pointer';
        card.innerHTML = `
            <div class="p-6">
                <h3 class="text-xl font-semibold text-gray-800 mb-2">${deck.name}</h3>
                <p class="text-gray-600">${deck.numFlashcards} cards</p>
                <p class="text-sm text-gray-500 mt-2">Created: ${new Date(deck.createdAt).toLocaleDateString()}</p>
            </div>
        `;
        card.onclick = () => loadDeck(deck.name);
        decksContainer.appendChild(card);
    });
}

function loadDeck(deckName) {
    const savedDeck = localStorage.getItem(`deck_${deckName}`);
    if (savedDeck) {
        deck = JSON.parse(savedDeck);
        showDeckView(deckName);
    }
}

function showDeckView(deckName) {
    currentDeckName = deckName;
    document.getElementById('deckList').classList.add('hidden');
    document.getElementById('flashcardContainer').classList.remove('hidden');
    document.getElementById('currentDeckName').textContent = currentDeckName;

    showCurrentCard();
}

function backToDeckList() {
    document.getElementById('flashcardContainer').classList.add('hidden');
    document.getElementById('deckList').classList.remove('hidden');
    updateDeckList();
}

window.onload = function () {
    updateDeckList();

    const pathParts = window.location.pathname.split('/');
    if (pathParts.length >= 3 && pathParts[1] === 'decks') {
        const deckName = decodeURIComponent(pathParts[2]);
        loadDeck(deckName);
    }
};