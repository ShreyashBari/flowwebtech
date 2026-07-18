
if(window.gsap){
gsap.registerPlugin(ScrollTrigger);
gsap.from(".hero h1",{y:120,opacity:0,duration:1.2});
document.querySelectorAll(".card,.section h2").forEach(el=>{
gsap.from(el,{y:80,opacity:0,scrollTrigger:{trigger:el,start:"top 85%"}});
});
}
const c=document.getElementById("bg");
console.log("Canvas element:", c);
console.log("THREE library:", window.THREE);
if(c && window.THREE){
  console.log("Initializing Three.js sphere...");
  const scene=new THREE.Scene();
  
  // Size according to the canvas layout size
  let w = c.clientWidth || window.innerWidth;
  let h = c.clientHeight || window.innerHeight;

  const camera=new THREE.PerspectiveCamera(75,w/h,.1,1000);
  const renderer=new THREE.WebGLRenderer({canvas:c,alpha:true,antialias:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Robust resize function to calculate correct aspect and dimensions
  function resize() {
    w = c.clientWidth || window.innerWidth;
    h = c.clientHeight || window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h); // Set drawing buffer size and style
  }

  // Initial sizing call
  resize();
  window.addEventListener("resize", resize);

  const geo=new THREE.IcosahedronGeometry(2,1);
  const mat=new THREE.MeshBasicMaterial({color:0x00e5ff,wireframe:true,transparent:true,opacity:0.4});
  const mesh=new THREE.Mesh(geo,mat);
  scene.add(mesh);
  camera.position.z=5;

  console.log("Sphere successfully added to scene:", mesh);

  // Animation loop
  (function animate(){
    requestAnimationFrame(animate);
    mesh.rotation.x+=.003;
    mesh.rotation.y+=.005;
    renderer.render(scene,camera);
  })();
}

// ============================================================================
// Premium Custom Feedback Modal Component (Vanilla JS State Managed)
// ============================================================================
class FeedbackModal {
  constructor(options = {}) {
    this.type = options.type || 'success'; // 'success' or 'error'
    this.title = options.title || 'Message Sent Successfully!';
    this.message = options.message || '';
    this.onClose = options.onClose || null;
    this.onAction = options.onAction || null; // e.g., Retry callback
    this.autoCloseDuration = options.autoCloseDuration !== undefined ? options.autoCloseDuration : (this.type === 'success' ? 5000 : 0);
    
    this.autoCloseTimer = null;
    this.overlay = null;
    this.focusableElements = [];
    this.firstFocusable = null;
    this.lastFocusable = null;
    
    // Bind event handlers
    this.escHandler = this.handleEsc.bind(this);
    this.tabHandler = this.handleTab.bind(this);
  }

  createMarkup() {
    this.overlay = document.createElement('div');
    this.overlay.className = 'modal-overlay';
    this.overlay.setAttribute('role', 'dialog');
    this.overlay.setAttribute('aria-modal', 'true');
    this.overlay.setAttribute('aria-labelledby', 'modal-title');
    this.overlay.setAttribute('aria-describedby', 'modal-desc');

    const card = document.createElement('div');
    card.className = 'modal-box';

    const closeXBtn = document.createElement('button');
    closeXBtn.className = 'close-btn';
    closeXBtn.setAttribute('aria-label', 'Close dialog');
    closeXBtn.innerHTML = '&times;';

    const iconContainer = document.createElement('div');
    iconContainer.className = 'icon-container';

    const checkmarkCircle = document.createElement('div');
    if (this.type === 'success') {
      checkmarkCircle.className = 'checkmark-circle';
      checkmarkCircle.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      `;
    } else {
      checkmarkCircle.className = 'checkmark-circle error';
      checkmarkCircle.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      `;
    }
    iconContainer.appendChild(checkmarkCircle);

    const titleEl = document.createElement('h2');
    titleEl.id = 'modal-title';
    titleEl.className = 'modal-title';
    titleEl.textContent = this.title;

    const descEl = document.createElement('p');
    descEl.id = 'modal-desc';
    descEl.className = 'modal-text';
    descEl.innerHTML = this.message;

    const actionBtn = document.createElement('button');
    if (this.type === 'success') {
      actionBtn.className = 'done-btn';
      actionBtn.textContent = 'Done';
    } else {
      actionBtn.className = 'done-btn error';
      actionBtn.textContent = 'Retry';
    }

    card.appendChild(closeXBtn);
    card.appendChild(iconContainer);
    card.appendChild(titleEl);
    card.appendChild(descEl);
    card.appendChild(actionBtn);

    this.overlay.appendChild(card);
    document.body.appendChild(this.overlay);

    // Event listeners
    closeXBtn.addEventListener('click', () => this.close());
    
    actionBtn.addEventListener('click', () => {
      this.close();
      if (this.onAction) this.onAction();
    });

    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) {
        this.close();
      }
    });

    // Accessibility focus elements mapping for trapping focus
    this.focusableElements = Array.from(card.querySelectorAll('button, [tabindex="0"]'));
    this.firstFocusable = this.focusableElements[0];
    this.lastFocusable = this.focusableElements[this.focusableElements.length - 1];
  }

  show() {
    this.createMarkup();
    
    // Prevent background body scrolling
    document.body.style.overflow = 'hidden';

    // Event listeners for keyboard handling
    document.addEventListener('keydown', this.escHandler);
    this.overlay.addEventListener('keydown', this.tabHandler);

    // Set initial focus
    if (this.firstFocusable) {
      setTimeout(() => this.firstFocusable.focus(), 50);
    }

    // Trigger transition animation
    setTimeout(() => {
      this.overlay.classList.add('active');
    }, 50);

    // Success auto-close timer (Success modals only)
    if (this.type === 'success' && this.autoCloseDuration > 0) {
      this.autoCloseTimer = setTimeout(() => {
        this.close();
      }, this.autoCloseDuration);
    }
  }

  close() {
    if (this.autoCloseTimer) {
      clearTimeout(this.autoCloseTimer);
    }

    // Remove event listeners
    document.removeEventListener('keydown', this.escHandler);
    if (this.overlay) {
      this.overlay.removeEventListener('keydown', this.tabHandler);
      this.overlay.classList.remove('active');
    }

    // Re-enable page scrolling
    document.body.style.overflow = '';

    // Wait for fade animation before destroying DOM element
    setTimeout(() => {
      if (this.overlay) {
        this.overlay.remove();
        this.overlay = null;
      }
      if (this.onClose) this.onClose();
    }, 450);
  }

  handleEsc(e) {
    if (e.key === 'Escape') {
      this.close();
    }
  }

  handleTab(e) {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      // Shift + Tab: if focus is on first, wrap to last
      if (document.activeElement === this.firstFocusable) {
        e.preventDefault();
        this.lastFocusable.focus();
      }
    } else {
      // Tab: if focus is on last, wrap to first
      if (document.activeElement === this.lastFocusable) {
        e.preventDefault();
        this.firstFocusable.focus();
      }
    }
  }
}

