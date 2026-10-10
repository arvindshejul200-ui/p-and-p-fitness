/**
 * P&P Fitness - High-Converting Single Page Web App
 * Bajrang Chowk, CIDCO N 8, Chhatrapati Sambhajinagar (Aurangabad)
 * Official Red & Black Brand Identity
 */

// Strictly ensure page starts at the very top (Hero section) on initial page load
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

if (window.location.hash) {
  history.replaceState(null, '', window.location.pathname + window.location.search);
  window.scrollTo(0, 0);
}

window.addEventListener('load', () => {
  window.scrollTo(0, 0);
});

document.addEventListener('DOMContentLoaded', () => {
  window.scrollTo(0, 0);
  initLiveGymSchedule();
  initBookingEngine();
  initPricingToggle();
  initFitnessCalculator();
  initMobileMenu();
  initNavbarScroll();
  initCheckExistingPass();
});

/* ==========================================================================
   1. LIVE GYM SCHEDULE & REAL-TIME IST STATUS INDICATOR
   ========================================================================== */
function initLiveGymSchedule() {
  function getISTDate() {
    const now = new Date();
    // Convert to IST (UTC + 5 hours 30 mins)
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    return new Date(utc + (3600000 * 5.5));
  }

  function updateStatus() {
    const ist = getISTDate();
    const day = ist.getDay(); // 0 = Sunday, 1 = Monday, ... 6 = Saturday
    const hours = ist.getHours();
    const minutes = ist.getMinutes();
    const currentMins = hours * 60 + minutes;

    // Gym Operating Hours (IST):
    // Mon - Sat:
    // Morning Shift: 06:00 AM (360m) - 11:00 AM (660m)
    // Evening Shift: 05:00 PM (1020m) - 10:00 PM (1320m)
    // Sunday: Closed

    const morningStart = 6 * 60;   // 06:00
    const morningEnd = 11 * 60;    // 11:00
    const eveningStart = 17 * 60;  // 17:00
    const eveningEnd = 22 * 60;    // 22:00

    let isOpen = false;
    let statusText = '';
    let pillText = '';
    let nextEventText = '';

    if (day === 0) {
      // Sunday
      isOpen = false;
      statusText = 'CLOSED TODAY (SUNDAY)';
      pillText = '🔴 CLOSED (Sunday Rest Day)';
      nextEventText = 'Weekly Recovery Day. Gym reopens Monday at 6:00 AM.';
    } else {
      if (currentMins >= morningStart && currentMins < morningEnd) {
        isOpen = true;
        const minsLeft = morningEnd - currentMins;
        const hrsLeft = Math.floor(minsLeft / 60);
        const remMins = minsLeft % 60;
        statusText = 'OPEN NOW • MORNING SHIFT';
        pillText = '🟢 OPEN NOW (Morning Shift)';
        nextEventText = `Morning shift active. Closes in ${hrsLeft > 0 ? hrsLeft + 'h ' : ''}${remMins}m (at 11:00 AM).`;
      } else if (currentMins >= morningEnd && currentMins < eveningStart) {
        isOpen = false;
        const minsUntil = eveningStart - currentMins;
        const hrsUntil = Math.floor(minsUntil / 60);
        const remMins = minsUntil % 60;
        statusText = 'CLOSED • AFTERNOON BREAK';
        pillText = '🔴 CLOSED (Opens 5:00 PM)';
        nextEventText = `Floor sanitization & trainer break. Evening shift opens in ${hrsUntil > 0 ? hrsUntil + 'h ' : ''}${remMins}m (at 5:00 PM).`;
      } else if (currentMins >= eveningStart && currentMins < eveningEnd) {
        isOpen = true;
        const minsLeft = eveningEnd - currentMins;
        const hrsLeft = Math.floor(minsLeft / 60);
        const remMins = minsLeft % 60;
        statusText = 'OPEN NOW • EVENING SHIFT';
        pillText = '🟢 OPEN NOW (Till 10:00 PM)';
        nextEventText = `High-energy prime workout shift. Closes in ${hrsLeft > 0 ? hrsLeft + 'h ' : ''}${remMins}m (at 10:00 PM).`;
      } else {
        isOpen = false;
        statusText = 'CLOSED FOR THE NIGHT';
        pillText = '🔴 CLOSED (Opens 6:00 AM)';
        nextEventText = day === 6
          ? 'Gym closes for the week. Reopens Monday morning at 6:00 AM.'
          : 'Night rest period. Gym reopens tomorrow morning at 6:00 AM sharp.';
      }
    }

    // Format current IST time
    const timeString = ist.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });

    // Update Header Pill
    const navLivePill = document.getElementById('navLivePill');
    if (navLivePill) {
      navLivePill.innerHTML = `
        <span class="inline-block w-2 h-2 rounded-full ${isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'} mr-2"></span>
        <span>${pillText}</span>
      `;
      navLivePill.className = isOpen
        ? 'hidden md:inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/40 text-emerald-400 border border-emerald-500/30'
        : 'hidden md:inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-950/40 text-red-400 border border-red-500/30';
    }

    // Update Schedule Widget
    const scheduleLiveBadge = document.getElementById('scheduleLiveBadge');
    const scheduleTimeDisplay = document.getElementById('scheduleTimeDisplay');
    const scheduleNextEvent = document.getElementById('scheduleNextEvent');

    if (scheduleLiveBadge) {
      scheduleLiveBadge.innerHTML = `
        <span class="w-3 h-3 rounded-full ${isOpen ? 'bg-emerald-400 animate-ping' : 'bg-red-500'} mr-2"></span>
        <span class="font-bold tracking-wide">${statusText}</span>
      `;
      scheduleLiveBadge.className = isOpen
        ? 'inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-500/40 shadow-lg shadow-emerald-950/40'
        : 'inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold bg-red-950/60 text-red-400 border border-red-500/40 shadow-lg shadow-red-950/40';
    }

    if (scheduleTimeDisplay) {
      scheduleTimeDisplay.textContent = `${timeString} IST`;
    }

    if (scheduleNextEvent) {
      scheduleNextEvent.textContent = nextEventText;
    }
  }

  updateStatus();
  setInterval(updateStatus, 5000);
}

