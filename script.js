let balance = 500;
let userTeams = [];
let tempSelectedPlayers = [];
let captainId = null;
let viceCaptainId = null;
let currentMatchTitle = '';

const playerDatabase = [
  { id: 1, name: "V Kohli", role: "BAT", pts: 45, credit: 9.5 },
  { id: 2, name: "R Sharma", role: "BAT", pts: 52, credit: 9.0 },
  { id: 3, name: "B Azam", role: "BAT", pts: 38, credit: 9.0 },
  { id: 4, name: "J Bumrah", role: "BOWL", pts: 60, credit: 9.5 },
  { id: 5, name: "S Afridi", role: "BOWL", pts: 42, credit: 8.5 },
  { id: 6, name: "H Pandya", role: "AR", pts: 55, credit: 8.5 },
  { id: 7, name: "M Rizwan", role: "WK", pts: 30, credit: 8.0 },
  { id: 8, name: "KL Rahul", role: "WK", pts: 35, credit: 8.5 },
  { id: 9, name: "RA Jadeja", role: "AR", pts: 48, credit: 8.5 },
  { id: 10, name: "M Siraj", role: "BOWL", pts: 28, credit: 8.0 },
  { id: 11, name: "N Shah", role: "BOWL", pts: 22, credit: 7.5 }
];

// View Tabs Switcher
function switchMainView(element, viewId) {
  document.querySelectorAll('.view-content').forEach(v => v.style.display = 'none');
  document.getElementById(viewId).style.display = 'block';

  if (element) {
    document.querySelectorAll('.v-tab, .nav-item').forEach(t => t.classList.remove('active'));
    element.classList.add('active');
  }
}

// Open Team Builder
function openTeamBuilder(matchTitle) {
  currentMatchTitle = matchTitle;
  tempSelectedPlayers = [];
  captainId = null;
  viceCaptainId = null;
  document.getElementById('step-players').style.display = 'block';
  document.getElementById('step-roles').style.display = 'none';
  document.getElementById('modal-match-title').innerText = 'Select Players: ' + matchTitle;
  
  renderPlayerList();
  document.getElementById('team-modal').style.display = 'flex';
}

function renderPlayerList() {
  const box = document.getElementById('player-list-box');
  box.innerHTML = '';
  playerDatabase.forEach(p => {
    const isSel = tempSelectedPlayers.includes(p.id);
    const row = document.createElement('div');
    row.className = `player-row ${isSel ? 'selected' : ''}`;
    row.onclick = () => togglePlayer(p.id, p.credit);
    row.innerHTML = `
      <div class="p-info"><strong>${p.name}</strong> (${p.role})</div>
      <div class="p-credit">${p.credit} CR <i class="fa-solid ${isSel ? 'fa-check-circle' : 'fa-plus-circle'}"></i></div>
    `;
    box.appendChild(row);
  });
  updateTracker();
}

function togglePlayer(id, credit) {
  const idx = tempSelectedPlayers.indexOf(id);
  if (idx > -1) {
    tempSelectedPlayers.splice(idx, 1);
  } else {
    if (tempSelectedPlayers.length >= 11) {
      alert("Aap max 11 players hi select kar sakte hain!");
      return;
    }
    tempSelectedPlayers.push(id);
  }
  renderPlayerList();
}

function updateTracker() {
  document.getElementById('player-count').innerText = tempSelectedPlayers.length;
  let creditUsed = tempSelectedPlayers.reduce((acc, id) => acc + playerDatabase.find(p => p.id === id).credit, 0);
  document.getElementById('credit-count').innerText = (100 - creditUsed).toFixed(1);
}

// Step 2: Choose Captain & Vice Captain
function goToRolesStep() {
  if (tempSelectedPlayers.length < 4) {
    alert("Kam se kam 4 players select karein!");
    return;
  }
  document.getElementById('step-players').style.display = 'none';
  document.getElementById('step-roles').style.display = 'block';
  
  const box = document.getElementById('roles-list-box');
  box.innerHTML = '';
  tempSelectedPlayers.forEach(id => {
    const p = playerDatabase.find(item => item.id === id);
    const row = document.createElement('div');
    row.className = 'player-row';
    row.innerHTML = `
      <span><strong>${p.name}</strong> (${p.role})</span>
      <div>
        <button class="role-btn ${captainId === p.id ? 'active-c' : ''}" onclick="setRole(${p.id}, 'C')">C</button>
        <button class="role-btn ${viceCaptainId === p.id ? 'active-vc' : ''}" onclick="setRole(${p.id}, 'VC')">VC</button>
      </div>
    `;
    box.appendChild(row);
  });
}

function setRole(id, type) {
  if (type === 'C') captainId = id;
  if (type === 'VC') viceCaptainId = id;
  goToRolesStep();
}

// Confirm & Save Team
function confirmTeam() {
  if (!captainId || !viceCaptainId) {
    alert("Captain (C) aur Vice-Captain (VC) dono select karein!");
    return;
  }

  // Calculate Fantasy Points
  let totalPts = 0;
  tempSelectedPlayers.forEach(id => {
    let p = playerDatabase.find(item => item.id === id);
    let pts = p.pts;
    if (id === captainId) pts *= 2;
    if (id === viceCaptainId) pts *= 1.5;
    totalPts += pts;
  });

  const newTeam = {
    id: userTeams.length + 1,
    match: currentMatchTitle,
    playersCount: tempSelectedPlayers.length,
    points: totalPts
  };

  userTeams.push(newTeam);
  document.getElementById('team-count-badge').innerText = userTeams.length;
  document.getElementById('user-points-display').innerText = totalPts + ' Pts';

  renderUserTeams();
  alert("🎉 Success! Team Save ho gayi. Calculated Fantasy Points: " + totalPts);
  closeTeamBuilder();
}

function renderUserTeams() {
  const container = document.getElementById('my-teams-container');
  container.innerHTML = '';
  userTeams.forEach(t => {
    const div = document.createElement('div');
    div.className = 'created-team-card';
    div.innerHTML = `
      <h4>Team #${t.id} - ${t.match}</h4>
      <p>Players: ${t.playersCount} | <strong>Total Fantasy Pts: ${t.points}</strong></p>
    `;
    container.appendChild(div);
  });
}

function closeTeamBuilder() {
  document.getElementById('team-modal').style.display = 'none';
}

function filterMatches(element, status) {
  document.querySelectorAll('.matches-filter .filter-item').forEach(i => i.classList.remove('active'));
  element.classList.add('active');
  document.querySelectorAll('.match-card').forEach(card => {
    card.style.display = card.getAttribute('data-status') === status ? 'block' : 'none';
  });
}

function addReview() {
  const input = document.getElementById('review-input');
  if (!input.value.trim()) return;
  const list = document.getElementById('reviews-list');
  const card = document.createElement('div');
  card.className = 'review-card';
  card.innerHTML = `<div class="reviewer"><div class="avatar">U</div><div><h4>You</h4><div class="stars">★★★★★</div></div></div><p>"${input.value}"</p>`;
  list.prepend(card);
  input.value = '';
}
