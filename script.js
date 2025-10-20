// Quiz Data
const quizData = [
    {
        question: "What is the primary purpose of CSS media queries?",
        options: [
            "To create animations",
            "To make websites responsive to different screen sizes",
            "To add JavaScript functionality",
            "To optimize images"
        ],
        correct: 1
    },
    {
        question: "Which JavaScript method is used to fetch data from an API?",
        options: [
            "getData()",
            "fetch()",
            "request()",
            "ajax()"
        ],
        correct: 1
    },
    {
        question: "What does the CSS property 'transform' do?",
        options: [
            "Changes text color",
            "Modifies the size of elements",
            "Applies 2D or 3D transformations to elements",
            "Controls element positioning"
        ],
        correct: 2
    },
    {
        question: "Which HTML element is used to create a clickable button?",
        options: [
            "<click>",
            "<button>",
            "<link>",
            "<input type='submit'>"
        ],
        correct: 1
    },
    {
        question: "What is the purpose of the 'addEventListener' method in JavaScript?",
        options: [
            "To add CSS styles",
            "To create HTML elements",
            "To attach event handlers to elements",
            "To validate form data"
        ],
        correct: 2
    }
];

// Quiz Class
class Quiz {
    constructor() {
        this.currentQuestion = 0;
        this.score = 0;
        this.totalQuestions = quizData.length;
        this.userAnswers = [];
        this.initializeQuiz();
    }

    initializeQuiz() {
        this.bindEvents();
        this.displayQuestion();
        this.updateProgress();
    }

    bindEvents() {
        document.getElementById('restartQuiz').addEventListener('click', () => this.restartQuiz());
    }

    displayQuestion() {
        const question = quizData[this.currentQuestion];
        const questionTitle = document.getElementById('questionTitle');
        const optionsContainer = document.getElementById('optionsContainer');

        questionTitle.textContent = question.question;
        optionsContainer.innerHTML = '';

        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.textContent = option;
            optionElement.addEventListener('click', () => this.selectOption(index));
            optionsContainer.appendChild(optionElement);
        });
    }

    selectOption(selectedIndex) {
        const question = quizData[this.currentQuestion];
        const options = document.querySelectorAll('.option');
        
        // Remove previous selections
        options.forEach(option => {
            option.classList.remove('selected');
        });

        // Mark selected option
        options[selectedIndex].classList.add('selected');
        this.userAnswers[this.currentQuestion] = selectedIndex;

        // Auto-advance after a short delay
        setTimeout(() => {
            this.nextQuestion();
        }, 1000);
    }

    nextQuestion() {
        const question = quizData[this.currentQuestion];
        const options = document.querySelectorAll('.option');
        const selectedIndex = this.userAnswers[this.currentQuestion];

        // Show correct/incorrect answers
        options.forEach((option, index) => {
            option.style.pointerEvents = 'none';
            if (index === question.correct) {
                option.classList.add('correct');
            } else if (index === selectedIndex && selectedIndex !== question.correct) {
                option.classList.add('incorrect');
            }
        });

        // Update score
        if (selectedIndex === question.correct) {
            this.score++;
        }

        // Update progress
        this.updateProgress();

        // Move to next question or show results
        setTimeout(() => {
            this.currentQuestion++;
            if (this.currentQuestion < this.totalQuestions) {
                this.displayQuestion();
            } else {
                this.showResults();
            }
        }, 2000);
    }

    updateProgress() {
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        const currentScore = document.getElementById('currentScore');

        const progress = ((this.currentQuestion + 1) / this.totalQuestions) * 100;
        progressFill.style.width = `${progress}%`;
        progressText.textContent = `Question ${this.currentQuestion + 1} of ${this.totalQuestions}`;
        currentScore.textContent = this.score;
    }

    showResults() {
        document.getElementById('questionContainer').classList.add('hidden');
        document.getElementById('quizResults').classList.remove('hidden');
        
        const finalScore = document.getElementById('finalScore');
        const scoreText = document.getElementById('scoreText');
        
        finalScore.textContent = `${this.score}/${this.totalQuestions}`;
        
        const percentage = (this.score / this.totalQuestions) * 100;
        if (percentage >= 80) {
            scoreText.textContent = 'Excellent! You have great web development knowledge!';
        } else if (percentage >= 60) {
            scoreText.textContent = 'Good job! You have a solid understanding.';
        } else if (percentage >= 40) {
            scoreText.textContent = 'Not bad! Keep learning and practicing.';
        } else {
            scoreText.textContent = 'Keep studying! Web development takes practice.';
        }
    }

    restartQuiz() {
        this.currentQuestion = 0;
        this.score = 0;
        this.userAnswers = [];
        
        document.getElementById('questionContainer').classList.remove('hidden');
        document.getElementById('quizResults').classList.add('hidden');
        
        this.displayQuestion();
        this.updateProgress();
    }
}