/* ==========================================================================
   2. INTERACTIVE BOOKING ENGINE & TRIAL PASS GENERATOR
   ========================================================================== */
function initBookingEngine() {
  const form = document.getElementById('trialBookingForm');
  const dateInput = document.getElementById('trialDate');
  const dateWarning = document.getElementById('dateWarning');
  const shiftRadios = document.querySelectorAll('input[name="shiftType"]');
  const morningSlotsContainer = document.getElementById('morningSlots');
  const eveningSlotsContainer = document.getElementById('eveningSlots');

  // Set default minimum date to today
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const minDateStr = `${yyyy}-${mm}-${dd}`;

  if (dateInput) {
    dateInput.min = minDateStr;

    // Default to tomorrow or today if not Sunday
    let defaultDate = new Date(today);
    if (defaultDate.getDay() === 0) {
      // If today is Sunday, set to Monday
      defaultDate.setDate(defaultDate.getDate() + 1);
    }
    const defY = defaultDate.getFullYear();
    const defM = String(defaultDate.getMonth() + 1).padStart(2, '0');
    const defD = String(defaultDate.getDate()).padStart(2, '0');
    dateInput.value = `${defY}-${defM}-${defD}`;

    // Validate Sunday selection
    dateInput.addEventListener('change', () => {
      validateDateSelection(dateInput.value);
    });
  }

  // Quick Date Chips
  const dateChips = document.querySelectorAll('.quick-date-chip');
  dateChips.forEach(chip => {
    chip.addEventListener('click', (e) => {
      e.preventDefault();
      dateChips.forEach(c => c.classList.remove('bg-red-600', 'text-white', 'border-red-500'));
      chip.classList.add('bg-red-600', 'text-white', 'border-red-500');

      const daysToAdd = parseInt(chip.getAttribute('data-days') || '0', 10);
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + daysToAdd);

      const tY = targetDate.getFullYear();
      const tM = String(targetDate.getMonth() + 1).padStart(2, '0');
      const tD = String(targetDate.getDate()).padStart(2, '0');
      const targetStr = `${tY}-${tM}-${tD}`;

      if (dateInput) {
        dateInput.value = targetStr;
        validateDateSelection(targetStr);
      }
    });
  });

  function validateDateSelection(dateStr) {
    if (!dateStr) return true;
    const parts = dateStr.split('-');
    const pickedDate = new Date(parts[0], parts[1] - 1, parts[2]);

    if (pickedDate.getDay() === 0) {
      if (dateWarning) {
        dateWarning.classList.remove('hidden');
      }
      return false;
    } else {
      if (dateWarning) {
        dateWarning.classList.add('hidden');
      }
      return true;
    }
  }

  // Shift Toggle (Morning vs Evening slots)
  shiftRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.value === 'morning') {
        morningSlotsContainer.classList.remove('hidden');
        eveningSlotsContainer.classList.add('hidden');
        const firstM = morningSlotsContainer.querySelector('input[type="radio"]');
        if (firstM) firstM.checked = true;
      } else {
        morningSlotsContainer.classList.add('hidden');
        eveningSlotsContainer.classList.remove('hidden');
        const firstE = eveningSlotsContainer.querySelector('input[type="radio"]');
        if (firstE) firstE.checked = true;
      }
    });
  });

  // Handle Form Submission
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('userName');
      const phoneInput = document.getElementById('userPhone');
      const selectedGoal = document.querySelector('input[name="fitnessGoal"]:checked');
      const selectedSlot = document.querySelector('input[name="timeSlot"]:checked');
      const selectedDate = dateInput ? dateInput.value : '';

      const name = nameInput ? nameInput.value.trim() : '';
      const phone = phoneInput ? phoneInput.value.trim() : '';
      const goal = selectedGoal ? selectedGoal.value : 'General Fitness';
      const slot = selectedSlot ? selectedSlot.value : '6:00 AM – 7:30 AM';

      // Validation
      if (!name || name.length < 2) {
        alert('Please enter your full name.');
        if (nameInput) nameInput.focus();
        return;
      }

      const cleanPhone = phone.replace(/\D/g, '');
      if (cleanPhone.length < 10) {
        alert('Please enter a valid 10-digit mobile number for WhatsApp pass confirmation.');
        if (phoneInput) phoneInput.focus();
        return;
      }

      if (!validateDateSelection(selectedDate)) {
        alert('P&P Fitness is closed on Sundays for muscle recovery. Please select Monday to Saturday.');
        return;
      }

      // Generate Pass ID
      const passId = `PPF-${Math.floor(1000 + Math.random() * 9000)}`;

      // Format Date for Display
      const dateParts = selectedDate.split('-');
      const dObj = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
      const dateDisplay = dObj.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });

      const passData = {
        passId,
        name,
        phone: cleanPhone,
        goal,
        slot,
        date: dateDisplay,
        rawDate: selectedDate,
        createdAt: new Date().toISOString()
      };

      // Save to localStorage
      try {
        localStorage.setItem('pp_fitness_trial_pass', JSON.stringify(passData));
      } catch (err) {
        console.warn('Storage error', err);
      }

      // Trigger Confetti Celebration
      triggerConfetti();

      // Show VIP Pass Modal
      showVipPassModal(passData);

      // Update banner
      updatePassBanner(passData);
    });
  }
}

