// Configuración global
let currentUser = null;
let map = null;
let lastScrollTop = 0;
let isHeaderVisible = true;

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    checkAuthStatus();
});

// Inicializar aplicación
function initializeApp() {
    if (document.getElementById('mapContainer')) {
        initializeMap();
    }
    setupRetractableHeader();
    setupSmoothScroll();
}

// Configurar event listeners
function setupEventListeners() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // Cerrar menús al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.profile-btn') && !e.target.closest('.profile-menu')) {
            const profileMenu = document.getElementById('profileMenu');
            if (profileMenu) profileMenu.classList.add('hidden');
        }
    });
}

// Verificar estado de autenticación
function checkAuthStatus() {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
        try {
            currentUser = JSON.parse(userData);
            showMainApp();
            updateUserInfo();
        } catch (error) {
            logout();
        }
    } else {
        showLoginScreen();
    }
}

// Mostrar pantalla de login
function showLoginScreen() {
    const loginScreen = document.getElementById('loginScreen');
    const registerScreen = document.getElementById('registerScreen');
    const mainApp = document.getElementById('mainApp');
    
    if (loginScreen) loginScreen.classList.remove('hidden');
    if (registerScreen) registerScreen.classList.add('hidden');
    if (mainApp) mainApp.classList.add('hidden');
}

// Mostrar pantalla de registro
function showRegister() {
    const loginScreen = document.getElementById('loginScreen');
    const registerScreen = document.getElementById('registerScreen');
    const mainApp = document.getElementById('mainApp');
    
    if (loginScreen) loginScreen.classList.add('hidden');
    if (registerScreen) registerScreen.classList.remove('hidden');
    if (mainApp) mainApp.classList.add('hidden');
}

// Mostrar aplicación principal
function showMainApp() {
    const loginScreen = document.getElementById('loginScreen');
    const registerScreen = document.getElementById('registerScreen');
    const mainApp = document.getElementById('mainApp');
    
    if (loginScreen) loginScreen.classList.add('hidden');
    if (registerScreen) registerScreen.classList.add('hidden');
    if (mainApp) mainApp.classList.remove('hidden');
    
    setTimeout(() => {
        initializeMap();
        setupRetractableHeader();
    }, 100);
}

// Manejar login
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    showLoading(true);
    
    try {
        await simulateApiCall(1000);
        
        currentUser = {
            id: 1,
            name: 'Usuario Demo',
            email: email,
            avatar: 'https://via.placeholder.com/60x60/2563eb/ffffff?text=U'
        };
        
        localStorage.setItem('authToken', 'demo-token-' + Date.now());
        localStorage.setItem('userData', JSON.stringify(currentUser));
        
        showMainApp();
        updateUserInfo();
        showNotification('¡Bienvenido!', 'success');
        
    } catch (error) {
        showNotification('Error al iniciar sesión', 'error');
    } finally {
        showLoading(false);
    }
}

// Manejar registro
async function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    if (password !== confirmPassword) {
        showNotification('Las contraseñas no coinciden', 'error');
        return;
    }
    
    if (!agreeTerms) {
        showNotification('Debes aceptar los términos', 'error');
    return;
  }

    showLoading(true);
    
    try {
        await simulateApiCall(1500);
        
        currentUser = {
            id: 1,
            name: name,
            email: email,
            avatar: 'https://via.placeholder.com/60x60/2563eb/ffffff?text=' + name.charAt(0).toUpperCase()
        };
        
        localStorage.setItem('authToken', 'demo-token-' + Date.now());
        localStorage.setItem('userData', JSON.stringify(currentUser));
        
        showMainApp();
        updateUserInfo();
        showNotification('¡Cuenta creada!', 'success');
        
    } catch (error) {
        showNotification('Error al crear cuenta', 'error');
    } finally {
        showLoading(false);
    }
}

// Cerrar sesión
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    currentUser = null;
    showLoginScreen();
    showNotification('Sesión cerrada', 'info');
}

