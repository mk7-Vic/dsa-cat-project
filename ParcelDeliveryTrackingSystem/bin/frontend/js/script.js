/*PAGE LOADED*/
document.addEventListener("DOMContentLoaded", function() {
    try { animateCards(); } catch(e){}
    try { animateCounters(); } catch(e){}
    try { searchParcel(); } catch(e){}
    try { showWelcomeToast(); } catch(e){}
    try { enableDarkMode(); } catch(e){}
    try { sidebarToggle(); } catch(e){}
    try { loadAllParcels(); } catch(e){}
    try { loadDashboardData(); } catch(e){}
    try { loadDispatchData(); } catch(e){}
    try { prefillNextParcelID(); } catch(e){}
});

/*ANIMATE DASHBOARD CARDS*/
function animateCards(){
    const cards=document.querySelectorAll(".stats-card");
    cards.forEach((card,index)=>{
        card.style.opacity="0";
        card.style.transform="translateY(40px)";
        setTimeout(()=>{
            card.style.transition="0.6s";
            card.style.opacity="1";
            card.style.transform="translateY(0px)";
        },index*200);
    });
}

/*COUNTER ANIMATION*/
function animateCounters(){
    const numbers=document.querySelectorAll(".stats-card h2");
    numbers.forEach(counter=>{
        let target=parseInt(counter.innerText);
        let current=0;
        let speed=Math.ceil(target/50);
        let updateCounter=function(){
            current+=speed;
            if(current>=target){
                counter.innerText=target;
            }else{
                counter.innerText=current;
                requestAnimationFrame(updateCounter);
            }
        };
        updateCounter();
    });
}

/*SEARCH BAR*/
function searchParcel(){
    const searchInput=document.getElementById("searchInput");
    if(!searchInput) return;
    searchInput.addEventListener("keyup",function(){
        const value=this.value.toLowerCase();
        const rows=document.querySelectorAll("tbody tr");
        rows.forEach(row=>{
            row.style.display=row.innerText.toLowerCase().includes(value)?"":"none";
        });
    });
}

/*WELCOME MESSAGE*/
function showWelcomeToast(){
    setTimeout(()=>{
        console.log("Welcome to Parcel Delivery Tracking System");
    },1000);
}

/*SIDEBAR ACTIVE LINK*/
const links=document.querySelectorAll(".nav-link");
links.forEach(link=>{
    link.addEventListener("click",function(){
        links.forEach(item=>item.classList.remove("active"));
        this.classList.add("active");
    });
});

/*CARD HOVER EFFECT*/
const stats=document.querySelectorAll(".stats-card");
stats.forEach(card=>{
    card.addEventListener("mouseenter",()=> card.style.transform="translateY(-8px) scale(1.03)");
    card.addEventListener("mouseleave",()=> card.style.transform="translateY(0px) scale(1)");
});

/*DARK MODE*/
function enableDarkMode(){
    const button=document.createElement("button");
    button.innerHTML="<i class='bi bi-moon-fill'></i>";
    button.className="btn btn-dark position-fixed";
    button.style.right="20px";
    button.style.bottom="20px";
    button.style.borderRadius="50%";
    button.style.width="55px";
    button.style.height="55px";
    button.style.zIndex="999";
    document.body.appendChild(button);
    let dark=false;
    button.addEventListener("click",()=>{
        dark=!dark;
        if(dark){
            document.body.classList.toggle("dark-mode");
            button.innerHTML = "<i class='bi bi-sun-fill text-warning'></i>";
            button.classList.replace("btn-dark", "btn-light");
        } else {
            document.body.classList.remove("dark-mode");
            button.innerHTML = "<i class='bi bi-moon-fill'></i>";
            button.classList.replace("btn-light", "btn-dark");
        }
    });
}

/*SIDEBAR TOGGLE*/
function sidebarToggle(){
    if(window.innerWidth>768) return;
    const sidebar=document.querySelector(".sidebar");
    if(sidebar) sidebar.style.display="block";
}

document.documentElement.style.scrollBehavior="smooth";

