// Firebase configuration
const firebaseConfig = {
     apiKey: "AIzaSyBEJPGQmxeiURz8moG3MrmAX0wJKx7KmhA",
  authDomain: "weddingtest-11688.firebaseapp.com",
  projectId: "weddingtest-11688",
  storageBucket: "weddingtest-11688.appspot.com",
  messagingSenderId: "508642310727",
  appId: "1:508642310727:web:c15ecd7b8de51b11aa4f62",
  measurementId: "G-WCYGDQRRNH"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Fetch data from Firestore
async function fetchData() {
    const querySnapshot = await db.collection('guests').get();
    const guests = [];
    querySnapshot.forEach((doc) => {
        guests.push({ ...doc.data(), id: doc.id });
    });
    return guests;
}

// Save data to Firestore
async function saveData(name, email) {
    await db.collection('guests').add({ name, email });
}

// Delete data from Firestore
async function deleteData(id) {
    await db.collection('guests').doc(id).delete();
}

// Render the guest list
function renderList(guests) {
    const guestList = document.getElementById('guest-list');
    guestList.innerHTML = '';

    guests.forEach((guest) => {
        const li = document.createElement('li');
        li.textContent = `${guest.name} (${guest.email})`;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete';
        deleteButton.addEventListener('click', () => {
            deleteData(guest.id).then(() => {
                fetchData().then(renderList);
            });
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

    saveData(name, email).then(() => {
        fetchData().then((guests) => {
            renderList(guests);
            document.getElementById('name').value = '';
            document.getElementById('email').value = '';
        });
    });
});

// Initialize the app
fetchData().then(renderList);

