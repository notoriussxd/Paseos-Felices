        // Estado global que controla las vistas, filtros y datos temporales del usuario
        const state = { userType: null, currentView: 'home', activeTab: 'earnings', selectedPet: null, goalAmount: '3000', showSafetyInfo: false, registerType: null, selectedWalker: null, showRequestForm: false, filters: { minRating: 0, minExperience: 0, minWalks: 0, minPrice: 0, maxPrice: 100, maxDistance: 5, easyNow: false }, locationSearch: '', selectedLocation: '', professionalGoals: [], professionalGoalInput: '', showVisionScreen: false, pendingAction: null, destinationMode: false, destinationAddress: '', isPremium: false, showPremiumModal: false };

        // Configuración por página (se inyecta desde cada HTML)
        const appConfig = window.APP_CONFIG || {};
        if (appConfig.initialView) state.currentView = appConfig.initialView;
        if (appConfig.defaultUserType) state.userType = appConfig.defaultUserType;
        if (appConfig.activeTab) state.activeTab = appConfig.activeTab;
        if (typeof appConfig.showSafetyInfo === 'boolean') state.showSafetyInfo = appConfig.showSafetyInfo;
        if (appConfig.registerType) state.registerType = appConfig.registerType;
        
        // Datos de ejemplo que alimentan las tarjetas y secciones de la SPA
        const pets = [
            { id: 1, name: 'MAX', photo: '🐕', owner: 'Carla Martínez', payment: 'Al día', nextWalk: '2h', characteristics: ['Apto para paseos grupales', 'Sociable y tranquilo', 'Alérgico a las rosas'], walkSummary: { start: '3:00 PM', end: '3:50 PM', duration: '50 min', extra: '+S/5 por demora del dueño' }, scheduledWalks: ['Martes y jueves 7:00 AM', 'Todos los días 8:00 PM'] },
            { id: 2, name: 'REY', photo: '🦮', owner: 'Ricardo Sánchez', payment: 'Pendiente', nextWalk: 'Mañana', characteristics: ['Necesita espacio', 'Energético'], walkSummary: { start: '4:00 PM', end: '4:45 PM', duration: '45 min' }, scheduledWalks: ['Lunes, miércoles y viernes 6:30 AM', 'Domingos 5:00 PM (paseo largo)'] }
        ];

        const requests = [
            { id: 1, petName: 'Toby', petPhoto: '🐕', owner: 'María López', service: 'Paseo de 30 minutos', price: 25, negotiable: true, distance: '0.8 km', time: 'Ahorita', urgent: true },
            { id: 2, petName: 'Luna & Sol', petPhoto: '🐩', owner: 'Pedro Ruiz', service: 'Paseo de 1h (2 perros)', price: 45, negotiable: true, distance: '1.2 km', time: 'En 20 min', urgent: false }
        ];

        const routeWalks = [
            { id: 1, petName: 'Rocky', petPhoto: '🦮', owner: 'Ana García', service: 'Paseo de 45 min', price: 35, pickupLocation: 'Av. Javier Prado 1200', destination: 'Parque Kennedy', routeMatch: '95%', timeWindow: 'En 30 min', onRoute: true },
            { id: 2, petName: 'Bella', petPhoto: '🐕', owner: 'Luis Mendoza', service: 'Paseo corto 25 min', price: 22, pickupLocation: 'Calle Las Begonias 450', destination: 'Parque El Olivar', routeMatch: '88%', timeWindow: 'En 15 min', onRoute: true },
            { id: 3, petName: 'Max & Luna', petPhoto: '🐩', owner: 'Carmen Silva', service: 'Paseo grupal 1h', price: 50, pickupLocation: 'Av. Arequipa 2800', destination: 'Parque de la Reserva', routeMatch: '92%', timeWindow: 'En 45 min', onRoute: true }
        ];

        const nearbyWalkers = [
            { id: 1, name: 'Daniel.R', photo: '👨', rating: 5, distance: '0.5 km', price: 25, services: ['Paseos cortos', 'Paseos largos', 'Entrenamiento'], available: true, phone: '987654321', experience: 5, totalWalks: 210, easyNow: true, completedWalks: 210, cancellations: 0, repeatClients: 98 },
            { id: 2, name: 'Patricia Romero', photo: '👩', rating: 4, distance: '1.2 km', price: 30, services: ['Paseos grupales', 'Cuidado en casa'], available: true, phone: '987654322', experience: 3, totalWalks: 150, easyNow: true, completedWalks: 150, cancellations: 2, repeatClients: 95 },
            { id: 3, name: 'Carlos Mendez', photo: '🧑', rating: 5, distance: '0.8 km', price: 28, services: ['Paseos largos', 'Transporte veterinaria'], available: false, phone: '987654323', experience: 7, totalWalks: 320, easyNow: false, completedWalks: 320, cancellations: 0, repeatClients: 99 }
        ];

        const ownerRequests = [
            { id: 1, walkerName: 'Daniel.R', walkerPhoto: '👨', service: 'Paseo de 30 minutos', price: 25, date: 'Hoy 3:00 PM', status: 'Pendiente' },
            { id: 2, walkerName: 'Patricia Romero', walkerPhoto: '👩', service: 'Paseo de 1h', price: 45, date: 'Mañana 10:00 AM', status: 'Aceptado' }
        ];

        const professionalGoalSuggestions = [
            'Tener 30 clientes regulares',
            'Extender mi trabajo a dos distritos más',
            'Ser más conocido en redes',
            'Solo trabajar 4 días a la semana'
        ];

        const economicPlans = [
            {
                title: 'Plan Intensivo 🚀',
                subtitle: 'Maximiza ingresos este mes',
                badge: 'Meta rápida',
                items: [
                    { text: '8 paseos diarios combinando rutas cortas y largas' },
                    { text: 'Certificación avanzada canina para subir tarifas', link: 'https://example.com/cert-canina', linkLabel: 'Ver certificado' },
                    { text: 'Disponibilidad 6 días con horarios extendidos' },
                    { text: 'Sesión semanal con mentor financiero', link: 'https://example.com/mentor-finanzas', linkLabel: 'Agendar mentoría' }
                ]
            },
            {
                title: 'Plan Flexible 🌤️',
                subtitle: 'Gana más con menos días',
                badge: 'Balance ideal',
                items: [
                    { text: '5 paseos premium al día en zonas de alto ticket' },
                    { text: 'Rutas optimizadas para agrupar clientes cercanos (IA)' },
                    { text: 'Trabaja solo 4 días a la semana con bloques inteligentes' },
                    { text: 'Curso “Productividad para paseadores”', link: 'https://example.com/curso-productividad', linkLabel: 'Ir al curso' }
                ]
            }
        ];

        const professionalPlans = [
            {
                title: 'Plan Visibilidad ✨',
                subtitle: 'Haz que te conozcan más',
                badge: 'Impulso en redes',
                items: [
                    { text: 'Calendario de contenido para Facebook, TikTok e Instagram', link: 'https://example.com/plantilla-calendario', linkLabel: 'Descargar plantilla' },
                    { text: 'Plantillas de testimonios posteriores al paseo', link: 'https://example.com/kit-testimonios', linkLabel: 'Ver kit' },
                    { text: 'Galería colaborativa con dueños para subir fotos en vivo' }
                ]
            },
            {
                title: 'Plan Expansión 🌎',
                subtitle: 'Conquista nuevos distritos',
                badge: 'Nuevos mercados',
                items: [
                    { text: 'Mapa de demanda para abrir 2 distritos adicionales', link: '#', linkLabel: 'Abrir mapa IA' },
                    { text: 'Rutas recomendadas con tiempos y costos de traslado' },
                    { text: 'Kit de presentación profesional para negocios pet friendly', link: 'https://example.com/kit-petfriendly', linkLabel: 'Descargar kit' }
                ]
            }
        ];

        const walkerNotifications = [
            { title: 'Carla te transfirió S/45', detail: 'Pago del paseo de Lucy', time: 'Hace 2 min', type: 'finanzas' },
            { title: 'Recoge a Ben en 10 minutos', detail: 'Punto: Parque Castilla', time: 'Hace 5 min', type: 'logistica' },
            { title: 'Nuevo mensaje de Patricia', detail: 'Quiere reagendar el paseo grupal', time: 'Hace 9 min', type: 'chat' },
            { title: 'Recordatorio de descanso', detail: 'Toma agua antes del próximo recorrido', time: 'Hace 15 min', type: 'wellness' }
        ];

        const ownerNotifications = [
            { petId: 1, message: 'Lucy ya salió rumbo al parque', time: '3:01 PM' },
            { petId: 2, message: 'Rey hizo una pausa para tomar agua', time: '4:22 PM' }
        ];

        const aiOpportunities = [
            { title: 'Demanda alta en San Borja', description: '48 solicitudes nuevas en la última hora, ideal para paseos premium.', icon: '📍', action: 'Abrir mapa', link: '#' },
            { title: 'Curso express “Club de paseos grupales”', description: 'Fortalece tu manejo de grupos grandes y aumenta tus tarifas +S/25.', icon: '🎓', action: 'Ver curso', link: 'https://example.com/curso-grupal' },
            { title: 'Clientes corporativos en Miraflores', description: 'Empresas pet-friendly buscan paseos recurrentes. Tu perfil calza perfecto.', icon: '🏢', action: 'Aplicar ahora', link: '#' }
        ];

        const walkerReviews = [
            { author: 'Carla Ramírez', detail: 'Lucy - 3 paseos/semana', comment: 'Daniel comparte cada paso del paseo con fotos y notas. Lucy llega cansada y feliz.' },
            { author: 'Renzo Quinteros', detail: 'Max - Paseos grupales', comment: 'Organiza grupos sin perder control. Mis horarios cambiantes nunca fueron un problema.' },
            { author: 'Andrea Soto', detail: 'Nina - Plan rehabilitación', comment: 'Se coordinó con mi veterinario para adaptar el ritmo del paseo. 100% comprometido.' },
            { author: 'Fiorella Paredes', detail: 'Tommy - Paseos express', comment: 'Siempre puntual y con reportes de hidratación y descansos. Confío con los ojos cerrados.' },
            { author: 'Gabriel León', detail: 'Lola - Paseos premium', comment: 'Gracias a sus sugerencias, Lola ahora socializa mejor y aprendió nuevas rutinas.' }
        ];

        // Genera el logo principal permitiendo reutilizar tamaños en distintas pantallas
        function renderLogo(size = 'large') {
            const squareSize = size === 'small' ? '90px' : size === 'medium' ? '110px' : '130px';
            return `
                <div class="inline-block" style="width: ${squareSize}; height: ${squareSize}; display: flex; align-items: center; justify-content: center;">
                    <img src="assets/img/logo.png" alt="Logo Paseos Felices" style="width: 100%; height: 100%; object-fit: contain;">
                </div>
            `;
        }
        
        // Decide qué vista se debe renderizar según el estado actual
        function render() {
            const app = document.getElementById('app');
            if (!app) return;
            
            let content = '';
            if (state.showVisionScreen) { 
                app.innerHTML = renderVisionScreen(); 
                return; 
            }
            if (state.showSafetyInfo) content = renderSafetyInfo();
            else if (state.currentView === 'home') content = renderHome();
            else if (state.currentView === 'register') content = renderRegister();
            else if (state.currentView === 'main') content = renderMain();
            else if (state.currentView === 'petDetail') content = renderPetDetail();
            else if (state.currentView === 'walkerProfile') content = renderWalkerProfile();
            else if (state.currentView === 'requestForm') content = renderRequestForm();
            
            if (state.showPremiumModal) {
                content += renderPremiumModal();
            }
            
            app.innerHTML = content;
        }
        
        // Modal para promocionar el plan Premium
        function renderPremiumModal() {
            return `<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div class="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative">
                    <button onclick="closePremiumModal()" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl">×</button>
                    <div class="text-center mb-6">
                        <div class="text-6xl mb-4">⭐</div>
                        <h2 class="text-3xl font-bold mb-2" style="color: #48BB78;">¡Prueba Premium!</h2>
                        <p class="text-2xl font-bold mb-1" style="color: #4A90E2;">30 días de prueba GRATIS</p>
                        <p class="text-sm text-gray-600 mb-4">Luego de agregar tu tarjeta</p>
                    </div>
                    <div class="bg-gradient-to-br from-green-50 to-sky-50 rounded-2xl p-6 mb-6 border-2" style="border-color: #48BB78;">
                        <h3 class="font-bold text-lg mb-3" style="color: #48BB78;">Funciones Premium incluidas:</h3>
                        <ul class="space-y-2 text-sm text-gray-700">
                            <li>✓ 🚗 Paseos en ruta</li>
                            <li>✓ 📈 Tu semana en números (IA)</li>
                            <li>✓ 🌎 Explora otras zonas (IA)</li>
                            <li>✓ 🤖 Anticipamos oportunidades para ti (IA)</li>
                            <li>✓ 🎯 Alcanza tus objetivos económicos <span class="text-xs text-gray-500">(Plan gratis: solo 2 opciones | Premium: opciones ilimitadas)</span></li>
                            <li>✓ ✨ Alcanza tus objetivos profesionales <span class="text-xs text-gray-500">(Plan gratis: solo 2 opciones | Premium: opciones ilimitadas)</span></li>
                        </ul>
                    </div>
                    <div class="text-center mb-6">
                        <p class="text-2xl font-bold mb-2" style="color: #48BB78;">S/ 35/mes</p>
                        <p class="text-sm text-gray-600">Después de los 30 días gratis</p>
                    </div>
                    <button onclick="startPremiumTrial()" class="w-full text-white py-4 rounded-2xl font-bold text-lg hover:shadow-lg transform hover:scale-105 transition-all mb-3" style="background: linear-gradient(135deg, #48BB78 0%, #4A90E2 100%);">
                        Comenzar prueba gratis
                    </button>
                    <button onclick="closePremiumModal()" class="w-full bg-gray-100 text-gray-700 py-3 rounded-2xl font-semibold hover:bg-gray-200 transition-all">
                        Ahora no
                    </button>
                </div>
            </div>`;
        }
        
        function openPremiumModal() {
            state.showPremiumModal = true;
            render();
        }
        
        function closePremiumModal() {
            state.showPremiumModal = false;
            render();
        }
        
        function startPremiumTrial() {
            alert('¡Excelente! Te pediremos tus datos de tarjeta en el siguiente paso. Tendrás 30 días para probar todas las funciones Premium gratis.');
            state.isPremium = true;
            state.showPremiumModal = false;
            render();
        }
        
        function checkPremium(feature) {
            if (!state.isPremium) {
                openPremiumModal();
                return false;
            }
            return true;
        }

        // Pantalla intermedia que refuerza la narrativa antes de cambiar de flujo
        function renderVisionScreen() {
            return `<div class="min-h-screen bg-gradient-to-br from-white via-sky-50 to-green-50 flex items-center justify-center p-6">
                <div class="bg-white rounded-3xl shadow-2xl p-10 max-w-3xl w-full space-y-6 text-center">
                    <div class="text-6xl">🌟</div>
                    <h2 class="text-4xl font-bold mb-2" style="color: #48BB78;">¡Somos los únicos que vemos MÁS ALLÁ del paseo!</h2>
                    <p class="text-lg text-gray-600">Otras apps solo conectan. Nosotros IMPULSAMOS.</p>
                    <div class="grid md:grid-cols-2 gap-4 text-left">
                        <div class="rounded-2xl p-6 border-2" style="background: #f0f9ff; border-color: #48BB78;">
                            <p class="text-3xl mb-3">✨</p>
                            <h3 class="font-bold text-lg mb-1" style="color: #48BB78;">Para paseadores</h3>
                            <p class="text-gray-700">No solo consigues clientes, construyes una CARRERA con planes personalizados.</p>
                        </div>
                        <div class="rounded-2xl p-6 border-2" style="background: #f0fdf4; border-color: #4A90E2;">
                            <p class="text-3xl mb-3">💜</p>
                            <h3 class="font-bold text-lg mb-1" style="color: #4A90E2;">Para dueños</h3>
                            <p class="text-gray-700">No solo ves un mapa, VIVES cada momento con tu mascota en tiempo real.</p>
                        </div>
                    </div>
                    <div class="text-white rounded-2xl p-6" style="background: linear-gradient(135deg, #48BB78 0%, #4A90E2 100%);">
                        <p class="text-lg font-semibold">🚀 Aquí creces, aquí confías, aquí eres parte de algo más grande.</p>
                    </div>
                    <button onclick="continueFromVision()" class="w-full text-white py-4 rounded-2xl font-bold text-lg hover:shadow-xl transform hover:scale-105 transition-all" style="background: linear-gradient(135deg, #48BB78 0%, #4A90E2 100%);">Continuar</button>
                </div>
            </div>`;
        }

        function renderSafetyInfo() {
            return `<div class="min-h-screen bg-gradient-to-br from-white via-sky-50 to-blue-50 flex items-center justify-center p-6">
                <div class="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full">
                    <div class="text-center mb-8">
                        <div class="text-7xl mb-4">🛡️</div>
                        <h2 class="text-3xl font-bold mb-3" style="color: #4A90E2;">Confía en nosotros</h2>
                        <p class="text-xl text-gray-700">La seguridad de tu mascota es nuestra prioridad 🐾</p>
                    </div>
                    <div class="space-y-5 mb-8">
                        <div class="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-5 border-2 border-blue-200">
                            <div class="flex items-start"><div class="text-3xl mr-4">📞</div><div><h3 class="font-bold text-lg text-gray-800 mb-1">1. Línea telefónica 24/7</h3><p class="text-gray-600">Siempre disponibles para ayudarte ante cualquier consulta o imprevisto.</p></div></div>
                        </div>
                        <div class="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-5 border-2 border-green-200">
                            <div class="flex items-start"><div class="text-3xl mr-4">✅</div><div><h3 class="font-bold text-lg text-gray-800 mb-1">2. Paseadores verificados</h3><p class="text-gray-600">Cada perfil es registrado, validado y aprobado antes de ofrecer sus servicios.</p></div></div>
                        </div>
                        <div class="bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl p-5 border-2 border-purple-200">
                            <div class="flex items-start"><div class="text-3xl mr-4">🛡️</div><div><h3 class="font-bold text-lg text-gray-800 mb-1">3. Responsabilidad garantizada</h3><p class="text-gray-600">La compañía supervisa y responde por cada servicio realizado.</p></div></div>
                        </div>
                        <div class="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-5 border-2 border-orange-200">
                            <div class="flex items-start"><div class="text-3xl mr-4">📍</div><div><h3 class="font-bold text-lg text-gray-800 mb-1">4. Ubicación en tiempo real</h3><p class="text-gray-600">Cada paseo se comparte automáticamente para que puedas seguirlo al instante.</p></div></div>
                        </div>
                        <div class="bg-gradient-to-r from-pink-50 to-pink-100 rounded-2xl p-5 border-2 border-pink-200">
                            <div class="flex items-start"><div class="text-3xl mr-4">⏰</div><div><h3 class="font-bold text-lg text-gray-800 mb-1">5. Chequeos automáticos cada 10 minutos</h3><p class="text-gray-600">La app realiza verificaciones periódicas para confirmar que el paseo continúa con normalidad y todo está en orden.</p></div></div>
                        </div>
                    </div>
                    <div class="space-y-3">
                        <button onclick="continuToApp()" class="w-full text-white py-4 rounded-2xl font-bold text-lg hover:shadow-xl transform hover:scale-105 transition-all" style="background: linear-gradient(135deg, #48BB78 0%, #4A90E2 100%);">Continuar ✨</button>
                        <button onclick="closeSafetyInfo()" class="w-full bg-gray-100 text-gray-700 py-4 rounded-2xl font-semibold text-lg hover:bg-gray-200 transition-all">Volver</button>
                    </div>
                </div>
            </div>`;
        }

        function renderRegister() {
            if (!state.registerType) {
                return `<div class="min-h-screen bg-gradient-to-br from-white via-sky-50 to-blue-50 flex items-center justify-center p-8">
                    <div class="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full">
                        <div class="text-center mb-8">
                            <div class="text-7xl mb-4">📝</div>
                            <h1 class="text-4xl font-bold text-orange-600 mb-2">Registrarse</h1>
                            <p class="text-gray-600">¿Cómo deseas registrarte?</p>
                        </div>
                        <div class="space-y-4">
                            <button onclick="selectRegisterType('walker')" class="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-4 rounded-2xl font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all">
                                🚶 Como Paseador
                            </button>
                            <button onclick="selectRegisterType('owner')" class="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-4 rounded-2xl font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all">
                                🏠 Como Dueño de Mascota
                            </button>
                            <button onclick="goHome()" class="w-full bg-gray-100 text-gray-700 py-4 rounded-2xl font-semibold text-lg hover:bg-gray-200 transition-all">
                                ← Volver
                            </button>
                        </div>
                    </div>
                </div>`;
            }

            const isWalker = state.registerType === 'walker';
            return `<div class="min-h-screen bg-gradient-to-br from-${isWalker ? 'orange' : 'purple'}-50 via-${isWalker ? 'yellow' : 'pink'}-50 to-${isWalker ? 'pink' : 'blue'}-50 p-6">
                <div class="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl p-8">
                    <div class="text-center mb-8">
                        <div class="text-6xl mb-4">${isWalker ? '🚶' : '🏠'}</div>
                        <h1 class="text-3xl font-bold text-${isWalker ? 'orange' : 'purple'}-600 mb-2">
                            Registro ${isWalker ? 'de Paseador' : 'de Dueño'}
                        </h1>
                        <p class="text-gray-600">Completa tus datos para comenzar</p>
                    </div>

                    <form onsubmit="event.preventDefault(); submitRegister();" class="space-y-5">
                        <div class="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-5 border-2 border-blue-200">
                            <label class="block text-sm font-bold text-gray-700 mb-2">📝 Nombre Completo *</label>
                            <input type="text" required class="w-full px-4 py-3 rounded-xl border-2 border-blue-300 focus:border-blue-500 outline-none" placeholder="Ej: Juan Carlos Pérez">
                        </div>

                        <div class="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-5 border-2 border-green-200">
                            <label class="block text-sm font-bold text-gray-700 mb-2">🆔 DNI *</label>
                            <input type="text" required pattern="[0-9]{8}" maxlength="8" class="w-full px-4 py-3 rounded-xl border-2 border-green-300 focus:border-green-500 outline-none" placeholder="12345678">
                        </div>

                        <div class="bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl p-5 border-2 border-purple-200">
                            <label class="block text-sm font-bold text-gray-700 mb-2">📍 Dirección / Distrito *</label>
                            <input type="text" required class="w-full px-4 py-3 rounded-xl border-2 border-2"
            style="border-color: #4A90E2; focus:border-purple-500 outline-none" placeholder="Ej: San Isidro, Lima">
                        </div>

                        <div class="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-5 border-2 border-orange-200">
                            <label class="block text-sm font-bold text-gray-700 mb-2">🎂 Edad *</label>
                            <input type="number" required min="18" max="100" class="w-full px-4 py-3 rounded-xl border-2 border-orange-300 focus:border-orange-500 outline-none" placeholder="25">
                        </div>

                        <div class="bg-gradient-to-r from-pink-50 to-pink-100 rounded-2xl p-5 border-2 border-pink-200">
                            <label class="block text-sm font-bold text-gray-700 mb-2">📧 Correo Electrónico *</label>
                            <input type="email" required class="w-full px-4 py-3 rounded-xl border-2 border-pink-300 focus:border-pink-500 outline-none" placeholder="ejemplo@correo.com">
                        </div>

                        <div class="bg-gradient-to-r from-teal-50 to-teal-100 rounded-2xl p-5 border-2 border-teal-200">
                            <label class="block text-sm font-bold text-gray-700 mb-2">📱 Teléfono / WhatsApp *</label>
                            <input type="tel" required pattern="[0-9]{9}" maxlength="9" class="w-full px-4 py-3 rounded-xl border-2 border-teal-300 focus:border-teal-500 outline-none" placeholder="987654321">
                        </div>

                        ${isWalker ? `
                            <div class="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-2xl p-5 border-2 border-yellow-200">
                                <label class="block text-sm font-bold text-gray-700 mb-2">💼 Experiencia *</label>
                                <select required class="w-full px-4 py-3 rounded-xl border-2 border-yellow-300 focus:border-yellow-500 outline-none">
                                    <option value="">Selecciona tu experiencia</option>
                                    <option value="sin">Sin experiencia</option>
                                    <option value="basica">Básica (menos de 1 año)</option>
                                    <option value="intermedia">Intermedia (1-3 años)</option>
                                    <option value="avanzada">Avanzada (más de 3 años)</option>
                                    <option value="profesional">Profesional certificado</option>
                                </select>
                            </div>

                            <div class="bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-2xl p-5 border-2 border-indigo-200">
                                <label class="block text-sm font-bold text-gray-700 mb-3">🐾 Servicios que Ofreces *</label>
                                <div class="space-y-2">
                                    <label class="flex items-center bg-white p-3 rounded-lg cursor-pointer hover:bg-indigo-50">
                                        <input type="checkbox" class="mr-3 w-5 h-5">
                                        <span>Paseos cortos (20-30 min)</span>
                                    </label>
                                    <label class="flex items-center bg-white p-3 rounded-lg cursor-pointer hover:bg-indigo-50">
                                        <input type="checkbox" class="mr-3 w-5 h-5">
                                        <span>Paseos largos (1+ hora)</span>
                                    </label>
                                    <label class="flex items-center bg-white p-3 rounded-lg cursor-pointer hover:bg-indigo-50">
                                        <input type="checkbox" class="mr-3 w-5 h-5">
                                        <span>Paseos grupales (varios perros)</span>
                                    </label>
                                    <label class="flex items-center bg-white p-3 rounded-lg cursor-pointer hover:bg-indigo-50">
                                        <input type="checkbox" class="mr-3 w-5 h-5">
                                        <span>Entrenamiento básico</span>
                                    </label>
                                    <label class="flex items-center bg-white p-3 rounded-lg cursor-pointer hover:bg-indigo-50">
                                        <input type="checkbox" class="mr-3 w-5 h-5">
                                        <span>Cuidado en casa</span>
                                    </label>
                                    <label class="flex items-center bg-white p-3 rounded-lg cursor-pointer hover:bg-indigo-50">
                                        <input type="checkbox" class="mr-3 w-5 h-5">
                                        <span>Transporte a veterinaria</span>
                                    </label>
                                </div>
                            </div>

                            <div class="bg-gradient-to-r from-red-50 to-red-100 rounded-2xl p-5 border-2 border-red-200">
                                <label class="block text-sm font-bold text-gray-700 mb-3">⏰ Horario Disponible *</label>
                                <div class="grid grid-cols-2 gap-3">
                                    <div>
                                        <label class="block text-xs text-gray-600 mb-1">Hora inicio:</label>
                                        <input type="time" required class="w-full px-3 py-2 rounded-lg border-2 border-red-300 focus:border-red-500 outline-none">
                                    </div>
                                    <div>
                                        <label class="block text-xs text-gray-600 mb-1">Hora fin:</label>
                                        <input type="time" required class="w-full px-3 py-2 rounded-lg border-2 border-red-300 focus:border-red-500 outline-none">
                                    </div>
                                </div>
                                <div class="mt-3">
                                    <label class="block text-xs text-gray-600 mb-2">Días disponibles:</label>
                                    <div class="flex flex-wrap gap-2">
                                        ${['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => `
                                            <label class="flex items-center bg-white px-3 py-2 rounded-lg cursor-pointer hover:bg-red-50">
                                                <input type="checkbox" class="mr-2">
                                                <span class="text-sm">${day}</span>
                                            </label>
                                        `).join('')}
                                    </div>
                                </div>
                            </div>
                        ` : `
                            <div class="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-2xl p-5 border-2 border-yellow-200">
                                <label class="block text-sm font-bold text-gray-700 mb-2">🐕 Información de tu Mascota</label>
                                <input type="text" class="w-full px-4 py-3 rounded-xl border-2 border-yellow-300 mb-3 outline-none" placeholder="Nombre de tu mascota">
                                <select class="w-full px-4 py-3 rounded-xl border-2 border-yellow-300 mb-3 outline-none">
                                    <option value="">Tipo de mascota</option>
                                    <option value="perro">Perro</option>
                                    <option value="gato">Gato</option>
                                    <option value="otro">Otro</option>
                                </select>
                                <select class="w-full px-4 py-3 rounded-xl border-2 border-yellow-300 outline-none">
                                    <option value="">Tamaño</option>
                                    <option value="pequeno">Pequeño</option>
                                    <option value="mediano">Mediano</option>
                                    <option value="grande">Grande</option>
                                </select>
                            </div>
                        `}

                        <div class="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-5 border-2 border-gray-200">
                            <label class="block text-sm font-bold text-gray-700 mb-2">💬 Información Adicional</label>
                            <textarea class="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-gray-500 outline-none" rows="4" placeholder="Cuéntanos más sobre ti o tus necesidades..."></textarea>
                        </div>

                        <div class="space-y-3 pt-4">
                            <button type="submit" class="w-full bg-gradient-to-r from-${isWalker ? 'orange' : 'purple'}-500 to-${isWalker ? 'pink' : 'blue'}-500 text-white py-4 rounded-2xl font-bold text-lg hover:shadow-xl transform hover:scale-105 transition-all">
                                ✨ Enviar Registro
                            </button>
                            <button type="button" onclick="state.registerType = null; render();" class="w-full bg-gray-200 text-gray-700 py-3 rounded-2xl font-semibold hover:bg-gray-300 transition-all">
                                ← Volver
                            </button>
                        </div>
                    </form>
                </div>
            </div>`;
        }

        function renderHome() {
            return `<div class="min-h-screen bg-gradient-to-br from-white via-sky-50 to-green-50 flex items-center justify-center p-8">
                <div class="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full">
                    <div class="flex flex-col items-center mb-8">
                        <div class="mb-4 flex flex-col items-center">
                            ${renderLogo('large')}
                            <div class="mt-3">
                                <h1 class="text-5xl font-bold mb-0" style="color: #1a1a1a; letter-spacing: 0.05em; font-weight: 800;">PASEOS</h1>
                                <h1 class="text-5xl font-bold -mt-2 mb-2" style="color: #1a1a1a; letter-spacing: 0.05em; font-weight: 800;">FELICES</h1>
                            </div>
                        </div>
                        <p class="text-gray-600 text-center mb-4">Tu compañero perfecto para el cuidado de mascotas</p>
                        <div class="bg-green-50 border-2" style="border-color: #48BB78; border-radius: 1.5rem; padding: 1.5rem; text-align: center; space-y: 0.75rem;">
                            <h2 class="text-2xl font-bold mb-2" style="color: #48BB78;">¿Qué es?</h2>
                            <p class="text-base text-gray-700">Es una app que impulsa a los paseadores a ser más eficientes y lograr sus metas 📈 de forma clara y rápida.</p>
                            <p class="text-base text-gray-700">Los dueños viven cada paseo en tiempo real: rutas, fotos y recomendaciones 🐾 como si estuvieran ahí con su mascota.</p>
                        </div>
                    </div>
                    <div class="space-y-4">
                        <button onclick="selectUserType('walker')" class="w-full text-white py-4 rounded-2xl font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all" style="background: linear-gradient(135deg, #48BB78 0%, #4A90E2 100%);">🚶 Soy Paseador</button>
                        <button onclick="selectUserType('owner')" class="w-full text-white py-4 rounded-2xl font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all" style="background: linear-gradient(135deg, #4A90E2 0%, #48BB78 100%);">🏠 Dueño de Mascota</button>
                        <button onclick="goToRegister()" class="w-full bg-gray-100 text-gray-700 py-4 rounded-2xl font-semibold text-lg hover:bg-gray-200 transition-all">📝 Registrarse</button>
                    </div>
                </div>
            </div>`;
        }

        function renderMain() {
            if (state.userType === 'owner') {
                return `<div class="min-h-screen bg-gradient-to-br from-white via-sky-50 to-green-50 pb-24">
                    <div class="text-white p-6 shadow-lg" style="background: linear-gradient(135deg, #48BB78 0%, #4A90E2 100%);">
                        <button onclick="goHome()" class="mb-4 hover:bg-white/20 rounded-lg p-2">← Volver</button>
                        <div class="flex items-center justify-center mb-2">
                            <div class="text-center">
                                ${renderLogo('medium')}
                                <h1 class="text-3xl font-bold" style="color: #1a1a1a; letter-spacing: 0.05em;">PASEOS</h1>
                                <h1 class="text-3xl font-bold -mt-1" style="color: #1a1a1a; letter-spacing: 0.05em;">FELICES</h1>
                            </div>
                        </div>
                        <p class="text-white/80 text-center">Panel de Dueño</p>
                    </div>
                    <div>${state.activeTab === 'pets' ? renderPetsTab() : ''}${state.activeTab === 'nearby' ? renderOwnerNearbyTab() : ''}</div>
                    <div class="fixed bottom-0 left-0 right-0 bg-white shadow-2xl border-t-2" style="border-color: #48BB78;">
                        <div class="flex justify-around p-3">
                            <button onclick="changeTab('pets')" class="flex flex-col items-center p-2 rounded-xl ${state.activeTab === 'pets' ? 'text-white' : 'text-gray-600'}" style="${state.activeTab === 'pets' ? 'background: linear-gradient(135deg, #48BB78 0%, #4A90E2 100%);' : ''}"><span class="text-xl">🐾</span><span class="text-xs">Mascotas</span></button>
                            <button onclick="changeTab('nearby')" class="flex flex-col items-center p-2 rounded-xl ${state.activeTab === 'nearby' ? 'text-white' : 'text-gray-600'}" style="${state.activeTab === 'nearby' ? 'background: linear-gradient(135deg, #48BB78 0%, #4A90E2 100%);' : ''}"><span class="text-xl">📍</span><span class="text-xs">Cerca</span></button>
                        </div>
                    </div>
                </div>`;
            }
            return `<div class="min-h-screen bg-gradient-to-br from-white via-sky-50 to-green-50 pb-24">
                <div class="text-white p-6 shadow-lg" style="background: linear-gradient(135deg, #48BB78 0%, #4A90E2 100%);">
                    <button onclick="goHome()" class="mb-4 hover:bg-white/20 rounded-lg p-2">← Volver</button>
                    <div class="flex items-center justify-center mb-2">
                        <div class="text-center">
                            ${renderLogo('medium')}
                            <div class="mt-2">
                                <h1 class="text-4xl font-bold mb-0" style="color: #1a1a1a; letter-spacing: 0.05em; font-weight: 800;">PASEOS</h1>
                                <h1 class="text-4xl font-bold -mt-2" style="color: #1a1a1a; letter-spacing: 0.05em; font-weight: 800;">FELICES</h1>
                            </div>
                        </div>
                    </div>
                    <p class="text-white/80 text-center">Panel de Paseador</p>
                </div>
                <div>${state.activeTab === 'earnings' ? renderEarningsTab() : ''}${state.activeTab === 'nearby' ? renderNearbyTab() : ''}${state.activeTab === 'pets' ? renderPetsTab() : ''}${state.activeTab === 'profile' ? renderProfileTab() : ''}</div>
                ${state.userType === 'walker' && !state.isPremium ? `<div class="mx-6 mt-6 mb-6 text-white p-4 rounded-2xl shadow-lg cursor-pointer" onclick="openPremiumModal()" style="background: linear-gradient(135deg, #48BB78 0%, #4A90E2 100%); margin-bottom: 100px !important;">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center flex-1">
                            <span class="text-2xl mr-3">⭐</span>
                            <div class="flex-1">
                                <p class="font-bold text-lg">Probar Premium gratis</p>
                            </div>
                        </div>
                        <span class="text-xl ml-2">→</span>
                    </div>
                </div>` : ''}
                <div class="fixed bottom-0 left-0 right-0 bg-white shadow-2xl border-t-2" style="border-color: #48BB78;">
                    <div class="flex justify-around p-3">
                        <button onclick="changeTab('earnings')" class="flex flex-col items-center p-2 rounded-xl ${state.activeTab === 'earnings' ? 'text-white' : 'text-gray-600'}" style="${state.activeTab === 'earnings' ? 'background: linear-gradient(135deg, #48BB78 0%, #4A90E2 100%);' : ''}"><span class="text-xl">📈</span><span class="text-xs">Ganancias</span></button>
                        <button onclick="changeTab('nearby')" class="flex flex-col items-center p-2 rounded-xl ${state.activeTab === 'nearby' ? 'text-white' : 'text-gray-600'}" style="${state.activeTab === 'nearby' ? 'background: linear-gradient(135deg, #48BB78 0%, #4A90E2 100%);' : ''}"><span class="text-xl">📍</span><span class="text-xs">Cerca</span></button>
                        <button onclick="changeTab('pets')" class="flex flex-col items-center p-2 rounded-xl ${state.activeTab === 'pets' ? 'text-white' : 'text-gray-600'}" style="${state.activeTab === 'pets' ? 'background: linear-gradient(135deg, #48BB78 0%, #4A90E2 100%);' : ''}"><span class="text-xl">🐾</span><span class="text-xs">Mascotas</span></button>
                        <button onclick="changeTab('profile')" class="flex flex-col items-center p-2 rounded-xl ${state.activeTab === 'profile' ? 'text-white' : 'text-gray-600'}" style="${state.activeTab === 'profile' ? 'background: linear-gradient(135deg, #48BB78 0%, #4A90E2 100%);' : ''}"><span class="text-xl">👤</span><span class="text-xs">Perfil</span></button>
                    </div>
                </div>
            </div>`;
        }

        function renderNearbyTab() {
            const filteredRequests = requests.filter(req => {
                const price = parseFloat(req.price);
                const distance = parseFloat(req.distance);
                const matchesPrice = price >= state.filters.minPrice && price <= state.filters.maxPrice;
                const matchesDistance = distance <= state.filters.maxDistance;
                const matchesEasyNow = !state.filters.easyNow || req.urgent;
                return matchesPrice && matchesDistance && matchesEasyNow;
            });
            const areaLabel = state.selectedLocation || 'tu zona actual';
            const locationInputValue = state.locationSearch.replace(/"/g, '&quot;');
            return `<div class="p-6 space-y-6">
                <div class="bg-gradient-to-br from-green-400 to-teal-400 rounded-3xl p-6 text-white shadow-xl">
                    <h2 class="text-2xl font-bold mb-1">📍 ${state.selectedLocation ? `Solicitudes en ${areaLabel}` : 'Solicitudes cerca de ti'}</h2>
                    <p class="text-sm text-white/90 mb-4">Mostrando movimiento en ${areaLabel}. Ajusta una zona específica para explorar nuevas oportunidades.</p>
                    <div class="bg-white/20 backdrop-blur rounded-2xl p-4">
                        <div class="relative h-64 bg-gradient-to-br from-green-200 to-teal-200 rounded-xl">
                            <div class="absolute inset-0 flex items-center justify-center text-6xl">🗺️</div>
                            <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <div class="relative">
                                    <div class="absolute inset-0 bg-blue-500 rounded-full w-16 h-16 animate-ping opacity-75"></div>
                                    <div class="relative bg-blue-500 rounded-full w-16 h-16 flex items-center justify-center text-3xl border-4 border-white">👤</div>
                                </div>
                            </div>
                            <div class="absolute top-1/4 left-1/4 animate-pulse"><div class="bg-orange-500 rounded-full w-10 h-10 flex items-center justify-center text-xl border-2 border-white">🐾</div></div>
                            <div class="absolute top-1/3 right-1/4 animate-pulse"><div class="rounded-full w-10 h-10 flex items-center justify-center text-xl border-2 border-white" style="background: #4A90E2;">🐾</div></div>
                        </div>
                        <div class="mt-4 flex flex-wrap gap-3">
                            <a href="https://www.google.com/maps" target="_blank" class="flex-1 min-w-[140px] bg-white/80 text-green-700 font-semibold text-sm px-4 py-2 rounded-xl text-center">Abrir en Google Maps</a>
                            <a href="https://www.waze.com/ul" target="_blank" class="flex-1 min-w-[140px] bg-white/80 text-green-700 font-semibold text-sm px-4 py-2 rounded-xl text-center">Abrir en Waze</a>
                        </div>
                    </div>
                </div>
                <div class="bg-white rounded-2xl p-5 shadow-lg border-2" style="border-color: ${state.isPremium ? '#4A90E2' : '#e5e7eb'};">
                    <div class="flex items-center justify-between mb-2">
                        <h3 class="text-xl font-bold">🌎 Explora otras zonas (IA)</h3>
                        ${!state.isPremium ? '<span class="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 font-semibold">⭐ Premium</span>' : ''}
                    </div>
                    <p class="text-sm text-gray-600 mb-3">Busca un distrito, parque o punto de encuentro para visualizar la demanda en ese lugar.</p>
                    ${state.isPremium ? `
                        <div class="flex flex-col sm:flex-row gap-3">
                            <input type="text" value="${locationInputValue}" oninput="updateLocationSearch(this.value)" placeholder="Ej: Miraflores, Parque Kennedy" class="flex-1 px-4 py-2 rounded-xl border-2" style="border-color: #4A90E2;" onfocus="this.style.borderColor='#48BB78'" onblur="this.style.borderColor='#4A90E2'" placeholder="Ej: Miraflores, Parque Kennedy">
                            <button onclick="applyLocationSearch()" class="text-white px-6 py-2 rounded-xl font-semibold" style="background: linear-gradient(135deg, #48BB78 0%, #4A90E2 100%);">Explorar</button>
                        </div>
                    ` : `
                        <div class="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border-2 border-yellow-300 text-center">
                            <p class="text-sm text-gray-700 mb-3">Esta función requiere Premium</p>
                            <button onclick="openPremiumModal()" class="w-full text-white py-2 rounded-xl font-semibold" style="background: linear-gradient(135deg, #48BB78 0%, #4A90E2 100%);">Probar Premium gratis</button>
                        </div>
                    `}
                </div>
                <div class="bg-white rounded-2xl p-5 shadow-lg">
                    <h3 class="text-xl font-bold mb-4">🔍 Filtros</h3>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">💰 Rango de Precio (S/)</label>
                            <div class="grid grid-cols-2 gap-3">
                                <input type="number" placeholder="Mínimo" min="0" value="${state.filters.minPrice}" onchange="updateFilter('minPrice', this.value)" class="px-3 py-2 rounded-lg border-2 border-green-300 focus:border-green-500 outline-none">
                                <input type="number" placeholder="Máximo" min="0" value="${state.filters.maxPrice}" onchange="updateFilter('maxPrice', this.value)" class="px-3 py-2 rounded-lg border-2 border-green-300 focus:border-green-500 outline-none">
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">📍 Distancia máxima (km)</label>
                            <input type="number" placeholder="Ej: 2" min="0" max="10" step="0.1" value="${state.filters.maxDistance}" onchange="updateFilter('maxDistance', this.value)" class="w-full px-3 py-2 rounded-lg border-2 border-green-300 focus:border-green-500 outline-none">
                        </div>
                        <div>
                            <label class="flex items-center cursor-pointer">
                                <input type="checkbox" ${state.filters.easyNow ? 'checked' : ''} onchange="updateFilter('easyNow', this.checked)" class="mr-3 w-5 h-5">
                                <span class="text-sm font-semibold">⚡ Fácil en el momento</span>
                            </label>
                        </div>
                        <button onclick="resetFilters()" class="w-full bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300">Limpiar Filtros</button>
                    </div>
                </div>
                ${filteredRequests.length > 0 ? filteredRequests.map(req => `<div class="bg-white rounded-2xl shadow-lg border-2 ${req.urgent ? 'border-red-300' : 'border-green-200'}">
                    ${req.urgent ? '<div class="bg-red-500 text-white text-center py-1 text-xs font-bold">⚡ URGENTE</div>' : ''}
                    <div class="p-5">
                        <div class="flex justify-between mb-4">
                            <div class="flex items-center">
                                <div class="text-5xl mr-4">${req.petPhoto}</div>
                                <div><h3 class="text-xl font-bold">${req.petName}</h3><p class="text-sm text-gray-600">${req.owner}</p><p class="text-xs text-green-600 font-semibold">📍 ${req.distance}</p></div>
                            </div>
                            <div class="text-right"><p class="text-2xl font-bold text-green-600">S/${req.price}</p>${req.negotiable ? '<p class="text-xs text-orange-500">💬 Negociable</p>' : ''}</div>
                        </div>
                        <div class="bg-blue-50 rounded-xl p-3 mb-3"><p class="text-sm text-gray-600">Servicio:</p><p class="font-bold">${req.service}</p></div>
                        <div class="bg-yellow-50 rounded-xl p-3 mb-4"><p class="text-sm text-gray-600">Cuándo:</p><p class="font-bold text-orange-600">⏰ ${req.time}</p></div>
                        <div class="flex gap-3">
                            <button onclick="alert('Rechazado')" class="flex-1 bg-gray-300 py-3 rounded-xl font-bold">✕</button>
                            ${req.negotiable ? '<button onclick="alert(\'Negociando...\')" class="flex-1 bg-orange-400 text-white py-3 rounded-xl font-bold">💬</button>' : ''}
                            <button onclick="alert('Aceptado')" class="flex-1 bg-green-500 text-white py-3 rounded-xl font-bold">✓</button>
                        </div>
                    </div>
                </div>`).join('') : '<div class="bg-white rounded-2xl p-8 text-center"><p class="text-gray-500">No hay solicitudes que coincidan con los filtros</p></div>'}
                <div class="bg-white rounded-3xl p-6 shadow-xl border-2" style="border-color: ${state.isPremium ? '#4A90E2' : '#e5e7eb'};">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex-1">
                            <div class="flex items-center gap-2 mb-2">
                                <h3 class="text-2xl font-bold text-gray-800">🚗 Paseos en ruta</h3>
                                ${!state.isPremium ? '<span class="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 font-semibold">⭐ Premium</span>' : ''}
                            </div>
                            <p class="text-sm text-gray-600">Aprovecha tus viajes: acepta paseos que están en tu camino</p>
                        </div>
                        ${state.isPremium ? `
                            <label class="relative inline-flex items-center cursor-pointer ml-4">
                                <input type="checkbox" ${state.destinationMode ? 'checked' : ''} onchange="toggleDestinationMode(this.checked)" class="sr-only peer">
                                <div class="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-green-500 peer-checked:to-blue-500"></div>
                            </label>
                        ` : ''}
                    </div>
                    ${!state.isPremium ? `
                        <div class="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border-2 border-yellow-300 text-center">
                            <p class="text-sm text-gray-700 mb-4">Esta función requiere Premium para activarla</p>
                            <button onclick="openPremiumModal()" class="text-white px-6 py-3 rounded-xl font-semibold" style="background: linear-gradient(135deg, #48BB78 0%, #4A90E2 100%);">Probar Premium gratis</button>
                        </div>
                    ` : ''}
                    ${state.isPremium && state.destinationMode ? `
                        <div class="bg-gradient-to-r from-blue-50 to-sky-50 rounded-2xl p-4 mb-4 border-2" style="border-color: #4A90E2;">
                            <label class="block text-sm font-bold mb-2" style="color: #48BB78;">📍 ¿Hacia dónde vas?</label>
                            <div class="flex gap-2">
                                <input type="text" value="${state.destinationAddress.replace(/"/g, '&quot;')}" oninput="updateDestinationAddress(this.value)" placeholder="Ej: Mi casa, Parque Kennedy, San Isidro" class="flex-1 px-4 py-3 rounded-xl bg-white border-2 text-gray-800 placeholder-gray-400 outline-none text-sm" style="border-color: #4A90E2;" onfocus="this.style.borderColor='#48BB78'" onblur="this.style.borderColor='#4A90E2'">
                                <button onclick="searchRouteWalks()" class="text-white px-5 py-3 rounded-xl font-semibold text-sm" style="background: linear-gradient(135deg, #48BB78 0%, #4A90E2 100%);">Buscar</button>
                            </div>
                            <p class="text-xs mt-2" style="color: #4A90E2;">💡 Te mostraremos paseos que están en tu ruta hacia ese destino</p>
                        </div>
                        ${state.destinationAddress ? `
                            <div class="space-y-4">
                                ${routeWalks.map(walk => `<div class="bg-white rounded-2xl p-5 shadow-lg border-2" style="border-color: #e0f2fe;">
                                    <div class="flex items-start justify-between mb-4">
                                        <div class="flex items-center flex-1">
                                            <div class="text-5xl mr-4">${walk.petPhoto}</div>
                                            <div class="flex-1">
                                                <h4 class="font-bold text-xl text-gray-800">${walk.petName}</h4>
                                                <p class="text-sm text-gray-600">${walk.owner}</p>
                                            </div>
                                        </div>
                                        <div class="text-right">
                                            <p class="text-2xl font-bold" style="color: #4A90E2;">S/${walk.price}</p>
                                            <span class="text-xs px-3 py-1 rounded-full font-semibold mt-1 inline-block" style="background: #d1fae5; color: #48BB78;">${walk.routeMatch} en ruta</span>
                                        </div>
                                    </div>
                                    <div class="bg-gradient-to-r from-blue-50 to-sky-50 rounded-xl p-4 mb-3 space-y-2 border" style="border-color: #4A90E2;">
                                        <div class="flex items-start text-sm">
                                            <span class="text-lg mr-2" style="color: #4A90E2;">📍</span>
                                            <div>
                                                <p class="text-xs text-gray-500 font-semibold">Recoger</p>
                                                <p class="text-gray-800 font-bold">${walk.pickupLocation}</p>
                                            </div>
                                        </div>
                                        <div class="flex items-start text-sm">
                                            <span class="text-lg mr-2" style="color: #48BB78;">🎯</span>
                                            <div>
                                                <p class="text-xs text-gray-500 font-semibold">Destino</p>
                                                <p class="text-gray-800 font-bold">${walk.destination}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="bg-yellow-50 rounded-xl p-4 mb-4 border" style="border-color: #fbbf24;">
                                        <p class="text-xs text-gray-500 font-semibold mb-1">Servicio</p>
                                        <p class="font-bold text-gray-800 mb-2">${walk.service}</p>
                                        <p class="text-sm font-semibold" style="color: #f59e0b;">⏰ ${walk.timeWindow}</p>
                                    </div>
                                    <div class="flex gap-3">
                                        <button onclick="alert('Rechazado')" class="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-300 transition-all">✕ Rechazar</button>
                                        <button onclick="alert('Aceptado en ruta')" class="flex-1 text-white py-3 rounded-xl font-bold transition-all hover:shadow-lg" style="background: linear-gradient(135deg, #48BB78 0%, #4A90E2 100%);">✓ Aceptar</button>
                                    </div>
                                </div>`).join('')}
                            </div>
                        ` : '<div class="bg-gradient-to-r from-blue-50 to-sky-50 rounded-2xl p-6 border-2 text-center" style="border-color: #4A90E2;"><p class="text-gray-700">Ingresa tu destino para ver paseos en tu ruta</p></div>'}
                    ` : state.isPremium ? '<div class="bg-gradient-to-r from-blue-50 to-sky-50 rounded-2xl p-6 border-2 text-center" style="border-color: #4A90E2;"><p class="text-gray-700">Activa el modo destino para ver paseos que están en tu camino</p></div>' : ''}
                </div>
            </div>`;
        }


        function renderEarningsTab() {
            const professionalGoalInputValue = state.professionalGoalInput.replace(/"/g, '&quot;');
            return `<div class="p-6 space-y-6">
                <div class="rounded-3xl p-8 text-white shadow-xl" style="background: linear-gradient(135deg, #48BB78 0%, #4A90E2 100%);">
                    <h2 class="text-3xl font-bold mb-4">¡Alcanza tus objetivos económicos! 🎯</h2>
                    <p class="mb-4">¿Cuánto quieres ganar al mes?</p>
                    <div class="flex items-center bg-white rounded-2xl p-4">
                        <span class="text-2xl font-bold mr-2" style="color: #48BB78;">S/</span>
                        <input type="number" value="${state.goalAmount}" class="flex-1 text-3xl font-bold text-gray-800 outline-none">
                    </div>
                    <p class="text-sm text-white/90 mt-3">(Plan gratis: solo 2 opciones | Premium: opciones ilimitadas)</p>
                </div>
                <div class="bg-white rounded-3xl p-6 shadow-lg border-2" style="border-color: ${state.isPremium ? '#4A90E2' : '#e5e7eb'};">
                    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                        <div>
                            <div class="flex items-center gap-2">
                                <h3 class="text-2xl font-bold text-gray-800">📈 Tu semana en números (IA)</h3>
                                ${!state.isPremium ? '<span class="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 font-semibold">⭐ Premium</span>' : ''}
                            </div>
                            <p class="text-sm text-gray-500">La app analiza tu ritmo y te muestra dónde puedes mejorar.</p>
                        </div>
                        ${state.isPremium ? '<span class="text-xs uppercase tracking-widest font-semibold px-3 py-1 rounded-full" style="color: #4A90E2; background: #e0f2fe;">Vista generada con IA</span>' : ''}
                    </div>
                    ${state.isPremium ? `
                        <div class="grid grid-cols-7 gap-3 mb-4">
                            ${['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, idx) => {
                                const heights = [65, 85, 40, 90, 75, 50, 30];
                                return `<div class="flex flex-col items-center">
                                    <span class="text-xs text-gray-400 mb-1">${day}</span>
                                    <div class="w-10 rounded-full h-28 flex items-end overflow-hidden" style="background: #e0f2fe;">
                                        <div class="w-full" style="background: linear-gradient(135deg, #48BB78 0%, #4A90E2 100%); height:${heights[idx]}%"></div>
                                    </div>
                                    <span class="text-xs text-gray-500 mt-1">${heights[idx]}%</span>
                                </div>`;
                            }).join('')}
                        </div>
                        <div class="bg-gray-100 rounded-2xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                            <p class="text-sm text-gray-600"><strong>Dato IA:</strong> Si mantienes el ritmo de jueves y viernes podrías cerrar el mes con +S/420 adicionales.</p>
                            <button class="text-white px-4 py-2 rounded-xl text-sm font-semibold" style="background: linear-gradient(135deg, #48BB78 0%, #4A90E2 100%);">Ver proyección completa</button>
                        </div>
                    ` : `
                        <div class="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border-2 border-yellow-300 text-center">
                            <p class="text-sm text-gray-700 mb-4">Esta función requiere Premium para analizar tu rendimiento con IA</p>
                            <button onclick="openPremiumModal()" class="text-white py-2 px-6 rounded-xl font-semibold" style="background: linear-gradient(135deg, #48BB78 0%, #4A90E2 100%);">Probar Premium gratis</button>
                        </div>
                    `}
                </div>
                <div>
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-2xl font-bold">📊 Opciones para ti (Profesionales)</h3>
                        ${!state.isPremium && economicPlans.length > 2 ? '<span class="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 font-semibold">⭐ Premium para más planes</span>' : ''}
                    </div>
                    <div class="space-y-4">
                        ${economicPlans.slice(0, state.isPremium ? economicPlans.length : 2).map(plan => `<div class="bg-white rounded-2xl p-6 shadow-lg border-2" style="border-color: #e0f2fe;">
                            <div class="flex justify-between items-start mb-3">
                                <div>
                                    <h4 class="text-xl font-bold text-gray-800">${plan.title}</h4>
                                    <p class="text-sm text-gray-500">${plan.subtitle}</p>
                                </div>
                                <span class="px-3 py-1 rounded-full text-xs font-semibold" style="background: #e0f2fe; color: #48BB78;">${plan.badge}</span>
                            </div>
                            <ul class="list-disc ml-5 text-sm text-gray-700 space-y-1 mb-4">
                                ${plan.items.map(item => `<li>${item.text}${item.link ? ` <a href="${item.link}" target="_blank" class="underline text-xs ml-1" style="color: #4A90E2;">${item.linkLabel || 'Ver recurso'}</a>` : ''}</li>`).join('')}
                            </ul>
                            <button class="w-full text-white py-3 rounded-xl font-semibold" style="background: linear-gradient(135deg, #48BB78 0%, #4A90E2 100%);">APLICAR PLAN</button>
                        </div>`).join('')}
                        ${!state.isPremium && economicPlans.length > 2 ? `
                            <div class="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border-2 border-yellow-300 text-center">
                                <p class="text-sm text-gray-700 mb-4">Desbloquea ${economicPlans.length - 2} planes adicionales con Premium</p>
                                <button onclick="openPremiumModal()" class="text-white py-3 px-6 rounded-xl font-semibold" style="background: linear-gradient(135deg, #48BB78 0%, #4A90E2 100%);">Probar Premium gratis</button>
                            </div>
                        ` : ''}
                    </div>
                </div>
                <div class="rounded-3xl p-6 text-white shadow-xl space-y-4" style="background: linear-gradient(135deg, #48BB78 0%, #4A90E2 100%);">
                    <div>
                        <h4 class="text-2xl font-bold mb-2">¡Define tus objetivos profesionales!</h4>
                        <p class="text-sm text-white/90">Marca o escribe en qué quieres mejorar y deja que la app te sugiera cómo lograrlo.</p>
                        <p class="text-sm text-white/90 mt-2">(Plan gratis: solo 2 opciones | Premium: opciones ilimitadas)</p>
                    </div>
                    <div class="space-y-2 mb-2">
                        ${professionalGoalSuggestions.map(goal => {
                            const isActive = state.professionalGoals.includes(goal);
                            return `<label class="flex items-center bg-white/90 text-gray-800 px-3 py-2 rounded-xl cursor-pointer border-2 ${isActive ? 'border-white' : 'border-transparent'}">
                                <input type="checkbox" ${isActive ? 'checked' : ''} onchange="toggleProfessionalGoal(${JSON.stringify(goal)})" class="mr-3 w-5 h-5">
                                <span class="text-sm font-semibold">${goal}</span>
                            </label>`;
                        }).join('')}
                    </div>
                    <div class="bg-white rounded-2xl p-4 space-y-3 text-gray-700">
                        <label class="text-sm font-bold">Escribe tu propio objetivo</label>
                        <input type="text" value="${professionalGoalInputValue}" oninput="updateProfessionalGoalInput(this.value)" placeholder="Ej: Dar talleres para nuevos paseadores" class="w-full px-4 py-2 rounded-xl border-2" style="border-color: #4A90E2;" onfocus="this.style.borderColor='#48BB78'" onblur="this.style.borderColor='#4A90E2'">
                        <button onclick="addProfessionalGoal()" class="w-full text-white py-2 rounded-xl font-semibold" style="background: linear-gradient(135deg, #48BB78 0%, #4A90E2 100%);">Agregar objetivo</button>
                    </div>
                    ${state.professionalGoals.length ? `<div class="bg-white/90 rounded-2xl p-4 text-gray-800">
                        <p class="text-sm font-bold mb-2" style="color: #48BB78;">Tus objetivos priorizados:</p>
                        <ul class="list-disc ml-5 text-sm space-y-1">
                            ${state.professionalGoals.map(goal => `<li>${goal}</li>`).join('')}
                        </ul>
                    </div>` : ''}
                </div>
                <div>
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-2xl font-bold">📊 Opciones para ti</h3>
                        ${!state.isPremium && professionalPlans.length > 2 ? '<span class="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 font-semibold">⭐ Premium para más planes</span>' : ''}
                    </div>
                    <div class="space-y-4">
                        ${professionalPlans.slice(0, state.isPremium ? professionalPlans.length : 2).map(plan => `<div class="bg-white rounded-2xl p-6 shadow-lg border-2" style="border-color: #e0f2fe;">
                            <div class="flex justify-between items-start mb-3">
                                <div>
                                    <h4 class="text-xl font-bold text-gray-800">${plan.title}</h4>
                                    <p class="text-sm text-gray-500">${plan.subtitle}</p>
                                </div>
                                <span class="px-3 py-1 rounded-full text-xs font-semibold" style="background: #e0f2fe; color: #48BB78;">${plan.badge}</span>
                            </div>
                            <ul class="list-disc ml-5 text-sm text-gray-700 space-y-1 mb-4">
                                ${plan.items.map(item => `<li>${item.text}${item.link ? ` <a href="${item.link}" target="_blank" class="underline text-xs ml-1" style="color: #4A90E2;">${item.linkLabel || 'Ver recurso'}</a>` : ''}</li>`).join('')}
                            </ul>
                            <button class="w-full text-white py-3 rounded-xl font-semibold" style="background: linear-gradient(135deg, #48BB78 0%, #4A90E2 100%);">APLICAR PLAN</button>
                        </div>`).join('')}
                        ${!state.isPremium && professionalPlans.length > 2 ? `
                            <div class="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border-2 border-yellow-300 text-center">
                                <p class="text-sm text-gray-700 mb-4">Desbloquea ${professionalPlans.length - 2} planes adicionales con Premium</p>
                                <button onclick="openPremiumModal()" class="text-white py-3 px-6 rounded-xl font-semibold" style="background: linear-gradient(135deg, #48BB78 0%, #4A90E2 100%);">Probar Premium gratis</button>
                            </div>
                        ` : ''}
                    </div>
                </div>
                <div class="bg-white rounded-3xl p-6 shadow-xl border-2" style="border-color: ${state.isPremium ? '#4A90E2' : '#e5e7eb'};">
                    <div class="flex items-center justify-between mb-2">
                        <h3 class="text-2xl font-bold text-gray-800">🤖 ¡Anticipamos oportunidades para ti! (IA)</h3>
                        ${!state.isPremium ? '<span class="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 font-semibold">⭐ Premium</span>' : ''}
                    </div>
                    <p class="text-sm text-gray-500 mb-4">Nuestro motor de IA analiza demanda, reputación y habilidades para recomendarte próximos pasos.</p>
                    ${state.isPremium ? `
                        <div class="grid md:grid-cols-3 gap-4">
                            ${aiOpportunities.map(op => `<div class="border-2 rounded-2xl p-4" style="border-color: #e0f2fe; background: linear-gradient(to bottom right, white, #f0f9ff);">
                                <div class="flex items-center mb-3">
                                    <span class="text-3xl mr-3">${op.icon}</span>
                                    <div>
                                        <h4 class="font-semibold text-gray-800">${op.title}</h4>
                                        <p class="text-xs text-gray-500">Detectado hace 5 min</p>
                                    </div>
                                </div>
                                <p class="text-sm text-gray-600 mb-4">${op.description}</p>
                                <a href="${op.link}" target="_blank" class="inline-flex items-center gap-2 font-semibold text-sm" style="color: #4A90E2;">${op.action} →</a>
                            </div>`).join('')}
                        </div>
                    ` : `
                        <div class="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border-2 border-yellow-300 text-center">
                            <p class="text-sm text-gray-700 mb-4">Esta función requiere Premium para recibir recomendaciones personalizadas con IA</p>
                            <button onclick="openPremiumModal()" class="text-white py-3 px-6 rounded-xl font-semibold" style="background: linear-gradient(135deg, #48BB78 0%, #4A90E2 100%);">Probar Premium gratis</button>
                        </div>
                    `}
                </div>
            </div>`;
        }

        function renderPetsTab() {
            const isOwner = state.userType === 'owner';
            const heading = isOwner ? '🐾 Mis mascotas' : '🐾 ¡Mis clientes peludos!';
            return `<div class="p-6">
                <h2 class="text-3xl font-bold mb-6" style="color: #4A90E2;">${heading}</h2>
                ${pets.map(pet => {
                    const petNotification = isOwner ? ownerNotifications.find(n => n.petId === pet.id) : null;
                    return `<div onclick="selectPet(${pet.id})" class="rounded-2xl p-6 shadow-lg mb-4 cursor-pointer" style="background: #e0f2fe;">
                        <div class="flex justify-between items-center">
                            <div class="flex items-center">
                                <div class="text-5xl mr-4">${pet.photo}</div>
                                <div><h3 class="text-2xl font-bold">${pet.name}</h3><p class="text-sm">Dueña: ${pet.owner}</p></div>
                            </div>
                            <span class="text-2xl">→</span>
                        </div>
                        ${petNotification ? `<div class="mt-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 text-sm text-orange-700 rounded-2xl p-3 flex items-center gap-3">
                            <div class="text-2xl">🔔</div>
                            <div>
                                <p class="font-semibold">${petNotification.message}</p>
                                <p class="text-xs text-orange-500">${petNotification.time}</p>
                            </div>
                        </div>` : ''}
                        <div class="mt-4 space-y-2">
                            <div class="bg-white rounded-xl p-3 flex justify-between"><span>Pagos:</span><span class="font-bold ${pet.payment === 'Al día' ? 'text-green-600' : 'text-yellow-600'}">${pet.payment}</span></div>
                            <div class="bg-white rounded-xl p-3 flex justify-between"><span>Próximo paseo:</span><span class="font-bold">${pet.nextWalk}</span></div>
                        </div>
                    </div>`;
                }).join('')}
            </div>`;
        }

        function renderProfileTab() {
            return `<div class="p-6">
                <div class="bg-blue-100 rounded-3xl p-8 shadow-xl">
                    <h2 class="text-3xl font-bold mb-6">¡Tu Perfil! 👤</h2>
                    <div class="text-center mb-6">
                        <div class="w-32 h-32 bg-orange-400 rounded-full mx-auto flex items-center justify-center text-6xl mb-4">👨</div>
                        <h3 class="text-2xl font-bold">Daniel.R</h3>
                        <p style="color: #4A90E2;">Paseador Profesional</p>
                        <div class="mt-2">⭐⭐⭐⭐⭐</div>
                    </div>
                    <div class="bg-white rounded-2xl p-6 mb-4">
                        <div class="flex items-center justify-between mb-3">
                            <h4 class="font-bold">Valores principales</h4>
                            <button class="text-sm font-semibold" style="color: #4A90E2;">✏️ Editar valores</button>
                        </div>
                        <div class="flex flex-wrap gap-2">
                            <span class="text-white px-4 py-2 rounded-full text-sm" style="background: #4A90E2;">Puntualidad</span>
                            <span class="text-white px-4 py-2 rounded-full text-sm" style="background: #4A90E2;">Progreso</span>
                            <span class="text-white px-4 py-2 rounded-full text-sm" style="background: #4A90E2;">Consistencia</span>
                        </div>
                    </div>
                    <div class="bg-white rounded-2xl p-6 mb-4">
                        <div class="flex items-center justify-between mb-3">
                            <h4 class="font-bold">⏰ Horario</h4>
                            <button class="text-sm font-semibold" style="color: #4A90E2;">✏️ Editar horario</button>
                        </div>
                        <p class="text-gray-700">🗓️ Lun - Viernes</p>
                        <p class="text-gray-700">⏰ 8:00am - 12:00pm</p>
                        <p class="text-gray-700">⏰ 3:00pm - 8:00pm</p>
                    </div>
                    <div class="bg-white rounded-2xl p-6 mb-4">
                        <div class="flex items-center justify-between mb-3">
                            <h4 class="font-bold">🔔 Notificaciones</h4>
                            <span class="text-xs text-gray-400">Actualizado hace 1 min</span>
                        </div>
                        <div class="space-y-3">
                            ${walkerNotifications.map(note => `<div class="bg-gray-50 rounded-2xl p-3 border border-gray-100">
                                <p class="text-sm font-semibold text-gray-800">${note.title}</p>
                                <p class="text-xs text-gray-500">${note.detail}</p>
                                <span class="text-xs text-gray-400">${note.time}</span>
                            </div>`).join('')}
                        </div>
                    </div>
                    <div class="bg-white rounded-2xl p-6 mb-4">
                        <h4 class="font-bold mb-3">💬 Comentarios:</h4>
                        <div class="space-y-3">
                            ${walkerReviews.map((review, idx) => `<div class="border-l-4 ${idx % 2 === 0 ? 'border-purple-400' : 'border-pink-400'} pl-4">
                                <p class="italic text-gray-800">"${review.comment}"</p>
                                <p class="text-sm text-gray-500">- ${review.author} · ${review.detail}</p>
                            </div>`).join('')}
                        </div>
                    </div>
                    <div class="bg-white rounded-2xl p-6 mb-4">
                        <div class="flex items-center justify-between mb-3">
                            <h4 class="font-bold">🏆 Logros</h4>
                            <button class="text-sm font-semibold" style="color: #4A90E2;">➕ Añadir logro</button>
                        </div>
                        <p class="mb-2">✓ Certificado en paseos</p>
                        <p class="mb-2">✓ Certificado en Rescate</p>
                        <p class="mb-4">✓ Curso de entrenamiento</p>
                    </div>
                    <div class="bg-white rounded-2xl p-6 mb-4">
                        <h4 class="font-bold mb-3">📊 Trayectoria</h4>
                        <div class="space-y-3">
                            <div class="bg-green-50 p-4 rounded-lg">
                                <p class="text-sm text-gray-600">Paseos completados:</p>
                                <p class="text-2xl font-bold text-green-600">210</p>
                            </div>
                            <div class="bg-red-50 p-4 rounded-lg">
                                <p class="text-sm text-gray-600">Cancelaciones:</p>
                                <p class="text-2xl font-bold text-red-600">0</p>
                            </div>
                            <div class="bg-blue-50 p-4 rounded-lg">
                                <p class="text-sm text-gray-600">Clientes que repiten:</p>
                                <p class="text-2xl font-bold text-blue-600">98%</p>
                            </div>
                        </div>
                    </div>
                    <div class="bg-white rounded-2xl p-6 mb-4">
                        <h4 class="font-bold mb-3">📈 Progreso de tus objetivos económicos</h4>
                        <p class="text-sm text-gray-600 mb-1">Meta mensual: <span class="font-bold text-orange-500">S/${state.goalAmount}</span></p>
                        <div class="bg-gray-100 rounded-full h-3 mb-4">
                            <div class="h-3 rounded-full" style="width:70%; background: linear-gradient(135deg, #48BB78 0%, #4A90E2 100%);"></div>
                        </div>
                        <p class="text-sm text-gray-600 mb-1">Ingresos confirmados esta semana</p>
                        <div class="bg-green-50 rounded-2xl p-4"><span class="text-2xl font-bold text-green-600">S/ 780</span><span class="text-xs text-green-700 ml-2">(+15% vs semana pasada)</span></div>
                        <p class="text-xs text-gray-400 mt-3 text-right">Contenido visible únicamente para ti</p>
                    </div>
                    <div class="bg-white rounded-2xl p-6 mb-4">
                        <h4 class="font-bold mb-3">🎯 Objetivos profesionales en marcha</h4>
                        <p class="text-sm text-gray-600 mb-2">Lo que estás trabajando ahora:</p>
                        <ul class="list-disc ml-5 text-sm text-gray-700 space-y-1">
                            ${(state.professionalGoals.length ? state.professionalGoals : ['Tener 30 clientes regulares', 'Extender mi trabajo a dos distritos más']).map(goal => `<li>${goal}</li>`).join('')}
                        </ul>
                        <button onclick="changeTab('earnings')" class="mt-4 text-white px-4 py-2 rounded-xl text-sm font-semibold" style="background: #4A90E2;">Actualizar objetivos</button>
                        <p class="text-xs text-gray-400 mt-3 text-right">Contenido visible únicamente para ti</p>
                    </div>
                    <div class="bg-white rounded-2xl p-6">
                        <h4 class="font-bold mb-3">📸 Mi trabajo en acción</h4>
                        <div class="grid grid-cols-3 gap-3">
                            ${[...Array(6)].map((_, i) => `<div class="aspect-square bg-gradient-to-br from-purple-200 to-pink-200 rounded-xl flex items-center justify-center text-4xl">📷</div>`).join('')}
                        </div>
                    </div>
                </div>
            </div>`;
        }

        function renderOwnerNearbyTab() {
            const filteredWalkers = nearbyWalkers.filter(walker => {
                return walker.rating >= state.filters.minRating &&
                       walker.experience >= state.filters.minExperience &&
                       walker.totalWalks >= state.filters.minWalks;
            });
            return `<div class="p-6 space-y-6">
                <div class="rounded-3xl p-6 text-white shadow-xl" style="background: linear-gradient(135deg, #48BB78 0%, #4A90E2 100%);">
                    <h2 class="text-2xl font-bold mb-4">📍 Paseadores cerca de ti</h2>
                    <div class="bg-white/20 backdrop-blur rounded-2xl p-4">
                        <div class="relative h-64 bg-gradient-to-br from-green-200 to-teal-200 rounded-xl">
                            <div class="absolute inset-0 flex items-center justify-center text-6xl">🗺️</div>
                            <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <div class="relative">
                                    <div class="absolute inset-0 style="background: #4A90E2;" rounded-full w-16 h-16 animate-ping opacity-75"></div>
                                    <div class="relative style="background: #4A90E2;" rounded-full w-16 h-16 flex items-center justify-center text-3xl border-4 border-white">🏠</div>
                                </div>
                            </div>
                            ${nearbyWalkers.map((w, i) => `<div class="absolute ${i === 0 ? 'top-1/4 left-1/4' : i === 1 ? 'top-1/3 right-1/4' : 'bottom-1/4 left-1/3'} animate-pulse"><div class="bg-orange-500 rounded-full w-10 h-10 flex items-center justify-center text-xl border-2 border-white">${w.photo}</div></div>`).join('')}
                        </div>
                        <div class="mt-4 flex flex-wrap gap-3">
                            <a href="https://www.google.com/maps" target="_blank" class="flex-1 min-w-[140px] bg-white/80 text-green-700 font-semibold text-sm px-4 py-2 rounded-xl text-center">Abrir en Google Maps</a>
                            <a href="https://www.waze.com/ul" target="_blank" class="flex-1 min-w-[140px] bg-white/80 text-green-700 font-semibold text-sm px-4 py-2 rounded-xl text-center">Abrir en Waze</a>
                        </div>
                    </div>
                </div>
                <div class="bg-white rounded-2xl p-5 shadow-lg">
                    <h3 class="text-xl font-bold mb-4">🔍 Filtros</h3>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">⭐ Calificación mínima (estrellas)</label>
                            <select onchange="updateFilter('minRating', this.value)" class="w-full px-3 py-2 rounded-lg border-2 border-2"
            style="border-color: #4A90E2; focus:border-purple-500 outline-none">
                                <option value="0" ${state.filters.minRating === 0 ? 'selected' : ''}>Todas</option>
                                <option value="3" ${state.filters.minRating === 3 ? 'selected' : ''}>3+ estrellas</option>
                                <option value="4" ${state.filters.minRating === 4 ? 'selected' : ''}>4+ estrellas</option>
                                <option value="5" ${state.filters.minRating === 5 ? 'selected' : ''}>5 estrellas</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">📅 Años de experiencia mínima</label>
                            <input type="number" placeholder="Ej: 2" min="0" max="20" value="${state.filters.minExperience}" onchange="updateFilter('minExperience', this.value)" class="w-full px-3 py-2 rounded-lg border-2 border-2"
            style="border-color: #4A90E2; focus:border-purple-500 outline-none">
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">🐾 Número de paseos mínimos</label>
                            <input type="number" placeholder="Ej: 50" min="0" value="${state.filters.minWalks}" onchange="updateFilter('minWalks', this.value)" class="w-full px-3 py-2 rounded-lg border-2 border-2"
            style="border-color: #4A90E2; focus:border-purple-500 outline-none">
                        </div>
                        <button onclick="resetFilters()" class="w-full bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300">Limpiar Filtros</button>
                    </div>
                </div>
                <div class="bg-white rounded-2xl p-4 shadow-lg">
                    <h3 class="text-xl font-bold mb-4">📋 Mis Solicitudes</h3>
                    ${ownerRequests.length > 0 ? ownerRequests.map(req => `<div class="rounded-xl p-4 mb-3 border-2" style="background: #e0f2fe; border-color: ${req.status === 'Aceptado' ? '#10b981' : '#f59e0b'};">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center">
                                <div class="text-4xl mr-3">${req.walkerPhoto}</div>
                                <div>
                                    <p class="font-bold">${req.walkerName}</p>
                                    <p class="text-sm text-gray-600">${req.service}</p>
                                    <p class="text-xs text-gray-500">${req.date}</p>
                                </div>
                            </div>
                            <div class="text-right">
                                <p class="font-bold style="color: #4A90E2;"">S/${req.price}</p>
                                <span class="text-xs px-2 py-1 rounded-full ${req.status === 'Aceptado' ? 'bg-green-200 text-green-700' : 'bg-yellow-200 text-yellow-700'}">${req.status}</span>
                            </div>
                        </div>
                    </div>`).join('') : '<p class="text-gray-500 text-center py-4">No tienes solicitudes aún</p>'}
                </div>
                ${filteredWalkers.length > 0 ? filteredWalkers.map(walker => `<div class="bg-white rounded-2xl shadow-lg border-2 border-green-200">
                    <div class="p-5">
                        <div class="flex justify-between items-start mb-4">
                            <div class="flex items-center">
                                <div class="text-6xl mr-4">${walker.photo}</div>
                                <div>
                                    <h3 class="text-2xl font-bold">${walker.name}</h3>
                                    <div class="flex items-center gap-2 mt-1">
                                        <div class="text-yellow-500">${'⭐'.repeat(walker.rating)}</div>
                                        <span class="text-sm text-gray-600">${walker.rating}.0</span>
                                    </div>
                                    <p class="text-sm text-green-600 font-semibold mt-1">📍 ${walker.distance}</p>
                                </div>
                            </div>
                            <div class="text-right">
                                <p class="text-2xl font-bold text-green-600">S/${walker.price}</p>
                                <span class="text-xs px-2 py-1 rounded-full ${walker.available ? 'bg-green-200 text-green-700' : 'bg-gray-200 text-gray-700'}">${walker.available ? 'Disponible' : 'Ocupado'}</span>
                            </div>
                        </div>
                        <div class="bg-blue-50 rounded-xl p-3 mb-3">
                            <p class="text-sm text-gray-600 mb-1">Servicios:</p>
                            <div class="flex flex-wrap gap-2">
                                ${walker.services.map(s => `<span class="bg-blue-200 text-blue-700 px-2 py-1 rounded-full text-xs">${s}</span>`).join('')}
                            </div>
                        </div>
                        <div class="flex gap-3">
                            <button onclick="openChat('${walker.phone}')" class="flex-1 bg-blue-500 text-white py-3 rounded-xl font-bold">💬 Escribir</button>
                            <button onclick="viewWalkerProfile(${walker.id})" class="flex-1 text-white py-3 rounded-xl font-bold" style="background: #4A90E2;">👤 Ver Perfil</button>
                            <button onclick="openRequestForm(${walker.id})" class="flex-1 bg-green-500 text-white py-3 rounded-xl font-bold">📝 Pedido</button>
                        </div>
                    </div>
                </div>`).join('') : '<div class="bg-white rounded-2xl p-8 text-center"><p class="text-gray-500">No hay paseadores que coincidan con los filtros</p></div>'}
            </div>`;
        }

        function renderWalkerProfile() {
            const walker = nearbyWalkers.find(w => w.id === state.selectedWalker) || nearbyWalkers[0];
            if (!walker) return '';
            return `<div class="min-h-screen bg-purple-50">
                <div class="style="background: #4A90E2;" text-white p-6">
                    <button onclick="goBackFromProfile()" class="mb-4">← Volver</button>
                    <div class="flex items-center">
                        <div class="text-6xl mr-4">${walker.photo}</div>
                        <div>
                            <h2 class="text-3xl font-bold">${walker.name}</h2>
                            <div class="flex items-center gap-2 mt-1">
                                <div class="text-yellow-300">${'⭐'.repeat(walker.rating)}</div>
                                <span>${walker.rating}.0</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="p-6 space-y-6">
                    <div class="bg-white rounded-2xl p-6 shadow-lg">
                        <h3 class="font-bold mb-3">📍 Ubicación</h3>
                        <p class="text-gray-700">A ${walker.distance} de ti</p>
                        <div class="bg-green-50 rounded-xl p-4 mt-3">
                            <p class="text-sm text-gray-600">Precio base:</p>
                            <p class="text-2xl font-bold text-green-600">S/${walker.price}</p>
                        </div>
                    </div>
                    <div class="bg-white rounded-2xl p-6 shadow-lg">
                        <h3 class="font-bold mb-3">🐾 Servicios que ofrece</h3>
                        <div class="space-y-2">
                            ${walker.services.map(s => `<div class="p-3 rounded-lg" style="background: #e0f2fe;"><span class="mr-2" style="color: #4A90E2;">✓</span>${s}</div>`).join('')}
                        </div>
                    </div>
                    <div class="bg-white rounded-2xl p-6 shadow-lg">
                        <h3 class="font-bold mb-3">⏰ Horario:</h3>
                        <p class="text-gray-700">🗓️ Lun - Viernes</p>
                        <p class="text-gray-700">⏰ 8:00am - 12:00pm</p>
                        <p class="text-gray-700">⏰ 3:00pm - 8:00pm</p>
                    </div>
                    <div class="bg-white rounded-2xl p-6 shadow-lg">
                        <h3 class="font-bold mb-3">💬 Comentarios:</h3>
                        <div class="space-y-3">
                            ${walkerReviews.map((review, idx) => `<div class="border-l-4 ${idx % 2 === 0 ? 'border-purple-400' : 'border-pink-400'} pl-4">
                                <p class="italic text-gray-800">"${review.comment}"</p>
                                <p class="text-sm text-gray-500">- ${review.author} · ${review.detail}</p>
                            </div>`).join('')}
                        </div>
                    </div>
                    <div class="bg-white rounded-2xl p-6 shadow-lg">
                        <h3 class="font-bold mb-3">🏆 Logros:</h3>
                        <p class="mb-2">✓ Certificado en paseos</p>
                        <p class="mb-2">✓ Certificado en Rescate</p>
                        <p class="mb-4">✓ Curso de entrenamiento</p>
                    </div>
                    <div class="bg-white rounded-2xl p-6 shadow-lg">
                        <h4 class="font-bold mb-3">📊 Trayectoria</h4>
                        <div class="space-y-3">
                            <div class="bg-green-50 p-4 rounded-lg">
                                <p class="text-sm text-gray-600">Paseos completados:</p>
                                <p class="text-2xl font-bold text-green-600">${walker.completedWalks}</p>
                            </div>
                            <div class="bg-red-50 p-4 rounded-lg">
                                <p class="text-sm text-gray-600">Cancelaciones:</p>
                                <p class="text-2xl font-bold text-red-600">${walker.cancellations}</p>
                            </div>
                            <div class="bg-blue-50 p-4 rounded-lg">
                                <p class="text-sm text-gray-600">Clientes que repiten:</p>
                                <p class="text-2xl font-bold text-blue-600">${walker.repeatClients}%</p>
                            </div>
                        </div>
                    </div>
                    <div class="bg-white rounded-2xl p-6 shadow-lg">
                        <h4 class="font-bold mb-3">📸 Mi trabajo en acción</h4>
                        <div class="grid grid-cols-3 gap-3">
                            ${[...Array(6)].map((_, i) => `<div class="aspect-square bg-gradient-to-br from-purple-200 to-pink-200 rounded-xl flex items-center justify-center text-4xl">📷</div>`).join('')}
                        </div>
                    </div>
                    <div class="flex gap-3">
                        <button onclick="openChat('${walker.phone}')" class="flex-1 bg-blue-500 text-white py-4 rounded-xl font-bold text-lg">💬 Escribir</button>
                        <button onclick="openRequestForm(${walker.id})" class="flex-1 bg-green-500 text-white py-4 rounded-xl font-bold text-lg">📝 Hacer Pedido</button>
                    </div>
                </div>
            </div>`;
        }

        function renderRequestForm() {
            const walker = nearbyWalkers.find(w => w.id === state.selectedWalker) || nearbyWalkers[0];
            if (!walker) return '';
            return `<div class="min-h-screen bg-purple-50">
                <div class="style="background: #4A90E2;" text-white p-6">
                    <button onclick="goBackFromRequest()" class="mb-4">← Volver</button>
                    <h2 class="text-3xl font-bold">📝 Hacer Pedido</h2>
                    <p class="text-white/80">Para: ${walker.name}</p>
                </div>
                <div class="p-6">
                    <form onsubmit="event.preventDefault(); submitRequest();" class="space-y-5">
                        <div class="bg-white rounded-2xl p-5 shadow-lg">
                            <label class="block text-sm font-bold text-gray-700 mb-2">🐕 Mascota *</label>
                            <select required class="w-full px-4 py-3 rounded-xl border-2 outline-none" style="border-color: #4A90E2;"
                                <option value="">Selecciona tu mascota</option>
                                ${pets.map(pet => `<option value="${pet.id}">${pet.name}</option>`).join('')}
                            </select>
                        </div>
                        <div class="bg-white rounded-2xl p-5 shadow-lg">
                            <label class="block text-sm font-bold text-gray-700 mb-2">📅 Fecha y Hora *</label>
                            <input type="datetime-local" required class="w-full px-4 py-3 rounded-xl border-2 outline-none" style="border-color: #4A90E2;"
                        </div>
                        <div class="bg-white rounded-2xl p-5 shadow-lg">
                            <label class="block text-sm font-bold text-gray-700 mb-2">⏰ Tipo de Servicio *</label>
                            <select required class="w-full px-4 py-3 rounded-xl border-2 outline-none" style="border-color: #4A90E2;"
                                <option value="">Selecciona el servicio</option>
                                <option value="corto">Paseo corto (20-30 min)</option>
                                <option value="largo">Paseo largo (1+ hora)</option>
                                <option value="grupal">Paseo grupal</option>
                                <option value="entrenamiento">Entrenamiento básico</option>
                                <option value="cuidado">Cuidado en casa</option>
                                <option value="transporte">Transporte a veterinaria</option>
                            </select>
                        </div>
                        <div class="bg-white rounded-2xl p-5 shadow-lg">
                            <label class="block text-sm font-bold text-gray-700 mb-2">💰 Precio a pagar (S/) *</label>
                            <input type="number" required min="1" class="w-full px-4 py-3 rounded-xl border-2 border-2"
            style="border-color: #4A90E2; focus:border-purple-500 outline-none" placeholder="Ej: 25">
                        </div>
                        <div class="bg-white rounded-2xl p-5 shadow-lg">
                            <label class="block text-sm font-bold text-gray-700 mb-2">💬 Notas adicionales</label>
                            <textarea class="w-full px-4 py-3 rounded-xl border-2 border-2"
            style="border-color: #4A90E2; focus:border-purple-500 outline-none" rows="4" placeholder="Instrucciones especiales, preferencias, etc..."></textarea>
                        </div>
                        <div class="space-y-3 pt-4">
                            <button type="submit" class="w-full text-white py-4 rounded-2xl font-bold text-lg hover:shadow-xl transform hover:scale-105 transition-all" style="background: linear-gradient(135deg, #48BB78 0%, #4A90E2 100%);">
                                ✨ Enviar Pedido
                            </button>
                            <button type="button" onclick="goBackFromRequest()" class="w-full bg-gray-200 text-gray-700 py-3 rounded-2xl font-semibold hover:bg-gray-300 transition-all">
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>`;
        }

        function renderPetDetail() {
            const pet = pets.find(p => p.id === state.selectedPet);
            if (!pet) return '';
            const isOwner = state.userType === 'owner';
            const petNotifications = ownerNotifications.filter(n => n.petId === pet.id);
            return `<div class="min-h-screen bg-purple-50">
                <div class="style="background: #4A90E2;" text-white p-6">
                    <button onclick="goBack()" class="mb-4">← Volver</button>
                    <div class="flex items-center">
                        <div class="text-6xl mr-4">${pet.photo}</div>
                        <div><h2 class="text-3xl font-bold">${pet.name}</h2><p>Dueña: ${pet.owner}</p></div>
                    </div>
                </div>
                <div class="p-6 space-y-6">
                    ${petNotifications.length ? `<div class="bg-white rounded-2xl p-5 shadow-lg border border-yellow-200">
                        <h3 class="font-bold text-yellow-500 mb-2">🔔 Notificaciones en vivo</h3>
                        <div class="space-y-2">
                            ${petNotifications.map(note => `<div class="flex items-center justify-between text-sm text-gray-700">
                                <span>${note.message}</span>
                                <span class="text-xs text-gray-400">${note.time}</span>
                            </div>`).join('')}
                        </div>
                    </div>` : ''}
                    <div class="bg-white rounded-2xl p-6 shadow-lg">
                        <h3 class="font-bold mb-2 flex items-center justify-between">📍 Ubicación Compartida <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div></h3>
                        <div class="relative h-72 rounded-2xl overflow-hidden border border-green-200 shadow-inner" style="background-image: linear-gradient(0deg, rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px); background-size: 60px 60px; background-color: #e6fbef;">
                            <svg viewBox="0 0 360 260" class="absolute inset-0 w-full h-full">
                                <defs>
                                    <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stop-color="#4A90E2" />
                                        <stop offset="100%" stop-color="#48BB78" />
                                    </linearGradient>
                                    <filter id="glow">
                                        <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                                        <feMerge>
                                            <feMergeNode in="coloredBlur"/>
                                            <feMergeNode in="SourceGraphic"/>
                                        </feMerge>
                                    </filter>
                                </defs>
                                <path d="M40 220 Q 140 180 200 150 Q 260 120 320 60" fill="none" stroke="url(#routeGradient)" stroke-width="10" stroke-linecap="round" stroke-dasharray="6 12" filter="url(#glow)" />
                                <foreignObject x="15" y="185" width="70" height="70">
                                    <div xmlns="http://www.w3.org/1999/xhtml" class="flex flex-col items-center text-xs font-semibold text-green-700">
                                        <div class="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center text-2xl border-4 border-white shadow-lg">🟢</div>
                                        <span class="mt-2">Inicio</span>
                                    </div>
                                </foreignObject>
                                <foreignObject x="105" y="140" width="80" height="80">
                                    <div xmlns="http://www.w3.org/1999/xhtml" class="flex flex-col items-center text-xs font-semibold text-yellow-700">
                                        <div class="w-12 h-12 rounded-full bg-white text-3xl flex items-center justify-center border-4 border-yellow-400 shadow-lg">💩</div>
                                        <span class="mt-1 bg-yellow-100 px-2 py-0.5 rounded-full text-xs">Hizo popó</span>
                                    </div>
                                </foreignObject>
                                <foreignObject x="185" y="105" width="80" height="80">
                                    <div xmlns="http://www.w3.org/1999/xhtml" class="flex flex-col items-center text-xs font-semibold text-blue-700">
                                        <div class="w-12 h-12 rounded-full bg-white text-3xl flex items-center justify-center border-4 border-blue-400 shadow-lg">🐶</div>
                                        <span class="mt-1 bg-blue-100 px-2 py-0.5 rounded-full text-xs">Jugó con amigos</span>
                                    </div>
                                </foreignObject>
                                <foreignObject x="275" y="30" width="70" height="90">
                                    <div xmlns="http://www.w3.org/1999/xhtml" class="flex flex-col items-center text-xs font-semibold" style="color: #4A90E2;">
                                        <div class="relative">
                                            <div class="absolute -inset-2 rounded-full opacity-40 animate-ping" style="background: #4A90E2;"></div>
                                            <div class="w-14 h-14 rounded-full bg-white text-3xl flex items-center justify-center border-4 shadow-lg" style="border-color: #4A90E2;">🐩</div>
                                        </div>
                                        <span class="mt-1 px-2 py-0.5 rounded-full text-xs" style="background: #e0f2fe;">Parque</span>
                                    </div>
                                </foreignObject>
                            </svg>
                            <div class="absolute top-4 right-6 text-xs bg-white/80 backdrop-blur px-3 py-1 rounded-full font-semibold text-gray-600 shadow">Paseo en vivo</div>
                        </div>
                        <div class="mt-4 text-white rounded-2xl p-5 shadow-inner" style="background: linear-gradient(135deg, #48BB78 0%, #4A90E2 100%);">
                            <div class="flex items-center justify-between mb-4">
                                <div>
                                    <p class="text-sm text-white/80">Paseo en vivo</p>
                                    <p class="text-xl font-bold">Lucy con Patricia Romero</p>
                                </div>
                                <div class="bg-white/20 px-4 py-2 rounded-full text-sm font-semibold">⏱️ 25:34</div>
                            </div>
                            <div class="mb-5">
                                <p class="text-sm text-white/80 mb-1">Progreso del paseo</p>
                                <div class="w-full bg-white/30 rounded-full h-3">
                                    <div class="bg-white h-3 rounded-full" style="width:75%"></div>
                                </div>
                                <p class="text-xs mt-1 text-white/70">75% completado</p>
                            </div>
                            <div class="grid grid-cols-3 gap-2 text-center text-sm font-semibold mb-5">
                                <div class="bg-white/10 rounded-xl py-2">
                                    <p class="text-xs text-white/80">Distancia</p>
                                    <p class="text-lg">1.2 km</p>
                                </div>
                                <div class="bg-white/10 rounded-xl py-2">
                                    <p class="text-xs text-white/80">Duración</p>
                                    <p class="text-lg">26 min</p>
                                </div>
                                <div class="bg-white/10 rounded-xl py-2">
                                    <p class="text-xs text-white/80">Velocidad</p>
                                    <p class="text-lg">2.8 km/h</p>
                                </div>
                            </div>
                            <div class="space-y-3 bg-white/10 rounded-2xl p-4">
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center gap-2">
                                        <div class="text-2xl">✅</div>
                                        <div>
                                            <p class="text-sm font-semibold">Ya hizo popó</p>
                                            <p class="text-xs text-white/70">Todo bajo control</p>
                                        </div>
                                    </div>
                                    <button class="text-sm font-bold bg-white/20 px-3 py-1 rounded-xl">Ver</button>
                                </div>
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center gap-2">
                                        <div class="text-2xl">✅</div>
                                        <div>
                                            <p class="text-sm font-semibold">Jugó con perros</p>
                                            <p class="text-xs text-white/70">2 fotos nuevas</p>
                                        </div>
                                    </div>
                                    <button class="text-sm font-bold bg-white/20 px-3 py-1 rounded-xl">Ver fotos</button>
                                </div>
                            </div>
                            <div class="mt-5 bg-white/15 rounded-2xl p-4 space-y-3">
                                <div class="flex items-center justify-between">
                                    <div>
                                        <h4 class="text-lg font-bold">Notificar</h4>
                                        <p class="text-sm text-white/70">Escribe una actualización rápida para la familia</p>
                                    </div>
                                    <button class="text-xs font-semibold bg-white/20 px-3 py-1 rounded-xl text-white/90">Ver historial</button>
                                </div>
                                <textarea class="w-full rounded-2xl p-3 bg-white/20 text-white placeholder-white/60 text-sm outline-none" rows="2" placeholder="Ej: Estamos llegando al parque, Lucy va feliz y tomó agua."></textarea>
                                <button class="w-full bg-white font-bold py-2 rounded-xl text-sm" style="color: #4A90E2;">Enviar notificación</button>
                            </div>
                        </div>
                    </div>
                    ${pet.scheduledWalks && pet.scheduledWalks.length ? `<div class="bg-white rounded-2xl p-6 shadow-lg">
                        <h3 class="font-bold mb-3">🗓️ Paseos programados</h3>
                        <ul class="list-disc ml-5 text-sm text-gray-700 space-y-1">
                            ${pet.scheduledWalks.map(s => `<li>${s}</li>`).join('')}
                        </ul>
                        <button class="mt-3 text-sm font-semibold" style="color: #4A90E2;">✏️ Ajustar horarios</button>
                    </div>` : ''}
                    <div class="bg-white rounded-2xl p-6 shadow-lg">
                        <h3 class="font-bold mb-3 flex justify-between items-center">Características ${isOwner ? '<button class="text-sm" style="color: #4A90E2;">✏️ [Editar]</button>' : ''}</h3>
                        ${pet.characteristics.map(c => `<div class="p-3 rounded-lg mb-2" style="background: #e0f2fe;"><span class="mr-2" style="color: #4A90E2;">✓</span>${c}</div>`).join('')}
                    </div>
                    <div class="bg-white rounded-2xl p-6 shadow-lg">
                        <h3 class="font-bold mb-3">⏰ Resumen del Paseo</h3>
                        <div class="grid grid-cols-2 gap-3">
                            <div class="bg-orange-50 p-3 rounded-lg"><p class="text-sm text-gray-600">Hora de inicio:</p><p class="font-bold">${pet.walkSummary.start}</p></div>
                            <div class="bg-orange-50 p-3 rounded-lg"><p class="text-sm text-gray-600">Hora de salida:</p><p class="font-bold">${pet.walkSummary.end}</p></div>
                            <div class="bg-orange-50 p-3 rounded-lg"><p class="text-sm text-gray-600">Duración:</p><p class="font-bold">${pet.walkSummary.duration}</p></div>
                            ${pet.walkSummary.extra ? `<div class="bg-green-50 p-3 rounded-lg col-span-2"><p class="text-sm text-gray-600">Extra:</p><p class="font-bold text-green-600">${pet.walkSummary.extra}</p></div>` : ''}
                        </div>
                    </div>
                    <div class="bg-white rounded-2xl p-6 shadow-lg">
                        <h3 class="font-bold mb-3">Videos y Fotos</h3>
                        <div class="grid grid-cols-3 gap-3 mb-4">
                            ${[...Array(6)].map((_, i) => `<div class="aspect-square rounded-xl flex items-center justify-center text-3xl" style="background: #e0f2fe;">${i % 2 === 0 ? '📷' : '🎥'}</div>`).join('')}
                        </div>
                        <button class="w-full text-white py-3 rounded-xl font-bold" style="background: #4A90E2;">📹 Recopilación Semanal</button>
                    </div>
                    <div class="bg-white rounded-2xl p-6 shadow-lg">
                        <h3 class="font-bold mb-3">💰 Finanzas</h3>
                        <div class="bg-green-50 p-4 rounded-lg mb-3"><p class="text-sm text-gray-600">Estado:</p><p class="font-bold text-2xl text-green-600">✓ Todo al día</p></div>
                        <div class="bg-blue-50 p-4 rounded-lg mb-3"><p class="text-sm text-gray-600">Próximo pago:</p><p class="font-bold text-xl">05 Nov 2025</p></div>
                        <div class="p-4 rounded-lg mb-3" style="background: #e0f2fe;"><p class="text-sm text-gray-600">Monto:</p><p class="font-bold text-2xl" style="color: #4A90E2;">S/ 120</p></div>
                        <div class="bg-yellow-50 p-4 rounded-lg flex justify-between items-center">
                            <div><p class="text-sm text-gray-600">Yape:</p><p class="font-bold">988 754 874</p></div>
                            <button onclick="alert('${isOwner ? 'Número copiado' : 'Editar Yape'}')" class="bg-yellow-400 px-4 py-2 rounded-lg font-bold">${isOwner ? '📋 [Copiar]' : '✏️ [Editar]'}</button>
                        </div>
                    </div>
                    ${isOwner ? `<div class="bg-white rounded-2xl p-6 shadow-lg">
                        <h3 class="font-bold mb-3">💬 Deja una reseña</h3>
                        <p class="text-sm text-gray-600 mb-3">Cuéntale a otros dueños cómo fue la experiencia de ${pet.name}.</p>
                        <textarea class="w-full border-2 border-purple-200 rounded-2xl p-3 mb-3" rows="3" placeholder="Ej: Patricia mandó fotos y siguió todas las instrucciones..."></textarea>
                        <button class="w-full style="background: #4A90E2;" text-white py-3 rounded-xl font-semibold">Enviar reseña</button>
                    </div>` : ''}
                </div>
            </div>`;
        }

        // Acciones de navegación principal entre vistas dueños/paseadores
        function selectUserType(type) {
            state.userType = type;
            if (type === 'owner') {
                state.showSafetyInfo = true;
                state.currentView = 'home';
                render();
            } else {
                triggerVision('walkerMain');
            }
        }
        function goToRegister() { triggerVision('register'); }
        function selectRegisterType(type) { state.registerType = type; render(); }
        function submitRegister() { alert('¡Registro enviado! Te contactaremos pronto.'); state.currentView = 'home'; state.registerType = null; render(); }
        function continuToApp() { state.showSafetyInfo = false; triggerVision('ownerMain'); }
        function closeSafetyInfo() { state.showSafetyInfo = false; state.currentView = 'home'; state.userType = null; render(); }
        function changeTab(tab) { state.activeTab = tab; render(); }
        function selectPet(id) { state.selectedPet = id; state.currentView = 'petDetail'; render(); }
        function goBack() { state.currentView = 'main'; state.selectedPet = null; render(); }
        function goHome() { state.currentView = 'home'; state.userType = null; state.activeTab = 'earnings'; state.registerType = null; render(); }
        function viewWalkerProfile(walkerId) { state.selectedWalker = walkerId; state.currentView = 'walkerProfile'; render(); }
        function openRequestForm(walkerId) { state.selectedWalker = walkerId; state.currentView = 'requestForm'; render(); }
        function openChat(phone) { window.open(`https://wa.me/51${phone}`, '_blank'); }
        function submitRequest() { alert('¡Pedido enviado! El paseador recibirá tu solicitud.'); goBackFromRequest(); }
        function goBackFromProfile() { state.currentView = 'main'; state.selectedWalker = null; render(); }
        function goBackFromRequest() { state.currentView = 'main'; state.selectedWalker = null; render(); }
        // Manejo de filtros y formularios auxiliares
        function updateFilter(key, value) {
            if (key === 'easyNow') {
                state.filters[key] = value;
            } else {
                state.filters[key] = parseFloat(value) || 0;
            }
            render();
        }
        function resetFilters() {
            state.filters = { minRating: 0, minExperience: 0, minWalks: 0, minPrice: 0, maxPrice: 100, maxDistance: 5, easyNow: false };
            render();
        }
        function toggleProfessionalGoal(goal) {
            if (!goal) return;
            const index = state.professionalGoals.indexOf(goal);
            if (index >= 0) state.professionalGoals.splice(index, 1);
            else state.professionalGoals.push(goal);
            render();
        }
        function updateProfessionalGoalInput(value) {
            state.professionalGoalInput = value;
        }
        function addProfessionalGoal() {
            const goal = state.professionalGoalInput.trim();
            if (!goal) return;
            if (!state.professionalGoals.includes(goal)) state.professionalGoals.push(goal);
            state.professionalGoalInput = '';
            render();
        }
        function updateLocationSearch(value) {
            state.locationSearch = value;
        }
        function applyLocationSearch() {
            state.selectedLocation = state.locationSearch.trim();
            render();
        }
        function toggleDestinationMode(enabled) {
            state.destinationMode = enabled;
            if (!enabled) state.destinationAddress = '';
            render();
        }
        function updateDestinationAddress(value) {
            state.destinationAddress = value;
        }
        function searchRouteWalks() {
            if (!state.destinationAddress.trim()) {
                alert('Por favor ingresa un destino');
                return;
            }
            render();
        }
        // Control del flujo de visión (muestra pantalla y luego ejecuta acción)
        function triggerVision(action) {
            state.pendingAction = action;
            state.showVisionScreen = true;
            render();
        }
        function continueFromVision() {
            const action = state.pendingAction;
            state.showVisionScreen = false;
            state.pendingAction = null;
            if (action === 'walkerMain') {
                state.currentView = 'main';
                state.activeTab = 'earnings';
            } else if (action === 'ownerMain') {
                state.currentView = 'main';
                state.activeTab = 'pets';
            } else if (action === 'register') {
                state.currentView = 'register';
            }
            render();
        }
        render();
