let deck = [];
let currentCardIndex = 0;

function uploadPDF() {
    const pdfFile = document.getElementById('pdfFile').files[0];
    const formData = new FormData();
    formData.append('file', pdfFile);

    fetch('/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        deck = data;
        currentCardIndex = 0;
        showCard(currentCardIndex);
        document.getElementById('flashcardContainer').style.display = 'block';
    })
    .catch(error => console.error('Error:', error));
}

function showBack() {
    document.getElementById('front').style.display = 'none';
    document.getElementById('back').style.display = 'block';
}

function nextCard(correct) {
    currentCardIndex++;
    if (currentCardIndex < deck.length) {
        showCard(currentCardIndex);
    } else {
        console.log('No more cards');
    }
}

function showCard(index) {
    document.getElementById('front').innerText = deck[index].front;
    document.getElementById('back').innerText = deck[index].back;
    document.getElementById('front').style.display = 'block';
    document.getElementById('back').style.display = 'none';
}