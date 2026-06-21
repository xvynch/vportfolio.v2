// ===========================================================
// knowledgeBase.js
// Single source of truth for everything Luci knows.
// No external calls — every fact lives here, locally.
// ===========================================================

export const knowledgeBase = {

  about: {
    title: "About Vynch",
    text: "Vynch Miranda is a Bachelor of Science in Information Systems student at Davao del Norte State College (DNSC), about halfway through the four-year program. He focuses on AI tools, prompt engineering, system development, and digital design, in that order of priority.",
    section: "about",
    buttons: ["View Academic Background", "View Projects", "Capabilities"]
  },

  academic: {
    title: "Academic Background",
    text: "Vynch is taking up BS Information Systems at Davao del Norte State College. He's roughly halfway through the 4-year course, with expected graduation between May and June 2028.",
    section: "academic",
    buttons: ["About Vynch", "View Projects", "Capabilities"]
  },

  capabilities: {
    title: "Capabilities & Tools",
    text: "Vynch's core capabilities are prompt engineering, AI tool utilization, system development fundamentals, and digital design fundamentals. He regularly works with ChatGPT, Claude, GitHub, VS Code, Figma, and Canva.",
    section: "capabilities",
    buttons: ["View Projects", "View Certificates", "About Vynch"]
  },

  tools: {
    title: "Tools",
    text: "Vynch's everyday toolkit: ChatGPT and Claude for AI-assisted work, GitHub and VS Code for development, and Figma and Canva for design.",
    section: "capabilities",
    buttons: ["Capabilities", "View Projects", "Contact"]
  },

  projects: {
    title: "Projects",
    text: "Vynch's flagship project is the EverGreen Management System — a centralized platform built for EverGreen Legacy Corp, a Philippine insurance and financial services company offering life, legacy, and preneed plans. It replaces manual, paper-based processes for managing clients, policies, payments, and claims across Branch Managers, Cashiers, and the General Manager.",
    section: "projects",
    buttons: ["View Certificates", "About Vynch", "Contact"],
    followUp: {
      text: "EverGreen Management System was Vynch's System Analysis and Design project. It was built around three roles — Branch Managers, Cashiers, and the General Manager — and it manages clients, policies, payments, and claims, with the goal of improving transparency and operational efficiency for EverGreen Legacy Corp.",
      buttons: ["View Certificates", "Capabilities", "Contact"]
    }
  },

  certificates: {
    title: "Certificates",
    text: "Vynch holds a CCNA: Introduction to Networks certificate from Cisco Networking Academy, covering networking fundamentals, IP addressing, routing, switching, network protocols, and basic network security. It represents his foundational networking knowledge and commitment to professional growth.",
    section: "certificates",
    buttons: ["View Projects", "Capabilities", "Contact"]
  },

  contact: {
    title: "Contact",
    text: "You can reach Vynch through email, GitHub, Facebook, or LinkedIn.",
    section: "contact",
    buttons: ["Email", "GitHub", "Facebook", "LinkedIn"]
  },

  tour: {
    title: "Portfolio Tour",
    text: "Sure — let's walk through the whole portfolio together."
  }
};

export const contactDetails = {
  email: "vynchmiranda@gmail.com",
  github: "https://github.com/xvynch",
  facebook: "https://www.facebook.com/xvynch#",
  linkedin: "https://www.linkedin.com/in/xvynch"
};

export const tourSteps = [
  { key: "home", section: "top", title: "Home", text: "This is the home base — Vynch Miranda, BS Information Systems student at DNSC, focused on AI tools, prompt engineering, system development, and digital design." },
  { key: "about", section: "about", title: "About Me", text: "Here's a closer look at who Vynch is and what he prioritizes — AI tools first, then prompt engineering, system development, and digital design." },
  { key: "academic", section: "academic", title: "Academic Information", text: "Vynch is studying BS Information Systems at DNSC, about halfway through the program, expecting to graduate between May and June 2028." },
  { key: "capabilities", section: "capabilities", title: "Capabilities & Tools", text: "His core capabilities are prompt engineering, AI tool utilization, system development, and digital design — backed by tools like ChatGPT, Claude, GitHub, VS Code, Figma, and Canva." },
  { key: "projects", section: "projects", title: "Projects", text: "The flagship project is the EverGreen Management System, built for EverGreen Legacy Corp to manage clients, policies, payments, and claims in one platform." },
  { key: "certificates", section: "certificates", title: "Certificates", text: "Vynch holds a CCNA: Introduction to Networks certificate from Cisco Networking Academy, covering core networking fundamentals." },
  { key: "contact", section: "contact", title: "Contact", text: "If you'd like to reach out, Vynch is available by email, GitHub, Facebook, or LinkedIn." },
  { key: "complete", section: "contact", title: "Tour Complete", text: "That's the full tour. Feel free to ask me anything else, or reach out to Vynch directly." }
];