/* REUSABLE NOTIFICATION */
function showNotification(message, type = 'success') {
    const toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) return; 

    const toastEl = document.createElement('div');
    toastEl.className = `toast align-items-center text-bg-${type} border-0 mb-2 shadow`;
    toastEl.setAttribute('role', 'alert');
    toastEl.setAttribute('aria-live', 'assertive');
    toastEl.setAttribute('aria-atomic', 'true');

    let icon = 'bi-info-circle-fill';
    if (type === 'success') icon = 'bi-check-circle-fill';
    if (type === 'danger') icon = 'bi-exclamation-triangle-fill';
    if (type === 'warning') icon = 'bi-exclamation-circle-fill';

    toastEl.innerHTML = `
        <div class="d-flex">
            <div class="toast-body fs-6">
                <i class="bi ${icon} me-2"></i> ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;

    toastContainer.appendChild(toastEl);
    const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
    toast.show();
    toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
}

/*REGISTER PARCEL FORM*/
const parcelForm = document.getElementById("parcelForm");
if (parcelForm) {
    parcelForm.addEventListener("submit", async function(e) {
        e.preventDefault();
        
        const parcelData = {
            parcelID: document.getElementById("parcelID").value.trim().toUpperCase(),
            weight: document.getElementById("weight").value.trim(),
            sender: document.getElementById("senderName").value.trim(),
            receiver: document.getElementById("receiverName").value.trim(),
            destination: document.getElementById("destination").value.trim(),
            priority: document.getElementById("priority").value
        };

        if (Number(parcelData.weight) <= 0) {
            showNotification("Weight must be greater than 0.", "danger");
            return;
        }

        try {
            const checkResponse = await fetch('http://127.0.0.1:8080/api/parcels');
            if (checkResponse.ok) {
                const parcels = await checkResponse.json();
                let maxIdNum = 0;
                parcels.forEach(p => {
                    let num = parseInt(p.parcelID.replace(/\D/g, '')) || 0;
                    if (num > maxIdNum) maxIdNum = num;
                });
                const expectedIdNum = maxIdNum + 1;
                const expectedParcelID = "P" + String(expectedIdNum).padStart(3, '0');

                if (parcelData.parcelID !== expectedParcelID) {
                    showNotification(`Invalid ID! The next required Parcel ID is ${expectedParcelID}.`, "warning");
                    document.getElementById("parcelID").value = expectedParcelID;
                    return; 
                }
            }

            const response = await fetch('http://127.0.0.1:8080/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(parcelData)
            });

            if (response.ok) {
                showNotification(`Success! ${parcelData.parcelID} has been registered and added to the Queue.`, "success");
                parcelForm.reset();
                prefillNextParcelID(); 
                if (document.querySelector(".table tbody")) loadAllParcels(); 
            } else {
                showNotification("Failed to register. Parcel ID might already exist.", "danger");
            }
        } catch (error) {
            console.error("Connection failed:", error);
            showNotification("Could not connect to the backend server.", "danger");
        }
    });
}

/*TRACK PARCEL - HITS THE JAVA HASH MAP & UPDATES DOM*/
const trackingForm = document.getElementById("trackingForm");
if(trackingForm){
    trackingForm.addEventListener("submit", async function(e){
        e.preventDefault();
        const parcelID = document.getElementById("trackingInput").value.trim().toUpperCase();

        if(parcelID === ""){
            showNotification("Please enter a Parcel ID", "warning");
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8080/api/track?id=${parcelID}`);
            if (response.ok) {
                const parcel = await response.json();
                
                let priorityBadge = parcel.priority === "High" ? "bg-danger" : 
                                   (parcel.priority === "Medium" ? "bg-warning text-dark" : "bg-success");
                
                let statusBadge = parcel.status === "Delivered" ? "bg-success" :
                                 (parcel.status === "Dispatched" ? "bg-primary" : 
                                 (parcel.status === "In Transit" ? "bg-warning text-dark" : "bg-secondary"));

                let progressPercentage = "25%";
                let activeSteps = 1;

                if (parcel.status === "Registered") { progressPercentage = "25%"; activeSteps = 1; } 
                else if (parcel.status === "Dispatched") { progressPercentage = "50%"; activeSteps = 2; } 
                else if (parcel.status === "In Transit") { progressPercentage = "75%"; activeSteps = 3; } 
                else if (parcel.status === "Delivered") { progressPercentage = "100%"; activeSteps = 4; }

                const detailsBody = document.getElementById("trackDetailsBody");
                if(detailsBody) {
                    detailsBody.innerHTML = `
                        <p><strong>Parcel ID:</strong> ${parcel.parcelID}</p>
                        <p><strong>Sender:</strong> ${parcel.sender}</p>
                        <p><strong>Receiver:</strong> ${parcel.receiver}</p>
                        <p><strong>Destination:</strong> ${parcel.destination}</p>
                        <p><strong>Weight:</strong> ${parcel.weight} kg</p>
                        <p><strong>Priority:</strong> <span class="badge ${priorityBadge}">${parcel.priority}</span></p>
                        <p><strong>Status:</strong> <span class="badge ${statusBadge}">${parcel.status}</span></p>
                    `;
                }
                
                const progressBar = document.getElementById("trackProgressBar");
                if (progressBar) {
                    progressBar.style.width = progressPercentage;
                    progressBar.innerText = progressPercentage;
                    progressBar.className = progressPercentage === "100%" 
                        ? "progress-bar progress-bar-striped progress-bar-animated bg-success"
                        : "progress-bar progress-bar-striped progress-bar-animated bg-primary";
                }

                const timeline = document.getElementById("trackTimeline");
                if(timeline) {
                    let c1 = activeSteps >= 1 ? "text-success" : "text-secondary opacity-50";
                    let c2 = activeSteps >= 2 ? "text-primary" : "text-secondary opacity-50";
                    let c3 = activeSteps >= 3 ? "text-warning" : "text-secondary opacity-50";
                    let c4 = activeSteps >= 4 ? "text-success" : "text-secondary opacity-50";

                    timeline.innerHTML = `
                        <div class="timeline">
                            <div class="timeline-item mb-4">
                                <div class="d-flex"><div class="me-3"><i class="bi bi-check-circle-fill fs-3 ${c1}"></i></div>
                                <div><h5 class="${activeSteps < 1 ? 'text-muted' : ''}">Parcel Registered</h5></div></div>
                            </div>
                            <div class="timeline-item mb-4">
                                <div class="d-flex"><div class="me-3"><i class="bi bi-box-seam-fill fs-3 ${c2}"></i></div>
                                <div><h5 class="${activeSteps < 2 ? 'text-muted' : ''}">Dispatched</h5></div></div>
                            </div>
                            <div class="timeline-item mb-4">
                                <div class="d-flex"><div class="me-3"><i class="bi bi-truck fs-3 ${c3}"></i></div>
                                <div><h5 class="${activeSteps < 3 ? 'text-muted' : ''}">In Transit</h5></div></div>
                            </div>
                            <div class="timeline-item mb-4">
                                <div class="d-flex"><div class="me-3"><i class="bi bi-house-check-fill fs-3 ${c4}"></i></div>
                                <div><h5 class="${activeSteps < 4 ? 'text-muted' : ''}">Delivered Successfully</h5></div></div>
                            </div>
                        </div>
                    `;
                }

                const summaryContainer = document.getElementById("trackSummaryIcons");
                if (summaryContainer) {
                    const icons = summaryContainer.querySelectorAll("i");
                    icons.forEach(icon => icon.className = "bi bi-check-circle text-secondary fs-2");
                    for (let i = 0; i < activeSteps; i++) {
                        icons[i].className = "bi bi-check-circle-fill text-success fs-2"; 
                    }
                }
                showNotification(`Found Parcel ${parcelID}!`, "success");
            } else {
                showNotification(`Parcel ${parcelID} not found in the system.`, "warning");
            }
        } catch (error) {
            console.error("Connection failed:", error);
            showNotification("Could not connect to the backend server.", "danger");
        }
    });
}