// Actualizar información del usuario
function updateUserInfo() {
    if (currentUser) {
        const userNameElement = document.getElementById('userName');
        const userEmailElement = document.getElementById('userEmail');
        const profileAvatar = document.querySelector('.profile-avatar');
        const profileAvatarLarge = document.querySelector('.profile-avatar-large');
        
        if (userNameElement) userNameElement.textContent = currentUser.name;
        if (userEmailElement) userEmailElement.textContent = currentUser.email;
        if (profileAvatar) profileAvatar.src = currentUser.avatar;
        if (profileAvatarLarge) profileAvatarLarge.src = currentUser.avatar;
    }
}

// Configurar header retráctil
function setupRetractableHeader() {
    const mainContent = document.getElementById('mainContent');
    const mainHeader = document.getElementById('mainHeader');
    
    if (!mainContent || !mainHeader) return;
    
    let scrollTimeout;
    
    mainContent.addEventListener('scroll', function() {
        const scrollTop = mainContent.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            if (isHeaderVisible) {
                mainHeader.classList.add('header-hidden');
                isHeaderVisible = false;
            }
        } else if (scrollTop < lastScrollTop) {
            if (!isHeaderVisible) {
                mainHeader.classList.remove('header-hidden');
                isHeaderVisible = true;
            }
        }
        
        lastScrollTop = scrollTop;
        
        clearTimeout(scrollTimeout);
        
        scrollTimeout = setTimeout(() => {
            if (!isHeaderVisible) {
                mainHeader.classList.remove('header-hidden');
                isHeaderVisible = true;
            }
        }, 1000);
    });
}

// Configurar scroll suave
function setupSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-item[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            const mainContent = document.getElementById('mainContent');
            
            if (targetSection && mainContent) {
                mainContent.scrollTo({
                    top: targetSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
    });
  });
}

// Variables globales para el mapa
let markers = [];
let userMarker = null;
let currentLocation = null;

// Gestor de sonidos sutiles para interacciones de UI
const SoundManager = (() => {
    let ctx;
    let ambientAudio = null;
    function ensure() {
        if (!ctx) {
            const Ctx = window.AudioContext || window.webkitAudioContext;
            if (Ctx) ctx = new Ctx();
        }
    }
    function createAmbientSound() {
        ensure();
        if (!ctx) return null;
        
        // Crear sonido ambiental de naturaleza/playa
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        
        // Configurar filtro para sonido más suave
        filter.type = 'lowpass';
        filter.frequency.value = 800;
        filter.Q.value = 1;
        
        // Configurar ganancia muy baja para sonido de fondo
        gainNode.gain.setValueAtTime(0.01, ctx.currentTime);
        
        // Frecuencia baja para sonido ambiental
        oscillator.type = 'sine';
        oscillator.frequency.value = 180;
        
        // Conectar nodos
        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        return { oscillator, gainNode };
    }
    function tone({ freq = 520, dur = 100, type = 'sine', vol = 0.03 } = {}) {
        ensure();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        gain.gain.value = vol;
        osc.connect(gain).connect(ctx.destination);
        const t = ctx.currentTime;
        osc.start(t);
        osc.stop(t + dur / 1000);
    }
    return {
        click: () => tone({ freq: 520, dur: 80 }),
        success: () => tone({ freq: 700, dur: 120, type: 'triangle' }),
        info: () => tone({ freq: 600, dur: 100 }),
        openModal: () => tone({ freq: 480, dur: 90 }),
        toggle: () => tone({ freq: 420, dur: 70, type: 'square' }),
        startAmbient: () => {
            if (ambientAudio) return;
            ambientAudio = createAmbientSound();
            if (ambientAudio) {
                ambientAudio.oscillator.start();
            }
        },
        stopAmbient: () => {
            if (ambientAudio) {
                ambientAudio.oscillator.stop();
                ambientAudio = null;
            }
        }
    };
})();

