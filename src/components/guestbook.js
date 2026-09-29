// "Leave a Message" Live Guestbook Component — Laxman & Abi
// Real-time Cloud Storage with Firebase Firestore + Local Fallback + Guest Name Integration & Admin Moderation

import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore';
import { firebaseConfig, isFirebaseConfigured } from '../config/firebase.js';

export function initGuestbook() {
  const form = document.getElementById('guestbook-form');
  const textarea = document.getElementById('guestbook-input');
  const listEl = document.getElementById('messages-list');
  const headingEl = document.querySelector('#guestbook h2');

  if (!form || !textarea || !listEl) return;

  const STORAGE_KEY = 'laxman_abi_guestbook_messages';
  const ADMIN_PIN = '2026';
  let isAdmin = localStorage.getItem('laxman_abi_guestbook_admin') === 'true';

  // Inject "Posting as: [Name]" badge above textarea if not present
  let userBadgeEl = document.getElementById('guestbook-user-badge');
  if (!userBadgeEl) {
    userBadgeEl = document.createElement('div');
    userBadgeEl.id = 'guestbook-user-badge';
    userBadgeEl.style.display = 'flex';
    userBadgeEl.style.alignItems = 'center';
    userBadgeEl.style.justifyContent = 'space-between';
    userBadgeEl.style.padding = '8px 14px';
    userBadgeEl.style.background = 'rgba(0, 0, 0, 0.3)';
    userBadgeEl.style.border = '1px solid rgba(212, 175, 55, 0.25)';
    userBadgeEl.style.borderRadius = '12px';
    userBadgeEl.style.marginBottom = '8px';
    userBadgeEl.style.fontSize = '0.88rem';
    form.parentNode.insertBefore(userBadgeEl, form);
  }

  function updateUserBadge() {
    const currentName = localStorage.getItem('laxman_abi_guest_name') || 'Guest';
    userBadgeEl.innerHTML = `
      <span>Posting as: <strong style="color: var(--gold-light);">${escapeHtml(currentName)}</strong></span>
      <button type="button" id="btn-edit-guest-name" style="background: transparent; border: none; color: var(--gold-primary); cursor: pointer; font-size: 0.8rem; text-decoration: underline; padding: 2px 6px;">
        ✏️ Change name
      </button>
    `;
    const editBtn = document.getElementById('btn-edit-guest-name');
    if (editBtn) {
      editBtn.addEventListener('click', () => {
        if (typeof window.openNameModal === 'function') {
          window.openNameModal();
        }
      });
    }
  }

  updateUserBadge();

  // Listen for guest name updates
  window.addEventListener('guestNameChanged', () => {
    updateUserBadge();
  });

  // Default Warm Initial Messages
  const defaultMessages = [
    { id: 'def-1', author: 'Rahul & Priya', text: 'Wishing Laxman & Abi a lifetime of happiness, love, and laughter! 💖' },
    { id: 'def-2', author: 'Karthik S.', text: 'Super excited for the engagement at Eden Garden! Congratulations team! 🎉' }
  ];

  let currentMessages = [];
  let db = null;
  let unsubscribeFirestore = null;

  // Secret Admin Trigger: Clicking "Leave a Message" 3 times asks for PIN to unlock delete mode
  let clickCount = 0;
  if (headingEl) {
    headingEl.style.cursor = 'pointer';
    headingEl.setAttribute('title', 'Tap 3 times for Admin Moderation');
    headingEl.addEventListener('click', () => {
      clickCount++;
      if (clickCount >= 3) {
        clickCount = 0;
        if (isAdmin) {
          isAdmin = false;
          localStorage.removeItem('laxman_abi_guest_admin');
          alert('Admin mode disabled.');
        } else {
          const pin = prompt('Enter Admin PIN to manage/delete comments (Default: 2026):');
          if (pin === ADMIN_PIN) {
            isAdmin = true;
            localStorage.setItem('laxman_abi_guest_admin', 'true');
            alert('Admin Mode Activated! You can now delete any message with the trash 🗑️ button.');
          } else if (pin !== null) {
            alert('Incorrect PIN.');
          }
        }
        renderMessages();
      }
    });
  }

  // Check if Firebase is configured
  if (isFirebaseConfigured()) {
    try {
      const app = initializeApp(firebaseConfig);
      db = getFirestore(app);

      const wishesRef = collection(db, 'wishes');
      const q = query(wishesRef, orderBy('createdAt', 'desc'));

      unsubscribeFirestore = onSnapshot(q, (snapshot) => {
        currentMessages = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data()
        }));
        if (currentMessages.length === 0) {
          currentMessages = defaultMessages;
        }
        renderMessages();
      }, (error) => {
        console.warn('Firestore subscription fallback:', error);
        loadLocalMessages();
      });
    } catch (err) {
      console.warn('Firebase init error, using local storage fallback:', err);
      loadLocalMessages();
    }
  } else {
    loadLocalMessages();
  }

  function loadLocalMessages() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      currentMessages = stored ? JSON.parse(stored) : defaultMessages;
    } catch (e) {
      currentMessages = defaultMessages;
    }
    renderMessages();
  }

  function saveLocalMessages(msgs) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs));
    } catch (e) {}
  }

  function renderMessages() {
    listEl.innerHTML = '';

    if (currentMessages.length === 0) {
      const emptyCard = document.createElement('div');
      emptyCard.className = 'message-card';
      emptyCard.style.textAlign = 'center';
      emptyCard.style.opacity = '0.7';
      emptyCard.innerHTML = '<p class="msg-text">Be the first to leave a message for the couple! 💌</p>';
      listEl.appendChild(emptyCard);
      return;
    }

    currentMessages.forEach((m) => {
      const card = document.createElement('div');
      card.className = 'message-card';
      card.style.position = 'relative';

      const authorHtml = `<div class="msg-author">${escapeHtml(m.author || 'Well-wisher')}</div>`;
      const textHtml = `<div class="msg-text">${escapeHtml(m.text || '')}</div>`;

      let deleteBtnHtml = '';
      if (isAdmin) {
        deleteBtnHtml = `
          <button
            class="delete-msg-btn"
            data-id="${escapeHtml(m.id || '')}"
            style="position: absolute; top: 12px; right: 12px; background: rgba(220, 20, 60, 0.25); border: 1px solid crimson; color: #ff6b6b; border-radius: 8px; padding: 4px 8px; font-size: 0.75rem; cursor: pointer; transition: all 0.2s ease;"
            title="Delete this comment"
          >
            🗑️ Delete
          </button>
        `;
      }

      card.innerHTML = `${authorHtml}${textHtml}${deleteBtnHtml}`;
      listEl.appendChild(card);
    });

    if (isAdmin) {
      const deleteBtns = listEl.querySelectorAll('.delete-msg-btn');
      deleteBtns.forEach((btn) => {
        btn.addEventListener('click', async (e) => {
          const docId = e.currentTarget.getAttribute('data-id');
          if (confirm('Are you sure you want to permanently delete this wish?')) {
            await deleteMessage(docId);
          }
        });
      });
    }
  }

  async function deleteMessage(id) {
    if (db && isFirebaseConfigured() && id && !id.startsWith('def-')) {
      try {
        await deleteDoc(doc(db, 'wishes', id));
      } catch (err) {
        console.error('Failed to delete from Firestore:', err);
        alert('Could not delete from cloud. Check Firebase permissions.');
      }
    } else {
      currentMessages = currentMessages.filter((m) => m.id !== id);
      saveLocalMessages(currentMessages);
      renderMessages();
    }
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = textarea.value.trim();
    if (!text) return;

    let savedName = localStorage.getItem('laxman_abi_guest_name') || '';
    if (!savedName) {
      savedName = prompt('Please enter your name for the wish:') || 'Guest';
      localStorage.setItem('laxman_abi_guest_name', savedName);
      updateUserBadge();
    }

    if (db && isFirebaseConfigured()) {
      try {
        await addDoc(collection(db, 'wishes'), {
          author: savedName,
          text: text,
          createdAt: serverTimestamp()
        });
        textarea.value = '';
      } catch (err) {
        console.warn('Firestore write failed, saving locally:', err);
        addLocalMessage(savedName, text);
      }
    } else {
      addLocalMessage(savedName, text);
    }
  });

  function addLocalMessage(author, text) {
    const newMsg = {
      id: 'local-' + Date.now(),
      author: author,
      text: text,
      createdAt: new Date().toISOString()
    };
    currentMessages = [newMsg, ...currentMessages.filter((m) => !m.id?.startsWith('def-'))];
    saveLocalMessages(currentMessages);
    textarea.value = '';
    renderMessages();
  }
}
