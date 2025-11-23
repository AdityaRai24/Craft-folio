export const templates = {
  NeoSpark: {
    sections: [
      {
        type: "userInfo",
        data: {
          github: "https://github.com/janedoe",
          linkedin: "https://linkedin.com/in/janedoe",
          email: "janedoe@gmail.com",
        },
      },
      {
        type: "hero",
        data: {
          name: "Alex Morgan",
          titlePrefix: "Aspiring Software",
          titleSuffixOptions: ["Engineer", "Developer"],
          summary:
            "Craving to build innovative solutions that make an impact.\nEnthusiastic problem solver, always curious about new technologies.\nCommitted to continuous learning and growth.",
          badge: {
            texts: [
              "Available for freelance",
              "Open to work",
              "Let's Collaborate!",
            ],
            color: "green",
            isVisible: true,
          },
          actions: [
            {
              type: "button",
              label: "View Projects",
              url: "#projects",
              style: "primary",
            },
            {
              type: "button",
              label: "Contact Me",
              url: "#contact",
              style: "outline",
            },
          ],
        },
      },
      {
        type: "projects",
        data: [
          {
            "liveLink": "https://movieflex.vercel.app",
            "githubLink": "https://github.com/janedoe/movieflex",
            "projectName": "MovieFlex",
            "projectTitle": "Movie Streaming Website",
            "projectDescription": "Built a responsive movie browsing website with Next.js, Tailwind CSS, and TMDB API integration for fetching real-time movie data.",
            "projectImage": "https://user-images.githubusercontent.com/106135144/196727097-50c0ae49-b92f-4aa9-bdcb-30d978a44125.png",
            "techStack": [
              { "name": "Next.js", "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
              { "name": "Tailwind CSS", "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Tailwind_CSS_Logo.svg/2560px-Tailwind_CSS_Logo.svg.png" },
              { "name": "React", "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
              { "name": "TMDB API", "logo": "https://cdn-icons-png.flaticon.com/512/6062/6062643.png" },
              { "name": "Node.js", "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" }
            ]
          },
          {
            "liveLink": "https://chatifyhub.vercel.app",
            "githubLink": "https://github.com/janedoe/chatifyhub",
            "projectName": "ChatifyHub",
            "projectTitle": "Real-time Chat Website",
            "projectDescription": "Developed a real-time chat application using React, Tailwind CSS, and Socket.io for live messaging across multiple rooms.",
            "projectImage": "https://adware-technologies.s3.amazonaws.com/uploads/photo/image/10/Screenshot_2020-09-04_at_2.13.27_AM.png",
            "techStack": [
              { "name": "React", "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
              { "name": "Tailwind CSS", "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Tailwind_CSS_Logo.svg/2560px-Tailwind_CSS_Logo.svg.png" },
              { "name": "Node.js", "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
              { "name": "Express.js", "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" },
              { "name": "Socket.io", "logo": "https://cdn-icons-png.flaticon.com/512/6062/6062643.png" }
            ]
          }
        ]
      },
      {
        type: "experience",
        data: [
          {
            role: "Senior Frontend Developer",
            companyName: "TechCorp Solutions",
            location: "San Francisco, CA",
            startDate: "03/2021",
            endDate: "Present",
            description:
              "Led development of multiple React-based web applications with a focus on performance optimization and accessibility. Implemented CI/CD pipelines and mentored junior developers. Reduced application load time by 40% through code splitting and lazy loading strategies.",
            techStack: [
              { "name": "React", "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
              { "name": "TypeScript", "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
              { "name": "Redux", "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg" },
              { "name": "Next.js", "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
              { "name": "Tailwind CSS", "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Tailwind_CSS_Logo.svg/2560px-Tailwind_CSS_Logo.svg.png" },
              { "name": "Jest", "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jest/jest-plain.svg" }
            ],
          },
          {
            role: "Web Developer",
            companyName: "Digital Innovations Inc.",
            location: "Remote",
            startDate: "06/2018",
            endDate: "02/2021",
            description:
              "Developed and maintained client websites using modern JavaScript frameworks. Collaborated with UI/UX designers to implement responsive designs. Built RESTful APIs and integrated third-party services for e-commerce functionality.",
            techStack: [
              { "name": "JavaScript", "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
              { "name": "Vue.js", "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg" },
              { "name": "Node.js", "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
              { "name": "Express", "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" },
              { "name": "MongoDB", "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
              { "name": "SCSS", "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg" }
            ],
          },
        ]
      },
      {
        type: "technologies",
        data: [
          { "name": "HTML5", "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
          { "name": "CSS3", "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
          { "name": "JavaScript", "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
          { "name": "TypeScript", "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
          { "name": "React", "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
          { "name": "Next.js", "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
          { "name": "Redux", "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg" },
          { "name": "TailwindCSS", "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Tailwind_CSS_Logo.svg/2560px-Tailwind_CSS_Logo.svg.png" },
          { "name": "Node.js", "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
          { "name": "Express.js", "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" },
          { "name": "MongoDB", "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
        ]
      }
    ],
  },
  SimpleWhite : {
    
  },
  MacOS: {
    sections: [
      {
        type: "hero",
        data: {
          name: "Alex Morgan",
          title: "Software Engineer & Designer",
          summary: "Building beautiful digital experiences with code.\nPassionate about creating intuitive interfaces and scalable solutions.",
          backgroundImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80",
          profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
          status: "Available for opportunities",
          location: "San Francisco, CA",
        },
      },
      {
        type: "projects",
        data: [
          {
            projectName: "MovieFlex",
            projectTitle: "Movie Streaming Platform",
            projectDescription: "A modern movie browsing and streaming platform built with Next.js, featuring real-time data integration and responsive design.",
            projectImage: "https://user-images.githubusercontent.com/106135144/196727097-50c0ae49-b92f-4aa9-bdcb-30d978a44125.png",
            liveLink: "https://movieflex.vercel.app",
            githubLink: "https://github.com/janedoe/movieflex",
            techStack: [
              { name: "Next.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
              { name: "React", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
              { name: "Tailwind CSS", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Tailwind_CSS_Logo.svg/2560px-Tailwind_CSS_Logo.svg.png" },
              { name: "TypeScript", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" }
            ],
            windowPosition: { x: 100, y: 150 },
            windowSize: { width: 800, height: 600 },
            isMinimized: false,
          },
          {
            projectName: "ChatifyHub",
            projectTitle: "Real-time Chat Application",
            projectDescription: "A real-time messaging application with multi-room support, built using React, Socket.io, and Node.js.",
            projectImage: "https://adware-technologies.s3.amazonaws.com/uploads/photo/image/10/Screenshot_2020-09-04_at_2.13.27_AM.png",
            liveLink: "https://chatifyhub.vercel.app",
            githubLink: "https://github.com/janedoe/chatifyhub",
            techStack: [
              { name: "React", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
              { name: "Node.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
              { name: "Socket.io", logo: "https://cdn-icons-png.flaticon.com/512/6062/6062643.png" },
              { name: "Express.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" }
            ],
            windowPosition: { x: 250, y: 200 },
            windowSize: { width: 800, height: 600 },
            isMinimized: false,
          },
        ],
      },
      {
        type: "experience",
        data: [
          {
            role: "Senior Frontend Developer",
            companyName: "TechCorp Solutions",
            location: "San Francisco, CA",
            startDate: "03/2021",
            endDate: "Present",
            description: "Led development of multiple React-based web applications with focus on performance optimization and accessibility. Implemented CI/CD pipelines and mentored junior developers. Reduced application load time by 40% through code splitting and lazy loading strategies.",
            techStack: [
              { name: "React", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
              { name: "TypeScript", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
              { name: "Next.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
              { name: "Redux", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg" }
            ],
            icon: "💼",
            color: "#007AFF",
          },
          {
            role: "Web Developer",
            companyName: "Digital Innovations Inc.",
            location: "Remote",
            startDate: "06/2018",
            endDate: "02/2021",
            description: "Developed and maintained client websites using modern JavaScript frameworks. Collaborated with UI/UX designers to implement responsive designs. Built RESTful APIs and integrated third-party services for e-commerce functionality.",
            techStack: [
              { name: "JavaScript", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
              { name: "Vue.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg" },
              { name: "Node.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
              { name: "MongoDB", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" }
            ],
            icon: "🚀",
            color: "#34C759",
          },
        ],
      },
      {
        type: "technologies",
        data: [
          { name: "React", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg", category: "Frontend" },
          { name: "Next.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg", category: "Frontend" },
          { name: "TypeScript", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg", category: "Language" },
          { name: "Node.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg", category: "Backend" },
          { name: "PostgreSQL", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg", category: "Database" },
          { name: "Tailwind CSS", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Tailwind_CSS_Logo.svg/2560px-Tailwind_CSS_Logo.svg.png", category: "Styling" },
          { name: "Python", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg", category: "Language" },
          { name: "Docker", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg", category: "DevOps" }
        ],
      },
      {
        type: "userInfo",
        data: {
          github: "https://github.com/janedoe",
          linkedin: "https://linkedin.com/in/janedoe",
          email: "janedoe@gmail.com",
          twitter: "https://twitter.com/janedoe",
          website: "https://janedoe.dev"
        },
      },
    ],
  },
};