// Inicializar mapa de Google Maps
function initializeMap() {
    const mapContainer = document.getElementById('mapContainer');
    if (!mapContainer || map) return;
    
    // Coordenadas por defecto (El Salvador)
    const calucoCoords = CONFIG.DEFAULT_LOCATION;
    
    // Configuración del mapa
    const mapOptions = {
        center: calucoCoords,
        zoom: CONFIG.MAP_CONFIG.zoom,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: [
            {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
            }
        ]
    };
    
    // Crear el mapa
    map = new google.maps.Map(mapContainer, mapOptions);
    
    // Agregar marcadores de destinos
    addDestinationMarkers();
    
    // Intentar obtener ubicación del usuario
    getCurrentLocation();
}

// Agregar marcadores de destinos
function addDestinationMarkers() {
    const destinations = [
        {
            id: 'el-tunco',
            name: 'Playa El Tunco',
            coords: { lat: 13.4947, lng: -89.4392 },
            description: 'Playa icónica para surf y atardeceres en La Libertad',
            icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="16" cy="16" r="16" fill="#1f3a93" opacity="0.85"/>
                        <path d="M6 20 C10 16, 22 24, 26 20 L26 26 L6 26 Z" fill="#d97706"/>
                    </svg>
                `),
                scaledSize: new google.maps.Size(32, 32),
                anchor: new google.maps.Point(16, 16)
            }
        },
        {
            id: 'el-boqueron',
            name: 'Parque Nacional El Boquerón',
            coords: { lat: 13.7346, lng: -89.2903 },
            description: 'Volcán de San Salvador con miradores y senderos',
            icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="16" cy="16" r="16" fill="#0f766e" opacity="0.85"/>
                        <path d="M8 24 L16 10 L24 24 Z" fill="#1f3a93"/>
                    </svg>
                `),
                scaledSize: new google.maps.Size(32, 32),
                anchor: new google.maps.Point(16, 16)
            }
        },
        {
            id: 'coatepeque',
            name: 'Lago de Coatepeque',
            coords: { lat: 13.8417, lng: -89.5526 },
            description: 'Lago volcánico de aguas turquesa en Santa Ana',
            icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="16" cy="16" r="16" fill="#d97706" opacity="0.85"/>
                        <circle cx="16" cy="18" r="8" fill="#ffffff"/>
                    </svg>
                `),
                scaledSize: new google.maps.Size(32, 32),
                anchor: new google.maps.Point(16, 16)
            }
        }
    ];
    
    destinations.forEach(dest => {
        const marker = new google.maps.Marker({
            position: dest.coords,
            map: map,
            title: dest.name,
            icon: dest.icon,
            animation: google.maps.Animation.DROP
        });
        
        // Crear ventana de información
        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div style="padding: 10px; max-width: 200px;">
                    <h3 style=\"margin: 0 0 8px 0; color: #1f3a93; font-size: 14px;\">${dest.name}</h3>
                    <p style="margin: 0; color: #6b7280; font-size: 12px;">${dest.description}</p>
                    <div style="margin-top: 10px;">
                        <button onclick="showDestinationDetails('${dest.id}')" style="background: #2563eb; color: white; border: none; padding: 5px 10px; border-radius: 4px; font-size: 11px; cursor: pointer;">Ver Detalles</button>
                        <button onclick=\"getDirections('${dest.id}')\" style=\"background: #0f766e; color: white; border: none; padding: 5px 10px; border-radius: 4px; font-size: 11px; cursor: pointer; margin-left: 5px;\">Ruta</button>
                    </div>
                </div>
            `
        });
        
        // Agregar evento de clic al marcador
        marker.addListener('click', () => {
            infoWindow.open(map, marker);
            SoundManager.click();
        });
        
        // Guardar referencia al marcador
        markers.push({
            id: dest.id,
            marker: marker,
            infoWindow: infoWindow
  });
});
}