// 1. DISPATCH NEXT PARCEL
const dispatchButton = document.getElementById("dispatchBtn");
if(dispatchButton){
    dispatchButton.addEventListener("click", async function(){
        try {
            const response = await fetch('http://127.0.0.1:8080/api/dispatch', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.ok) {
                const data = await response.json();
                showNotification("Backend Success! Dispatched Parcel: " + data.parcelId, 'success');
                if (window.location.pathname.includes("dispatch.html")) loadDispatchData();
            } else {
                showNotification("Failed to dispatch. Check your Java backend logic.", 'danger');
            }
        } catch (error) {
            console.error("Connection failed:", error);
            showNotification("Could not connect to the server. Is your VS Code Java server running?", 'danger');
        }
    });
}

// 2. TRIGGER QUICKSORT (Calls backend algorithm)
window.triggerQuicksort = async function(sortByColumn) {
    try {
        showNotification(`Sorting by ${sortByColumn}...`, 'info');

        // Removed custom headers to prevent CORS preflight network blocks!
        const response = await fetch(`http://127.0.0.1:8080/api/sort?column=${sortByColumn}`);

        if (response.ok) {
            const sortedParcels = await response.json();
            updateParcelTable(sortedParcels);
            showNotification("Quicksort executed successfully!", 'success');
        } else {
            showNotification("Backend sorting failed.", 'danger');
        }
    } catch (error) {
        console.error("Connection failed:", error);
        showNotification("Could not connect to the server. Check if backend is running.", 'danger');
    }
}

