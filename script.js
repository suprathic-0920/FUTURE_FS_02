/* --- script.js --- */

const API_BASE_URL = 'https://future-fs-02-gzhx.onrender.com';

const currentPage = window.location.pathname.split('/').pop();
const isAuthenticated = localStorage.getItem('crm_token');

if (currentPage === 'index.html' || currentPage === '') {
    if (!isAuthenticated) window.location.href = 'login.html';
}

if (currentPage === 'login.html') {
    if (isAuthenticated) window.location.href = 'index.html';

    document.addEventListener("DOMContentLoaded", () => {
        const loginForm = document.getElementById("loginForm");
        if (loginForm) {
            loginForm.addEventListener("submit", async (e) => {
                e.preventDefault(); 
                const email = document.getElementById("loginEmail").value;
                const password = document.getElementById("loginPassword").value;
                const btn = loginForm.querySelector(".login-btn");
                const ogText = btn.innerText;
                btn.innerText = "Verifying...";

                try {
                    // API URL UPDATED
                    const response = await fetch(`${API_BASE_URL}/api/login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, password })
                    });
                    
                    const result = await response.json();
                    
                    if (response.ok && result.success) {
                        localStorage.setItem('crm_token', result.token);
                        window.location.href = 'index.html'; 
                    } else {
                        alert(result.message);
                    }
                } catch (error) {
                    alert("Server Error! Please try again.");
                } finally {
                    btn.innerText = ogText;
                }
            });
        }
    });
}

const body = document.querySelector('body.dash-body');
document.addEventListener('mousemove', (e) => {
    const xPercentage = (e.clientX / window.innerWidth) * 100;
    const yPercentage = (e.clientY / window.innerHeight) * 100;
    if (body) {
        body.style.setProperty('--cursor-x', `${xPercentage}%`);
        body.style.setProperty('--cursor-y', `${yPercentage}%`);
    }
});

const title = document.querySelector('.dash-title.animate-text-3d');
const splitText = () => {
    if(!title) return; 
    const textStr = title.innerText.trim();
    title.innerText = '';
    textStr.split('').forEach(char => {
        const span = document.createElement('span');
        if (char === ' ') span.innerHTML = '&nbsp;';
        else span.innerText = char;
        title.appendChild(span);
    });
};
splitText();

const modal = document.getElementById("leadModal");
const reviewModal = document.getElementById("reviewModal");
const openModalBtn = document.getElementById("openModalBtn"); 
const closeBtn = document.querySelector(".close-btn");
const closeReviewBtn = document.querySelector(".close-review-btn");
const form = document.getElementById("addLeadForm");
const reviewForm = document.getElementById("reviewLeadForm");
const tableBody = document.getElementById("leadsTableBody");
const transactionList = document.getElementById("transactionList");

window.currentReviewName = "";

function showToast(message) {
    const toast = document.getElementById("toastNotification");
    const toastMsg = document.getElementById("toastMessage");
    if(toast && toastMsg) {
        toastMsg.innerText = message;
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 3000);
    }
}

if(openModalBtn) openModalBtn.addEventListener("click", () => modal.classList.add("show"));
if(closeBtn) closeBtn.addEventListener("click", () => modal.classList.remove("show"));
if(closeReviewBtn) closeReviewBtn.addEventListener("click", () => reviewModal.classList.remove("show"));

window.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.remove("show");
    if (e.target === reviewModal) reviewModal.classList.remove("show");
});

const logoutIcon = document.querySelector('.logout-icon');
if (logoutIcon) {
    logoutIcon.addEventListener('click', () => {
        if (confirm("Are you sure you want to securely logout?")) {
            localStorage.removeItem('crm_token');
            window.location.href = 'login.html';
        }
    });
}

const dummyButtons = document.querySelectorAll('.dash-menu li, .action-icon');
dummyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        let btnName = btn.innerText.trim() || (btn.classList.contains('fa-search') ? "Search" : "Notifications");
        showToast(`${btnName} is coming soon! 🚀`);
    });
});

if (currentPage === 'index.html') {
    
    async function fetchTransactions() {
        try {
            // API URL UPDATED
            const response = await fetch(`${API_BASE_URL}/api/transactions`);
            const result = await response.json();
            transactionList.innerHTML = ''; 
            
            if(result.data.length === 0) {
                transactionList.innerHTML = `<li class="empty-txn-msg" style="background: transparent; box-shadow: none; justify-content: center; color: var(--text-muted);">No recent transactions yet.</li>`;
                return;
            }

            result.data.forEach((txn, index) => {
                const li = document.createElement('li');
                if(index === 0) li.style.animation = "modalFadeIn 0.3s ease";
                
                const initial = txn.name.charAt(0).toUpperCase();
                let colorClass = "av-blue", amt = "Pending", iconClass = "fa-sync fa-spin", statusColor = "var(--yellow-highlight)", signColor = "inherit";

                if(txn.action_type === "Converted") {
                    colorClass = "av-green"; amt = "+$1,500.00"; iconClass = "fa-arrow-circle-down"; statusColor = "var(--status-paid)"; signColor = "var(--status-paid)";
                } else if (txn.action_type === "Contacted") {
                    colorClass = "av-blue"; amt = "Follow-up"; iconClass = "fa-phone-alt"; statusColor = "#3498db";
                } else {
                    colorClass = "av-purple"; amt = "Added"; iconClass = "fa-user-plus"; statusColor = "#3498db";
                }

                li.innerHTML = `
                    <div class="avatar-circle ${colorClass}">${initial}</div>
                    <div class="txn-info">
                        <span class="txn-name">${txn.name}</span>
                        <span class="txn-date">${txn.action_type} - ${txn.date}</span>
                    </div>
                    <div class="txn-amount-status">
                        <span class="txn-amt" style="color: ${signColor}">${amt}</span>
                        <i class="fas ${iconClass} txn-status" style="color: ${statusColor}"></i>
                    </div>
                `;
                transactionList.appendChild(li);
            });
        } catch (error) { console.error("Error fetching txns:", error); }
    }

    async function fetchLeads() {
        try {
            // API URL UPDATED
            const response = await fetch(`${API_BASE_URL}/api/leads`);
            const result = await response.json();
            tableBody.innerHTML = ''; 
            
            // Dashboard metric cards-oda DOM elements-ah select panrom
            const paidElement = document.querySelector('.metric-card:nth-child(1) .metric-amount');
            const dueElement = document.querySelector('.metric-card:nth-child(2) .metric-amount');
            const balanceElement = document.querySelector('.metric-card:nth-child(3) .metric-amount');
            
            // Initial variables
            let totalPaid = 0;
            let totalDue = 0;
            const VALUE_PER_LEAD = 1500; // $1,500 per lead

            if(result.data.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center;">No records found. Click 'Add new lead' to insert data.</td></tr>`;
                
                // Records illati zero aakkidrom
                if (paidElement) paidElement.innerText = "$0.00";
                if (dueElement) dueElement.innerText = "$0.00";
                if (balanceElement) balanceElement.innerText = "$0.00";
                return;
            }

            result.data.forEach(lead => {
                const row = document.createElement("tr");
                row.classList.add("interactive-row");
                const statusClass = `status-${lead.status.toLowerCase()}`;
                const initials = lead.name.substring(0,2).toUpperCase();
                const safeNotes = lead.notes ? lead.notes.replace(/'/g, "\\'") : '';
                
                // Dashboard Calculation Logic
                if (lead.status === "Converted") {
                    totalPaid += VALUE_PER_LEAD; 
                } else {
                    totalDue += VALUE_PER_LEAD; // New or Contacted
                }

                row.innerHTML = `
                    <td>#LD-${lead.id}</td>
                    <td>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <div class="avatar-circle av-purple" style="width: 35px; height: 35px; font-size: 0.9rem;">${initials}</div>
                            <div style="line-height: 1.2;">
                                <strong>${lead.name}</strong><br>
                                <small style="color: var(--text-muted);">${lead.email}</small>
                            </div>
                        </div>
                    </td>
                    <td>${lead.date}</td>
                    <td>${lead.source}</td>
                    <td>$1,500.00</td>
                    <td><span class="badge ${statusClass}">${lead.status}</span></td>
                    <td class="table-actions">
                        <button class="table-review-btn" onclick="openReviewModal('${lead.id}', '${lead.name}', '${lead.status}', '${safeNotes}')">Review</button>
                        <i class="fas fa-trash row-action" onclick="deleteLead(${lead.id})"></i>
                    </td>
                `;
                tableBody.appendChild(row);
            });

            // Calculate Total Balance
            const totalBalance = totalPaid + totalDue;

            // DOM-la update panrom
            if (paidElement) paidElement.innerText = `$${totalPaid.toLocaleString('en-US')}.00`;
            if (dueElement) dueElement.innerText = `$${totalDue.toLocaleString('en-US')}.00`;
            if (balanceElement) balanceElement.innerText = `$${totalBalance.toLocaleString('en-US')}.00`;

        } catch (error) { console.error("Error fetching leads:", error); }
    }

    window.openReviewModal = function(id, name, currentStatus, currentNotes) {
        document.getElementById("reviewLeadId").value = id;
        document.getElementById("reviewStatus").value = currentStatus;
        document.getElementById("reviewNotes").value = currentNotes;
        window.currentReviewName = name; 
        reviewModal.classList.add("show");
    }

    if(form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const leadData = {
                name: document.getElementById("leadName").value,
                email: document.getElementById("leadEmail").value,
                source: document.getElementById("leadSource").value,
                status: "New"
            };
            // API URL UPDATED
            const response = await fetch(`${API_BASE_URL}/api/leads`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(leadData)
            });
            if (response.ok) {
                form.reset(); modal.classList.remove("show");
                fetchLeads(); fetchTransactions();
                showToast("Added new lead successfully! 🎉");
            }
        });
    }

    if(reviewForm) {
        reviewForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const id = document.getElementById("reviewLeadId").value;
            const updateData = { name: window.currentReviewName, status: document.getElementById("reviewStatus").value, notes: document.getElementById("reviewNotes").value };
            const submitBtn = reviewForm.querySelector('button[type="submit"]');
            const ogText = submitBtn.innerHTML; submitBtn.innerHTML = "Saving...";

            try {
                // API URL UPDATED
                const response = await fetch(`${API_BASE_URL}/api/leads/${id}`, {
                    method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updateData)
                });
                if(response.ok) {
                    reviewModal.classList.remove("show");
                    fetchLeads(); fetchTransactions(); 
                    showToast("Lead updated successfully! ✨"); 
                }
            } catch (error) { console.error("Failed to update:", error); }
            submitBtn.innerHTML = ogText;
        });
    }

    window.deleteLead = async function(id) {
        if(confirm("Are you sure you want to delete this lead?")) {
            // API URL UPDATED
            await fetch(`${API_BASE_URL}/api/leads/${id}`, { method: 'DELETE' });
            fetchLeads();
            showToast("Lead deleted! 🗑️");
        }
    }

    fetchLeads();
    fetchTransactions();
}