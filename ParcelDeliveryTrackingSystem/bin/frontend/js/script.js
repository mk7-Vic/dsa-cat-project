/*PAGE LOADED*/
document.addEventListener("DOMContentLoaded",function(){
    animateCards();
    animateCounters();
    searchParcel();
    showWelcomeToast();
    enableDarkMode();
    sidebarToggle();
    loadAllParcels();
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
            }

            else{
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
        console.log("Searching for:",searchInput.value);
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
        links.forEach(item=>{
            item.classList.remove("active");
        });
        this.classList.add("active");
    });
});


/*CARD HOVER EFFECT*/
const stats=document.querySelectorAll(".stats-card");

stats.forEach(card=>{
    card.addEventListener("mouseenter",()=>{
        card.style.transform="translateY(-8px) scale(1.03)";
    });

    card.addEventListener("mouseleave",()=>{
        card.style.transform="translateY(0px) scale(1)";
    });
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
            
            // Optional: Make the button itself light to contrast the dark background
            button.classList.replace("btn-dark", "btn-light");
        }
        else{
            document.body.classList.remove("dark-mode");
            button.innerHTML = "<i class='bi bi-moon-fill'></i>";
            
            // Optional: Make the button itself dark to contrast the light background
            button.classList.replace("btn-light", "btn-dark");
        }
    });
}


/*SIDEBAR TOGGLE*/
function sidebarToggle(){
    if(window.innerWidth>768){
        return;
    }
    const sidebar=document.querySelector(".sidebar");
    if(!sidebar){
        return;
    }
    sidebar.style.display="block";
}


/*SMOOTH SCROLL*/
document.documentElement.style.scrollBehavior="smooth";

