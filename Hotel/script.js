// Mobile Menu Toggle
////mobile mennu toggle wxu qabana hamburger mennu(3xariiq)
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
/////nav list=mennuga listiga
const navList = document.querySelector('.nav-list');
////hadii mobile mennu jiro ha shaqeyo codeka hdi usan jirina wax error yuu dhicin
//SADARKA ADD====marka la gujiyo hamurger mennu wala daraya ama la daminayaa
//mennuga mobile ayuu furayaa ama xirayaa
if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        navList.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
///////dhmn linkska menuga
const navLinks = document.querySelectorAll('.nav-link');
///navlist == linki kasta ayuu marayaa
navLinks.forEach(link => {
    ///marka link la gujiyo mennuga mobileka waala xirayaa
    link.addEventListener('click', () => {
        navList.classList.remove('active');
    });
});

// Smooth Scrolling for Navigation Links
///////dhmn linkska bilabanaya HOME ROOMS BOOKING IWM
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        //////WXUU JOOJINAYAA JUMPIGA CAADIGA EE DEGDEGA AH
        e.preventDefault();
        ////Wxuu soo qabanaya sectionska sida HOME<section id=home>
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            ////hiderka waa fixed 
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
////sida tartiib ayuu hoos ugu rogayaa scrolka
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Booking Form Submission
////wxuu soo qabanayaa bookings
const bookingForm = document.getElementById('booking-form');
if (bookingForm) {
    bookingForm.addEventListener('submit', function(e) {
        ///wxuu joojinayaa reloadka pageka
        e.preventDefault();
        
        // Get form values
        const formData = new FormData(this);
        const bookingData = {
            /////id gaar ah(timestamp)
            id: Date.now().toString(),
            fullName: formData.get('fullname'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            roomType: formData.get('room-type'),
            checkIn: formData.get('checkin'),
            checkOut: formData.get('checkout'),
            guests: formData.get('guests'),
            date: new Date().toISOString(),
            ////////adminka ayuu sugayaa
            status: 'Pending'
        };
        
        // Save to localStorage
        /////booking ayuu ukeydinayaa localStorage
        let bookings = JSON.parse(localStorage.getItem('hotelBookings') || '[]');
        bookings.push(bookingData);
        localStorage.setItem('hotelBookings', JSON.stringify(bookings));
        
        // Show success message
        alert('Macmiil waad ku mahadsantahy soo gudbinta bookin-gaaga.');
        
        //////FORM-KA AYUU NADIIFIYAA
        this.reset();
    });
}

// Order Form Submission
const orderForm = document.getElementById('order-form');
if (orderForm) {
    orderForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const formData = new FormData(this);
        const orderData = {
            id: Date.now().toString(),
            fullName: formData.get('order-name'),
            phone: formData.get('order-phone'),
            email: formData.get('order-email'),
            item: formData.get('order-item'),
            quantity: formData.get('order-quantity'),
            preferredTime: formData.get('order-time'),
            date: new Date().toISOString(),
            status: 'Pending'
        };
        
        // Save to localStorage
        let orders = JSON.parse(localStorage.getItem('hotelOrders') || '[]');
        orders.push(orderData);
        localStorage.setItem('hotelOrders', JSON.stringify(orders));
        
        // Show success message
        alert('Macmiil waad ku mahadsantahy soo gudbinta Orderkaaga .');
        
        // WXUU NADIIFIYAA FORM-KA
        this.reset();
    });
}

// Order Now Buttons in Restaurant Section
/////Buttonska ORDER NOW ayuu soo qabanayaa
const orderButtons = document.querySelectorAll('.btn-order');
orderButtons.forEach(button => {
    ////////marka la gujiyo order now ayuu ku geynayaa ORDER FORM
    button.addEventListener('click', function() {
        // Scroll to order section
        ///////Nasray qeyptaan kusoo laabo
        const orderSection = document.getElementById('order');
        if (orderSection) {
            const headerOffset = 80;
            const elementPosition = orderSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Set minimum date for check-in and check-out
const checkinInput = document.getElementById('checkin');
const checkoutInput = document.getElementById('checkout');

if (checkinInput && checkoutInput) {
    ///TAARIIKHDA MAANTA
    const today = new Date().toISOString().split('T')[0];
    ///////LAMA OGOLA TAARIIIKH HORE
    checkinInput.setAttribute('min', today);
    checkoutInput.setAttribute('min', today);

    // Update checkout minimum date when check-in date changes
    checkinInput.addEventListener('change', function() {
        const checkinDate = new Date(this.value);
        ////////CHECKOUT waa inuu ka dambeeya checkIn
        checkinDate.setDate(checkinDate.getDate() + 1);
        const minCheckout = checkinDate.toISOString().split('T')[0];
        checkoutInput.setAttribute('min', minCheckout);
        
        // If checkout date is before new check-in date, clear it
        if (checkoutInput.value && checkoutInput.value <= this.value) {
            //////////haday qaldantahy waala tirtirayaa
            checkoutInput.value = '';
        }
    });
}

// Header scroll effect
let lastScroll = 0;
const header = document.querySelector('.header');
////marka boga la rogo
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    ///hadii hoos loo rogo wax bdn
    //shadow bdn marka hoos la joogo
    if (currentScroll > 100) {
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
    ////shadow yar marka kor la joogo
    lastScroll = currentScroll;
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe cards and sections
/////////BAgeka markuu dhamaado
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.room-card, .food-card, .contact-item');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        ////////ROOM CARDS,FOOD CARDS,CONTACT ITEMS animation ayey helayaan marka la joogo ama la dul istaago
        observer.observe(card);
    });
});

