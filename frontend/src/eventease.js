let initialized = false;

function searchEvents() {
  const query = document
    .getElementById('searchInput')
    .value
    .trim()
    .toLowerCase();

  const cards = document.querySelectorAll('.event-card');

  let visibleCount = 0;

  cards.forEach(card => {
    const content = card.innerText.toLowerCase();
    const matches = !query || content.includes(query);
    card.style.display = matches ? 'block' : 'none';
    if (matches) {
      visibleCount++;
    }
  });

  updateResultCount(visibleCount);

  document.getElementById('emptyState').style.display =
    visibleCount === 0 ? 'block' : 'none';
}

function filterEvents(category, button) {
  document.querySelectorAll('.filter').forEach(btn => {
    btn.classList.remove('active');
  });

  button.classList.add('active');

  document.getElementById('searchInput').value = '';

  const cards = document.querySelectorAll('.event-card');

  let visibleCount = 0;

  cards.forEach(card => {
    const matches =
      category === 'all' ||
      card.dataset.category === category;
    card.style.display = matches ? 'block' : 'none';
    if (matches) {
      visibleCount++;
    }
  });

  updateResultCount(visibleCount);

  document.getElementById('emptyState').style.display =
    visibleCount === 0 ? 'block' : 'none';
}

function updateResultCount(count) {
  document.getElementById('resultCount').textContent =
    `Showing ${count} event${count === 1 ? '' : 's'}`;
}

let currentEvent = null;

function showEventDetails(title, date, time, location, category, description, extra) {
  currentEvent = title;

  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalDate').textContent = `📅 ${date}`;
  document.getElementById('modalTime').textContent = `⏰ ${time}`;
  document.getElementById('modalLocation').textContent = `📍 ${location}`;
  document.getElementById('modalCategory').textContent = category;
  document.getElementById('modalDescription').textContent = description;
  document.getElementById('modalExtra').textContent = extra;

  document.getElementById('eventModal').classList.add('show');
}

function closeEventModal() {
  document.getElementById('eventModal').classList.remove('show');
}

function saveEvent(button) {
  const card = button.closest('.event-card');
  const eventName = card.querySelector('h3').textContent;

  let savedEvents =
    JSON.parse(
      localStorage.getItem('eventeaseSavedEvents')
    ) || [];

  if (savedEvents.includes(eventName)) {
    savedEvents = savedEvents.filter(name => name !== eventName);
    button.classList.remove('saved');
    button.textContent = '♡';
    showToast(`"${eventName}" removed from saved events.`);
  } else {
    savedEvents.push(eventName);
    button.classList.add('saved');
    button.textContent = '♥';
    showToast(`"${eventName}" saved.`);
  }

  localStorage.setItem(
    'eventeaseSavedEvents',
    JSON.stringify(savedEvents)
  );
}

function submitContact(event) {
  event.preventDefault();

  const name = document.getElementById('contactName').value.trim();
  const email = document.getElementById('contactEmail').value.trim();

  if (!name || !email) {
    showToast('Please fill in all required fields.');
    return;
  }

  event.target.reset();

  showToast(`Thanks ${name}! Your message has been received.`);
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

function loadSavedEvents() {
  const savedEvents =
    JSON.parse(
      localStorage.getItem('eventeaseSavedEvents')
    ) || [];

  document.querySelectorAll('.event-card').forEach(card => {
    const eventName = card.querySelector('h3').textContent;
    const button = card.querySelector('.save-btn');

    if (savedEvents.includes(eventName)) {
      button.classList.add('saved');
      button.textContent = '♥';
    }
  });
}

export default function initEventease() {
  if (initialized) return;
  initialized = true;

  window.searchEvents = searchEvents;
  window.filterEvents = filterEvents;
  window.showEventDetails = showEventDetails;
  window.closeEventModal = closeEventModal;
  window.saveEvent = saveEvent;
  window.submitContact = submitContact;
  window.showToast = showToast;

  document
    .getElementById('searchInput')
    .addEventListener('input', searchEvents);

  document
    .getElementById('eventModal')
    .addEventListener('click', function(event) {
      if (event.target === this) {
        closeEventModal();
      }
    });

  document
    .getElementById('registerButton')
    .addEventListener('click', function() {
      if (!currentEvent) return;
      showToast(`Registration confirmed for "${currentEvent}".`);
      closeEventModal();
    });

  updateResultCount(document.querySelectorAll('.event-card').length);

  loadSavedEvents();
}