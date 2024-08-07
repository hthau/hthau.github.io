// Firebase configuration and initialization
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Fetch data from Firestore
async function fetchData() {
    const querySnapshot = await getDocs(collection(db, 'guests'));
    const guests = [];
    querySnapshot.forEach((doc) => {
        guests.push({ ...doc.data(), id: doc.id });
    });
    return guests;
}

// Save data to Firestore
async function saveData(name, email) {
    await addDoc(collection(db, 'guests'), { name, email });
}

// Delete data from Firestore
async function deleteData(id) {
    await deleteDoc(doc(db, 'guests', id));
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
