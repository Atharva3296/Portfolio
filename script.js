class PortfolioManager {
  constructor() {
    this.currentTheme = "light"
    this.currentRoleIndex = 0
    this.isAnimating = false
    this.projectsData = this.getProjectsData()
    this.chatbotOpen = false

    this.initializePortfolio()
  }

  initializePortfolio() {
    document.addEventListener("DOMContentLoaded", () => {
      this.setupThemeToggle()
      this.loadSavedTheme()
      this.startRoleRotation()
      this.setupProjectFilters()
      this.setupContactForm()
      this.setupScrollEffects()
      this.setupModalHandlers()
      this.setupChatbot()
    })
  }

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

    roles[this.currentRoleIndex].classList.remove("active")

    this.currentRoleIndex = (this.currentRoleIndex + 1) % roles.length

    setTimeout(() => {
      roles[this.currentRoleIndex].classList.add("active")
      this.isAnimating = false
    }, 100)
  }

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

    allButtons.forEach((btn) => btn.classList.remove("active"))
    activeButton.classList.add("active")

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

  setupContactForm() {
    const contactForm = document.getElementById("contactForm")
    if (contactForm) {
      contactForm.addEventListener("submit", (e) => this.handleFormSubmission(e))
    }
  }

  async handleFormSubmission(event) {
    event.preventDefault()

    const form = event.target
    const submitButton = form.querySelector(".submit-btn")
    const formStatus = document.getElementById("formStatus")

    this.showFormLoadingState(submitButton)

    const formData = new FormData(form)

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: formData,
        headers: {
          Accept: "application/json",
        },
      })

      if (response.ok) {
        this.showFormSuccess(formStatus)
        form.reset()
      } else {
        this.showFormError(formStatus)
      }
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

  setupModalHandlers() {
    const modal = document.getElementById("projectModal")
    if (!modal) return

    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        this.closeProjectModal()
      }
    })

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeProjectModal()
      }
    })
  }

  setupChatbot() {
    const chatbotBubble = document.getElementById("chatbotBubble")
    const chatbotWindow = document.getElementById("chatbotWindow")
    const chatbotClose = document.getElementById("chatbotClose")
    const chatbotInput = document.getElementById("chatbotInput")
    const chatbotSend = document.getElementById("chatbotSend")

    if (chatbotBubble) {
      chatbotBubble.addEventListener("click", () => this.toggleChatbot())
    }

    if (chatbotClose) {
      chatbotClose.addEventListener("click", () => this.closeChatbot())
    }

    if (chatbotSend) {
      chatbotSend.addEventListener("click", () => this.sendMessage())
    }

    if (chatbotInput) {
      chatbotInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          this.sendMessage()
        }
      })
    }

    document.addEventListener("click", (e) => {
      if (this.chatbotOpen) {
        const chatbotWindow = document.getElementById("chatbotWindow")
        const chatbotBubble = document.getElementById("chatbotBubble")

        // Check if click is outside both chatbot window and bubble
        if (chatbotWindow && chatbotBubble && !chatbotWindow.contains(e.target) && !chatbotBubble.contains(e.target)) {
          this.closeChatbot()
        }
      }
    })
  }

  toggleChatbot() {
    const chatbotWindow = document.getElementById("chatbotWindow")
    if (this.chatbotOpen) {
      this.closeChatbot()
    } else {
      this.openChatbot()
    }
  }

  openChatbot() {
    const chatbotWindow = document.getElementById("chatbotWindow")
    if (chatbotWindow) {
      chatbotWindow.classList.add("active")
      this.chatbotOpen = true
    }
  }

  closeChatbot() {
    const chatbotWindow = document.getElementById("chatbotWindow")
    if (chatbotWindow) {
      chatbotWindow.classList.remove("active")
      this.chatbotOpen = false
    }
  }

  sendMessage() {
    const chatbotInput = document.getElementById("chatbotInput")
    const message = chatbotInput.value.trim()

    if (message) {
      this.addUserMessage(message)
      chatbotInput.value = ""

      setTimeout(() => {
        this.generateBotResponse(message)
      }, 500)
    }
  }

  addUserMessage(message) {
    const messagesContainer = document.getElementById("chatbotMessages")
    const messageDiv = document.createElement("div")
    messageDiv.className = "chatbot-message user-message"
    messageDiv.innerHTML = `<div class="message-content">${message}</div>`
    messagesContainer.appendChild(messageDiv)
    messagesContainer.scrollTop = messagesContainer.scrollHeight
  }

  addBotMessage(message) {
    const messagesContainer = document.getElementById("chatbotMessages")
    const messageDiv = document.createElement("div")
    messageDiv.className = "chatbot-message bot-message"
    messageDiv.innerHTML = `<div class="message-content">${message}</div>`
    messagesContainer.appendChild(messageDiv)
    messagesContainer.scrollTop = messagesContainer.scrollHeight
  }

  generateBotResponse(userMessage) {
    const message = userMessage.toLowerCase()
    let response = ""

    if (message.includes("who") && (message.includes("you") || message.includes("atharva"))) {
      response =
        "I'm Atharva Shedge, a passionate Full-Stack Web Developer specializing in MERN stack development. I'm located in Wagholi, Pune, India. I create modern, dynamic, and user-friendly web applications while continuously learning and exploring new technologies!"
    } else if (message.includes("skill") || message.includes("technology") || message.includes("tech")) {
      response =
        "Atharva's comprehensive technical skills include:<br><br><strong>Frontend Development:</strong><br>• React.js, JavaScript (ES6+), HTML5, CSS3<br>• Tailwind CSS, Responsive Design<br>• UI/UX Design principles<br><br><strong>Backend Development:</strong><br>• Node.js, Express.js<br>• REST APIs development<br>• Server-side architecture<br><br><strong>Database & Tools:</strong><br>• MongoDB (NoSQL), MySQL<br>• Git, VS Code, Postman<br>• AWS cloud services<br>• Figma, Motiff for design<br>• Android Studio, Java"
    } else if (message.includes("project") || message.includes("work") || message.includes("portfolio")) {
      response =
        "Here are Atharva's key projects:<br><br><strong>Major Projects:</strong><br>• <strong>SIP Calculator:</strong> Investment calculation tool with compound interest calculations<br>• <strong>Quiz Website:</strong> Interactive general knowledge quiz with AI voice feedback<br>• <strong>Disaster Helper:</strong> Comprehensive disaster management application with real-time alerts and resource coordination<br><br><strong>Minor Projects:</strong><br>• <strong>Digital Kids Scrapbook:</strong> Memory book creation app built with React.js<br>• <strong>Chatbot:</strong> Weather, currency, and news bot (In Development)<br><br>You can view all projects with live demos on the <a href='projects.html' style='color: #1a1a1dff;'>Projects page</a>!"
    } else if (
      message.includes("contact") ||
      message.includes("reach") ||
      message.includes("email") ||
      message.includes("phone")
    ) {
      response =
        "You can contact Atharva through multiple channels:<br><br><strong>Direct Contact:</strong><br>• <strong>Email:</strong> atharvashedge98@gmail.com<br>• <strong>Phone:</strong> +91 9529419298<br>• <strong>Location:</strong> Wagholi, Pune, India<br><br><strong>Social Media:</strong><br>• <strong>LinkedIn:</strong> <a href='https://www.linkedin.com/in/atharvashedgeofficial/' target='_blank' style='color: #252528ff;'>Professional Profile</a><br>• <strong>GitHub:</strong> <a href='https://github.com/Atharva3296' target='_blank' style='color: #1a1b1fff;'>Code Repository</a><br>• <strong>Instagram:</strong> <a href='https://www.instagram.com/atharva_._shedge/' target='_blank' style='color: #2f2f33ff;'>Personal Updates</a><br><br>Or use the <a href='contact.html' style='color: #1f2024ff;'>contact form</a> for direct messaging!"
    } else if (message.includes("github") || message.includes("git") || message.includes("code")) {
      response =
        "You can find Atharva's code repositories on GitHub:<br><br><strong>GitHub Profile:</strong><br>• <strong>Username:</strong> Atharva3296<br>• <strong>Profile Link:</strong> <a href='https://github.com/Atharva3296' target='_blank' style='color: #17181aff;'>github.com/Atharva3296</a><br><br>His GitHub showcases all his projects including:<br>• SIP Calculator<br>• Quiz Website<br>• Digital Kids Scrapbook<br>• Disaster Helper<br>• And more exciting projects!<br><br>Feel free to explore his repositories and see his coding style!"
    } else if (message.includes("linkedin") || message.includes("professional") || message.includes("network")) {
      response =
        "Connect with Atharva on LinkedIn for professional networking:<br><br><strong>LinkedIn Profile:</strong><br>• <strong>Profile:</strong> <a href='https://www.linkedin.com/in/atharvashedgeofficial/' target='_blank' style='color: #101011ff;'>linkedin.com/in/atharvashedgeofficial</a><br><br>On LinkedIn, you can find:<br>• Professional experience and internships<br>• Skills endorsements<br>• Project updates<br>• Industry connections<br>• Career achievements<br><br>Perfect for professional inquiries and networking!"
    } else if (
      message.includes("leetcode") ||
      message.includes("coding") ||
      message.includes("algorithm") ||
      message.includes("dsa")
    ) {
      response =
        "Atharva actively practices coding challenges on LeetCode:<br><br><strong>LeetCode Profile:</strong><br>• <strong>Username:</strong> Atharva3296<br>• <strong>Profile Link:</strong> <a href='https://leetcode.com/u/Atharva3296/' target='_blank' style='color: #667eea;'>leetcode.com/u/Atharva3296</a><br><br>He regularly solves:<br>• Data Structures problems<br>• Algorithm challenges<br>• Coding interview questions<br>• Problem-solving exercises<br><br>This helps him stay sharp with programming fundamentals and interview preparation!"
    } else if (message.includes("social") || message.includes("profile") || message.includes("follow")) {
      response =
        "Here are all of Atharva's social media profiles:<br><br><strong>Professional Platforms:</strong><br>• <strong>GitHub:</strong> <a href='https://github.com/Atharva3296' target='_blank' style='color: #667eea;'>github.com/Atharva3296</a><br>• <strong>LinkedIn:</strong> <a href='https://www.linkedin.com/in/atharvashedgeofficial/' target='_blank' style='color: #667eea;'>linkedin.com/in/atharvashedgeofficial</a><br>• <strong>LeetCode:</strong> <a href='https://leetcode.com/u/Atharva3296/' target='_blank' style='color: #667eea;'>leetcode.com/u/Atharva3296</a><br><br><strong>Personal:</strong><br>• <strong>Instagram:</strong> <a href='https://www.instagram.com/atharva_._shedge/' target='_blank' style='color: #667eea;'>@atharva_._shedge</a><br><br>Follow him to stay updated with his latest projects and professional journey!"
    } else if (message.includes("experience") || message.includes("internship") || message.includes("work")) {
      response =
        "Atharva's professional experience includes:<br><br><strong>Current Internship:</strong><br>• <strong>Web Full-Stack Developer</strong> at Eduskill (Virtual)<br>• Duration: 10 weeks (January-March 2025)<br>• Focus: Full-stack web development with MERN stack<br><br><strong>Previous Experience:</strong><br>• <strong>Android Developer</strong> at Google for Developer<br>• Duration: 10 weeks (April-June 2024)<br>• Technologies: Java, Android Studio<br><br>He's passionate about creating user-friendly interfaces and solving real-world problems through innovative code solutions."
    } else if (message.includes("education") || message.includes("study") || message.includes("learning")) {
      response =
        "Atharva is a dedicated learner who believes in continuous education and skill development. He stays updated with the latest web technologies, best practices, and industry trends. His learning approach combines formal education with hands-on project experience and self-directed study of emerging technologies."
    } else if (message.includes("interest") || message.includes("hobby") || message.includes("personal")) {
      response =
        "Beyond coding, Atharva has diverse interests:<br>• <strong>Technology:</strong> Exploring new web technologies and frameworks<br>• <strong>Music:</strong> Enjoys listening to music during coding sessions<br>• <strong>Gaming:</strong> Recreational gaming for relaxation<br>• <strong>Open Source:</strong> Contributing to community projects<br>• <strong>Tech Websites:</strong> Staying updated with industry news and trends<br><br>These interests help him maintain a balanced approach to both personal and professional growth!"
    } else if (message.includes("location") || message.includes("where") || message.includes("pune")) {
      response =
        "Atharva is based in <strong>Wagholi, Pune, India</strong>. Pune is a major IT hub in India, providing excellent opportunities for web developers and tech professionals. He's available for both local and remote collaboration opportunities."
    } else if (message.includes("react") || message.includes("javascript") || message.includes("mern")) {
      response =
        "Atharva specializes in <strong>MERN Stack Development</strong>:<br>• <strong>MongoDB:</strong> NoSQL database for scalable applications<br>• <strong>Express.js:</strong> Backend framework for robust APIs<br>• <strong>React.js:</strong> Frontend library for dynamic user interfaces<br>• <strong>Node.js:</strong> Server-side JavaScript runtime<br><br>He also works with modern JavaScript (ES6+), responsive design, and has experience with both SQL and NoSQL databases."
    } else if (message.includes("hire") || message.includes("available") || message.includes("freelance")) {
      response =
        "Atharva is open to new opportunities! He's available for:<br>• <strong>Full-time positions</strong> in web development<br>• <strong>Freelance projects</strong> and consulting<br>• <strong>Internship opportunities</strong> for skill enhancement<br>• <strong>Collaborative projects</strong> with other developers<br><br>Feel free to reach out via email at atharvashedge98@gmail.com or through the <a href='contact.html' style='color: #667eea;'>contact form</a> to discuss potential opportunities!"
    } else if (message.includes("hello") || message.includes("hi") || message.includes("hey")) {
      response =
        "Hello! 👋 I'm here to help you learn more about Atharva Shedge, a talented Full-Stack Web Developer from Pune, India. Feel free to ask me about his skills, projects, experience, or how to contact him!"
    } else if (message.includes("thank") || message.includes("thanks")) {
      response =
        "You're welcome! 😊 Is there anything else you'd like to know about Atharva, his projects, or his technical expertise?"
    } else if (message.includes("resume") || message.includes("cv") || message.includes("download")) {
      response =
        "You can download Atharva's resume directly from the website! Look for the 'Download CV' button on the homepage, or contact him directly at atharvashedge98@gmail.com for the latest version of his resume."
    } else {
      response =
        "I'd be happy to help you learn more about Atharva! You can ask me about:<br><br>• <strong>Personal Info:</strong> Who is Atharva? Where is he located?<br>• <strong>Technical Skills:</strong> What technologies does he use?<br>• <strong>Projects:</strong> What has he built?<br>• <strong>Experience:</strong> What's his professional background?<br>• <strong>Contact:</strong> How can you reach him?<br>• <strong>Availability:</strong> Is he open for new opportunities?<br><br>What would you like to know?"
    }

    this.addBotMessage(response)
  }

  getProjectsData() {
    return {
      1: {
        title: "SIP Calculator",
        description: "A Calculating the amount that invested in the Mutual fund compounding the amount ",
        features: [
          "Accept a monthly investment amount, annual return percentage, and investment duration",
          "Display total investment amount, total return, total corpus",
          "User-friendly interface and clear UI/UX design",
        ],
        technologies: ["HTML", "CSS", "Javascript"],
        liveUrl: "https://atharva3296.github.io/Sip-calculator.github.io/",
        githubUrl: "https://github.com/Atharva3296/Sip-calculator.github.io",
        image: "SIP.png",
      },
      2: {
        title: "Quiz Website",
        description: "Provided the certain the question of general knowledge with AI voice feedback",
        features: ["Accepting the ans of user", "With AI voice feedback", "User-friendly UI/UX design"],
        technologies: ["HTML", "CSS", "Javascript"],
        liveUrl: "https://atharva3296.github.io/quiz.github.io/",
        githubUrl: "https://github.com/Atharva3296/quiz.github.io",
        image: "Quiz.png",
      },
      3: {
        title: "Scrapbook",
        description:
          "This is a digital scrapbook web application built using HTML, CSS, and React.js, where users can create and view personalized memory books with one image per page. It provides a creative way to capture and relive memories.",
        features: [
          "Create a scrapbook with custom name",
          "Add one image per page",
          "Navigation between pages",
          "Saves the scrapbook data in browser localstorage",
          "Clean design UI/UX",
        ],
        technologies: ["HTML", "CSS", "React.js"],
        liveUrl: "https://memorychapter.netlify.app/",
        githubUrl: "https://github.com/Atharva3296/Scrapbook",
        image: "Scrapbook.png",
      },
      4: {
        title: "Chatbot",
        description: "Currently the project is ongoing",
        features: [
          "Giving the data of weather",
          "Translating the language",
          "Providing the information of news in Pune and technology",
        ],
        technologies: ["HTML", "CSS", "React.js", "Motiff"],
        liveUrl: "https://example.com/brand-identity",
        githubUrl: "https://github.com/alexrivera/brand-identity",
        image: "chatbot.png",
      },
      5: {
        title: "Disaster Helper",
        description:
          "A comprehensive disaster management application that provides emergency response tools, real-time alerts, and resource coordination for disaster preparedness and response.",
        features: [
          "Real-time disaster alerts and notifications",
          "Emergency contact management system",
          "Resource coordination and distribution tracking",
          "Interactive disaster preparedness guides",
          "Community reporting and response coordination",
        ],
        technologies: ["React.js", "Node.js", "MongoDB", "Express.js"],
        liveUrl: "https://disaster-helper-app.netlify.app/",
        githubUrl: "https://github.com/Atharva3296/disaster-helper",
        image: "disaster-helper.png",
      },
    }
  }
}

function downloadCV(filename) {
  window.location.href = filename || "Atharva-shedge resume.pdf"
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

const portfolioManager = new PortfolioManager()
