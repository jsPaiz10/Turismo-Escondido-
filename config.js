// Configuración de la aplicación
const CONFIG = {
    // API Key de Google Maps (reemplazar con tu API key real)
    GOOGLE_MAPS_API_KEY: 'AIzaSyA_z3LOmUWzpUjFVigymif2kXw1jNtIn_g',
    
    // Coordenadas por defecto (Centro de El Salvador: San Salvador)
    DEFAULT_LOCATION: {
        lat: 13.6929,
        lng: -89.2182
    },
    
    // Configuración del mapa
    MAP_CONFIG: {
        zoom: 8,
        mapTypeId: 'roadmap'
    },
    
    // Configuración de geolocalización
    GEOLOCATION_CONFIG: {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
    }
};

// Exportar configuración
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