// Image Carousel Class
class ImageCarousel {
    constructor() {
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.carousel-slide');
        this.totalSlides = this.slides.length;
        this.autoPlayInterval = null;
        this.isAutoPlaying = false;
        this.initializeCarousel();
    }

    initializeCarousel() {
        this.createIndicators();
        this.bindEvents();
        this.updateCarousel();
    }

    createIndicators() {
        const indicatorsContainer = document.getElementById('carouselIndicators');
        indicatorsContainer.innerHTML = '';

        for (let i = 0; i < this.totalSlides; i++) {
            const indicator = document.createElement('div');
            indicator.className = 'indicator';
            if (i === 0) indicator.classList.add('active');
            indicator.addEventListener('click', () => this.goToSlide(i));
            indicatorsContainer.appendChild(indicator);
        }
    }

    bindEvents() {
        document.getElementById('prevBtn').addEventListener('click', () => this.previousSlide());
        document.getElementById('nextBtn').addEventListener('click', () => this.nextSlide());
        document.getElementById('autoPlayBtn').addEventListener('click', () => this.startAutoPlay());
        document.getElementById('pauseBtn').addEventListener('click', () => this.pauseAutoPlay());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.previousSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });

        // Touch/swipe support
        let startX = 0;
        let endX = 0;

        const carouselWrapper = document.querySelector('.carousel-wrapper');
        
        carouselWrapper.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        carouselWrapper.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            this.handleSwipe(startX, endX);
        });
    }

    handleSwipe(startX, endX) {
        const swipeThreshold = 50;
        const diff = startX - endX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.previousSlide();
            }
        }
    }

    goToSlide(slideIndex) {
        this.currentSlide = slideIndex;
        this.updateCarousel();
        this.resetAutoPlay();
    }

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.updateCarousel();
        this.resetAutoPlay();
    }

    previousSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.updateCarousel();
        this.resetAutoPlay();
    }

    updateCarousel() {
        const track = document.getElementById('carouselTrack');
        const indicators = document.querySelectorAll('.indicator');

        // Update track position
        track.style.transform = `translateX(-${this.currentSlide * 100}%)`;

        // Update indicators
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });
    }

    startAutoPlay() {
        if (this.isAutoPlaying) return;
        
        this.isAutoPlaying = true;
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, 3000);

        document.getElementById('autoPlayBtn').textContent = 'Auto Playing...';
        document.getElementById('autoPlayBtn').disabled = true;
        document.getElementById('pauseBtn').disabled = false;
    }

    pauseAutoPlay() {
        this.isAutoPlaying = false;
        clearInterval(this.autoPlayInterval);
        
        document.getElementById('autoPlayBtn').textContent = 'Start Auto Play';
        document.getElementById('autoPlayBtn').disabled = false;
        document.getElementById('pauseBtn').disabled = true;
    }

    resetAutoPlay() {
        if (this.isAutoPlaying) {
            this.pauseAutoPlay();
            this.startAutoPlay();
        }
    }
}

// API Integration Class
class APIManager {
    constructor() {
        this.weatherApiKey = 'demo'; // Using demo key for OpenWeatherMap
        this.initializeAPI();
    }

    initializeAPI() {
        this.bindEvents();
    }

    bindEvents() {
        document.getElementById('fetchWeatherBtn').addEventListener('click', () => this.fetchWeather());
        document.getElementById('fetchJokeBtn').addEventListener('click', () => this.fetchJoke());
        document.getElementById('newJokeBtn').addEventListener('click', () => this.fetchJoke());
    }

    showLoading() {
        this.hideAllResults();
        document.getElementById('loadingSpinner').classList.remove('hidden');
    }

    hideLoading() {
        document.getElementById('loadingSpinner').classList.add('hidden');
    }

    showError() {
        this.hideAllResults();
        document.getElementById('errorMessage').classList.remove('hidden');
    }

    hideAllResults() {
        document.getElementById('weatherCard').classList.add('hidden');
        document.getElementById('jokeCard').classList.add('hidden');
        document.getElementById('loadingSpinner').classList.add('hidden');
        document.getElementById('errorMessage').classList.add('hidden');
    }

