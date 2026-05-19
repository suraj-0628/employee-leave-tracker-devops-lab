const leaveForm = document.getElementById('leaveForm');
const requestsBody = document.getElementById('requestsBody');
const messageBox = document.getElementById('message');

const STORAGE_KEY = 'leaveRequests';

function loadRequests() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    return [];
  }

  try {
    return JSON.parse(saved);
  } catch (error) {
    console.error('Unable to parse saved leave requests', error);
    return [];
  }
}

function saveRequests(requests) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
}

function showMessage(text, type = 'success') {
  messageBox.textContent = text;
  messageBox.className = `message ${type}`;
  messageBox.style.display = 'block';
  setTimeout(() => {
    messageBox.style.display = 'none';
  }, 3500);
}

function createRequestRow(request) {
  const row = document.createElement('tr');

  row.innerHTML = `
    <td>${request.employeeId}</td>
    <td>${request.employeeName}</td>
    <td>${request.leaveType}</td>
    <td>${request.fromDate}</td>
    <td>${request.toDate}</td>
    <td>
      <button class="action-btn" type="button" data-id="${request.id}">Cancel</button>
    </td>
  `;

  const deleteButton = row.querySelector('button');
  deleteButton.addEventListener('click', () => {
    deleteRequest(request.id);
  });

  return row;
}

function renderRequests() {
  const requests = loadRequests();

  requestsBody.innerHTML = '';

  if (requests.length === 0) {
    const emptyRow = document.createElement('tr');
    emptyRow.innerHTML = '<td colspan="6" style="text-align:center; padding: 14px 0;">No leave requests submitted yet.</td>';
    requestsBody.appendChild(emptyRow);
    return;
  }

  requests.forEach((request) => {
    requestsBody.appendChild(createRequestRow(request));
  });
}

function deleteRequest(id) {
  const requests = loadRequests();
  const updated = requests.filter((request) => request.id !== id);
  saveRequests(updated);
  renderRequests();
  showMessage('Leave request canceled successfully.', 'success');
}

leaveForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const employeeId = document.getElementById('employeeId').value.trim();
  const employeeName = document.getElementById('employeeName').value.trim();
  const leaveType = document.getElementById('leaveType').value;
  const fromDate = document.getElementById('fromDate').value;
  const toDate = document.getElementById('toDate').value;

  if (!employeeId || !employeeName || !leaveType || !fromDate || !toDate) {
    showMessage('Please fill all fields before submitting.', 'error');
    return;
  }

  if (new Date(toDate) < new Date(fromDate)) {
    showMessage('The To Date cannot be earlier than the From Date.', 'error');
    return;
  }

  const requests = loadRequests();

  const newRequest = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    employeeId,
    employeeName,
    leaveType,
    fromDate,
    toDate,
  };

  requests.push(newRequest);
  saveRequests(requests);
  renderRequests();
  leaveForm.reset();
  showMessage('Leave request submitted successfully.', 'success');
});

renderRequests();