/* ==========================================================================
   3. VIP PASS CONFIRMATION MODAL & WHATSAPP GENERATION
   ========================================================================== */
function showVipPassModal(pass) {
  const modal = document.getElementById('passConfirmationModal');
  if (!modal) return;

  // Populate pass fields
  const passIdEl = document.getElementById('modalPassId');
  const passNameEl = document.getElementById('modalUserName');
  const passDateSlotEl = document.getElementById('modalDateSlot');
  const passGoalEl = document.getElementById('modalGoal');
  const modalCongratTitle = document.getElementById('modalCongratTitle');
  const waDeskBtn = document.getElementById('modalWhatsAppBtn');

  if (passIdEl) passIdEl.textContent = pass.passId;
  if (passNameEl) passNameEl.textContent = pass.name;
  if (passDateSlotEl) passDateSlotEl.textContent = `${pass.date} • ${pass.slot}`;
  if (passGoalEl) passGoalEl.textContent = pass.goal;
  if (modalCongratTitle) {
    modalCongratTitle.textContent = `🎉 Congratulations, ${pass.name.split(' ')[0]}!`;
  }

  // Build WhatsApp Desk Link with prefilled parameters
  const waMessage = 
`Hi P&P Fitness Desk! 🏋️‍♂️

I have booked my Free 1-Day Trial Pass through your website:
🎟️ Pass ID: ${pass.passId}
👤 Name: ${pass.name}
📱 Mobile: +91 ${pass.phone}
🎯 Fitness Goal: ${pass.goal}
📅 Reserved Date: ${pass.date}
⏰ Workout Slot: ${pass.slot}
📍 Gym Location: Bajrang Chowk, CIDCO N 8, Chh. Sambhajinagar

Please confirm my free trial pass. Excited to visit the floor!`;

  const waUrl = `https://wa.me/919356560838?text=${encodeURIComponent(waMessage)}`;
  if (waDeskBtn) {
    waDeskBtn.href = waUrl;
  }

  // Open modal
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closePassModal() {
  const modal = document.getElementById('passConfirmationModal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

// Print / Save Pass
function printPassTicket() {
  window.print();
}

// Check existing saved pass on load
function initCheckExistingPass() {
  try {
    const saved = localStorage.getItem('pp_fitness_trial_pass');
    if (saved) {
      const pass = JSON.parse(saved);
      updatePassBanner(pass);
    }
  } catch (e) {
    console.warn(e);
  }
}

function updatePassBanner(pass) {
  const banner = document.getElementById('activePassBanner');
  const passCode = document.getElementById('bannerPassCode');
  const viewBtn = document.getElementById('bannerViewPassBtn');

  if (banner && passCode) {
    passCode.textContent = pass.passId;
    banner.classList.remove('hidden');

    if (viewBtn) {
      viewBtn.onclick = (e) => {
        e.preventDefault();
        showVipPassModal(pass);
      };
    }
  }
}

/* ==========================================================================
   4. CONFETTI CELEBRATION EFFECT
   ========================================================================== */
function triggerConfetti() {
  if (typeof confetti === 'function') {
    // Red, White, Charcoal branded athletic confetti burst
    const colors = ['#E53935', '#FFFFFF', '#DC2626', '#FF5252', '#F87171'];
    
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: colors
    });

    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });
    }, 250);
  }
}

