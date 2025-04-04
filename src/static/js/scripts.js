let deck = [];
let currentDeckName = '';

const uploadForm = document.getElementById('uploadForm');
const deckList = document.getElementById('deckList');
const flashcardContainer = document.getElementById('flashcardContainer');
const decksContainer = document.getElementById('decksContainer');
const flashcardsList = document.getElementById('flashcardsList');
const currentDeckNameElement = document.getElementById('currentDeckName');
const backButton = document.getElementById('backButton');
const loadingOverlay = document.getElementById('loadingOverlay');

uploadForm.addEventListener('submit', handleUpload);
backButton.addEventListener('click', backToDeckList);

window.onload = function() {
    updateDeckList();
};

function handleUpload(e) {
    e.preventDefault();
    
    const deckName = document.getElementById('deckName').value;
    const numFlashcards = document.getElementById('numFlashcards').value;
    const pdfFile = document.getElementById('pdfFile').files[0];

    if (!deckName || !numFlashcards || !pdfFile) {
        alert('Please fill all fields and select a PDF file');
        return;
    }

    loadingOverlay.classList.remove('hidden');
    
    currentDeckName = deckName;

    const deckInfo = {
        name: deckName,
        numFlashcards: parseInt(numFlashcards),
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

    setTimeout(() => {
        const mockDeck = Array.from({ length: parseInt(numFlashcards) }, (_, i) => ({
            front: `Question ${i + 1} from ${deckName}`,
            back: `Answer ${i + 1} for ${deckName}`
        }));
        
        deck = mockDeck;
        localStorage.setItem(`deck_${deckName}`, JSON.stringify(mockDeck));
        
        loadingOverlay.classList.add('hidden');
        
        showDeckView(deckName);
    }, 1500);
}

function updateDeckList() {
    decksContainer.innerHTML = '';

    const decks = JSON.parse(localStorage.getItem('decks') || '[]');

    if (decks.length === 0) {
        decksContainer.innerHTML = '<p class="text-amber-700 col-span-full text-center py-8 bg-amber-100 rounded-lg border border-amber-200">No decks created yet. Upload a PDF to get started!</p>';
        return;
    }

    decks.forEach(deck => {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition transform hover:-translate-y-1 cursor-pointer border-2 border-amber-200';
        card.innerHTML = `
            <div class="bg-amber-100 h-2"></div>
            <div class="p-6">
                <h3 class="text-xl font-semibold text-amber-800 mb-2">${deck.name}</h3>
                <p class="text-amber-700">
                    <span class="font-medium">${deck.numFlashcards}</span> cards
                </p>
                <p class="text-sm text-amber-600 mt-2">
                    Created: ${new Date(deck.createdAt).toLocaleDateString()}
                </p>
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
    deckList.classList.add('hidden');
    document.getElementById('uploadSection').classList.add('hidden');
    flashcardContainer.classList.remove('hidden');
    currentDeckNameElement.textContent = currentDeckName;

    showFlashcards();
}

function showFlashcards() {
    flashcardsList.innerHTML = '';

    if (deck.length === 0) {
        flashcardsList.innerHTML = '<p class="text-amber-700 col-span-full text-center py-8 bg-amber-100 rounded-lg border border-amber-200">No flashcards in this deck</p>';
        return;
    }

    deck.forEach((card, index) => {
        const flashcard = document.createElement('div');
        flashcard.className = 'perspective w-full h-48 cursor-pointer group';
        flashcard.innerHTML = `
            <div id="card-${index}" class="relative w-full h-full transition-transform duration-500 transform-preserve-3d">
                <div class="absolute w-full h-full backface-hidden flex items-center justify-center p-6 bg-white rounded-xl shadow-md border-2 border-amber-200 group-hover:shadow-lg transition">
                    <p class="text-lg font-medium text-amber-900 text-center">${card.front}</p>
                    <div class="absolute bottom-2 right-2 bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded">Front</div>
                </div>
                <div class="absolute w-full h-full backface-hidden flex items-center justify-center p-6 bg-amber-50 rounded-xl shadow-md border-2 border-amber-200 rotate-y-180">
                    <p class="text-lg font-medium text-amber-900 text-center">${card.back}</p>
                    <div class="absolute bottom-2 right-2 bg-amber-200 text-amber-800 text-xs px-2 py-1 rounded">Back</div>
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

function backToDeckList() {
    flashcardContainer.classList.add('hidden');
    deckList.classList.remove('hidden');
    document.getElementById('uploadSection').classList.remove('hidden');
    updateDeckList();
}