// Helper function to dynamically rebuild the table
function updateParcelTable(parcels) {
    const tbody = document.querySelector(".table tbody");
    if (!tbody) return;
    tbody.innerHTML = ""; 

    parcels.forEach(parcel => {
        // 1. Determine Priority Badge Color
        let priorityBadge = parcel.priority.toLowerCase() === 'high' ? 'bg-danger' :
                            parcel.priority.toLowerCase() === 'medium' ? 'bg-warning text-dark' : 'bg-success';
                            
        // 2. ---> RESTORED THIS MISSING LINE! Determine Status Badge Color <---
        let statusBadge = parcel.status.toLowerCase() === 'delivered' ? 'bg-success' :
                          (parcel.status.toLowerCase() === 'dispatched' ? 'bg-primary' : 
                          (parcel.status.toLowerCase() === 'in transit' ? 'bg-warning text-dark' : 'bg-secondary'));

        // 3. Setup button styles based on status
        let deliverDisabled = parcel.status.toLowerCase() === 'delivered' ? 'disabled' : '';
        let deliverBtnClass = parcel.status.toLowerCase() === 'delivered' ? 'btn-secondary' : 'btn-success';

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${parcel.parcelID}</td>
            <td>${parcel.sender}</td>
            <td>${parcel.receiver}</td>
            <td>${parcel.destination}</td>
            <td><span class="badge ${statusBadge}">${parcel.status}</span></td>
            <td><span class="badge ${priorityBadge}">${parcel.priority}</span></td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="viewParcelDetails('${parcel.parcelID}')" title="View"><i class="bi bi-eye"></i></button>
                <button class="btn btn-sm ${deliverBtnClass}" ${deliverDisabled} onclick="markDelivered('${parcel.parcelID}')" title="Mark Delivered"><i class="bi bi-check-circle"></i></button>
                
                <button class="btn btn-sm btn-warning" onclick="showNotification('Edit mode coming soon!', 'info')" title="Edit"><i class="bi bi-pencil-square"></i></button>
                <button class="btn btn-sm btn-danger" onclick="deleteDynamicRow(this, '${parcel.parcelID}')" title="Delete"><i class="bi bi-trash"></i></button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

/* VIEW PARCEL DETAILS DYNAMICALLY IN MODAL */
window.viewParcelDetails = async function(parcelID) {
    try {
        // Fetch the specific parcel from Java
        const response = await fetch(`http://127.0.0.1:8080/api/track?id=${parcelID}`);
        
        if (response.ok) {
            const parcel = await response.json();

            // Inject the basic text data into the modal spans
            document.getElementById('modalParcelID').innerText = parcel.parcelID;
            document.getElementById('modalSender').innerText = parcel.sender;
            document.getElementById('modalReceiver').innerText = parcel.receiver;
            document.getElementById('modalWeight').innerText = parcel.weight;
            document.getElementById('modalDestination').innerText = parcel.destination;

            // Generate the colored badges
            let priorityBadge = parcel.priority.toLowerCase() === 'high' ? 'bg-danger' : 
                               (parcel.priority.toLowerCase() === 'medium' ? 'bg-warning text-dark' : 'bg-success');
                               
            let statusBadge = parcel.status.toLowerCase() === 'delivered' ? 'bg-success' : 
                             (parcel.status.toLowerCase() === 'dispatched' ? 'bg-primary' : 
                             (parcel.status.toLowerCase() === 'in transit' ? 'bg-warning text-dark' : 'bg-secondary'));

            // Inject the HTML badges
            document.getElementById('modalPriority').innerHTML = `<span class="badge ${priorityBadge}">${parcel.priority}</span>`;
            document.getElementById('modalStatus').innerHTML = `<span class="badge ${statusBadge}">${parcel.status}</span>`;

            // Manually trigger the Bootstrap modal to open
            const modalElement = document.getElementById('viewParcelModal');
            const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
            modalInstance.show();
            
        } else {
            showNotification(`Failed to load details for ${parcelID}`, 'danger');
        }
    } catch (error) {
        console.error("Connection failed:", error);
        showNotification("Could not connect to the server.", "danger");
    }
};

/*DELETE PARCEL DYNAMICALLY (CRUD: DELETE)*/
window.deleteDynamicRow = async function(buttonElement, parcelID) {
    if(confirm(`Are you sure you want to completely delete Parcel ${parcelID} from the system?`)) {
        try {
            const response = await fetch(`http://127.0.0.1:8080/api/delete?id=${parcelID}`, { method: 'DELETE' });
            if(response.ok) {
                buttonElement.closest("tr").remove();
                showNotification(`Parcel ${parcelID} deleted successfully.`, "success");
            } else {
                showNotification(`Failed to delete Parcel ${parcelID}.`, "danger");
            }
        } catch (error) {
            console.error("Connection failed:", error);
            showNotification("Could not connect to backend.", "danger");
        }
    }
}

/*MARK PARCEL AS DELIVERED DYNAMICALLY*/
window.markDelivered = async function(parcelID) {
    if(confirm(`Are you sure you want to mark Parcel ${parcelID} as Delivered?`)) {
        try {
            const response = await fetch(`http://127.0.0.1:8080/api/deliver?id=${parcelID}`, { 
                method: 'PUT' 
            });
            
            if(response.ok) {
                showNotification(`Parcel ${parcelID} marked as Delivered successfully!`, "success");
                
                // Refresh the data natively to update UI instantly
                if (window.location.pathname.includes("parcels.html")) loadAllParcels();
                if (window.location.pathname.includes("index.html") || window.location.pathname === "/") loadDashboardData();
            } else {
                const errData = await response.json();
                showNotification(errData.message || `Failed to update Parcel ${parcelID}.`, "warning");
            }
        } catch (error) {
            console.error("Connection failed:", error);
            showNotification("Could not connect to backend server.", "danger");
        }
    }
}

/*LOAD ALL PARCELS DYNAMICALLY INTO TABLE (parcels.html)*/
async function loadAllParcels() {
    if (!window.location.pathname.includes("parcels.html")) return;
    const tableBody = document.querySelector(".card-body table tbody");
    if (!tableBody) return;

    try {
        const response = await fetch('http://127.0.0.1:8080/api/parcels');
        if (response.ok) {
            const parcels = await response.json();
            updateParcelTable(parcels); // Java automatically sends them sorted by ID now!
        }
    } catch (error) {
        console.error("Failed to load parcels from backend:", error);
    }
}

/*LOAD DISPATCH QUEUES DYNAMICALLY (dispatch.html)*/
async function loadDispatchData() {
    if (!window.location.pathname.includes("dispatch.html")) return;
    const tables = document.querySelectorAll(".table-responsive tbody");
    if (tables.length < 2) return;
    const queueTable = tables[0];
    const recentTable = tables[1];

    try {
        const response = await fetch('http://127.0.0.1:8080/api/parcels');
        if (response.ok) {
            let parcels = await response.json(); // Data is already naturally sorted by ID via Java!

            queueTable.innerHTML = "";
            recentTable.innerHTML = "";
            let queuePosition = 1;
            
            parcels.forEach(parcel => {
                let priorityBadge = parcel.priority === "High" ? "bg-danger" : 
                                   (parcel.priority === "Medium" ? "bg-warning text-dark" : "bg-success");

                if (parcel.status === "Registered" || parcel.status === "Pending") {
                    let positionBadge = queuePosition === 1 ? "bg-primary" : "bg-secondary";
                    queueTable.innerHTML += `
                        <tr>
                            <td><span class="badge ${positionBadge}">#${queuePosition}</span></td>
                            <td>${parcel.parcelID}</td>
                            <td>${parcel.sender}</td>
                            <td>${parcel.destination}</td>
                            <td><span class="badge ${priorityBadge}">${parcel.priority}</span></td>
                            <td><span class="badge bg-warning text-dark">Waiting</span></td>
                        </tr>
                    `;
                    queuePosition++;
                } else if (parcel.status === "Dispatched") {
                    const now = new Date();
                    const timeString = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                    recentTable.innerHTML += `
                        <tr>
                            <td>${parcel.parcelID}</td>
                            <td>${parcel.destination}</td>
                            <td>${timeString}</td>
                            <td><span class="badge bg-success">Dispatched</span></td>
                        </tr>
                    `;
                }
            });
        }
    } catch (error) {
        console.error("Failed to load queue:", error);
    }
}

/*LOAD DASHBOARD DATA DYNAMICALLY (index.html)*/
async function loadDashboardData() {
    if (!window.location.pathname.includes("index.html") && window.location.pathname !== "/") return;

    try {
        const response = await fetch('http://127.0.0.1:8080/api/parcels');
        if (response.ok) {
            let parcels = await response.json(); // Arrives sorted by ID from Java

            let total = parcels.length;
            let inTransit = parcels.filter(p => p.status === "In Transit" || p.status === "Dispatched").length;
            let delivered = parcels.filter(p => p.status === "Delivered").length;
            let pending = parcels.filter(p => p.status === "Registered" || p.status === "Pending").length;

            const statsCards = document.querySelectorAll(".stats-card h2");
            if (statsCards.length >= 4) {
                statsCards[0].innerText = total;
                statsCards[1].innerText = inTransit;
                statsCards[2].innerText = delivered;
                statsCards[3].innerText = pending;
            }

            // Reverse the pre-sorted list to show the newest at the top
            parcels.reverse();

            const tbody = document.querySelector(".table-responsive tbody");
            if (tbody) {
                tbody.innerHTML = ""; 
                const recentParcels = parcels.slice(0, 5);
                
                recentParcels.forEach(parcel => {
                    let statusBadge = parcel.status === "Delivered" ? "bg-success" :
                                     (parcel.status === "Dispatched" ? "bg-primary" : 
                                     (parcel.status === "In Transit" ? "bg-warning text-dark" : "bg-secondary"));
                    
                    tbody.innerHTML += `
                        <tr>
                            <td>${parcel.parcelID}</td>
                            <td>${parcel.sender}</td>
                            <td>${parcel.receiver}</td>
                            <td><span class="badge ${statusBadge}">${parcel.status}</span></td>
                        </tr>
                    `;
                });
            }

            const summaryCardBody = document.querySelector(".card.shadow.mt-5 .card-body");
            if (summaryCardBody) {
                summaryCardBody.innerHTML = `
                    <p>✔ <strong>${total}</strong> Parcels Registered</p>
                    <p>✔ <strong>${delivered}</strong> Successfully Delivered</p>
                    <p>✔ <strong>${inTransit}</strong> Currently In Transit</p>
                    <p>✔ <strong>${pending}</strong> Awaiting Dispatch</p>
                `;
            }
        }
    } catch (error) {
        console.error("Failed to load dashboard data:", error);
    }
}

/* AUTO-FILL NEXT PARCEL ID ON REGISTER PAGE */
async function prefillNextParcelID() {
    const idInput = document.getElementById("parcelID");
    if (!idInput) return; 

    try {
        const response = await fetch('http://127.0.0.1:8080/api/parcels');
        if (response.ok) {
            const parcels = await response.json();
            let maxIdNum = 0;
            parcels.forEach(p => {
                let num = parseInt(p.parcelID.replace(/\D/g, '')) || 0;
                if (num > maxIdNum) maxIdNum = num;
            });
            const nextId = "P" + String(maxIdNum + 1).padStart(3, '0');
            idInput.value = nextId; 
        }
    } catch (error) {
        console.error("Could not pre-fill Parcel ID:", error);
    }
}