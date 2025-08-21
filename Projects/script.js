document.addEventListener('DOMContentLoaded', () => {
    // --- Terminal Functionality ---
    const terminalOutput = document.getElementById('terminal-output');
    const terminalInput = document.getElementById('terminal-input');

    const welcomeMessage = [
        "Initializing Linux.io ...",
        "Connection established. Welcome, user.",
        "Type 'help' to see available commands.",
        ""
    ];

    let lineIndex = 0;
    let charIndex = 0;

    function typeLine() {
        if (lineIndex < welcomeMessage.length) {
            const line = welcomeMessage[lineIndex];
            if (charIndex < line.length) {
                terminalOutput.innerHTML += line.charAt(charIndex);
                charIndex++;
                setTimeout(typeLine, 25);
            } else {
                terminalOutput.innerHTML += '<br>';
                lineIndex++;
                charIndex = 0;
                setTimeout(typeLine, 25);
            }
        }
    }

    typeLine();

    const commands = {
        help: `
Available commands:
  <span class="info">help</span>      - Displays this list of commands
  <span class="info">about</span>     - Shows the about me section
  <span class="info">skills</span>    - Lists my technical skills
  <span class="info">projects</span>  - Displays my recent projects
  <span class="info">contact</span>   - Shows contact information
  <span class="info">whoami</span>    - Prints the current user
  <span class="info">date</span>      - Shows the current date
  <span class="info">clear</span>     - Clears the terminal screen
        `,
        about: "Navigating to _about section...",
        skills: "Navigating to _skills section...",
        projects: "Navigating to _projects section...",
        contact: "Navigating to _contact section...",
        whoami: "guest",
        date: () => new Date().toString(),
        clear: () => {
            terminalOutput.innerHTML = '';
            return "";
        }
    };

    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = terminalInput.value.trim().toLowerCase();
            const promptLine = `<div class="terminal-line"><span class="prompt-user">user@linux.io</span>:<span class="prompt-path">~</span>$ ${command}</div>`;
            terminalOutput.innerHTML += promptLine;

            if (command in commands) {
                const output = commands[command];
                let result = "";
                if (typeof output === 'function') {
                    result = output();
                } else {
                    result = output;
                }
                
                if (result) {
                    const outputLine = `<div class="terminal-line command-output">${result}</div>`;
                    terminalOutput.innerHTML += outputLine;
                }

                // Handle navigation commands
                if (['about', 'skills', 'projects', 'contact'].includes(command)) {
                    document.getElementById(command).scrollIntoView({ behavior: 'smooth' });
                }

            } else {
                const errorLine = `<div class="terminal-line command-output error">command not found: ${command}</div>`;
                terminalOutput.innerHTML += errorLine;
            }

            terminalInput.value = '';
            terminalOutput.parentNode.scrollTop = terminalOutput.parentNode.scrollHeight;
        }
    });

    // --- Content Section Visibility on Scroll ---
    const sections = document.querySelectorAll('.content-section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => {
        observer.observe(section);
    });

    // --- Footer Logout Timer ---
    const logoutTimer = document.getElementById('logout-timer');
    let timeLeft = 300; // 5 minutes
    setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        logoutTimer.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        if (timeLeft > 0) {
            timeLeft--;
        }
    }, 1000);
    
    // --- Matrix Background Effect using three.js ---
    const canvas = document.getElementById('matrix-background');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const numColumns = 100;
    const fontHeight = 15;
    const rain = [];

    const font = '15px monospace';
    const texture = new THREE.CanvasTexture(document.createElement('canvas'));
    const context = texture.image.getContext('2d');
    texture.image.width = 64;
    texture.image.height = 64;

    for (let i = 0; i < numColumns; i++) {
        rain.push({
            x: i,
            y: Math.random() * -100,
            chars: [],
            speed: Math.random() * 0.5 + 0.2
        });

        for (let j = 0; j < 30; j++) {
            rain[i].chars.push(charSet.charAt(Math.floor(Math.random() * charSet.length)));
        }
    }
    
    function draw() {
        context.clearRect(0, 0, texture.image.width, texture.image.height);
        context.font = font;

        rain.forEach(column => {
            for (let i = 0; i < column.chars.length; i++) {
                const char = column.chars[i];
                const yPos = column.y + i;

                if (yPos > 0 && yPos < 50) {
                     if (i === column.chars.length - 1) {
                        context.fillStyle = '#ff7b7b'; // Salmon Pink for the leading character
                    } else {
                        const greenIntensity = Math.floor(255 * (1 - i / column.chars.length));
                        context.fillStyle = `rgb(0, ${greenIntensity}, 0)`;
                    }
                    context.fillText(char, (column.x * fontHeight) % texture.image.width, (yPos * fontHeight) % texture.image.height);
                }
            }
            column.y += column.speed;
            if (column.y * fontHeight > window.innerHeight) {
                column.y = Math.random() * -100;
            }
        });

        texture.needsUpdate = true;
    }

    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(window.innerWidth / 10, window.innerHeight / 10),
        new THREE.MeshBasicMaterial({ map: texture, transparent: true, opacity: 0.5 })
    );

    plane.position.z = -10;
    scene.add(plane);

    camera.position.z = 5;

    function animate() {
        requestAnimationFrame(animate);
        draw();
        renderer.render(scene, camera);
    }
    
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

});
