
  // CURSOR
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
  });

  function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.querySelectorAll('a, button, .project-item').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hover');
      ring.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover');
      ring.classList.remove('hover');
    });
  });

  // NAV SCROLL
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });

  // SCROLL REVEAL
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // 3D TILT EFFECT & DYNAMIC GLARE FOR PROFILE IMAGE
  const frame = document.querySelector('.about-image-frame');
  const glare = document.querySelector('.about-image-glare');
  if (frame && glare) {
    frame.addEventListener('mousemove', (e) => {
      const rect = frame.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const xc = rect.width / 2;
      const yc = rect.height / 2;
      
      const dx = x - xc;
      const dy = y - yc;
      
      const rx = -(dy / yc) * 12; 
      const ry = (dx / xc) * 12;
      
      frame.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
      
      const percentageX = (x / rect.width) * 100;
      const percentageY = (y / rect.height) * 100;
      glare.style.background = `radial-gradient(circle at ${percentageX}% ${percentageY}%, rgba(255,255,255,0.15) 0%, transparent 60%, rgba(200,255,0,0.08) 100%)`;
    });
    
    frame.addEventListener('mouseleave', () => {
      frame.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
      glare.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(200,255,0,0.05) 100%)';
    });
  }

  // SCROLL SPY (ACTIVE NAV LINKS)
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - 250)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // TYPEWRITER EFFECT
  const typewriterText = document.getElementById('typewriter-text');
  const phrases = [
    'sistem web yang efisien dan skalabel.',
    'infrastruktur data berskala besar.',
    'pola tersembunyi dari data yang kompleks.'
  ];
  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 80;

  function type() {
    if (!typewriterText) return;
    const currentPhrase = phrases[phraseIdx];
    if (isDeleting) {
      typewriterText.textContent = currentPhrase.substring(0, charIdx - 1);
      charIdx--;
      typingSpeed = 40;
    } else {
      typewriterText.textContent = currentPhrase.substring(0, charIdx + 1);
      charIdx++;
      typingSpeed = 80;
    }

    if (!isDeleting && charIdx === currentPhrase.length) {
      typingSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      typingSpeed = 500;
    }

    setTimeout(type, typingSpeed);
  }

  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(type, 1000);
  });

  // INTERACTIVE GRID PARTICLES ON HERO CANVAS
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;
    let mouse = { x: null, y: null, active: false };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    const heroSection = document.querySelector('.hero');
    if (heroSection) {
      heroSection.addEventListener('mousemove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
        mouse.active = true;
      });
      heroSection.addEventListener('mouseleave', () => {
        mouse.active = false;
      });
    }

    const gridSize = 80;

    function animateGrid() {
      ctx.clearRect(0, 0, width, height);
      for (let x = 0; x < width; x += gridSize) {
        for (let y = 0; y < height; y += gridSize) {
          let distance = 9999;
          if (mouse.active && mouse.x !== null) {
            const dx = mouse.x - x;
            const dy = mouse.y - y;
            distance = Math.sqrt(dx * dx + dy * dy);
          }

          if (distance < 200) {
            const alpha = (1 - distance / 200) * 0.5;
            ctx.fillStyle = `rgba(200, 255, 0, ${alpha})`;
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = `rgba(200, 255, 0, ${alpha * 0.3})`;
            ctx.beginPath();
            ctx.arc(x, y, 6 + (1 - distance / 200) * 10, 0, Math.PI * 2);
            ctx.stroke();
          } else {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
            ctx.beginPath();
            ctx.arc(x, y, 1.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
      requestAnimationFrame(animateGrid);
    }
    animateGrid();
  }

  // TERMINAL CLI CONTROLLER
  const terminalInput = document.getElementById('terminal-input');
  const terminalBody = document.getElementById('terminal-body');
  let streamInterval = null;

  if (terminalInput && terminalBody) {
    // Keep input focused when clicking anywhere inside terminal body
    terminalBody.addEventListener('click', () => {
      terminalInput.focus();
    });

    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const inputVal = terminalInput.value.trim();
        terminalInput.value = '';
        if (inputVal === '') return;

        // Print entered command
        printLine(`guest@unimed:~$ ${inputVal}`, 'accent-color3');

        // Execute command
        executeCommand(inputVal);
      }
    });

    function printLine(text, className = '') {
      const line = document.createElement('div');
      line.className = 'terminal-line ' + className;
      line.innerHTML = text;
      
      // Insert before the input line
      const inputLine = terminalBody.querySelector('.input-line');
      terminalBody.insertBefore(line, inputLine);
      
      // Auto scroll
      terminalBody.scrollTop = terminalBody.scrollHeight;
    }

    function executeCommand(cmd) {
      const command = cmd.toLowerCase().trim();

      // If active stream is running, stop it upon any new command
      if (streamInterval) {
        clearInterval(streamInterval);
        streamInterval = null;
        printLine('Data streaming connection closed.', 'accent-color2');
      }

      if (command === '/help') {
        printLine('Available Commands:', 'accent-color');
        printLine('  <span class="accent-color">/about</span>    - Display profile metadata');
        printLine('  <span class="accent-color">/skills</span>   - Check detailed system skill-levels');
        printLine('  <span class="accent-color">/contact</span>  - Get connection channels');
        printLine('  <span class="accent-color">/stream</span>   - Open active real-time data log stream');
        printLine('  <span class="accent-color">/clear</span>    - Wipe the terminal display');
      } else if (command === '/about') {
        printLine('--------------------------------------------');
        printLine('NAME: Bryant Tinambunan');
        printLine('ROLE: Web Architect & Data Engineer');
        printLine('EDU: Computer Science at UNIMED');
        printLine('INFO: Dual stack specialist specializing in high-load Laravel architecture & distributed Spark data pipelines.');
        printLine('--------------------------------------------');
      } else if (command === '/skills') {
        printLine('System Skill Core Diagnostics:', 'accent-color');
        printLine('PHP/Laravel      [====================] 95%');
        printLine('Python/Spark     [==================--] 90%');
        printLine('Data Engineering [==================--] 90%');
        printLine('SQL Optimization [=================---] 85%');
      } else if (command === '/contact') {
        printLine('Connection Channels Opened:', 'accent-color');
        printLine('  Email    - <a href="mailto:bryanttinambunan12@gmail.com" class="accent-color3">bryanttinambunan12@gmail.com</a>');
        printLine('  GitHub   - <a href="https://github.com/" target="_blank" class="accent-color3">github.com</a>');
        printLine('  LinkedIn - <a href="https://linkedin.com/" target="_blank" class="accent-color3">linkedin.com</a>');
      } else if (command === '/stream') {
        printLine('Opening connection to Spark cluster & Solana nodes...', 'accent-color');
        printLine('Streaming live pipeline log diagnostics... Run any other command to halt the stream.', 'accent-color');
        
        const streamLogs = [
          '<span class="accent-color">[SPARK]</span> SparkSession initialized in 1.42s.',
          '<span class="accent-color3">[YOUTUBE]</span> Fetching comment thread ID: UcwXoGg...',
          '<span class="accent-color3">[YOUTUBE]</span> Scraping active: 1,500 comments extracted.',
          '<span class="accent-color2">[MODEL]</span> Sentiment classification: Tokenizing comment text...',
          '<span class="accent-color2">[MODEL]</span> Sentiment analyzer: Positive 68% | Negative 32%.',
          '<span class="accent-color">[SPARK]</span> Distributed partition write to HDFS format: Parquet.',
          '<span class="accent-color3">[BIGQUERY]</span> Syncing Parquet tables to Google Cloud BigQuery.',
          '<span class="accent-color2">[SOLANA]</span> Monitoring block #2890142 | 2,142 active wallets.',
          '<span class="accent-color2">[SOLANA]</span> K-Means Segment: 12 bots, 82 long-term holders identified.',
          '<span class="accent-color">[SUCCESS]</span> Pipeline orchestration completed successfully (0 errors).'
        ];

        let logIndex = 0;
        streamInterval = setInterval(() => {
          printLine(streamLogs[logIndex % streamLogs.length]);
          logIndex++;
        }, 600);
      } else if (command === '/clear') {
        // Clear all except initial message and input
        const lines = terminalBody.querySelectorAll('.terminal-line:not(.input-line)');
        lines.forEach(l => l.remove());
        printLine('Console display wiped.');
      } else {
        printLine(`Command not found: "${cmd}". Type <span class="accent-color">/help</span> for commands.`, 'accent-color2');
      }
    }
  }

  // CYBER DECRYPT / CODE SCRAMBLE EFFECT FOR PROJECT INDEX NUMBERS
  const projectItems = document.querySelectorAll('.project-item');
  projectItems.forEach(item => {
    const indexEl = item.querySelector('.project-index');
    if (!indexEl) return;
    const originalText = indexEl.textContent;
    const chars = '0123456789%@$#&?*';
    let scrambleInterval = null;

    item.addEventListener('mouseenter', () => {
      let iteration = 0;
      clearInterval(scrambleInterval);
      
      scrambleInterval = setInterval(() => {
        indexEl.textContent = originalText
          .split('')
          .map((char, index) => {
            if (index < iteration) {
              return originalText[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('');
        
        if (iteration >= originalText.length) {
          clearInterval(scrambleInterval);
        }
        
        iteration += 1 / 3;
      }, 45);
    });

    item.addEventListener('mouseleave', () => {
      clearInterval(scrambleInterval);
      indexEl.textContent = originalText;
    });
  });

  // THEME ACCENT SWITCHER
  const themeBtns = document.querySelectorAll('.theme-btn');
  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const color = btn.getAttribute('data-color');
      document.documentElement.style.setProperty('--accent', color);
      
      // Update active state
      themeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // PROJECT DETAIL MODAL DATA
  const projectDetails = {
    '1': {
      title: '"Ask Me" — Forum Platform',
      year: '2024',
      tag: 'Web Dev',
      tagClass: 'tag-web',
      architecture: 'Menerapkan arsitektur <strong>Model-View-Controller (MVC)</strong> dengan <strong>Laravel 10</strong>. Alur request dioptimasi dari routing middleware ke Eloquent ORM dengan teknik Eager Loading untuk menghilangkan query redundan.',
      metrics: [
        'Eradikasi N+1 Query pada relasi thread-comment menggunakan eager loading.',
        'Implementasi custom autoloading optimasi composer classmap.',
        'Waktu respon server rata-rata terpangkas hingga 42% (diuji dengan benchmarking Apache).'
      ],
      github: 'https://github.com/bryanttinambunan/ask-me',
      demo: '#'
    },
    '2': {
      title: 'YouTube Sentiment Analysis',
      year: '2024',
      tag: 'Data Analytics',
      tagClass: 'tag-data',
      architecture: 'Membangun pipeline ekstraksi data komentar otomatis menggunakan <strong>Python BeautifulSoup & Selenium</strong> untuk memotong infinite scroll. Analisis data dilakukan dengan model NLP berbasis lexicon.',
      metrics: [
        'Scraping otomatis 10,000+ data komentar dari channel YouTube teraktif.',
        'Normalisasi text-processing tingkat lanjut (slang words, emoji, mixed languages).',
        'Visualisasi cluster sentimen menggunakan Pandas & Matplotlib secara langsung.'
      ],
      github: 'https://github.com/bryanttinambunan/youtube-sentiment',
      demo: '#'
    },
    '3': {
      title: 'Solana Wallet Analytics',
      year: '2024',
      tag: 'Blockchain Analytics',
      tagClass: 'tag-blockchain',
      architecture: 'Menghubungkan program analitik ke node Solana via RPC API untuk menarik data transaksi dompet on-chain. Algoritma <strong>K-Means Clustering</strong> dikonfigurasi menggunakan Scikit-learn.',
      metrics: [
        'Segmentasi 5,000+ dompet kripto aktif Solana berdasarkan profil transaksi.',
        'Optimasi jumlah klaster (K) terbaik lewat validasi silang Elbow Method & Silhouette Score.',
        'Identifikasi akurat 98% akun bot arbitrase dengan transaksi bervolume tinggi.'
      ],
      github: 'https://github.com/bryanttinambunan/solana-wallet-analytics',
      demo: '#'
    },
    '4': {
      title: 'Distributed Data Engineering',
      year: '2024',
      tag: 'Big Data Infrastructure',
      tagClass: 'tag-infra',
      architecture: 'Konfigurasi lingkungan Spark terdistribusi dengan HDFS sebagai shared storage. Aliran data didefinisikan dengan skema format <strong>Parquet kolumnar</strong> untuk efisiensi penyimpanan maksimal sebelum di-stream ke Google BigQuery.',
      metrics: [
        'Konfigurasi klaster Spark 3-node untuk membagi beban komputasi data terdistribusi.',
        'Efisiensi penyimpanan file terkompresi Parquet hingga 70% dibanding CSV standar.',
        'Schema validation terotomatisasi mencegah error mismatch data streaming Google BigQuery.'
      ],
      github: 'https://github.com/bryanttinambunan/bigdata-pipeline',
      demo: '#'
    }
  };

  // PROJECT DETAIL MODAL CONTROLLER
  const modal = document.getElementById('project-modal');
  const modalClose = document.getElementById('modal-close');
  const modalOverlay = document.getElementById('modal-overlay');
  
  const mTitle = document.getElementById('modal-title');
  const mYear = document.getElementById('modal-year');
  const mTag = document.getElementById('modal-tag');
  const mArch = document.getElementById('modal-architecture');
  const mMetrics = document.getElementById('modal-metrics');

  document.querySelectorAll('.project-item').forEach(item => {
    item.addEventListener('click', (e) => {
      // Prevent default navigation since it's a link to #
      e.preventDefault();
      
      const indexEl = item.querySelector('.project-index');
      if (!indexEl) return;
      const index = parseInt(indexEl.textContent.replace('0', '')); // '01' -> 1
      const data = projectDetails[index];
      
      if (data) {
        // Populate modal data
        mTitle.textContent = data.title;
        mYear.textContent = data.year;
        mTag.textContent = data.tag;
        mTag.className = 'modal-tag ' + data.tagClass;
        mArch.innerHTML = data.architecture;
        
        // Clear and add metrics
        mMetrics.innerHTML = '';
        data.metrics.forEach(m => {
          const li = document.createElement('li');
          li.innerHTML = m;
          mMetrics.appendChild(li);
        });
        
        // Open modal
        modal.classList.add('active');
      }
    });
  });

  const closeModal = () => {
    if (modal) modal.classList.remove('active');
  };
  
  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

  // CHATBOT WIDGET CONTROLLER
  const chatBubble = document.getElementById('chat-bubble');
  const chatWindow = document.getElementById('chat-window');
  const chatCloseBtn = document.getElementById('chat-close-btn');
  const chatInput = document.getElementById('chat-input');
  const chatSendBtn = document.getElementById('chat-send-btn');
  const chatBody = document.getElementById('chat-body');
  const bubblePing = chatBubble ? chatBubble.querySelector('.bubble-ping') : null;

  if (chatBubble && chatWindow && chatCloseBtn && chatInput && chatSendBtn && chatBody) {
    // Toggle Chat Window
    chatBubble.addEventListener('click', () => {
      chatWindow.classList.toggle('active');
      if (chatWindow.classList.contains('active')) {
        chatInput.focus();
        // Hide red ping notification when opened
        if (bubblePing) {
          bubblePing.style.display = 'none';
        }
      }
    });

    // Close Chat Window
    chatCloseBtn.addEventListener('click', () => {
      chatWindow.classList.remove('active');
    });

    // Send Message function
    const sendMessage = () => {
      const userText = chatInput.value.trim();
      if (!userText) return;

      // Clear input
      chatInput.value = '';

      // Append User message to Chat Body safely
      const userMsgDiv = document.createElement('div');
      userMsgDiv.className = 'chat-msg user';
      
      const userMsgText = document.createElement('div');
      userMsgText.className = 'msg-text';
      userMsgText.textContent = userText; // safe text content
      
      userMsgDiv.appendChild(userMsgText);
      chatBody.appendChild(userMsgDiv);
      
      // Auto Scroll
      chatBody.scrollTop = chatBody.scrollHeight;

      // Show typing indicator
      const typingIndicatorDiv = document.createElement('div');
      typingIndicatorDiv.className = 'chat-msg bot';
      typingIndicatorDiv.id = 'chat-typing-indicator';
      
      const typingMsgText = document.createElement('div');
      typingMsgText.className = 'msg-text';
      
      const typingIndicator = document.createElement('div');
      typingIndicator.className = 'typing-indicator';
      typingIndicator.innerHTML = '<span></span><span></span><span></span>';
      
      typingMsgText.appendChild(typingIndicator);
      typingIndicatorDiv.appendChild(typingMsgText);
      chatBody.appendChild(typingIndicatorDiv);
      
      // Auto Scroll
      chatBody.scrollTop = chatBody.scrollHeight;

      // Fetch from API
      fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: userText })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Remove typing indicator
        const indicator = document.getElementById('chat-typing-indicator');
        if (indicator) indicator.remove();

        // Append Bot response safely (supports HTML returned by bot/fallback)
        const botMsgDiv = document.createElement('div');
        botMsgDiv.className = 'chat-msg bot';
        
        const botMsgText = document.createElement('div');
        botMsgText.className = 'msg-text';
        botMsgText.innerHTML = data.response; // Allow innerHTML for linebreaks and bold styles from API
        
        botMsgDiv.appendChild(botMsgText);
        chatBody.appendChild(botMsgDiv);
        
        // Auto Scroll
        chatBody.scrollTop = chatBody.scrollHeight;
      })
      .catch(err => {
        console.error('Error fetching chat response:', err);
        // Remove typing indicator
        const indicator = document.getElementById('chat-typing-indicator');
        if (indicator) indicator.remove();

        // Append error fallback message
        const errMsgDiv = document.createElement('div');
        errMsgDiv.className = 'chat-msg bot';
        
        const errMsgText = document.createElement('div');
        errMsgText.className = 'msg-text';
        errMsgText.textContent = 'Maaf, sepertinya ada kendala koneksi. Coba lagi dalam beberapa saat ya!';
        
        errMsgDiv.appendChild(errMsgText);
        chatBody.appendChild(errMsgDiv);
        
        // Auto Scroll
        chatBody.scrollTop = chatBody.scrollHeight;
      });
    };

    // Trigger on Send button click
    chatSendBtn.addEventListener('click', sendMessage);

    // Trigger on Enter keypress
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
  }

  // LIGHT/DARK THEME TOGGLE CONTROLLER
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  if (themeToggleBtn) {
    const icon = themeToggleBtn.querySelector('.toggle-icon');
    
    // Check saved local storage preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      document.body.classList.add('light-theme');
      if (icon) icon.textContent = '🌙'; // Display moon to switch to dark
    } else {
      if (icon) icon.textContent = '☀️'; // Display sun to switch to light
    }

    themeToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('light-theme');
      
      if (document.body.classList.contains('light-theme')) {
        localStorage.setItem('theme', 'light');
        if (icon) icon.textContent = '🌙'; // Switch to moon icon
      } else {
        localStorage.setItem('theme', 'dark');
        if (icon) icon.textContent = '☀️'; // Switch to sun icon
      }
    });
  }

  // DYNAMIC CYBER PRELOADER CONTROLLER
  const preloader = document.getElementById('preloader');
  const preloaderProgress = document.getElementById('preloader-progress');
  const preloaderStatus = document.getElementById('preloader-status');
  const preloaderGreeting = document.getElementById('preloader-greeting');
  
  if (preloader && preloaderProgress) {
    // 1. Multilingual Greeting Cycles (every 500ms with fade in/out)
    if (preloaderGreeting) {
      const greetings = [
        "HALO",          // Indonesian
        "HELLO",         // English
        "こんにちは",    // Japanese (Hiragana)
        "HOLA",          // Spanish
        "BONJOUR",       // French
        "你好",          // Chinese (Hanzi)
        "안녕",          // Korean (Hangul)
        "SALVE",         // Latin
        "HALLO",         // German
        "SYSTEM READY"   // Cyber welcome
      ];
      let greetIndex = 0;
      
      const greetingInterval = setInterval(() => {
        greetIndex++;
        if (greetIndex >= greetings.length) {
          clearInterval(greetingInterval);
          return;
        }
        
        preloaderGreeting.classList.add('fade');
        setTimeout(() => {
          preloaderGreeting.textContent = greetings[greetIndex];
          preloaderGreeting.classList.remove('fade');
        }, 180);
      }, 500);
    }

    // 2. High-precision 5-second loading bar
    let startTime = null;
    const duration = 5000; // 5000ms = 5 seconds

    function stepPreloader(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(100, (elapsed / duration) * 100);

      preloaderProgress.style.width = progress + '%';

      if (progress < 25) {
        if (preloaderStatus) preloaderStatus.textContent = 'LOADING CORE DATABASE...';
      } else if (progress < 50) {
        if (preloaderStatus) preloaderStatus.textContent = 'SYNCING SOLANA NODES...';
      } else if (progress < 75) {
        if (preloaderStatus) preloaderStatus.textContent = 'ORCHESTRATING SPARK SESSION...';
      } else {
        if (preloaderStatus) preloaderStatus.textContent = 'RENDER SYSTEM READY';
      }

      if (elapsed < duration) {
        requestAnimationFrame(stepPreloader);
      } else {
        preloaderProgress.style.width = '100%';
        if (preloaderStatus) preloaderStatus.textContent = 'RENDER SYSTEM READY';
        setTimeout(() => {
          preloader.classList.add('fade-out');
        }, 300);
      }
    }

    requestAnimationFrame(stepPreloader);
  }

  // SCROLL PROGRESS & BACK TO TOP CONTROLLER
  const scrollProgress = document.getElementById('scroll-progress');
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    if (!scrollProgress) return;
    
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      const scrolledPercentage = (window.scrollY / totalHeight) * 100;
      scrollProgress.style.width = scrolledPercentage + '%';
    }

    if (backToTopBtn) {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add('active');
      } else {
        backToTopBtn.classList.remove('active');
      }
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // EMAIL CLICK TO COPY CONTROLLER
  const emailLinks = document.querySelectorAll('a[href^="mailto:bryanttinambunan12"]');
  const toast = document.getElementById('toast');

  emailLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault(); // Prevent opening default mail client
      
      const emailAddress = 'bryanttinambunan12@gmail.com';
      navigator.clipboard.writeText(emailAddress).then(() => {
        if (toast) {
          toast.classList.add('active');
          // Auto hide after 3 seconds
          setTimeout(() => {
            toast.classList.remove('active');
          }, 3000);
        }
      }).catch(err => {
        console.error('Failed to copy text: ', err);
      });
    });
  });

  // PROJECT FILTER CONTROLLER
  const filterBtns = document.querySelectorAll('.filter-btn');
  const pItems = document.querySelectorAll('.project-item');

  if (filterBtns.length > 0 && pItems.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Toggle active button style
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const category = btn.getAttribute('data-filter');

        pItems.forEach(item => {
          const tag = item.querySelector('.project-tag');
          if (!tag) return;

          let show = false;
          if (category === 'all') {
            show = true;
          } else {
            show = tag.classList.contains(category);
          }

          if (show) {
            item.style.display = 'flex';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'translateY(0) scale(1)';
            }, 50);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px) scale(0.95)';
            setTimeout(() => {
              item.style.display = 'none';
            }, 400); // Match CSS transition duration
          }
        });
      });
    });
  }

  // 1. CHERRY MX MECHANICAL KEYBOARD SOUND GENERATOR
  function playMechanicalClick(isEnterOrSpace = false) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      // Noise buffer for mechanical spring clack
      const bufferSize = ctx.sampleRate * 0.035; // 35ms clack
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.value = isEnterOrSpace ? 900 : 1800; // pitch shift space/enter down
      noiseFilter.Q.value = 4;
      
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(isEnterOrSpace ? 0.04 : 0.025, ctx.currentTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.025);
      
      // Triangle body tone oscillator
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      
      osc.type = 'triangle';
      const baseFreq = isEnterOrSpace ? 140 : 320;
      osc.frequency.setValueAtTime(baseFreq + Math.random() * 40, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.035);
      
      oscGain.gain.setValueAtTime(isEnterOrSpace ? 0.05 : 0.03, ctx.currentTime);
      oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);
      
      // Connect nodes
      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      
      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      
      // Execute sound waves
      noise.start();
      noise.stop(ctx.currentTime + 0.035);
      osc.start();
      osc.stop(ctx.currentTime + 0.035);
    } catch (e) {
      // Catch policy block
    }
  }

  // Bind mechanical clicking sound to terminal input and chatbot input
  const inputsToSound = [document.getElementById('terminal-input'), document.getElementById('chat-input')];
  inputsToSound.forEach(inp => {
    if (inp) {
      inp.addEventListener('keydown', (e) => {
        const isSpOrEnt = (e.key === ' ' || e.key === 'Enter');
        playMechanicalClick(isSpOrEnt);
      });
    }
  });

  // 2. INFINITE HSL COLOR SPECTRUM SWITCHER
  const hueSlider = document.getElementById('color-hue-slider');
  if (hueSlider) {
    hueSlider.addEventListener('input', (e) => {
      const hue = e.target.value;
      const newColor = `hsl(${hue}, 100%, 50%)`;
      document.documentElement.style.setProperty('--accent', newColor);
      
      // Remove presets active states if they custom customize
      document.querySelectorAll('.theme-presets .theme-btn').forEach(b => {
        b.classList.remove('active');
      });
    });
  }

  // THEME SWITCHER POPUP TOGGLE CONTROLLER
  const themeSwitcherToggle = document.getElementById('theme-switcher-toggle');
  const themeSwitcher = document.getElementById('theme-switcher');
  
  if (themeSwitcherToggle && themeSwitcher) {
    themeSwitcherToggle.addEventListener('click', () => {
      themeSwitcher.classList.toggle('active');
    });
    
    // Close the popup when clicking anywhere outside of it
    document.addEventListener('click', (e) => {
      if (!themeSwitcher.contains(e.target) && !themeSwitcherToggle.contains(e.target)) {
        themeSwitcher.classList.remove('active');
      }
    });
  }

  // 3. ACADEMIC LAB DETAIL DRAWER CONTROLLER
  const labDrawer = document.getElementById('lab-drawer');
  const drawerOverlay = document.getElementById('drawer-overlay');
  const drawerCloseBtn = document.getElementById('drawer-close');
  
  const dTitle = document.getElementById('drawer-title');
  const dNum = document.getElementById('drawer-num');
  const dDiag = document.getElementById('drawer-diagnostics');
  const dCode = document.getElementById('drawer-code-block');

  const labDiagDetails = {
    '01': {
      title: 'Database Systems Lab',
      diagnostics: 'Eksplorasi mendalam normalisasi skema, indexing strategy, dan query plan optimization di MySQL. Menganalisis execution plan (EXPLAIN) untuk mendeteksi bottleneck dan mengubah full table scan menjadi index range scan.',
      code: `-- EXPLAIN & OPTIMIZE MYSQL QUERIES
EXPLAIN SELECT * FROM users 
WHERE email = 'bryant@unimed.ac.id' AND status = 'active';

-- COVERING INDEX TO ERADICATE SLOW SCANNING
CREATE INDEX idx_users_email_status 
ON users(email, status);`
    },
    '02': {
      title: 'Operating Systems Lab',
      diagnostics: 'Simulasi penjadwalan proses CPU menggunakan algoritma Round Robin, Shortest Job First (SJF), First-Come First-Served (FCFS), dan studi deadlock algoritma Banker pada platform Linux.',
      code: `// ROUND ROBIN SCHEDULER IMPLEMENTATION (C++)
#include <iostream>
using namespace std;

void roundRobinScheduling(int processes[], int n, int bt[], int quantum) {
    int rem_bt[n];
    for (int i = 0 ; i < n ; i++) rem_bt[i] = bt[i];
    int t = 0;
    while (true) {
        bool done = true;
        for (int i = 0 ; i < n; i++) {
            if (rem_bt[i] > 0) {
                done = false;
                if (rem_bt[i] > quantum) {
                    t += quantum;
                    rem_bt[i] -= quantum;
                } else {
                    t = t + rem_bt[i];
                    rem_bt[i] = 0;
                }
            }
        }
        if (done) break;
    }
}`
    },
    '03': {
      title: 'Algorithm Optimization',
      diagnostics: 'Studi mendalam perbandingan kompleksitas waktu (Big-O) dan ruang, graf traversal (BFS & DFS), serta pohon pencarian biner (Binary Search Tree) untuk optimalisasi efisiensi pencarian data skala besar.',
      code: `# BINARY SEARCH TREE RETRIEVAL & INSERT (PYTHON)
class Node:
    def __init__(self, key):
        self.left = None
        self.right = None
        self.val = key

def insert(root, key):
    if root is None:
        return Node(key)
    else:
        if root.val == key:
            return root
        elif root.val < key:
            root.right = insert(root.right, key)
        else:
            root.left = insert(root.left, key)
    return root`
    }
  };

  document.querySelectorAll('.lab-card').forEach(card => {
    card.addEventListener('click', () => {
      const num = card.getAttribute('data-num');
      const details = labDiagDetails[num];
      
      if (details && labDrawer && dTitle && dNum && dDiag && dCode) {
        dNum.textContent = num;
        dTitle.textContent = details.title;
        dDiag.innerHTML = details.diagnostics;
        dCode.textContent = details.code;
        
        labDrawer.classList.add('active');
      }
    });
  });

  const closeLabDrawer = () => {
    if (labDrawer) labDrawer.classList.remove('active');
  };

  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeLabDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeLabDrawer);


  // ==========================================
  // 4. INTERACTIVE RETRACTABLE LANYARD PHYSICS
  // ==========================================
  const lanyardCard = document.getElementById('lanyard-card');
  const lanyardReel = document.getElementById('lanyard-reel');
  const strapPath = document.getElementById('lanyard-strap-path');
  const heroSection = document.querySelector('.hero');

  if (lanyardCard && lanyardReel && strapPath && heroSection) {
    let cardX = 0, cardY = 0;
    let vx = 0, vy = 0;
    let isDragging = false;
    let mouseX = 0, mouseY = 0;
    let grabX = 0, grabY = 0;
    let targetX = 0, targetY = 0;
    let reelX = 0, reelY = 0;
    
    // Tilt variables
    let tiltX = 0, tiltY = 0;

    // Initialization: set start position under the reel relative to hero, let it fall!
    const initHeroRect = heroSection.getBoundingClientRect();
    const initReelRect = lanyardReel.getBoundingClientRect();
    cardX = (initReelRect.left + initReelRect.width / 2) - initHeroRect.left;
    cardY = (initReelRect.bottom + 50) - initHeroRect.top;

    lanyardCard.addEventListener('mousedown', (e) => {
      if (window.innerWidth <= 1024) return;
      isDragging = true;
      const rect = lanyardCard.getBoundingClientRect();
      // Calculate grab offset relative to the center of the card
      grabX = e.clientX - (rect.left + rect.width / 2);
      grabY = e.clientY - rect.top;
      
      if (cursor && ring) {
        cursor.classList.add('hover');
        ring.classList.add('hover');
      }
      e.preventDefault();
    });

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (isDragging) {
        const heroRect = heroSection.getBoundingClientRect();
        cardX = mouseX - heroRect.left - grabX;
        cardY = mouseY - heroRect.top - grabY;
      }
    });

    window.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        if (cursor && ring) {
          cursor.classList.remove('hover');
          ring.classList.remove('hover');
        }
      }
    });

    // Touch support for mobile/tablets
    lanyardCard.addEventListener('touchstart', (e) => {
      if (window.innerWidth <= 1024) return;
      isDragging = true;
      const touch = e.touches[0];
      const rect = lanyardCard.getBoundingClientRect();
      grabX = touch.clientX - (rect.left + rect.width / 2);
      grabY = touch.clientY - rect.top;
    });

    window.addEventListener('touchmove', (e) => {
      if (isDragging) {
        const touch = e.touches[0];
        mouseX = touch.clientX;
        mouseY = touch.clientY;
        const heroRect = heroSection.getBoundingClientRect();
        cardX = mouseX - heroRect.left - grabX;
        cardY = mouseY - heroRect.top - grabY;
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      if (isDragging) {
        isDragging = false;
      }
    });

    lanyardCard.addEventListener('mouseenter', () => {
      if (window.innerWidth > 1024 && cursor && ring) {
        cursor.classList.add('hover');
        ring.classList.add('hover');
      }
    });

    lanyardCard.addEventListener('mouseleave', () => {
      if (!isDragging && cursor && ring) {
        cursor.classList.remove('hover');
        ring.classList.remove('hover');
      }
    });

    function updateLanyardPhysics() {
      if (window.innerWidth <= 1024) {
        // Reset absolute inline styles to let natural CSS media query styles place the card beautifully on mobile/tablet
        lanyardCard.style.position = '';
        lanyardCard.style.left = '';
        lanyardCard.style.top = '';
        lanyardCard.style.transform = '';
        lanyardCard.style.opacity = '';
        lanyardCard.style.visibility = '';
        lanyardCard.style.pointerEvents = '';
        strapPath.setAttribute('d', 'M 0 0');
        requestAnimationFrame(updateLanyardPhysics);
        return;
      }

      // 1. Calculate Reel anchor position (in Viewport coordinates)
      const reelRect = lanyardReel.getBoundingClientRect();
      reelX = reelRect.left + reelRect.width / 2;
      reelY = reelRect.bottom - 2;

      // 2. Calculate target resting position relative to the hero section
      const heroRect = heroSection.getBoundingClientRect();
      targetX = reelX - heroRect.left;
      
      // Responsive target Y relative to hero section top
      let targetYVal = 160;
      if (window.innerHeight < 700) {
        targetYVal = 130;
      }
      targetY = targetYVal;

      // 3. Active spring physics for desktop
      if (!isDragging) {
        const dx = targetX - cardX;
        const dy = targetY - cardY;
        
        const springTension = 0.06; // smooth tension
        const damping = 0.80;        // bounce bounce
        const gravity = 0.25;        // weight feel
        
        const ax = dx * springTension;
        const ay = dy * springTension + gravity;
        
        vx += ax;
        vy += ay;
        
        vx *= damping;
        vy *= damping;
        
        cardX += vx;
        cardY += vy;
      }

      // 4. Keep card inside bounds of the hero container
      const cardRect = lanyardCard.getBoundingClientRect();
      const halfWidth = cardRect.width / 2;
      
      const minX = halfWidth;
      const maxX = heroRect.width - halfWidth;
      const minY = 20;
      const maxY = heroRect.height - 20;

      if (cardX < minX) { cardX = minX; vx = 0; }
      if (cardX > maxX) { cardX = maxX; vx = 0; }
      if (cardY < minY) { cardY = minY; vy = 0; }
      if (cardY > maxY) { cardY = maxY; vy = 0; }

      // 5. Update Card Inline Styles (Absolute positioning inside relative hero)
      lanyardCard.style.position = 'absolute';
      lanyardCard.style.left = '0px';
      lanyardCard.style.top = '0px';

      // Smoothly fade out the lanyard when scrolling down past the hero
      const scrollY = window.scrollY;
      let opacity = 1;
      if (scrollY > 50) {
        opacity = Math.max(0, 1 - (scrollY - 50) / 200);
      }
      lanyardCard.style.opacity = opacity;
      
      if (opacity <= 0) {
        lanyardCard.style.pointerEvents = 'none';
        lanyardCard.style.visibility = 'hidden';
      } else {
        lanyardCard.style.pointerEvents = 'auto';
        lanyardCard.style.visibility = 'visible';
      }

      // 6. Calculate 3D tilt angles based on velocity & mouse drag
      let targetTiltX = 0;
      let targetTiltY = 0;

      if (isDragging) {
        targetTiltX = -vy * 1.5;
        targetTiltY = vx * 1.5;
      } else {
        targetTiltX = -vy * 0.8;
        targetTiltY = vx * 0.8;
      }

      // Clamping tilt to max 25 degrees
      const maxTilt = 25;
      targetTiltX = Math.max(-maxTilt, Math.min(maxTilt, targetTiltX));
      targetTiltY = Math.max(-maxTilt, Math.min(maxTilt, targetTiltY));

      // Interpolation for laggy tilt feel
      tiltX += (targetTiltX - tiltX) * 0.1;
      tiltY += (targetTiltY - tiltY) * 0.1;

      // Transform card with Translate3D for maximum smooth GPU rendering
      lanyardCard.style.transform = `translate3d(${cardX - cardRect.width / 2}px, ${cardY}px, 0) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;

      // 7. Draw the dynamic rope (represented in viewport coordinates for perfect scroll matching)
      if (opacity > 0) {
        strapPath.style.opacity = opacity;
        
        // Obtain actual viewport coordinates of the card clip
        const currentCardRect = lanyardCard.getBoundingClientRect();
        const endStrapX = currentCardRect.left + currentCardRect.width / 2;
        const endStrapY = currentCardRect.top + 14;

        const dxStrap = endStrapX - reelX;
        const dyStrap = endStrapY - reelY;
        const dist = Math.sqrt(dxStrap * dxStrap + dyStrap * dyStrap);

        // Catenary sag calculation (only if distance is smaller than strap natural length)
        const naturalLength = 240;
        let sag = 0;
        if (dist < naturalLength) {
          sag = (naturalLength - dist) * 0.65; // more sag when close
        }

        // Middle control point pull
        const cx = (reelX + endStrapX) / 2;
        const cy = (reelY + endStrapY) / 2 + sag;

        // Update path d attribute with quadratic bezier curve
        strapPath.setAttribute('d', `M ${reelX} ${reelY} Q ${cx} ${cy} ${endStrapX} ${endStrapY}`);
      } else {
        strapPath.style.opacity = 0;
        strapPath.setAttribute('d', 'M 0 0');
      }

      requestAnimationFrame(updateLanyardPhysics);
    }

    // Start physics loop
    requestAnimationFrame(updateLanyardPhysics);
  }