// Global legacy wrapper for newsletter forms in HTML pages
function showCustomPopup(title, message, isSuccess = true, callback = null) {
  const modal = new FeedbackModal({
    type: isSuccess ? 'success' : 'error',
    title: title,
    message: message,
    onClose: callback
  });
  modal.show();
}
window.showCustomPopup = showCustomPopup;
window.FeedbackModal = FeedbackModal;

// Contact form submission with AJAX and email dispatch via FormSubmit
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  console.log("Contact form detected. Initializing AJAX submission handler...");

  // Mimic React states for status tracking
  let showSuccessModal = false;
  let showErrorModal = false;
  let isSubmitting = false;

  const setIsSubmitting = (value) => {
    isSubmitting = value;
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    if (submitBtn) {
      if (isSubmitting) {
        submitBtn.innerText = "Sending...";
        submitBtn.disabled = true;
      } else {
        submitBtn.innerText = "Send Message";
        submitBtn.disabled = false;
      }
    }
  };

  const setShowSuccessModal = (value) => {
    showSuccessModal = value;
    if (showSuccessModal) {
      const success = new FeedbackModal({
        type: 'success',
        title: 'Message Sent Successfully!',
        message: "Thank you for contacting us.<br>Our team has received your message and will get back to you shortly.",
        autoCloseDuration: 3000,
        onClose: () => {
          showSuccessModal = false;
        }
      });
      success.show();
    }
  };

  const setShowErrorModal = (value) => {
    showErrorModal = value;
    if (showErrorModal) {
      const error = new FeedbackModal({
        type: 'error',
        title: 'Message Sending Failed',
        message: 'Something went wrong.<br>Please try again in a few moments.',
        autoCloseDuration: 0,
        onClose: () => {
          showErrorModal = false;
        },
        onAction: () => {
          // Re-trigger submit event for Retry action
          contactForm.dispatchEvent(new Event('submit'));
        }
      });
      error.show();
    }
  };

  const resetForm = () => {
    contactForm.reset();
    contactForm.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Prevent duplicate submissions
    if (isSubmitting) return;

    const formData = new FormData(contactForm);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    setIsSubmitting(true);

    // Use formsubmit.co's free AJAX endpoint
    fetch('https://formsubmit.co/ajax/flowwebtech.ai@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(async response => {
      let result = {};
      try {
        result = await response.json();
      } catch (err) {}
      
      if (!response.ok) {
        throw new Error(result.message || 'Response error');
      }
      return result;
    })
    .then(result => {
      console.log("Email sent status:", result);
      // Verify standard FormSubmit success key
      if (result && (result.success === true || result.success === "true" || result.success === "True")) {
        console.log("Success modal opened");
        setIsSubmitting(false);
        setShowSuccessModal(true);
        resetForm();
      } else {
        throw new Error(result.message || 'Submission rejected by backend');
      }
    })
    .catch(error => {
      console.error('Error sending message:', error);
      setIsSubmitting(false);
      
      // Check if it is a FormSubmit activation warning
      const errorMsg = error.message ? error.message.toLowerCase() : '';
      if (errorMsg.includes('activate') || errorMsg.includes('confirm') || errorMsg.includes('verification')) {
        const activation = new FeedbackModal({
          type: 'error',
          title: 'Activation Required',
          message: 'FormSubmit.co needs to verify your inbox.<br><br>Please check <strong>flowwebtech.ai@gmail.com</strong> (and your spam folder) and click the activation link.',
          autoCloseDuration: 0,
          onClose: () => {}
        });
        activation.show();
      } else {
        setShowErrorModal(true);
      }
    });
  });
}