// Obtener ubicación actual del usuario
function getCurrentLocation() {
    if (!navigator.geolocation) {
        showNotification('La geolocalización no está disponible en tu navegador', 'error');
        return;
    }
    
    showNotification('Obteniendo tu ubicación...', 'info');
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            
            currentLocation = pos;
            
            // Crear o actualizar marcador del usuario
            if (userMarker) {
                userMarker.setMap(null);
            }
            
            userMarker = new google.maps.Marker({
                position: pos,
                map: map,
                title: 'Tu ubicación',
                icon: {
                    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="12" fill="#10b981" opacity="0.8"/>
                            <circle cx="12" cy="12" r="6" fill="#ffffff"/>
                            <circle cx="12" cy="12" r="3" fill="#10b981"/>
                        </svg>
                    `),
                    scaledSize: new google.maps.Size(24, 24),
                    anchor: new google.maps.Point(12, 12)
                },
                animation: google.maps.Animation.BOUNCE
            });
            
            // Centrar mapa en la ubicación del usuario
            map.setCenter(pos);
            map.setZoom(14);
            
            showNotification('Ubicación obtenida correctamente', 'success');
        },
        (error) => {
            console.error('Error obteniendo ubicación:', error);
            showNotification('No se pudo obtener tu ubicación', 'error');
        },
        CONFIG.GEOLOCATION_CONFIG
    );
}

// Mostrar todos los destinos en el mapa
function showAllDestinations() {
    if (!map || markers.length === 0) return;
    
    const bounds = new google.maps.LatLngBounds();
    
    // Agregar todos los marcadores al bounds
    markers.forEach(markerObj => {
        bounds.extend(markerObj.marker.getPosition());
    });
    
    // Si hay ubicación del usuario, incluirla también
    if (currentLocation) {
        bounds.extend(currentLocation);
    }
    
    // Ajustar el mapa para mostrar todos los marcadores
    map.fitBounds(bounds);
    
    // Ajustar el zoom si es muy cercano
    google.maps.event.addListenerOnce(map, 'bounds_changed', () => {
        if (map.getZoom() > 15) {
            map.setZoom(12);
        }
    });
    
    showNotification('Mostrando todos los destinos', 'info');
}

// Resaltar marcador específico
function highlightMapMarker(destinationId) {
    const markerObj = markers.find(m => m.id === destinationId);
    if (markerObj) {
        // Centrar mapa en el marcador
        map.setCenter(markerObj.marker.getPosition());
        map.setZoom(15);
        
        // Abrir ventana de información
        markerObj.infoWindow.open(map, markerObj.marker);
        
        // Animar el marcador
        markerObj.marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(() => {
            markerObj.marker.setAnimation(null);
        }, 1500);
    }
}

// Funciones de navegación
function setActiveNav(element) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    element.classList.add('active');
}

function toggleProfileMenu() {
    const profileMenu = document.getElementById('profileMenu');
    if (profileMenu) {
        profileMenu.classList.toggle('hidden');
    }
}

function toggleSearch() {
    const searchBar = document.getElementById('searchBar');
    if (searchBar) {
        searchBar.classList.toggle('hidden');
        if (!searchBar.classList.contains('hidden')) {
            const searchInput = searchBar.querySelector('input');
            searchInput.focus();
            // Limpiar búsqueda anterior
            searchInput.value = '';
            clearSearchResults();
        }
    }
}

// Función para manejar la búsqueda
function handleSearch() {
    const searchInput = document.querySelector('#searchBar input');
    const query = searchInput.value.toLowerCase().trim();
    
    if (query.length === 0) {
        clearSearchResults();
        return;
    }
    
    // Base de datos de destinos con variaciones de nombres
    const destinations = {
        'el-tunco': {
            name: 'Playa El Tunco',
            aliases: ['tunco', 'playa el tunco', 'la libertad', 'surf', 'playa'],
            description: 'Playa icónica para surf y atardeceres en La Libertad.',
            image: 'https://upload.wikimedia.org/wikipedia/commons/5/5f/El_Tunco%2C_El_Salvador.jpg'
        },
        'el-boqueron': {
            name: 'Parque Nacional El Boquerón',
            aliases: ['boqueron', 'volcan', 'san salvador', 'parque nacional', 'mirador'],
            description: 'Volcán de San Salvador con miradores y senderos.',
            image: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Boqueron_Crater.jpg'
        },
        'coatepeque': {
            name: 'Lago de Coatepeque',
            aliases: ['coatepeque', 'lago', 'santa ana', 'turquesa', 'mirador'],
            description: 'Lago volcánico de aguas turquesa en Santa Ana.',
            image: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Lago_de_Coatepeque.jpg'
        }
    };
    
    // Buscar coincidencias
    const results = [];
    
    Object.keys(destinations).forEach(id => {
        const dest = destinations[id];
        const searchTerms = [dest.name.toLowerCase(), ...dest.aliases];
        
        // Verificar si la consulta coincide con algún término
        const matches = searchTerms.some(term => {
            // Búsqueda exacta
            if (term.includes(query) || query.includes(term)) return true;
            
            // Búsqueda por similitud (para errores de escritura)
            const similarity = calculateSimilarity(query, term);
            return similarity > 0.6; // Umbral de similitud
        });
        
        if (matches) {
            results.push({ id, ...dest });
        }
    });
    
    // Mostrar resultados
    showSearchResults(results, query);
}

// Función para calcular similitud entre strings (algoritmo simple)
function calculateSimilarity(str1, str2) {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
}

// Algoritmo de distancia de Levenshtein para similitud
function levenshteinDistance(str1, str2) {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
        matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
        matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
        for (let j = 1; j <= str1.length; j++) {
            if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }
    
    return matrix[str2.length][str1.length];
}

// Función para mostrar resultados de búsqueda
function showSearchResults(results, query) {
    const searchBar = document.getElementById('searchBar');
    let resultsContainer = searchBar.querySelector('.search-results');
    
    // Crear contenedor de resultados si no existe
    if (!resultsContainer) {
        resultsContainer = document.createElement('div');
        resultsContainer.className = 'search-results';
        searchBar.appendChild(resultsContainer);
    }
    
    if (results.length === 0) {
        resultsContainer.innerHTML = `
            <div class="search-result-item no-results">
                <i class="fas fa-search"></i>
                <div>
                    <h4>No se encontraron resultados</h4>
                    <p>Intenta con otros términos de búsqueda</p>
                </div>
            </div>
        `;
    } else {
        resultsContainer.innerHTML = results.map(result => `
            <div class="search-result-item" onclick="selectSearchResult('${result.id}')">
                <img src="${result.image}" alt="${result.name}">
                <div>
                    <h4>${result.name}</h4>
                    <p>${result.description}</p>
                </div>
                <i class="fas fa-chevron-right"></i>
            </div>
        `).join('');
    }
    
    resultsContainer.style.display = 'block';
}

// Función para limpiar resultados de búsqueda
function clearSearchResults() {
    const searchBar = document.getElementById('searchBar');
    const resultsContainer = searchBar.querySelector('.search-results');
    if (resultsContainer) {
        resultsContainer.style.display = 'none';
    }
}

// Función para seleccionar un resultado de búsqueda
function selectSearchResult(destinationId) {
    // Cerrar búsqueda
    toggleSearch();
    
    // Navegar al destino
    const destinationCard = document.querySelector(`[data-destination="${destinationId}"]`);
    if (destinationCard) {
        destinationCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Resaltar temporalmente la tarjeta
        destinationCard.style.boxShadow = '0 0 20px rgba(37, 99, 235, 0.3)';
        destinationCard.style.transform = 'scale(1.02)';
        
        setTimeout(() => {
            destinationCard.style.boxShadow = '';
            destinationCard.style.transform = '';
        }, 2000);
    }
    
    showNotification(`Mostrando destino`, 'success');
    SoundManager.success();
}

function toggleNotifications() {
    showNotification('No hay notificaciones', 'info');
}

// Variables globales para el modal de detalles
let currentDestinationId = null;
let ambientSoundEnabled = true;

// Funciones de destinos
function showDestinationDetails(destinationId) {
  currentDestinationId = destinationId;
  
  const destinations = {
    'el-tunco': {
      name: 'Playa El Tunco',
      description: 'Surf mundial, vida nocturna y atardeceres en La Libertad. Ideal para caminar entre rocas volcánicas y disfrutar de gastronomía local.',
      price: 'Acceso libre, parqueos y servicios con costo',
      hours: 'Abierto 24/7 (negocios con horarios propios)',
      location: 'El Tunco, Tamanique, La Libertad',
      features: [
        { icon: 'fas fa-water', text: 'Surf y playas' },
        { icon: 'fas fa-mug-hot', text: 'Cafés y restaurantes' },
        { icon: 'fas fa-music', text: 'Ambiente y música' }
      ],
      image: 'https://upload.wikimedia.org/wikipedia/commons/5/5f/El_Tunco%2C_El_Salvador.jpg'
    },
    'el-boqueron': {
      name: 'Parque Nacional El Boquerón',
      description: 'Miradores al cráter del Volcán de San Salvador, clima fresco y senderos cortos con flora local.',
      price: '$2.00 nacionales, $5.00 extranjeros (referencial)',
      hours: '8:00 AM - 5:00 PM (Lunes a Domingo)',
      location: 'Cordillera del Bálsamo, San Salvador',
      features: [
        { icon: 'fas fa-mountain', text: 'Miradores' },
        { icon: 'fas fa-hiking', text: 'Senderos' },
        { icon: 'fas fa-seedling', text: 'Naturaleza' }
      ],
      image: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Boqueron_Crater.jpg'
    },
    'coatepeque': {
      name: 'Lago de Coatepeque',
      description: 'Lago volcánico de aguas turquesa con miradores, restaurantes y deportes acuáticos.',
      price: 'Acceso libre a miradores, clubes con costo',
      hours: '6:00 AM - 8:00 PM (varía por establecimiento)',
      location: 'El Congo, Santa Ana',
      features: [
        { icon: 'fas fa-water', text: 'Paseos en lancha' },
        { icon: 'fas fa-utensils', text: 'Restaurantes' },
        { icon: 'fas fa-camera', text: 'Vistas panorámicas' }
      ],
      image: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Lago_de_Coatepeque.jpg'
    }
  };
  
  const dest = destinations[destinationId];
  if (!dest) return;
  
  // Llenar el modal con la información
  document.getElementById('detailsImage').src = dest.image;
  document.getElementById('detailsTitle').textContent = dest.name;
  document.getElementById('detailsSubtitle').textContent = dest.description.split('.')[0] + '.';
  document.getElementById('detailsDescription').textContent = dest.description;
  document.getElementById('detailsHours').textContent = dest.hours;
  document.getElementById('detailsPrice').textContent = dest.price;
  document.getElementById('detailsLocation').textContent = dest.location;
  
  // Llenar características
  const featuresContainer = document.getElementById('detailsFeatures');
  featuresContainer.innerHTML = '';
  dest.features.forEach(feature => {
    const featureElement = document.createElement('div');
    featureElement.className = 'feature-item';
    featureElement.innerHTML = `<i class="${feature.icon}"></i><span>${feature.text}</span>`;
    featuresContainer.appendChild(featureElement);
  });
  
  // Mostrar el modal
  const detailsModal = document.getElementById('detailsModal');
  detailsModal.classList.remove('hidden');
  SoundManager.openModal();
  
  // Iniciar sonido ambiental de fondo si está habilitado
  if (ambientSoundEnabled) {
    SoundManager.startAmbient();
  }
  
  // Animar entrada
  setTimeout(() => {
    detailsModal.style.opacity = '1';
    detailsModal.style.transform = 'scale(1)';
  }, 10);
  
  // Prevenir scroll del body
  document.body.style.overflow = 'hidden';
}

// Función para cerrar modal de detalles
function closeDetailsModal() {
  const detailsModal = document.getElementById('detailsModal');
  
  // Detener sonido ambiental
  SoundManager.stopAmbient();
  
  // Animar salida
  detailsModal.style.opacity = '0';
  detailsModal.style.transform = 'scale(0.9)';
  
  setTimeout(() => {
    detailsModal.classList.add('hidden');
    // Restaurar scroll del body
    document.body.style.overflow = '';
  }, 300);
}

// Función para ir al mapa desde detalles
function goToMapFromDetails() {
  if (!currentDestinationId) return;
  
  closeDetailsModal();
  
  // Navegar a la sección del mapa
  const mapSection = document.getElementById('map');
  const mainContent = document.getElementById('mainContent');
  
  if (mapSection && mainContent) {
    mainContent.scrollTo({
      top: mapSection.offsetTop - 80,
      behavior: 'smooth'
    });
    
    // Activar navegación del mapa
    const mapNav = document.querySelector('.nav-item[href="#map"]');
    if (mapNav) {
      setActiveNav(mapNav);
    }
    
    // Resaltar el marcador en el mapa después de un delay
    setTimeout(() => {
      highlightMapMarker(currentDestinationId);
    }, 1000);
  }
}

// Función para obtener direcciones desde detalles
function getDirectionsFromDetails() {
  if (!currentDestinationId) return;
  getDirections(currentDestinationId);
}

// Función para mostrar historia desde detalles
function showHistoryFromDetails() {
  if (!currentDestinationId) return;
  
  closeDetailsModal();
  showHistory(currentDestinationId);
}



// Función para obtener direcciones
function getDirections(destinationId) {
  const destinations = {
    'el-tunco': {
      name: 'Playa El Tunco',
      coords: { lat: 13.4947, lng: -89.4392 }
    },
    'el-boqueron': {
      name: 'Parque Nacional El Boquerón',
      coords: { lat: 13.7346, lng: -89.2903 }
    },
    'coatepeque': {
      name: 'Lago de Coatepeque',
      coords: { lat: 13.8417, lng: -89.5526 }
    }
  };
  
  const dest = destinations[destinationId];
  if (!dest) return;
  
  // Verificar si el navegador soporta geolocalización
  if (navigator.geolocation) {
    showLoading(true);
    
    navigator.geolocation.getCurrentPosition(
      function(position) {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        const destLat = dest.coords.lat;
        const destLng = dest.coords.lng;
        
        // Crear URL para Google Maps
        const googleMapsUrl = `https://www.google.com/maps/dir/${userLat},${userLng}/${destLat},${destLng}`;
        
        // Abrir en nueva pestaña
        window.open(googleMapsUrl, '_blank');
        
        showLoading(false);
        showNotification(`Ruta a ${dest.name} abierta en Google Maps`, 'success');
      },
      function(error) {
        showLoading(false);
        
        // Si no se puede obtener la ubicación, mostrar solo el destino
        const destLat = dest.coords.lat;
        const destLng = dest.coords.lng;
        const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${destLat},${destLng}`;
        
        window.open(googleMapsUrl, '_blank');
        showNotification(`Ubicación de ${dest.name} abierta en Google Maps`, 'info');
      },
      CONFIG.GEOLOCATION_CONFIG
    );
  } else {
    // Fallback para navegadores que no soportan geolocalización
    const destLat = dest.coords.lat;
    const destLng = dest.coords.lng;
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${destLat},${destLng}`;
    
    window.open(googleMapsUrl, '_blank');
    showNotification(`Ubicación de ${dest.name} abierta en Google Maps`, 'info');
  }
}

// Función para mostrar historia
function showHistory(destinationId) {
  const historyModal = document.getElementById(`historyModal-${destinationId}`);
  
  if (historyModal) {
    // Mostrar el modal
    historyModal.classList.remove('hidden');
    
    // Agregar clase para animación de entrada
    setTimeout(() => {
      historyModal.style.opacity = '1';
      historyModal.style.transform = 'scale(1)';
    }, 10);
    
    // Prevenir scroll del body
    document.body.style.overflow = 'hidden';
    
    // Animar elementos del timeline
    animateTimelineElements(historyModal);
    
    showNotification(`Mostrando historia de ${destinationId}`, 'info');
  }
}

// Función para cerrar modal de historia
function closeHistoryModal(destinationId) {
  const historyModal = document.getElementById(`historyModal-${destinationId}`);
  
  if (historyModal) {
    // Animar salida
    historyModal.style.opacity = '0';
    historyModal.style.transform = 'scale(0.9)';
    
    setTimeout(() => {
      historyModal.classList.add('hidden');
      // Restaurar scroll del body
      document.body.style.overflow = '';
    }, 300);
  }
}

// Función para animar elementos del timeline
function animateTimelineElements(modal) {
  const timelineItems = modal.querySelectorAll('.timeline-item');
  const galleryItems = modal.querySelectorAll('.gallery-item');
  
  // Resetear animaciones
  timelineItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
  });
  
  galleryItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
  });
  
  // Animar timeline items
  timelineItems.forEach((item, index) => {
    setTimeout(() => {
      item.style.opacity = '1';
      item.style.transform = 'translateY(0)';
    }, 200 + (index * 100));
  });
  
  // Animar gallery items
  galleryItems.forEach((item, index) => {
    setTimeout(() => {
      item.style.opacity = '1';
      item.style.transform = 'translateY(0)';
    }, 600 + (index * 100));
  });
}



