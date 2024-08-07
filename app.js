// Fetch data from the JSON file
async function fetchData() {
    const response = await fetch('data.json');
    const data = await response.json();
    return data.guests;
}

// Save data to the JSON file
async function saveData(guests) {
    await fetch('data.json', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ guests })
    });
}

// Render the guest list
function renderList(guests) {
    const guestList = document.getElementById('guest-list');
    guestList.innerHTML = '';

    guests.forEach((guest, index) => {
        const li = document.createElement('li');
        li.textContent = `${guest.name} (${guest.email})`;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete';
        deleteButton.addEventListener('click', () => {
            guests.splice(index, 1);
            saveData(guests).then(() => renderList(guests));
        });

        li.appendChild(deleteButton);
        guestList.appendChild(li);
    });
}

// Handle form submission
document.getElementById('guest-form').addEventListener('submit', (event) => {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    fetchData().then((guests) => {
        guests.push({ name, email });
        saveData(guests).then(() => {
            renderList(guests);
            document.getElementById('name').value = '';
            document.getElementById('email').value = '';
        });
    });
});

// Initialize the app
fetchData().then(renderList);
