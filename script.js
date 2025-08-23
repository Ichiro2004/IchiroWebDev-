document.addEventListener('DOMContentLoaded', function() {
      // Navbar scroll effect
      const navbar = document.getElementById('navbar');
      window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      });

      // Mobile menu toggle
      const menuToggle = document.querySelector('.menu-toggle');
      const navList = document.querySelector('nav ul');
      
      menuToggle.addEventListener('click', () => {
        navList.classList.toggle('active');
        menuToggle.innerHTML = navList.classList.contains('active') ? 
          '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        menuToggle.setAttribute('aria-expanded', navList.classList.contains('active'));
      });

      // Close mobile menu when clicking a link
      document.querySelectorAll('nav ul li a').forEach(link => {
        link.addEventListener('click', () => {
          navList.classList.remove('active');
          menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
          menuToggle.setAttribute('aria-expanded', 'false');
        });
      });

      // Smooth scrolling for anchor links
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
          e.preventDefault();
          
          const targetId = this.getAttribute('href');
          const targetElement = document.querySelector(targetId);
          
          if (targetElement) {
            window.scrollTo({
              top: targetElement.offsetTop - 70,
              behavior: 'smooth'
            });
          }
        });
      });

      // Back to top button
      const backToTopBtn = document.querySelector('.back-to-top');
      window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
          backToTopBtn.classList.add('active');
        } else {
          backToTopBtn.classList.remove('active');
        }
      });

      backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });

      // Form submission with AJAX
      const contactForm = document.getElementById('contactForm');
      const formStatus = document.getElementById('form-status');
      
      if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
          e.preventDefault();
          
          const submitBtn = contactForm.querySelector('button[type="submit"]');
          const originalBtnText = submitBtn.textContent;
          
          // Show loading state
          submitBtn.textContent = 'Sending...';
          submitBtn.disabled = true;
          
          try {
            const formData = new FormData(contactForm);
            
            const response = await fetch(contactForm.action, {
              method: 'POST',
              body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
              formStatus.textContent = result.message || 'Message sent successfully!';
              formStatus.className = 'form-status success';
              contactForm.reset();
            } else {
              formStatus.textContent = result.message || 'There was an error sending your message. Please try again.';
              formStatus.className = 'form-status error';
            }
          } catch (error) {
            formStatus.textContent = 'There was an error sending your message. Please try again.';
            formStatus.className = 'form-status error';
          } finally {
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
            
            // Scroll to form status
            formStatus.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        });
      }

      // Animate skill bars when they come into view
      const skillBars = document.querySelectorAll('.skill-progress');
      
      function animateSkillBars() {
        skillBars.forEach(bar => {
          const width = bar.getAttribute('data-width');
          bar.style.width = width;
        });
      }

      // Intersection Observer for animations
      const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            if (entry.target.id === 'about') {
              animateSkillBars();
            }
            entry.target.style.opacity = 1;
            entry.target.style.transform = 'translateY(0)';
          }
        });
      }, observerOptions);

      // Observe sections for smooth appearance
      document.querySelectorAll('section').forEach(section => {
        section.style.opacity = 0;
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
      });

      // Video Player Functionality
      function initVideoPlayers() {
        const videos = document.querySelectorAll('.video-container video');
        const playButtons = document.querySelectorAll('.video-btn.play-pause');
        const volumeButtons = document.querySelectorAll('.video-btn.volume');
        const progressBars = document.querySelectorAll('.video-progress-filled');
        
        // Play/Pause functionality
        playButtons.forEach(button => {
          button.addEventListener('click', function() {
            const videoId = this.getAttribute('data-video');
            const video = document.getElementById(videoId);
            const icon = this.querySelector('i');
            
            if (video.paused) {
              video.play();
              icon.classList.remove('fa-play');
              icon.classList.add('fa-pause');
            } else {
              video.pause();
              icon.classList.remove('fa-pause');
              icon.classList.add('fa-play');
            }
          });
        });
        
        // Volume toggle
        volumeButtons.forEach(button => {
          button.addEventListener('click', function() {
            const videoId = this.getAttribute('data-video');
            const video = document.getElementById(videoId);
            const icon = this.querySelector('i');
            
            if (video.muted) {
              video.muted = false;
              icon.classList.remove('fa-volume-mute');
              icon.classList.add('fa-volume-up');
            } else {
              video.muted = true;
              icon.classList.remove('fa-volume-up');
              icon.classList.add('fa-volume-mute');
            }
          });
        });
        
        // Update progress bars
        videos.forEach((video, index) => {
          video.addEventListener('timeupdate', function() {
            const percent = (this.currentTime / this.duration) * 100;
            progressBars[index].style.width = `${percent}%`;
          });
          
          // Click on progress bar to seek
          const progressContainer = video.parentElement.querySelector('.video-progress');
          progressContainer.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const width = rect.width;
            video.currentTime = (clickX / width) * video.duration;
          });
          
          // Reset play button when video ends
          video.addEventListener('ended', function() {
            const button = document.querySelector(`.video-btn.play-pause[data-video="${this.id}"]`);
            const icon = button.querySelector('i');
            icon.classList.remove('fa-pause');
            icon.classList.add('fa-play');
          });
        });
      }
      
      // Initialize video players
      initVideoPlayers();

      // 3D Background with Three.js - only on desktop
      function initThreeJS() {
        try {
          const scene = new THREE.Scene();
          const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
          const renderer = new THREE.WebGLRenderer({ 
            alpha: true, 
            antialias: true,
            powerPreference: "high-performance"
          });
          renderer.setSize(window.innerWidth, window.innerHeight);
          renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
          document.getElementById('threejs-background').appendChild(renderer.domElement);

          // Create stars
          const starsGeometry = new THREE.BufferGeometry();
          const starCount = window.innerWidth > 768 ? 2000 : 500; // Reduce stars on mobile
          
          const positions = new Float32Array(starCount * 3);
          
          for (let i = 0; i < starCount; i++) {
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * 2000;
            positions[i3 + 1] = (Math.random() - 0.5) * 2000;
            positions[i3 + 2] = (Math.random() - 0.5) * 2000;
          }
          
          starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
          
          const starsMaterial = new THREE.PointsMaterial({
            size: 1.5,
            color: 0x4acfee,
            transparent: true,
            opacity: 0.8,
            sizeAttenuation: true
          });
          
          const stars = new THREE.Points(starsGeometry, starsMaterial);
          scene.add(stars);
          
          camera.position.z = 500;
          
          // Animation
          function animate() {
            requestAnimationFrame(animate);
            
            stars.rotation.x += 0.0002;
            stars.rotation.y += 0.0002;
            
            renderer.render(scene, camera);
          }
          
          animate();
          
          // Handle window resize
          function handleResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
          }
          
          window.addEventListener('resize', handleResize);
          
          // Cleanup function
          return function() {
            window.removeEventListener('resize', handleResize);
            document.getElementById('threejs-background').removeChild(renderer.domElement);
          };
        } catch (e) {
          console.error("Three.js initialization failed:", e);
          return function() {};
        }
      }

      // Create floating bubbles
      function createBubbles() {
        const bubblesContainer = document.getElementById('bubbles');
        const bubbleCount = window.innerWidth > 768 ? 15 : 5; // Fewer bubbles on mobile
        
        for (let i = 0; i < bubbleCount; i++) {
          const bubble = document.createElement('div');
          bubble.classList.add('bubble');
          
          // Random size between 10 and 100px
          const size = Math.random() * 90 + 10;
          bubble.style.width = `${size}px`;
          bubble.style.height = `${size}px`;
          
          // Random position
          bubble.style.left = `${Math.random() * 100}%`;
          
          // Random animation duration between 5 and 15s
          const duration = Math.random() * 10 + 5;
          bubble.style.animationDuration = `${duration}s`;
          
          // Random delay
          bubble.style.animationDelay = `${Math.random() * 5}s`;
          
          bubblesContainer.appendChild(bubble);
        }
      }
      
      // Initialize Three.js background and bubbles only on desktop
      let cleanupThreeJS = function() {};
      
      if (window.innerWidth > 768) {
        cleanupThreeJS = initThreeJS();
        createBubbles();
      }

      // Handle window resize for background effects
      window.addEventListener('resize', function() {
        if (window.innerWidth <= 768) {
          cleanupThreeJS();
        } else if (document.getElementById('threejs-background').children.length === 0) {
          cleanupThreeJS = initThreeJS();
        }
      });

      // Button hover effects
      const buttons = document.querySelectorAll('.hero-btn');
      buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
          this.style.transform = 'translateY(-5px)';
        });
        
        button.addEventListener('mouseleave', function() {
          if (!this.classList.contains('hero-btn-primary')) {
            this.style.transform = 'translateY(0)';
          }
        });

        // Touch feedback for mobile
        button.addEventListener('touchstart', function() {
          this.style.transform = 'scale(0.95)';
        });

        button.addEventListener('touchend', function() {
          this.style.transform = 'scale(1)';
        });
      });
      
      // Social link hover effects
      const socialLinks = document.querySelectorAll('.social-link');
      socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
          this.style.transform = 'translateY(-5px) scale(1.1)';
        });
        
        link.addEventListener('mouseleave', function() {
          this.style.transform = 'translateY(0) scale(1)';
        });

        // Touch feedback for mobile
        link.addEventListener('touchstart', function() {
          this.style.transform = 'scale(0.95)';
        });

        link.addEventListener('touchend', function() {
          this.style.transform = 'scale(1)';
        });
      });
      
      // Button click effects
      buttons.forEach(button => {
        button.addEventListener('mousedown', function() {
          this.style.transform = 'translateY(2px)';
        });
        
        button.addEventListener('mouseup', function() {
          this.style.transform = 'translateY(-3px)';
        });
      });

      // Profile picture modal
      const profilePic = document.querySelector('.profile-pic-container');
      const modal = document.getElementById('profile-modal');
      const modalImg = document.getElementById('modal-image');
      const closeModal = document.querySelector('.close-modal');

      if (profilePic && modal && modalImg && closeModal) {
        profilePic.addEventListener('click', function() {
          modal.style.display = 'flex';
          modalImg.src = this.querySelector('img').src;
          document.body.style.overflow = 'hidden';
        });

        profilePic.addEventListener('keydown', function(e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            modal.style.display = 'flex';
            modalImg.src = this.querySelector('img').src;
            document.body.style.overflow = 'hidden';
          }
        });

        closeModal.addEventListener('click', function() {
          modal.style.display = 'none';
          document.body.style.overflow = 'auto';
        });

        window.addEventListener('click', function(event) {
          if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
          }
        });

        window.addEventListener('keydown', function(e) {
          if (e.key === 'Escape' && modal.style.display === 'flex') {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
          }
        });
      }

      // View Projects button scroll
      const viewProjectsBtn = document.querySelector('.hero-btn-outline');
      if (viewProjectsBtn) {
        viewProjectsBtn.addEventListener('click', (e) => {
          e.preventDefault();
          document.querySelector('#projects').scrollIntoView({
            behavior: 'smooth'
          });
        });
      }

      // Hire Me button scroll
      const hireMeBtn = document.querySelector('.hero-btn-primary');
      if (hireMeBtn) {
        hireMeBtn.addEventListener('click', (e) => {
          e.preventDefault();
          document.querySelector('#contact').scrollIntoView({
            behavior: 'smooth'
          });
        });
      }

      // Project card touch events for mobile
      const projectCards = document.querySelectorAll('.project-card');
      projectCards.forEach(card => {
        card.addEventListener('touchstart', function() {
          this.classList.add('active');
        });

        card.addEventListener('touchend', function() {
          this.classList.remove('active');
        });
      });

      // Performance optimization - reduce animations on mobile
      if (window.innerWidth <= 768) {
        document.querySelectorAll('.skill-card, .project-card').forEach(card => {
          card.style.transform = 'none';
          card.style.transition = 'none';
        });
      }

      // Initialize skill bars with 0 width
      skillBars.forEach(bar => {
        bar.style.width = '0';
      });
    });