// Funciones de utilidad
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.parentElement.querySelector('.toggle-password i');
    
    if (input.type === 'password') {
        input.type = 'text';
        button.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        button.className = 'fas fa-eye';
    }
}

function toggleFavorite(button) {
    button.classList.toggle('active');
    const icon = button.querySelector('i');
    
    if (button.classList.contains('active')) {
        icon.className = 'fas fa-heart';
        showNotification('Agregado a favoritos', 'success');
      SoundManager.toggle();
    } else {
        icon.className = 'far fa-heart';
        showNotification('Removido de favoritos', 'info');
      SoundManager.toggle();
    }
}



function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
    }
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    const mainContent = document.getElementById('mainContent');
    if (section && mainContent) {
        mainContent.scrollTo({
            top: section.offsetTop - 80,
            behavior: 'smooth'
        });
    }
}

function showLoading(show) {
    const loading = document.getElementById('loading');
    if (loading) {
        if (show) {
            loading.classList.remove('hidden');
        } else {
            loading.classList.add('hidden');
        }
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#059669' : type === 'error' ? '#dc2626' : '#2563eb'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        max-width: 300px;
        animation: slideInRight 0.3s ease;
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    if (type === 'success') SoundManager.success();
    else if (type === 'info') SoundManager.info();
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function simulateApiCall(delay) {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
}

function loginWithGoogle() {
    showNotification('Login con Google en desarrollo', 'info');
}

// Event listeners adicionales
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('modal')) {
    // Para modales de historia
    if (e.target.classList.contains('history-modal')) {
      const destinationId = e.target.id.replace('historyModal-', '');
      closeHistoryModal(destinationId);
    } else if (e.target.classList.contains('details-modal')) {
      // Para modal de detalles
      closeDetailsModal();
    } else {
      // Para otros modales
      e.target.classList.add('hidden');
    }
  }
});