    async fetchWeather() {
        const cityInput = document.getElementById('cityInput');
        const city = cityInput.value.trim();

        if (!city) {
            alert('Please enter a city name');
            return;
        }

        this.showLoading();

        try {
            // Using a free weather API that doesn't require a key
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=demo&units=metric`);
            
            if (!response.ok) {
                throw new Error('Weather data not found');
            }

            const data = await response.json();
            this.displayWeather(data);
        } catch (error) {
            console.error('Weather fetch error:', error);
            // Fallback to demo data if API fails
            this.displayDemoWeather(city);
        }
    }

    displayWeather(data) {
        this.hideLoading();
        
        const weatherContent = document.getElementById('weatherContent');
        const weatherCard = document.getElementById('weatherCard');
        
        weatherContent.innerHTML = `
            <div class="weather-info">
                <h4>${data.name}, ${data.sys.country}</h4>
                <div class="weather-main">
                    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="${data.weather[0].description}" style="width: 60px; height: 60px;">
                    <div>
                        <div class="temperature">${Math.round(data.main.temp)}°C</div>
                        <div class="description">${data.weather[0].description}</div>
                    </div>
                </div>
                <div class="weather-details">
                    <div class="detail-item">
                        <strong>Feels like:</strong> ${Math.round(data.main.feels_like)}°C
                    </div>
                    <div class="detail-item">
                        <strong>Humidity:</strong> ${data.main.humidity}%
                    </div>
                    <div class="detail-item">
                        <strong>Wind Speed:</strong> ${data.wind.speed} m/s
                    </div>
                    <div class="detail-item">
                        <strong>Pressure:</strong> ${data.main.pressure} hPa
                    </div>
                </div>
            </div>
        `;
        
        weatherCard.classList.remove('hidden');
    }

    displayDemoWeather(city) {
        this.hideLoading();
        
        const weatherContent = document.getElementById('weatherContent');
        const weatherCard = document.getElementById('weatherCard');
        
        // Demo weather data
        const demoWeather = {
            name: city,
            sys: { country: 'Demo' },
            weather: [{ icon: '01d', description: 'Clear sky' }],
            main: {
                temp: Math.floor(Math.random() * 30) + 10,
                feels_like: Math.floor(Math.random() * 30) + 10,
                humidity: Math.floor(Math.random() * 40) + 40,
                pressure: Math.floor(Math.random() * 100) + 1000
            },
            wind: { speed: Math.floor(Math.random() * 10) + 1 }
        };
        
        this.displayWeather(demoWeather);
    }

    async fetchJoke() {
        this.showLoading();

        try {
            // Using a free joke API
            const response = await fetch('https://official-joke-api.appspot.com/random_joke');
            
            if (!response.ok) {
                throw new Error('Failed to fetch joke');
            }

            const data = await response.json();
            this.displayJoke(data);
        } catch (error) {
            console.error('Joke fetch error:', error);
            // Fallback to demo joke
            this.displayDemoJoke();
        }
    }

    displayJoke(data) {
        this.hideLoading();
        
        const jokeContent = document.getElementById('jokeContent');
        const jokeCard = document.getElementById('jokeCard');
        
        jokeContent.innerHTML = `
            <div class="joke-setup">${data.setup}</div>
            <div class="joke-punchline">${data.punchline}</div>
        `;
        
        jokeCard.classList.remove('hidden');
    }

    displayDemoJoke() {
        this.hideLoading();
        
        const demoJokes = [
            {
                setup: "Why don't scientists trust atoms?",
                punchline: "Because they make up everything!"
            },
            {
                setup: "Why did the scarecrow win an award?",
                punchline: "He was outstanding in his field!"
            },
            {
                setup: "What do you call a fake noodle?",
                punchline: "An impasta!"
            },
            {
                setup: "Why don't eggs tell jokes?",
                punchline: "They'd crack each other up!"
            },
            {
                setup: "What do you call a bear with no teeth?",
                punchline: "A gummy bear!"
            }
        ];
        
        const randomJoke = demoJokes[Math.floor(Math.random() * demoJokes.length)];
        this.displayJoke(randomJoke);
    }
}

// Smooth scrolling for navigation links
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Initialize animations on scroll
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Observe all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    new Quiz();
    new ImageCarousel();
    new APIManager();
    
    // Initialize additional features
    initializeSmoothScrolling();
    initializeScrollAnimations();
    
    // Add loading animation to the page
    document.body.classList.add('fade-in');
    
    console.log('Advanced Web Development Project initialized successfully!');
});

// Add some additional CSS for weather display
const additionalStyles = `
    .weather-main {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        margin: 1rem 0;
    }
    
    .temperature {
        font-size: 2rem;
        font-weight: 700;
        color: #667eea;
    }
    
    .description {
        font-size: 1.1rem;
        color: #666;
        text-transform: capitalize;
    }
    
    .weather-details {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.5rem;
        margin-top: 1rem;
        text-align: left;
    }
    
    .detail-item {
        padding: 0.5rem;
        background: white;
        border-radius: 5px;
        font-size: 0.9rem;
    }
    
    .joke-setup {
        font-size: 1.2rem;
        font-weight: 600;
        margin-bottom: 1rem;
        color: #333;
    }
    
    .joke-punchline {
        font-size: 1.1rem;
        color: #667eea;
        font-weight: 500;
        font-style: italic;
    }
    
    @media (max-width: 768px) {
        .weather-main {
            flex-direction: column;
            text-align: center;
        }
        
        .weather-details {
            grid-template-columns: 1fr;
        }
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
