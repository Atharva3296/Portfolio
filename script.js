
class PortfolioManager {
  constructor() {
    this.currentTheme = "light"
    this.currentRoleIndex = 0
    this.isAnimating = false
    this.projectsData = this.getProjectsData()

    this.initializePortfolio()
  }

  // Initialize all portfolio functionality
  initializePortfolio() {
    document.addEventListener("DOMContentLoaded", () => {
      this.setupThemeToggle()
      this.loadSavedTheme()
      this.startRoleRotation()
      this.setupProjectFilters()
      this.setupContactForm()
      this.setupScrollEffects()
      this.setupModalHandlers()
    })
  }

  // Theme Management
  setupThemeToggle() {
    const themeToggle = document.getElementById("themeToggle")
    if (themeToggle) {
      themeToggle.addEventListener("click", () => this.toggleTheme())
    }
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === "light" ? "dark" : "light"
    this.applyTheme()
    this.updateThemeIcon()
    this.saveThemePreference()
  }

  applyTheme() {
    if (this.currentTheme === "dark") {
      document.body.classList.add("dark-theme")
    } else {
      document.body.classList.remove("dark-theme")
    }
  }

  updateThemeIcon() {
    const themeIcon = document.querySelector(".theme-icon")
    if (themeIcon) {
      themeIcon.textContent = this.currentTheme === "dark" ? "☀️" : "🌙"
    }
  }

  loadSavedTheme() {
    const savedTheme = localStorage.getItem("portfolioTheme")
    if (savedTheme) {
      this.currentTheme = savedTheme
      this.applyTheme()
      this.updateThemeIcon()
    }
  }

  saveThemePreference() {
    localStorage.setItem("portfolioTheme", this.currentTheme)
  }

  // Role Rotation Animation
  startRoleRotation() {
    const roles = document.querySelectorAll(".role")
    if (roles.length === 0) return

    setInterval(() => {
      this.rotateToNextRole(roles)
    }, 3000)
  }

  rotateToNextRole(roles) {
    if (this.isAnimating) return

    this.isAnimating = true

    // Remove active class from current role
    roles[this.currentRoleIndex].classList.remove("active")

    // Move to next role
    this.currentRoleIndex = (this.currentRoleIndex + 1) % roles.length

    // Add active class to new role
    setTimeout(() => {
      roles[this.currentRoleIndex].classList.add("active")
      this.isAnimating = false
    }, 100)
  }

