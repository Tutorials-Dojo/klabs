// Animate stats numbers
function animateStats() {
    const stats = document.querySelectorAll('.stat-number[data-target]');
    
    stats.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const increment = target / 100;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            stat.textContent = Math.floor(current).toLocaleString();
        }, 20);
    });
}

// Intersection Observer for animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && entry.target.classList.contains('stats')) {
            animateStats();
            observer.unobserve(entry.target);
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        observer.observe(statsSection);
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add some interactive effects
    document.addEventListener('mousemove', (e) => {
        const hero = document.querySelector('.hero');
        if (hero) {
            const rect = hero.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            
            hero.style.transform = `rotateX(${y * 2}deg) rotateY(${x * 2}deg)`;
        }
    });

    // Reset hero transform when mouse leaves
    const heroElement = document.querySelector('.hero');
    if (heroElement) {
        heroElement.addEventListener('mouseleave', () => {
            heroElement.style.transform = 'rotateX(0) rotateY(0)';
        });
    }
});

// Start session function - FIXED
function startSession() {
    // Show loading animation
    const button = event.target.closest('button') || event.target.closest('.cta-button');
    const originalText = button ? button.innerHTML : '';
    
    if (button) {
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Launching...';
        button.disabled = true;
    }
    
    // Make API call to start session
    fetch('/api/session/start', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to start session');
        }
        return response.json();
    })
    .then(session => {
        // Redirect to lab page after successful session creation
        window.location.href = '/lab.html';
    })
    .catch(error => {
        console.error('Error starting session:', error);
        alert('Failed to start session. Please try again.');
        if (button) {
            button.innerHTML = originalText;
            button.disabled = false;
        }
    });
}

// Show help function
function showHelp() {
    alert(`Welcome to TD Kubernetes Labs!

Getting Started:
1. Click "Start Learning" to begin your session
2. Create Kubernetes instances using the interface
3. Use kubectl commands in the terminal
4. Each session lasts 15 minutes

Need more help? Check our documentation or join our Discord community!`);
}