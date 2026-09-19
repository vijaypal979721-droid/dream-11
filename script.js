// Wallet State
let balance = 500;
let selectedPlayers = 0;
let creditsLeft = 100.0;

// Switch Sports Tabs
function switchSport(element, sportName) {
  document.querySelectorAll('.sports-nav .nav-tab').forEach(tab => tab.classList.remove('active'));
  element.classList.add('active');
}

// Filter Matches (Upcoming, Live, Completed)
function filterMatches(element, status) {
  document.querySelectorAll('.matches-filter .filter-item').forEach(item => item.classList.remove('active'));
  element.classList.add('active');

  const cards = document.querySelectorAll('.match-card');
  cards.forEach(card => {
    if (card.getAttribute('data-status') === status) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

// Open Interactive Team Builder Modal
function openTeamBuilder(matchTitle) {
  document.getElementById('modal-match-title').innerText = 'Create Team: ' + matchTitle;
  document.getElementById('team-modal').style.display = 'flex';
}

function closeTeamBuilder() {
  document.getElementById('team-modal').style.display = 'none';
}

// Player Selection Toggle Logic
function togglePlayer(element, creditVal) {
  if (element.classList.contains('selected')) {
    element.classList.remove('selected');
    selectedPlayers--;
    creditsLeft += creditVal;
  } else {
    if (selectedPlayers >= 11) {
      alert("Aap max 11 players chun sakte hain!");
      return;
    }
    element.classList.add('selected');
    selectedPlayers++;
    creditsLeft -= creditVal;
  }
  document.getElementById('player-count').innerText = selectedPlayers;
  document.getElementById('credit-count').innerText = creditsLeft.toFixed(1);
}

// Confirm Contest Entry
function confirmTeam() {
  if (selectedPlayers < 4) {
    alert("Kripya kam se kam players select karein!");
    return;
  }
  alert("🎉 Success! Aapka Team create ho gaya aur Contest join ho gaya hai.");
  closeTeamBuilder();
}

// Add Cash Modal Trigger
function openWalletModal() {
  let amount = prompt("Kitna Cash Add karna chahte hain? (₹)", "100");
  if (amount && !isNaN(amount)) {
    balance += parseInt(amount);
    document.getElementById('wallet-balance').innerText = '₹' + balance;
    alert("₹" + amount + " Wallet me successfully add ho gaye hain!");
  }
}

// Add User Review Function
function addReview() {
  const input = document.getElementById('review-input');
  if (input.value.trim() === "") return;

  const reviewList = document.getElementById('reviews-list');
  const newCard = document.createElement('div');
  newCard.className = 'review-card';
  newCard.innerHTML = `
    <div class="reviewer">
      <div class="avatar">U</div>
      <div>
        <h4>You</h4>
        <div class="stars">★★★★★</div>
      </div>
    </div>
    <p>"${input.value}"</p>
  `;
  reviewList.prepend(newCard);
  input.value = "";
}

// Mobile Navigation Action
function navigateTab(element) {
  document.querySelectorAll('.app-bottom-nav .nav-item').forEach(item => item.classList.remove('active'));
  element.classList.add('active');
}
