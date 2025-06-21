import { auth } from './firebase-init.js';
import {
    onAuthStateChanged, signOut
} from 'https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js';

const $app = document.getElementById('app');
let firstRun = true;

onAuthStateChanged(auth, user => {
    if (user) {
        $app.innerHTML = `
          <div class="text-center text-light">
            <h2>Hi, ${user.displayName || '使用者'} !</h2>
            <img src="${user.photoURL || ''}" width="96" class="rounded-circle mb-3">
            <p>${user.email || ''}</p>
            <button class="btn btn-outline-light" id="logout">登出</button>
          </div>`;
        document.getElementById('logout').onclick = () => {
            signOut(auth).then(() => location.replace('login.html'));
        };
    } else if (!firstRun) {
        location.replace('login.html');
    }
    firstRun = false;
});