  // Project Filtering
  setupProjectFilters() {
    const filterButtons = document.querySelectorAll(".filter-btn")
    const projectCards = document.querySelectorAll(".project-card")

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        this.filterProjects(button, filterButtons, projectCards)
      })
    })
  }

  filterProjects(activeButton, allButtons, projectCards) {
    const filterValue = activeButton.getAttribute("data-filter")

    // Update active button
    allButtons.forEach((btn) => btn.classList.remove("active"))
    activeButton.classList.add("active")

    // Filter projects
    projectCards.forEach((card) => {
      const category = card.getAttribute("data-category")

      if (filterValue === "all" || category === filterValue) {
        card.style.display = "block"
        card.style.animation = "fadeIn 0.5s ease-out"
      } else {
        card.style.display = "none"
      }
    })
  }

  // Contact Form
  setupContactForm() {
    const contactForm = document.getElementById("contactForm")
    if (contactForm) {
      contactForm.addEventListener("submit", (e) => this.handleFormSubmission(e))
    }
  }

  async handleFormSubmission(event) {
    event.preventDefault()

    const submitButton = event.target.querySelector(".submit-btn")
    const formStatus = document.getElementById("formStatus")

    // Show loading state
    this.showFormLoadingState(submitButton)

    try {
      // Simulate form submission
      await this.simulateFormSubmission()

      this.showFormSuccess(formStatus)
      event.target.reset()
    } catch (error) {
      this.showFormError(formStatus)
    } finally {
      this.resetFormButton(submitButton)
    }
  }

  showFormLoadingState(button) {
    button.innerHTML = "<span>Sending...</span>"
    button.disabled = true
  }

  resetFormButton(button) {
    button.innerHTML = '<span>Send Message</span><div class="button-glow"></div>'
    button.disabled = false
  }

  simulateFormSubmission() {
    return new Promise((resolve) => {
      setTimeout(resolve, 2000)
    })
  }

  showFormSuccess(statusElement) {
    statusElement.textContent = "Thank you! Your message has been sent successfully."
    statusElement.className = "form-status success"
    statusElement.style.display = "block"

    setTimeout(() => {
      statusElement.style.display = "none"
    }, 5000)
  }

  showFormError(statusElement) {
    statusElement.textContent = "Sorry, there was an error sending your message. Please try again."
    statusElement.className = "form-status error"
    statusElement.style.display = "block"

    setTimeout(() => {
      statusElement.style.display = "none"
    }, 5000)
  }

  // Scroll Effects
  setupScrollEffects() {
    const navbar = document.getElementById("navbar")
    if (!navbar) return

    window.addEventListener("scroll", () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > 50) {
        navbar.style.background = "rgba(255, 255, 255, 0.98)"
        navbar.style.boxShadow = "var(--shadow-medium)"
      } else {
        navbar.style.background = "rgba(255, 255, 255, 0.95)"
        navbar.style.boxShadow = "none"
      }
    })
  }

  // Modal Handlers
  setupModalHandlers() {
    const modal = document.getElementById("projectModal")
    if (!modal) return

    // Close modal when clicking outside
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        this.closeProjectModal()
      }
    })

    // Close modal with Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeProjectModal()
      }
    })
  }

  // Project Data
  getProjectsData() {
    return {
      1: {
        title: "SIP Calculator",
        description:
        "A Calculating the amount that invested in the Mutual fund compounding the amount ",
        features: [
          "Accept a monthly investment amount,annual return percentage , and investment duration",
          "Display total investment amount, total return , total corpus",
          "User friendly interface and clear UI/UX design",
          
        ],
        technologies: ["HTML","CSS","Javascript"],
        liveUrl: "https://atharva3296.github.io/Sip-calculator.github.io/",
        githubUrl: "https://github.com/Atharva3296/Sip-calculator.github.io",
        image: "SIP.png",
      },
      2: {
        title: "Quiz Website",
        description:
        "Provided the certain the question of general knowledge with AI voice feedback",
        features: [
          "Accepting the ans of user ",
          "With AI voice feedback",
          "User friendly UI/UX design",
        ],
        technologies: ["HTML","CSS","Javascript"],
        liveUrl: "https://atharva3296.github.io/quiz.github.io/",
        githubUrl: "https://github.com/Atharva3296/quiz.github.io",
        image: "Quiz.png",
      },
      3: {
        title: "Scrapbook",
        description:
          "This is a digital scrapbook web application built using HTML, CSS, and React.js, where users can create and view personalized memory books with one image per page. It provides a creative way to capture and relive memories.",
        features: [
          "Create a scrapbook with custom name ",
          "Add one image per page",
          "Navigation between pages",
          "Saves the scrapbook data in browser localstorage",
          "Clean design UI/UX"
        ],
        technologies: ["HTML","CSS","React.js"],
        liveUrl: "https://memorychapter.netlify.app/",
        githubUrl: "https://github.com/Atharva3296/Scrapbook",
        image: "Scrapbook.png",
      },
      4: {
        title: "Chatbot",
        description:
          " Currently the project is ongoing ",
        features: [
          "Giving the data of weather",
          "Translating the language ",
          "Providing the information of news in pune and technology",
        ],
        technologies: ["HTML","CSS","React.js","Motiff"],
        liveUrl: "https://example.com/brand-identity",
        githubUrl: "https://github.com/alexrivera/brand-identity",
        image: "chatbot.png",
      },
    }
  }
}

// Global Functions for HTML onclick handlers
function downloadCV() {

  window.location.href = "Atharva-shedge resume.pdf"
}

function openProjectModal(projectId) {
  const modal = document.getElementById("projectModal")
  const modalBody = document.getElementById("modalBody")

  if (!modal || !modalBody) return

  const project = portfolioManager.projectsData[projectId]
  if (!project) return

  const featuresHtml = project.features.map((feature) => `<li>${feature}</li>`).join("")
  const technologiesHtml = project.technologies.map((tech) => `<span class="tech-tag">${tech}</span>`).join("")

  modalBody.innerHTML = `
    <img src="${project.image}" alt="${project.title}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 10px; margin-bottom: 1.5rem;">
    <h2 style="margin-bottom: 1rem; color: var(--text-primary);">${project.title}</h2>
    <p style="color: var(--text-secondary); margin-bottom: 2rem; line-height: 1.6;">${project.description}</p>
    
    <div style="margin-bottom: 2rem;">
      <h3 style="color: var(--text-primary); margin-bottom: 1rem;">Key Features:</h3>
      <ul style="color: var(--text-secondary); padding-left: 1.5rem;">
        ${featuresHtml}
      </ul>
    </div>
    
    <div style="margin-bottom: 2rem;">
      <h3 style="color: var(--text-primary); margin-bottom: 1rem;">Technologies Used:</h3>
      <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
        ${technologiesHtml}
      </div>
    </div>
    
    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
      <a href="${project.liveUrl}" target="_blank" class="project-btn">View Live Site</a>
      <a href="${project.githubUrl}" target="_blank" class="project-btn secondary">View Code</a>
    </div>
  `

  modal.style.display = "flex"
  document.body.style.overflow = "hidden"
}

function closeProjectModal() {
  const modal = document.getElementById("projectModal")
  if (modal) {
    modal.style.display = "none"
    document.body.style.overflow = "auto"
  }
}

// Initialize Portfolio Manager
const portfolioManager = new PortfolioManager()