/* ==========================================================================
   5. MEMBERSHIP PRICING TOGGLE ENGINE
   ========================================================================== */
function initPricingToggle() {
  const toggleBtns = document.querySelectorAll('.pricing-tab-btn');
  const planCards = {
    silver: {
      priceEl: document.getElementById('priceSilver'),
      periodEl: document.getElementById('periodSilver'),
      waBtn: document.getElementById('waSilverBtn')
    },
    gold: {
      priceEl: document.getElementById('priceGold'),
      periodEl: document.getElementById('periodGold'),
      waBtn: document.getElementById('waGoldBtn')
    },
    platinum: {
      priceEl: document.getElementById('pricePlatinum'),
      periodEl: document.getElementById('periodPlatinum'),
      waBtn: document.getElementById('waPlatinumBtn')
    }
  };

  const pricingData = {
    monthly: {
      silver: { price: '₹1,500', period: '/ month', note: 'Standard 1-Month Access' },
      gold: { price: '₹1,600', period: '/ month', note: 'Billed monthly' },
      platinum: { price: '₹2,200', period: '/ month', note: 'All-inclusive monthly' }
    },
    quarterly: {
      silver: { price: '₹3,900', period: '/ 3 months', note: '₹1,300/mo equivalent' },
      gold: { price: '₹3,800', period: '/ 3 months', note: 'Special ₹1,266/mo (Save ₹1,000)' },
      platinum: { price: '₹5,500', period: '/ 3 months', note: '₹1,833/mo with nutrition' }
    },
    biannual: {
      silver: { price: '₹6,800', period: '/ 6 months', note: '₹1,133/mo equivalent' },
      gold: { price: '₹6,500', period: '/ 6 months', note: 'Best Value (Save ₹2,500)' },
      platinum: { price: '₹9,800', period: '/ 6 months', note: 'Includes 1-on-1 PT Guidance' }
    },
    annual: {
      silver: { price: '₹11,999', period: '/ 12 months', note: '₹1,000/mo equivalent' },
      gold: { price: '₹11,500', period: '/ 12 months', note: 'Elite Year Pass (Best ROI)' },
      platinum: { price: '₹16,999', period: '/ 12 months', note: 'Complete 365-Day Transformation' }
    }
  };

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      toggleBtns.forEach(b => {
        b.classList.remove('bg-red-600', 'text-white', 'shadow-lg', 'shadow-red-950/40');
        b.classList.add('text-slate-400', 'hover:text-white');
      });
      btn.classList.add('bg-red-600', 'text-white', 'shadow-lg', 'shadow-red-950/40');
      btn.classList.remove('text-slate-400');

      const mode = btn.getAttribute('data-plan') || 'quarterly';
      const data = pricingData[mode];

      if (!data) return;

      // Update Silver
      if (planCards.silver.priceEl) {
        planCards.silver.priceEl.textContent = data.silver.price;
        planCards.silver.periodEl.textContent = data.silver.period;
        updateWaLink(planCards.silver.waBtn, 'Silver Plan', data.silver.price, data.silver.period);
      }

      // Update Gold
      if (planCards.gold.priceEl) {
        planCards.gold.priceEl.textContent = data.gold.price;
        planCards.gold.periodEl.textContent = data.gold.period;
        updateWaLink(planCards.gold.waBtn, 'Gold Plan (Most Popular)', data.gold.price, data.gold.period);
      }

      // Update Platinum
      if (planCards.platinum.priceEl) {
        planCards.platinum.priceEl.textContent = data.platinum.price;
        planCards.platinum.periodEl.textContent = data.platinum.period;
        updateWaLink(planCards.platinum.waBtn, 'Platinum Transformation Plan', data.platinum.price, data.platinum.period);
      }
    });
  });

  function updateWaLink(btn, planName, price, period) {
    if (!btn) return;
    const msg = `Hi P&P Fitness! I am interested in joining the ${planName} (${price} ${period}) at Bajrang Chowk branch. Please share membership registration details.`;
    btn.href = `https://wa.me/919356560838?text=${encodeURIComponent(msg)}`;
  }
}

