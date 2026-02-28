document.addEventListener('DOMContentLoaded', function () {

    // 1. Countdown Timer Logic
    const countdownEl = document.getElementById('countdown');
    // Set 2 hours and 15 minutes from now
    let time = 2 * 3600 + 15 * 60 + 30;

    setInterval(function () {
        if (time <= 0) return;
        time--;
        let h = Math.floor(time / 3600);
        let m = Math.floor((time % 3600) / 60);
        let s = time % 60;
        countdownEl.innerText =
            (h < 10 ? '0' + h : h) + ':' +
            (m < 10 ? '0' + m : m) + ':' +
            (s < 10 ? '0' + s : s);
    }, 1000);


    // 2. Pricing Radio Button Logic
    const pricingRadios = document.querySelectorAll('input[name="pricing-tier"]');
    const finalPriceEl = document.getElementById('final-price');

    pricingRadios.forEach(radio => {
        radio.addEventListener('change', function () {
            // Update styling for selected card
            document.querySelectorAll('.pricing-card').forEach(card => {
                card.style.borderColor = 'var(--border)';
                card.style.boxShadow = 'none';
            });

            const parentCard = this.closest('.pricing-card');
            parentCard.style.borderColor = 'var(--primary)';
            if (this.id === 'tier-2') {
                parentCard.style.boxShadow = '0 4px 15px rgba(255, 90, 95, 0.15)';
            }

            // Update the total price at the bottom
            const price = this.getAttribute('data-price');
            finalPriceEl.innerText = price + ' درهم';

            // Add a little pop effect to the total bar
            const totalBar = document.querySelector('.total-bar');
            totalBar.style.transform = 'scale(1.05)';
            setTimeout(() => {
                totalBar.style.transform = 'scale(1)';
            }, 200);
        });
    });


    // 3. Form Submission (Google Sheet connection)
    const orderForm = document.getElementById('orderForm');
    const successMessage = document.getElementById('success-message');

    // IMPORTANT: Paste your copied Google Script URL here inside the quotes
    const scriptURL = 'https://script.google.com/macros/s/AKfycbw4J8t5pbz9HKttgkUK283P4F7mPMkS0qD_LGtAqc1pNomzI1NqQDGseXDy3XbTpRT7/exec';

    orderForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Change button state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري تأكيد الطلب...';
        submitBtn.disabled = true;

        // Prepare the form data to be sent
        const formData = new FormData(orderForm);

        // Grab the final selected price
        const finalPrice = document.getElementById('final-price').innerText;
        formData.append('tier', finalPrice); // Adding the price to our Google Sheet data

        // If the URL is still the placeholder, just simulate success (for testing)
        if (scriptURL === 'https://script.google.com/macros/s/AKfycbw4J8t5pbz9HKttgkUK283P4F7mPMkS0qD_LGtAqc1pNomzI1NqQDGseXDy3XbTpRT7/exec') {
            setTimeout(() => {
                orderForm.style.display = 'none';
                successMessage.classList.remove('hidden');
                successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 1500);
            return;
        }

        // Send data to Google Sheets
        fetch(scriptURL, { method: 'POST', body: formData })
            .then(response => {
                orderForm.style.display = 'none';
                successMessage.classList.remove('hidden');
                successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            })
            .catch(error => {
                console.error('Error!', error.message);
                alert('حدث مشكل أثناء إرسال الطلب. المرجو المحاولة لاحقاً أو الاتصال بنا مباشرة.');
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            });
    });

    // 4. Floating CTA Visibility on Mobile Scroll
    const floatingCta = document.getElementById('floating-cta');
    const heroBtn = document.querySelector('.cta-scroll');
    const checkoutSection = document.getElementById('checkout-section');

    window.addEventListener('scroll', function () {
        if (window.innerWidth > 768) return; // Only show on mobile

        const heroBtnBottom = heroBtn.getBoundingClientRect().bottom;
        const checkoutTop = checkoutSection.getBoundingClientRect().top;

        // Show if we scrolled past the hero button, but hide if we reached the checkout section
        if (heroBtnBottom < 0 && checkoutTop > window.innerHeight) {
            floatingCta.classList.add('visible');
        } else {
            floatingCta.classList.remove('visible');
        }
    });

    // 5. FAQ Toggle Logic
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Close other open items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            // Toggle current one
            item.classList.toggle('active');
        });
    });

    // 6. Fake Sales Popup Logic
    const salesPopup = document.getElementById('sales-popup');
    const popupName = document.getElementById('popup-name');
    const popupItem = document.getElementById('popup-item');
    const popupTime = document.getElementById('popup-time');

    // Arabic fake data
    const cities = ["الدار البيضاء", "الرباط", "طنجة", "مراكش", "أكادير", "فاس", "مكناس"];
    const names = ["يوسف", "حسن", "فاطمة", "مريم", "سعيد", "زكرياء", "سناء", "هشام"];
    const products = ["جهاز واحد (الأكثر طلباً)", "عرض الزوجين (جهازين)", "عرض الزوجين (جهازين)", "جهاز واحد (الأكثر طلباً)"];

    function showFakeSale() {
        if (!salesPopup) return;

        // Randomize data
        const rName = names[Math.floor(Math.random() * names.length)];
        const rCity = cities[Math.floor(Math.random() * cities.length)];
        const rProduct = products[Math.floor(Math.random() * products.length)];
        const rTime = Math.floor(Math.random() * 55) + 2; // Random time 2 to 57 mins

        popupName.innerText = `${rName} من ${rCity}`;
        popupItem.innerText = rProduct;
        popupTime.innerText = `منذ ${rTime} دقائق`;

        // Only show if the user isn't hovering over it (prevents misClicks)
        salesPopup.classList.add('show');

        // Hide after 5 seconds
        setTimeout(() => {
            salesPopup.classList.remove('show');
        }, 5000);
    }

    // Attempt to show popup randomly every 12 to 25 seconds
    setInterval(() => {
        // 60% chance to show to not make it look bot-like
        if (Math.random() > 0.4) {
            showFakeSale();
        }
    }, Math.floor(Math.random() * 13000) + 12000);

    // Initial popup shortly after page load
    setTimeout(showFakeSale, 6000);

});

// Global Smooth Scroll Function used by CTA buttons
function scrollToCheckout() {
    const checkoutSection = document.getElementById('checkout-section');
    checkoutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Highlight the form briefly to draw attention
    setTimeout(() => {
        const formPanel = document.querySelector('.checkout-form-panel');
        formPanel.style.boxShadow = '0 0 20px rgba(0, 166, 153, 0.4)';
        setTimeout(() => {
            formPanel.style.boxShadow = 'var(--shadow-sm)';
        }, 1500);
    }, 800);
}