function showNotification(message, type = 'success') {
    const toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) return; // Failsafe in case the container is missing

    // 1. Create the toast element
    const toastEl = document.createElement('div');
    toastEl.className = `toast align-items-center text-bg-${type} border-0 mb-2 shadow`;
    toastEl.setAttribute('role', 'alert');
    toastEl.setAttribute('aria-live', 'assertive');
    toastEl.setAttribute('aria-atomic', 'true');

    // 2. Determine the right Bootstrap icon based on the type
    let icon = 'bi-info-circle-fill';
    if (type === 'success') icon = 'bi-check-circle-fill';
    if (type === 'danger') icon = 'bi-exclamation-triangle-fill';
    if (type === 'warning') icon = 'bi-exclamation-circle-fill';

    // 3. Add the HTML inside the toast
    toastEl.innerHTML = `
        <div class="d-flex">
            <div class="toast-body fs-6">
                <i class="bi ${icon} me-2"></i> ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;

    // 4. Append to container and show
    toastContainer.appendChild(toastEl);
    const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
    toast.show();

    // 5. Clean up the DOM after it fades out
    toastEl.addEventListener('hidden.bs.toast', () => {
        toastEl.remove();
    });
}

/*REGISTER PARCEL FORM*/
const parcelForm = document.getElementById("parcelForm");

if(parcelForm){
    parcelForm.addEventListener("submit", async function(e){
        e.preventDefault();
        
        // Gather data from the form
        const parcelData = {
            parcelID: document.getElementById("parcelID").value.trim().toUpperCase(),
            weight: document.getElementById("weight").value.trim(),
            sender: document.getElementById("senderName").value.trim(),
            receiver: document.getElementById("receiverName").value.trim(),
            destination: document.getElementById("destination").value.trim(),
            priority: document.getElementById("priority").value
        };

        if(Number(parcelData.weight) <= 0){
            alert("Weight must be greater than 0.");
            return;
        }

        try {
            // Send to Java Backend
            const response = await fetch('http://127.0.0.1:8080/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(parcelData)
            });

            if (response.ok) {
                showNotification(`Success! ${parcelData.parcelID} has been registered and added to the Queue.`, "success");
                parcelForm.reset();
            } else {
                showNotification("Failed to register. Parcel ID might already exist.", "danger");
            }
        } catch (error) {
            console.error("Connection failed:", error);
            showNotification("Could not connect to the backend server.", "danger");
        }
    });
}

/*SEARCH PARCEL TABLE*/

const searchInput=document.getElementById("searchInput");

if(searchInput){

    searchInput.addEventListener("keyup",function(){

        const value=this.value.toLowerCase();

        const rows=document.querySelectorAll("tbody tr");

        rows.forEach(row=>{

            row.style.display=row.innerText.toLowerCase().includes(value)
            ?"":"none";

        });

    });

}

/*VIEW BUTTONS*/

const viewButtons=document.querySelectorAll(".btn-primary");

viewButtons.forEach(button=>{

    if(button.querySelector(".bi-eye")){

        button.addEventListener("click",function(){

            const modal=new bootstrap.Modal(document.getElementById("viewParcelModal"));

            modal.show();

        });

    }

});

/*DELETE BUTTON*/

const deleteButtons=document.querySelectorAll(".btn-danger");

deleteButtons.forEach(button=>{

    if(button.querySelector(".bi-trash")){

        button.addEventListener("click",function(){

            if(confirm("Delete this parcel?")){

                this.closest("tr").remove();

            }

        });

    }

});

/*EDIT BUTTON*/

const editButtons=document.querySelectorAll(".btn-warning");

editButtons.forEach(button=>{

    if(button.querySelector(".bi-pencil-square")){

        button.addEventListener("click",function(){

            alert("Edit functionality will be connected to Java backend.");

        });

    }

});

/*TRACK PARCEL - HITS THE JAVA HASH MAP & UPDATES DOM*/
const trackButton = document.getElementById("trackBtn");

if(trackButton){
    trackButton.addEventListener("click", async function(e){
        e.preventDefault(); 
        const parcelID = document.getElementById("trackingInput").value.trim().toUpperCase();

        if(parcelID === ""){
            alert("Enter Parcel ID");
            return;
        }

        try {
            // 1. Fetch from Java Backend
            const response = await fetch(`http://127.0.0.1:8080/api/track?id=${parcelID}`);
            
            if (response.ok) {
                const parcel = await response.json();
                
                // 2. Find the card body where the details live
                // (It's the first card body inside the main row)
                const detailsCardBody = document.querySelector(".col-lg-4 .card-body");
                
                if(detailsCardBody) {
                    // Determine badge colors based on data
                    let priorityBadge = parcel.priority === "High" ? "bg-danger" : 
                                       (parcel.priority === "Medium" ? "bg-warning text-dark" : "bg-success");
                    
                    let statusBadge = parcel.status === "Delivered" ? "bg-success" :
                                     (parcel.status === "Dispatched" ? "bg-primary" : "bg-secondary");

                    // 3. Overwrite the HTML with the real data from Java!
                    detailsCardBody.innerHTML = `
                        <p><strong>Parcel ID:</strong> ${parcel.parcelID}</p>
                        <p><strong>Sender:</strong> ${parcel.sender}</p>
                        <p><strong>Receiver:</strong> ${parcel.receiver}</p>
                        <p><strong>Weight:</strong> ${parcel.weight} kg</p>
                        <p><strong>Priority:</strong> <span class="badge ${priorityBadge}">${parcel.priority}</span></p>
                        <p><strong>Status:</strong> <span class="badge ${statusBadge}">${parcel.status}</span></p>
                        <p><strong>Destination:</strong> ${parcel.destination}</p>
                    `;
                }
                
                const progressBar = document.querySelector(".progress-bar");
                const summaryIcons = document.querySelectorAll(".card-body .row.text-center i");

                // Determine progress based on the Java status
                let progressPercentage = "25%";
                let activeSteps = 1;

                if (parcel.status === "Registered") {
                    progressPercentage = "25%";
                    activeSteps = 1;
                } else if (parcel.status === "Dispatched" || parcel.status === "Collected" || parcel.status === "Sorting Hub") {
                    progressPercentage = "50%";
                    activeSteps = 2;
                } else if (parcel.status === "In Transit") {
                    progressPercentage = "75%";
                    activeSteps = 3;
                } else if (parcel.status === "Delivered") {
                    progressPercentage = "100%";
                    activeSteps = 4;
                }

                // Animate the Progress Bar
                if (progressBar) {
                    progressBar.style.width = progressPercentage;
                    progressBar.innerText = progressPercentage;
                    
                    // Change color to green only if fully delivered
                    if(progressPercentage === "100%") {
                        progressBar.className = "progress-bar progress-bar-striped progress-bar-animated bg-success";
                    } else {
                        progressBar.className = "progress-bar progress-bar-striped progress-bar-animated bg-primary";
                    }
                }

                // Light up the correct checkmarks at the bottom
                if(summaryIcons.length >= 4) {
                    // First, reset all to gray outlines
                    summaryIcons.forEach(icon => {
                        icon.className = "bi bi-check-circle text-secondary fs-2"; 
                    });

                    // Then fill in the completed steps with green
                    for(let i = 0; i < activeSteps; i++) {
                        summaryIcons[i].className = "bi bi-check-circle-fill text-success fs-2"; 
                    }
                }
                
            } else {
                alert("Parcel " + parcelID + " not found in the system. (O(1) Hash Map lookup failed)");
            }
        } catch (error) {
            console.error("Connection failed:", error);
            alert("Could not connect to the backend server.");
        }
    });
}