// Filter services functionality
const serviceChips = document.querySelectorAll(".service-chip");
const serviceCards = document.querySelectorAll(".service-card");

if (serviceChips.length > 0 && serviceCards.length > 0) {
  console.log("Initializing service cards filter...");
  serviceChips.forEach(chip => {
    chip.addEventListener("click", () => {
      // Remove active class from all chips
      serviceChips.forEach(c => c.classList.remove("active"));
      // Add active class to clicked chip
      chip.classList.add("active");

      const filterValue = chip.getAttribute("data-filter");
      let count = 0;

      serviceCards.forEach(card => {
        const category = card.getAttribute("data-category");
        if (filterValue === "all" || category === filterValue) {
          card.style.display = "grid";
          count++;
          if (window.gsap) {
            gsap.fromTo(card, { opacity: 0, y: 30, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 0.4 });
          } else {
            card.style.opacity = "1";
          }
        } else {
          card.style.display = "none";
        }
      });

      // Update the summary count text dynamically
      const summaryText = document.querySelector(".service-summary p");
      if (summaryText) {
        summaryText.textContent = `${count} Solution${count === 1 ? '' : 's'} Available`;
      }
    });
  });
}

// ============================================================================
// Dynamic Mobile Navigation Hamburger Menu Injection
// ============================================================================
document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector(".nav");
  const links = document.querySelector(".links");
  
  if (nav && links) {
    // Create hamburger toggle button
    const toggleBtn = document.createElement("button");
    toggleBtn.className = "nav-toggle";
    toggleBtn.setAttribute("aria-label", "Toggle navigation");
    toggleBtn.innerHTML = `
      <span class="bar"></span>
      <span class="bar"></span>
      <span class="bar"></span>
    `;
    
    nav.appendChild(toggleBtn);
    
    // Toggle active classes on click
    toggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      links.classList.toggle("nav-active");
      toggleBtn.classList.toggle("toggle-active");
    });
    
    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (links.classList.contains("nav-active") && !nav.contains(e.target)) {
        links.classList.remove("nav-active");
        toggleBtn.classList.remove("toggle-active");
      }
    });

    // Close menu on link clicks
    links.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        links.classList.remove("nav-active");
        toggleBtn.classList.remove("toggle-active");
      });
    });
  }
});