// Prevenir zoom en inputs en iOS
document.addEventListener('touchstart', function(e) {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') {
    e.target.style.fontSize = '16px';
  }
});

// Función para animar elementos cuando entran en el viewport
function animateOnScroll() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, {
    threshold: 0.1
  });

  // Observar elementos de timeline y galería
  document.querySelectorAll('.timeline-item, .gallery-item').forEach(el => {
    observer.observe(el);
  });
}

// Inicializar animaciones de scroll cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(animateOnScroll, 1000);
});

// Función para mejorar la experiencia de navegación
function enhanceNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  
  navItems.forEach(item => {
    item.addEventListener('click', function() {
      // Agregar efecto de ripple
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(37, 99, 235, 0.3);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
      `;
      
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = event.clientX - rect.left - size / 2;
      const y = event.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
  });
});
}

// Inicializar mejoras de navegación
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(enhanceNavigation, 500);
});

// Función para alternar el sonido ambiental
function toggleAmbientSound() {
  const soundButton = document.querySelector('.sound-toggle i');
  
  if (ambientSoundEnabled) {
    // Desactivar sonido
    ambientSoundEnabled = false;
    SoundManager.stopAmbient();
    soundButton.className = 'fas fa-volume-mute';
    showNotification('Sonido ambiental desactivado', 'info');
  } else {
    // Activar sonido
    ambientSoundEnabled = true;
    SoundManager.startAmbient();
    soundButton.className = 'fas fa-volume-up';
    showNotification('Sonido ambiental activado', 'success');
  }
}