// 1. DISPATCH NEXT PARCEL (Triggers Backend Queue Dequeue)
const dispatchButton = document.getElementById("dispatchBtn");

if(dispatchButton){
    dispatchButton.addEventListener("click", async function(){
        try {
            const response = await fetch('http://127.0.0.1:8080/api/dispatch', {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                
                // --- NEW DYNAMIC UI UPDATE ---
                // 1. Find both tables on the page
                const tables = document.querySelectorAll(".table-responsive tbody");
                const queueTable = tables[0];   // Top table: Waiting Queue
                const recentTable = tables[1];  // Bottom table: Recently Dispatched

                if (queueTable && queueTable.firstElementChild) {
                    // Grab the very first row in the queue (Demonstrating FIFO!)
                    const firstRow = queueTable.firstElementChild;
                    
                    // Extract the ID and Destination text before we delete the row
                    const parcelId = firstRow.cells[1].innerText;
                    const destination = firstRow.cells[3].innerText;
                    
                    // Remove it from the Waiting Queue visually
                    firstRow.remove();

                    // Create a brand new row for the bottom table
                    const newRow = document.createElement("tr");
                    const now = new Date();
                    const timeString = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

                    newRow.innerHTML = `
                        <td>${parcelId}</td>
                        <td>${destination}</td>
                        <td>${timeString}</td>
                        <td><span class="badge bg-success">Dispatched</span></td>
                    `;
                    
                    // Insert it at the top of the Recently Dispatched list
                    if (recentTable) {
                        recentTable.insertBefore(newRow, recentTable.firstChild);
                    }
                }
                
                // Show the success message last
                alert("Backend Success! Dispatched Parcel: " + data.parcelId); 

                // Notice we removed location.reload() so the page doesn't reset!
                
            } else {
                alert("Failed to dispatch. Check your Java backend logic.");
            }
        } catch (error) {
            console.error("Connection failed:", error);
            alert("Could not connect to the server. Is your VS Code Java server running?");
        }
    });
}

// 2. TRIGGER QUICKSORT (Calls backend algorithm)
async function triggerQuicksort(sortByColumn) {
    try {
        // Show a loading toast
        showNotification(`Sorting by ${sortByColumn}...`, 'info');

        const response = await fetch(`http://127.0.0.1:8080/api/sort?column=${sortByColumn}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const sortedParcels = await response.json();
            console.log("Sorted Data from Backend:", sortedParcels);
            
            // Rebuild the HTML table with the new sorted data
            updateParcelTable(sortedParcels);
            
            // Show success toast instead of alert
            showNotification("Quicksort executed successfully!", 'success');
        } else {
            showNotification("Backend sorting failed.", 'danger');
        }
    } catch (error) {
        console.error("Connection failed:", error);
        showNotification("Could not connect to the server. Is your Java server running?", 'danger');
    }
}

// Helper function to dynamically rebuild the table
function updateParcelTable(parcels) {
    // Select the table body in parcels.html
    const tbody = document.querySelector(".table tbody");
    if (!tbody) return; 

    tbody.innerHTML = ""; // Clear the current unsorted rows

    // Loop through the sorted array and build new rows
    parcels.forEach(parcel => {
        // Assign correct badge colors based on status/priority
        let priorityBadge = parcel.priority.toLowerCase() === 'high' ? 'bg-danger' : 
                            parcel.priority.toLowerCase() === 'medium' ? 'bg-warning text-dark' : 'bg-success';
                            
        let statusBadge = parcel.status.toLowerCase() === 'delivered' ? 'bg-success' :
                          parcel.status.toLowerCase() === 'in transit' ? 'bg-warning text-dark' : 'bg-secondary';

        const row = `
            <tr>
                <td>${parcel.id}</td>
                <td>${parcel.sender}</td>
                <td>${parcel.receiver}</td>
                <td>${parcel.destination}</td>
                <td><span class="badge ${statusBadge}">${parcel.status}</span></td>
                <td><span class="badge ${priorityBadge}">${parcel.priority}</span></td>
                <td>
                    <button class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#viewParcelModal">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-warning" onclick="showNotification('Edit mode coming soon!', 'info')">
                        <i class="bi bi-pencil-square"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteDynamicRow(this, '${parcel.parcelID}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

/* EXPORT BUTTON */
const exportBtn = document.getElementById("exportBtn");
if (exportBtn) {
    exportBtn.addEventListener("click", function() {
        alert("Exporting parcel list to CSV...");
        // Add your export logic here later
    });
}

/* MAIN SEARCH BUTTON (DASHBOARD) */
const searchBtn = document.getElementById("searchBtn");
if (searchBtn) {
    searchBtn.addEventListener("click", function(e) {
        e.preventDefault(); // Prevent page reload since it's in a form
        const searchInput = document.querySelector(".navbar input[type='search']");
        if (searchInput && searchInput.value) {
            alert("Searching system for: " + searchInput.value);
        }
    });
}

/*CURRENT DATE*/

const navbar=document.querySelector(".navbar");

if(navbar){
    const today=new Date();
    const date=document.createElement("span");
    date.className="text-muted ms-auto";
    date.innerHTML=today.toDateString();
    navbar.appendChild(date);
}

/*LOAD ALL PARCELS DYNAMICALLY INTO TABLE*/
async function loadAllParcels() {
    // Find the table body on the parcels.html page
    const tableBody = document.querySelector(".card-body table tbody");
    const isParcelsPage = document.querySelector("th[onclick*='triggerQuicksort']");
    
    // Only run this script if we are actually on the All Parcels page
    if (!tableBody || !isParcelsPage) return;

    try {
        const response = await fetch('http://127.0.0.1:8080/api/parcels');
        
        if (response.ok) {
            const parcels = await response.json();
            
            // 1. Wipe out the hardcoded dummy HTML rows!
            tableBody.innerHTML = ""; 

            // 2. Loop through the real data from Java and create new rows
            parcels.forEach(parcel => {
                let priorityBadge = parcel.priority === "High" ? "bg-danger" : 
                                   (parcel.priority === "Medium" ? "bg-warning text-dark" : "bg-success");
                
                let statusBadge = parcel.status === "Delivered" ? "bg-success" :
                                 (parcel.status === "Dispatched" ? "bg-primary" : "bg-secondary");

                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${parcel.parcelID}</td>
                    <td>${parcel.sender}</td>
                    <td>${parcel.receiver}</td>
                    <td>${parcel.destination}</td>
                    <td><span class="badge ${statusBadge}">${parcel.status}</span></td>
                    <td><span class="badge ${priorityBadge}">${parcel.priority}</span></td>
                    <td>
                        <button class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#viewParcelModal">
                            <i class="bi bi-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-warning" onclick="showNotification('Edit mode coming soon!', 'info')">
                            <i class="bi bi-pencil-square"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="deleteDynamicRow(this, '${parcel.parcelID}')">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                `;
                
                tableBody.appendChild(row);
            });
        }
    } catch (error) {
        console.error("Failed to load parcels from backend:", error);
    }
}

/*DELETE PARCEL DYNAMICALLY (CRUD: DELETE)*/
window.deleteDynamicRow = async function(buttonElement, parcelID) {
    if(confirm(`Are you sure you want to completely delete Parcel ${parcelID} from the system?`)) {
        try {
            // Send DELETE request to Java Backend
            const response = await fetch(`http://127.0.0.1:8080/api/delete?id=${parcelID}`, {
                method: 'DELETE'
            });
            
            if(response.ok) {
                // Remove from the UI visually
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