// QUERY=wxuu soo qabanayaa dhmn elementska
////.tab-btn=badhamada Bookings io Orders
//////.tab-content=qeybaha la badalayo
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
/////FOR EACH=wxuu mid mid umarayaa button kasta
tabButtons.forEach(button => {
    ////marka button la gujiyo functionkan ayaa shaqeynaya
    button.addEventListener('click', () => {
        ////wxuu akhrinayaa
        //1:data-rab="Bookings"
        //1:data-rab="Orders"
        const targetTab = button.getAttribute('data-tab');
        
        //wxuu active kasaraya dhmn buttonska
        //wxuu active kasaraya dhmn contentska
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        //wxuu kusoo darayaa ACTIVE
        button.classList.add('active');
        document.getElementById(`${targetTab}-tab`).classList.add('active');
    });
});

//FUNCTION lagu soo bandhigo Bookings
function loadBookings() {
    ///////LocalStorage
    //////json.parse=string=array
    const bookings = JSON.parse(localStorage.getItem('hotelBookings') || '[]');
    ////Bookings ayaa table lagu soo gelinayaa
    const tbody = document.getElementById('bookings-table-body');
    ////hadii ay jirin bookings NO BOOKINGS FOUND ayaa lasoo bandhigayaa
    if (bookings.length === 0) {
        tbody.innerHTML = '<tr><td colspan="11" class="empty-state">No bookings found</td></tr>';
        return;
    }
    
    // Sort bookings by date (newest first)
    bookings.sort((a, b) => new Date(b.date) - new Date(a.date));
    ////MAP= booking kasta wxu usameeya Row cusub
    tbody.innerHTML = bookings.map(booking => {
        /////Date ayuu ubadalayaa format la aqrin karo
        const bookingDate = new Date(booking.date).toLocaleString();
        //////STATUS AYUU UXULANAYAA CSS
        ///CONFIRMED=green
        /////CANCELLED=red
        /////PENDIN=yellow
        const statusClass = booking.status === 'Confirmed' ? 'status-confirmed' : 
                           booking.status === 'Cancelled' ? 'status-cancelled' : 'status-pending';
        

        return `
            <tr>
                <td>${escapeHtml(booking.fullName)}</td>
                <td>${escapeHtml(booking.email)}</td>
                <td>${escapeHtml(booking.phone)}</td>
                <td>${formatRoomType(booking.roomType)}</td>
                <td>${booking.checkIn}</td>
                <td>${booking.checkOut}</td>
                <td>${booking.guests}</td>
                <td><span class="status-badge ${statusClass}">${booking.status}</span></td>
                <td>${bookingDate}</td>
                <td>
                    <div class="action-buttons">
                        ${booking.status === 'Pending' ? `
                            <button class="btn-action btn-confirm" onclick="updateBookingStatus('${booking.id}', 'Confirmed')">Confirm</button>
                            <button class="btn-action btn-cancel" onclick="updateBookingStatus('${booking.id}', 'Cancelled')">Cancel</button>
                        ` : ''}
                        <button class="btn-action btn-delete" onclick="deleteBooking('${booking.id}')">Delete</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Load and Display Orders
function loadOrders() {
    const orders = JSON.parse(localStorage.getItem('hotelOrders') || '[]');
    const tbody = document.getElementById('orders-table-body');
    
    if (orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10" class="empty-state">No orders found</td></tr>';
        return;
    }
    
    // Sort orders by date (newest first)
    orders.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    tbody.innerHTML = orders.map(order => {
        const orderDate = new Date(order.date).toLocaleString();
        const statusClass = order.status === 'Confirmed' ? 'status-confirmed' : 
                           order.status === 'Cancelled' ? 'status-cancelled' : 'status-pending';
        
        return `
            <tr>
                <td>${escapeHtml(order.fullName)}</td>
                <td>${escapeHtml(order.email)}</td>
                <td>${escapeHtml(order.phone)}</td>
                <td>${formatOrderItem(order.item)}</td>s
                <td>${order.quantity}</td>
                <td>${order.preferredTime || 'N/A'}</td>
                <td><span class="status-badge ${statusClass}">${order.status}</span></td>
                <td>${orderDate}</td>
                <td>
                    <div class="action-buttons">
                        ${order.status === 'Pending' ? `
                            <button class="btn-action btn-confirm" onclick="updateOrderStatus('${order.id}', 'Confirmed')">Confirm</button>
                            <button class="btn-action btn-cancel" onclick="updateOrderStatus('${order.id}', 'Cancelled')">Cancel</button>
                        ` : ''}
                        <button class="btn-action btn-delete" onclick="deleteOrder('${order.id}')">Delete</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Update Booking Status
///////marka adminku la gujiyo wxu soo saraya status COMFIRM OR CANCEL
function updateBookingStatus(id, status) {
    const bookings = JSON.parse(localStorage.getItem('hotelBookings') || '[]');
    ///////WXUU radinayaa bookinga la doorty
    const bookingIndex = bookings.findIndex(b => b.id === id);
    
    if (bookingIndex !== -1) {
        //status ayuu badalayaa
        bookings[bookingIndex].status = status;
        localStorage.setItem('hotelBookings', JSON.stringify(bookings));
        ///////table io stats waala cusboneysiinayaa
        loadBookings();
        updateStats();
    }
}

// Update Order Status

function updateOrderStatus(id, status) {
    const orders = JSON.parse(localStorage.getItem('hotelOrders') || '[]');
    const orderIndex = orders.findIndex(o => o.id === id);
    
    if (orderIndex !== -1) {
        orders[orderIndex].status = status;
        localStorage.setItem('hotelOrders', JSON.stringify(orders));
        loadOrders();
        updateStats();
    }
}

// Delete Booking
function deleteBooking(id) {
    if (confirm('Ma hubtaa inaad tirtirtid Booking-kaaga?')) {
        const bookings = JSON.parse(localStorage.getItem('hotelBookings') || '[]');
        /////waala tirayaa midka la doorty
        const filteredBookings = bookings.filter(b => b.id !== id);
        localStorage.setItem('hotelBookings', JSON.stringify(filteredBookings));
        loadBookings();
        updateStats();
    }
}

// Delete Order
function deleteOrder(id) {
    if (confirm('Ma hubtaa inad tirtirtid Dalabkaaga?')) {
        const orders = JSON.parse(localStorage.getItem('hotelOrders') || '[]');
        const filteredOrders = orders.filter(o => o.id !== id);
        localStorage.setItem('hotelOrders', JSON.stringify(filteredOrders));
        loadOrders();
        updateStats();
    }
}

// Clear All Bookings
function clearBookings() {
    if (confirm('M hubtaa inaad tirtirtid dhamaan Booking-gaa.')) {
        localStorage.removeItem('hotelBookings');
        loadBookings();
        updateStats();
    }
}

// Clear All Orders
function clearOrders() {
    if (confirm('Ma hubta inaa tirtirtid dhamaan dalabkaaga.')) {
        localStorage.removeItem('hotelOrders');
        loadOrders();
        updateStats();
    }
}

// Update Statistics
function updateStats() {
    const bookings = JSON.parse(localStorage.getItem('hotelBookings') || '[]');
    const orders = JSON.parse(localStorage.getItem('hotelOrders') || '[]');
    //////wxuu tirinayaa kuwa pending ku jira
    const pendingBookings = bookings.filter(b => b.status === 'Pending').length;
    const pendingOrders = orders.filter(o => o.status === 'Pending').length;
    /////Tirooyinka kore ayuu cusboneysiinayaa
    document.getElementById('total-bookings').textContent = bookings.length;
    document.getElementById('total-orders').textContent = orders.length;
    document.getElementById('pending-bookings').textContent = pendingBookings;
    document.getElementById('pending-orders').textContent = pendingOrders;
}

// Format Room Type
function formatRoomType(roomType) {
    const roomTypes = {
        'Single': 'Single Room',
        'Double': 'double Room',
        'VIP': 'VIP Room'
    };
    return roomTypes[roomType] || roomType;
}

// Format Order Item
function formatOrderItem(item) {
    const items = {
        'Quraac': 'Quraac - $15',
        'Qado VIP': 'Qado VIP- $20',
        'Casho': 'Casho - $12'
    };
    return items[item] || item;
}

// Escape HTML to prevent XSS
///////SECURITY
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize Admin Panel
/////MARKU PAGEKA SI BUUXDA UFURMO
document.addEventListener('DOMContentLoaded', () => {
    loadBookings();
    loadOrders();
    updateStats();
    
    //30 ILBIRIQSI KASTA
    /////refresh bookings
    /////refresh ordes
    //////refresh stats
    setInterval(() => {
        loadBookings();
        loadOrders();
        updateStats();
    }, 30000);
});