/* ==========================================================================
   6. INTERACTIVE UNISEX FITNESS & PROTEIN CALCULATOR (BONUS TOOL)
   ========================================================================== */
function initFitnessCalculator() {
  const calcForm = document.getElementById('fitnessCalculatorForm');
  if (!calcForm) return;

  calcForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const gender = document.querySelector('input[name="calcGender"]:checked')?.value || 'male';
    const weight = parseFloat(document.getElementById('calcWeight')?.value || '0');
    const height = parseFloat(document.getElementById('calcHeight')?.value || '0');
    const goal = document.getElementById('calcGoal')?.value || 'fat_loss';

    if (!weight || weight < 30 || weight > 200) {
      alert('Please enter a realistic weight (30 - 200 kg).');
      return;
    }
    if (!height || height < 120 || height > 230) {
      alert('Please enter a realistic height (120 - 230 cm).');
      return;
    }

    // BMI Calculation
    const heightM = height / 100;
    const bmi = (weight / (heightM * heightM)).toFixed(1);

    let bmiCategory = '';
    let bmiColor = '';
    if (bmi < 18.5) {
      bmiCategory = 'Underweight (Mass Gain Needed)';
      bmiColor = 'text-amber-400';
    } else if (bmi < 24.9) {
      bmiCategory = 'Normal / Athletic Range';
      bmiColor = 'text-emerald-400';
    } else if (bmi < 29.9) {
      bmiCategory = 'Overweight (Body Recomp)';
      bmiColor = 'text-orange-400';
    } else {
      bmiCategory = 'Obesity Zone (Targeted Fat Burn)';
      bmiColor = 'text-red-400';
    }

    // Daily Water Goal: ~35ml per kg body weight
    const waterGoal = ((weight * 35) / 1000).toFixed(1);

    // Protein calculation:
    // Muscle gain: 1.8 - 2.0g per kg
    // Fat loss: 1.6 - 1.8g per kg
    // Maintenance: 1.2 - 1.4g per kg
    let proteinMultiplier = 1.6;
    let calorieBase = weight * 24;

    if (goal === 'muscle_gain') {
      proteinMultiplier = 1.9;
      calorieBase = (calorieBase * 1.4) + 300;
    } else if (goal === 'fat_loss') {
      proteinMultiplier = 1.7;
      calorieBase = (calorieBase * 1.3) - 350;
    } else if (goal === 'crossfit') {
      proteinMultiplier = 1.8;
      calorieBase = calorieBase * 1.45;
    } else {
      proteinMultiplier = 1.3;
      calorieBase = calorieBase * 1.3;
    }

    const proteinGrams = Math.round(weight * proteinMultiplier);
    const dailyCalories = Math.round(calorieBase);

    // Render results
    const resultsContainer = document.getElementById('calcResults');
    const resBmi = document.getElementById('resBmi');
    const resBmiCategory = document.getElementById('resBmiCategory');
    const resCalories = document.getElementById('resCalories');
    const resProtein = document.getElementById('resProtein');
    const resWater = document.getElementById('resWater');

    if (resBmi) resBmi.textContent = bmi;
    if (resBmiCategory) {
      resBmiCategory.textContent = bmiCategory;
      resBmiCategory.className = `text-sm font-semibold ${bmiColor}`;
    }
    if (resCalories) resCalories.textContent = `${dailyCalories} kcal`;
    if (resProtein) resProtein.textContent = `${proteinGrams} g`;
    if (resWater) resWater.textContent = `${waterGoal} L`;

    if (resultsContainer) {
      resultsContainer.classList.remove('hidden');
      resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });
}

/* ==========================================================================
   7. MOBILE NAVIGATION & SCROLL HIGHLIGHT
   ========================================================================== */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const closeBtn = document.getElementById('mobileMenuClose');
  const mobileDrawer = document.getElementById('mobileMenuDrawer');
  const navLinks = document.querySelectorAll('.mobile-nav-link');

  if (menuBtn && mobileDrawer) {
    menuBtn.addEventListener('click', () => {
      mobileDrawer.classList.remove('-translate-x-full');
      document.body.style.overflow = 'hidden';
    });
  }

  if (closeBtn && mobileDrawer) {
    closeBtn.addEventListener('click', () => {
      mobileDrawer.classList.add('-translate-x-full');
      document.body.style.overflow = '';
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileDrawer) {
        mobileDrawer.classList.add('-translate-x-full');
        document.body.style.overflow = '';
      }
    });
  });
}

/* ==========================================================================
   8. NAVBAR SCROLL BACKGROUND & ACTIVE LINK
   ========================================================================== */
function initNavbarScroll() {
  const header = document.getElementById('mainHeader');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('bg-black/95', 'backdrop-blur-xl', 'border-b', 'border-red-950/30', 'shadow-xl');
      header.classList.remove('bg-transparent');
    } else {
      header.classList.remove('bg-black/95', 'backdrop-blur-xl', 'border-b', 'border-red-950/30', 'shadow-xl');
      header.classList.add('bg-transparent');
    }
  });
}

// Global modal close handlers
window.closePassModal = closePassModal;
window.printPassTicket = printPassTicket;
