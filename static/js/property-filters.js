// ✅ ФИЛЬТРЫ ДЛЯ СТРАНИЦЫ СВОЙСТВ - AJAX MODE (как Домклик/Циан)
console.log('🔥 property-filters.js загружается - AJAX MODE...');

// ======================
// CENTRALIZED FILTER STATE MANAGEMENT
// ======================

// ✅ Централизованное хранилище состояния фильтров
window.propertyFiltersState = {};

// Получить текущее состояние фильтров
window.getFiltersState = function() {
    const state = {};
    
    // Text search
    const mobileSearch = document.getElementById('property-search');
    const desktopSearch = document.getElementById('property-search-desktop');
    const searchValue = (mobileSearch && mobileSearch.value.trim()) || (desktopSearch && desktopSearch.value.trim());
    if (searchValue) state.q = searchValue;
    
    // Rooms
    const checkedRooms = Array.from(document.querySelectorAll('input[data-filter-type="rooms"]:checked')).map(cb => cb.value);
    if (checkedRooms.length > 0) state.rooms = checkedRooms;
    
    // Price
    const priceFromEl = document.getElementById('priceFrom') || document.getElementById('price-from');
    const priceToEl = document.getElementById('priceTo') || document.getElementById('price-to');
    const priceFromModalEl = document.getElementById('priceFromModal');
    const priceToModalEl = document.getElementById('priceToModal');
    if (priceFromEl && priceFromEl.value) state.price_min = priceFromEl.value;
    if (priceToEl && priceToEl.value) state.price_max = priceToEl.value;
    if (priceFromModalEl && priceFromModalEl.value) state.price_min = priceFromModalEl.value;
    if (priceToModalEl && priceToModalEl.value) state.price_max = priceToModalEl.value;
    
    // Developers
    const developers = Array.from(document.querySelectorAll('input[data-filter-type="developer"]:checked')).map(cb => cb.value);
    if (developers.length > 0) state.developers = developers;
    
    // Districts
    const districts = Array.from(document.querySelectorAll('input[data-filter-type="district"]:checked')).map(cb => cb.value);
    if (districts.length > 0) state.districts = districts;
    
    // Completion dates
    const completion = Array.from(document.querySelectorAll('input[data-filter-type="completion"]:checked')).map(cb => cb.value);
    if (completion.length > 0) state.completion = completion;
    
    // Object class
    const objectClass = Array.from(document.querySelectorAll('input[data-filter-type="object_class"]:checked')).map(cb => cb.value);
    if (objectClass.length > 0) state.object_class = objectClass;
    
    // Renovation
    const renovation = Array.from(document.querySelectorAll('input[data-filter-type="renovation"]:checked')).map(cb => cb.value);
    if (renovation.length > 0) state.renovation = renovation;
    
    // Floor options
    const floorOptions = Array.from(document.querySelectorAll('input[data-filter-type="floor_options"]:checked')).map(cb => cb.value);
    if (floorOptions.length > 0) state.floor_options = floorOptions;
    
    // Features
    const features = Array.from(document.querySelectorAll('input[data-filter-type="features"]:checked')).map(cb => cb.value);
    if (features.length > 0) state.features = features;
    
    // Building released
    const buildingReleased = Array.from(document.querySelectorAll('input[data-filter-type="building_released"]:checked')).map(cb => cb.value);
    if (buildingReleased.length > 0) state.building_released = buildingReleased;
    
    // Area range
    const areaFromEl = document.getElementById('areaFrom');
    const areaToEl = document.getElementById('areaTo');
    if (areaFromEl && areaFromEl.value) state.area_min = areaFromEl.value;
    if (areaToEl && areaToEl.value) state.area_max = areaToEl.value;
    
    // Floor range
    const floorFromEl = document.getElementById('floorFrom');
    const floorToEl = document.getElementById('floorTo');
    if (floorFromEl && floorFromEl.value) state.floor_min = floorFromEl.value;
    if (floorToEl && floorToEl.value) state.floor_max = floorToEl.value;
    
    // Building floors range
    const maxFloorFromEl = document.getElementById('maxFloorFrom');
    const maxFloorToEl = document.getElementById('maxFloorTo');
    if (maxFloorFromEl && maxFloorFromEl.value) state.building_floors_min = maxFloorFromEl.value;
    if (maxFloorToEl && maxFloorToEl.value) state.building_floors_max = maxFloorToEl.value;
    
    // Build year range
    const buildYearFromEl = document.getElementById('buildYearFrom');
    const buildYearToEl = document.getElementById('buildYearTo');
    if (buildYearFromEl && buildYearFromEl.value) state.build_year_min = buildYearFromEl.value;
    if (buildYearToEl && buildYearToEl.value) state.build_year_max = buildYearToEl.value;
    
    // Property type (apartments/houses/townhouses/penthouses/apartments_commercial)
    const propertyTypeRadio = document.querySelector('input[name="property_type"]:checked');
    if (propertyTypeRadio && propertyTypeRadio.value !== 'all') {
        state.property_type = propertyTypeRadio.value;
    }
    
    // Обновляем глобальный state
    window.propertyFiltersState = state;
    return state;
};

// Сериализация state для API
window.serializeForAPI = function() {
    const state = window.getFiltersState();
    const params = new URLSearchParams();
    
    for (const [key, value] of Object.entries(state)) {
        if (Array.isArray(value)) {
            params.set(key, value.join(','));
        } else {
            params.set(key, value);
        }
    }
    
    return params;
};

// Сброс всех фильтров
window.resetFilters = function() {
    console.log('🔄 Resetting all filters...');
    
    // Clear text search
    const mobileSearch = document.getElementById('property-search');
    const desktopSearch = document.getElementById('property-search-desktop');
    if (mobileSearch) mobileSearch.value = '';
    if (desktopSearch) desktopSearch.value = '';
    
    // Uncheck all checkboxes
    document.querySelectorAll('input[type="checkbox"][data-filter-type]').forEach(cb => cb.checked = false);
    
    // Reset property type to "all"
    const propertyTypeAllRadio = document.querySelector('input[name="property_type"][value="all"]');
    if (propertyTypeAllRadio) propertyTypeAllRadio.checked = true;
    
    // Clear all number inputs
    const numberInputs = [
        'priceFrom', 'priceTo', 'price-from', 'price-to',
        'priceFromModal', 'priceToModal',
        'areaFrom', 'areaTo',
        'floorFrom', 'floorTo',
        'maxFloorFrom', 'maxFloorTo',
        'buildYearFrom', 'buildYearTo'
    ];
    numberInputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    
    // Reset state
    window.propertyFiltersState = {};
    
    // Apply filters (will show all properties)
    if (typeof window.applyFilters === 'function') {
        window.applyFilters();
    }
};

// ======================
// RUSSIAN PLURALIZATION FOR SEARCH BUTTON
// ======================

// Функция для правильного склонения русских слов (квартира/квартиры/квартир)
window.pluralizeRussian = function(count, singular, few, many) {
    const n = Math.abs(count);
    const n10 = n % 10;
    const n100 = n % 100;
    
    if (n10 === 1 && n100 !== 11) {
        return singular; // 1 квартира, 21 квартира, 101 квартира
    }
    if (n10 >= 2 && n10 <= 4 && (n100 < 10 || n100 >= 20)) {
        return few; // 2-4 квартиры, 22-24 квартиры
    }
    return many; // 5+ квартир, 11-19 квартир
};

// Обновить текст кнопки "Найти" с правильным склонением
window.updateSearchButtonText = function(count, loading = false) {
    // Элементы кнопок
    const desktopBtnText = document.getElementById('search-btn-text-desktop');
    
    // Элементы счетчиков в модальных окнах
    const counters = [
        'filteredResultsCount',
        'roomsFilteredCount',
        'priceFilteredCount',
        'developerFilteredCount'
    ];
    
    if (loading) {
        // Показать "Загрузка..." во время запроса
        if (desktopBtnText) desktopBtnText.textContent = 'Загрузка...';
        counters.forEach(counterId => {
            const counter = document.getElementById(counterId);
            if (counter) counter.textContent = '...';
        });
        return;
    }
    
    // Правильное склонение: квартира/квартиры/квартир
    const propertyWord = window.pluralizeRussian(count, 'квартиру', 'квартиры', 'квартир');
    
    // Обновить текст кнопки "Найти"
    if (desktopBtnText) {
        desktopBtnText.textContent = `Найти ${count} ${propertyWord}`;
    }
    
    // Обновить счетчики в модальных окнах
    counters.forEach(counterId => {
        const counter = document.getElementById(counterId);
        if (counter) {
            counter.textContent = count;
        }
    });
    
    console.log(`✅ Search button text updated: "Найти ${count} ${propertyWord}"`);
};

// ======================
// PROPERTY TYPE FILTER HANDLER
// ======================

// Обработчик изменения типа недвижимости (Квартиры/Дома/Таунхаусы)
window.handlePropertyTypeChange = function() {
    const selectedRadio = document.querySelector('input[name="property_type"]:checked');
    if (!selectedRadio) return;
    
    const value = selectedRadio.value;
    const label = selectedRadio.closest('label').textContent.trim();
    
    console.log('Property type changed:', value, label);
    
    // Обновить текст кнопки dropdown
    const buttonText = document.getElementById('property-type-label');
    if (buttonText) {
        buttonText.textContent = label;
    }
    
    // Обновить состояние фильтров
    if (value === 'all') {
        delete window.propertyFiltersState.property_type;
    } else {
        window.propertyFiltersState.property_type = value;
    }
    
    // Обновить счетчик объявлений
    if (typeof window.updateFilteredCount === 'function') {
        window.updateFilteredCount();
    }
    
    // Закрыть dropdown
    const dropdown = selectedRadio.closest('.dropdown-menu');
    if (dropdown) {
        dropdown.classList.remove('open');
    }
};

// ======================
// ABORT CONTROLLER FOR RACE CONDITION PREVENTION
// ======================

// ✅ КРИТИЧНО: AbortController для предотвращения race conditions
let currentFilterAbortController = null;

// ======================
// LOADING INDICATOR & SCROLL FUNCTIONS
// ======================

// Функция для показа индикатора загрузки
function showLoadingIndicator() {
    const listContainer = document.getElementById('properties-list');
    if (listContainer) {
        listContainer.style.opacity = '0.5';
        listContainer.style.pointerEvents = 'none';
    }
    
    // Добавляем спиннер если его еще нет
    if (!document.getElementById('loading-spinner')) {
        const spinner = document.createElement('div');
        spinner.id = 'loading-spinner';
        spinner.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50';
        spinner.innerHTML = `
            <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
        `;
        document.body.appendChild(spinner);
    }
}

// Функция для скрытия индикатора загрузки
function hideLoadingIndicator() {
    const listContainer = document.getElementById('properties-list');
    if (listContainer) {
        listContainer.style.opacity = '1';
        listContainer.style.pointerEvents = 'auto';
    }
    
    const spinner = document.getElementById('loading-spinner');
    if (spinner) {
        spinner.remove();
    }
}

// Функция для скролла к списку объектов
function scrollToPropertiesList() {
    const listContainer = document.getElementById('properties-list');
    if (listContainer) {
        const offset = 100; // Отступ сверху
        const top = listContainer.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
    }
}

// ======================
// DEBOUNCE FUNCTION
// ======================

// Debounce для текстовых полей (300ms как в Домклик/Циан)
let debounceTimeout = null;
function debounceApplyFilters(delay = 300) {
    if (debounceTimeout) {
        clearTimeout(debounceTimeout);
    }
    debounceTimeout = setTimeout(() => {
        window.applyFilters();
    }, delay);
}

// ======================
// SEARCH BUTTON UPDATE FUNCTION
// ======================

// Функция склонения русских числительных
function pluralizeRussian(number, words) {
    // words = ['квартира', 'квартиры', 'квартир']
    const cases = [2, 0, 1, 1, 1, 2];
    return words[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[Math.min(number % 10, 5)]];
}

// ✅ КРИТИЧНО: Функция для обновления текста кнопки "Найти"
function updateSearchButtonText(count = 0, isLoading = false) {
    // Находим элемент текста кнопки
    const buttonTextEl = document.getElementById('search-btn-text-desktop');
    
    if (!buttonTextEl) {
        console.error('❌ Button text element not found! id="search-btn-text-desktop"');
        return;
    }
    
    if (isLoading) {
        // Показываем "Загрузка..."
        buttonTextEl.textContent = 'Загрузка...';
        console.log('⏳ Button text set to: Загрузка...');
    } else if (count === 0) {
        // Если count=0, показываем просто "Найти"
        buttonTextEl.textContent = 'Найти';
        console.log('✅ Button text set to: Найти (count=0)');
    } else {
        // Правильное склонение: квартира/квартиры/квартир
        const word = pluralizeRussian(count, ['квартиру', 'квартиры', 'квартир']);
        const text = `Найти ${count} ${word}`;
        buttonTextEl.textContent = text;
        console.log(`✅ Button text set to: ${text}`);
    }
}

// Экспортируем функцию глобально
window.updateSearchButtonText = updateSearchButtonText;

// ======================
// LIVE COUNT UPDATE FUNCTION
// ======================

// Debounce для обновления счетчика (500ms - быстрее чем full filter apply)
let countDebounceTimeout = null;
function updateFilteredCount() {
    // ✅ КРИТИЧНО: Показываем "Загрузка..." СРАЗУ, без задержки!
    if (typeof window.updateSearchButtonText === 'function') {
        window.updateSearchButtonText(0, true);
        console.log('⏳ Search button set to "Загрузка..." immediately');
    }
    
    // Очищаем предыдущий таймаут
    if (countDebounceTimeout) {
        clearTimeout(countDebounceTimeout);
    }
    
    // Устанавливаем новый таймаут
    countDebounceTimeout = setTimeout(() => {
        console.log('🚀 Debounce timeout complete, fetching count...');
        
        // Собираем те же параметры фильтров что и в applyFilters
        const params = new URLSearchParams();
        
        // ===== TEXT SEARCH =====
        // Читаем из обоих полей (мобильного и десктопного) - синхронизированы
        const mobileSearch = document.getElementById('property-search');
        const desktopSearch = document.getElementById('property-search-desktop');
        const searchValue = (mobileSearch && mobileSearch.value.trim()) || (desktopSearch && desktopSearch.value.trim());
        
        if (searchValue) {
            params.set('q', searchValue);
        }
        
        // ===== BASIC FILTERS =====
        
        // Room filter
        const checkedRooms = Array.from(document.querySelectorAll('input[data-filter-type="rooms"]:checked')).map(cb => cb.value);
        if (checkedRooms.length > 0) {
            params.set('rooms', checkedRooms.join(','));
        }
        
        // Price filter
        const priceFromEl = document.getElementById('priceFrom') || document.getElementById('price-from');
        const priceToEl = document.getElementById('priceTo') || document.getElementById('price-to');
        const priceFromModalEl = document.getElementById('priceFromModal');
        const priceToModalEl = document.getElementById('priceToModal');
        
        if (priceFromEl && priceFromEl.value) params.set('price_min', priceFromEl.value);
        if (priceToEl && priceToEl.value) params.set('price_max', priceToEl.value);
        if (priceFromModalEl && priceFromModalEl.value) params.set('price_min', priceFromModalEl.value);
        if (priceToModalEl && priceToModalEl.value) params.set('price_max', priceToModalEl.value);
        
        // ===== ADVANCED FILTERS =====
        
        // Developers
        const developers = Array.from(document.querySelectorAll('input[data-filter-type="developer"]:checked'))
            .map(cb => cb.value);
        if (developers.length > 0) {
            params.set('developers', developers.join(','));
        }
        
        // Districts
        const districts = Array.from(document.querySelectorAll('input[data-filter-type="district"]:checked'))
            .map(cb => cb.value);
        if (districts.length > 0) {
            params.set('districts', districts.join(','));
        }
        
        // Completion dates
        const completion = Array.from(document.querySelectorAll('input[data-filter-type="completion"]:checked'))
            .map(cb => cb.value);
        if (completion.length > 0) {
            params.set('completion', completion.join(','));
        }
        
        // Object class
        const objectClass = Array.from(document.querySelectorAll('input[data-filter-type="object_class"]:checked'))
            .map(cb => cb.value);
        if (objectClass.length > 0) {
            params.set('object_class', objectClass.join(','));
        }
        
        // Renovation
        const renovation = Array.from(document.querySelectorAll('input[data-filter-type="renovation"]:checked'))
            .map(cb => cb.value);
        if (renovation.length > 0) {
            params.set('renovation', renovation.join(','));
        }
        
        // Floor options
        const floorOptions = Array.from(document.querySelectorAll('input[data-filter-type="floor_options"]:checked'))
            .map(cb => cb.value);
        if (floorOptions.length > 0) {
            params.set('floor_options', floorOptions.join(','));
        }
        
        // Features
        const features = Array.from(document.querySelectorAll('input[data-filter-type="features"]:checked'))
            .map(cb => cb.value);
        if (features.length > 0) {
            params.set('features', features.join(','));
        }
        
        // Building released
        const buildingReleased = Array.from(document.querySelectorAll('input[data-filter-type="building_released"]:checked'))
            .map(cb => cb.value);
        if (buildingReleased.length > 0) {
            params.set('building_released', buildingReleased.join(','));
        }
        
        // Area range
        const areaFromEl = document.getElementById('areaFrom');
        const areaToEl = document.getElementById('areaTo');
        if (areaFromEl && areaFromEl.value) params.set('area_min', areaFromEl.value);
        if (areaToEl && areaToEl.value) params.set('area_max', areaToEl.value);
        
        // Floor range
        const floorFromEl = document.getElementById('floorFrom');
        const floorToEl = document.getElementById('floorTo');
        if (floorFromEl && floorFromEl.value) params.set('floor_min', floorFromEl.value);
        if (floorToEl && floorToEl.value) params.set('floor_max', floorToEl.value);
        
        // Building floors range
        const maxFloorFromEl = document.getElementById('maxFloorFrom');
        const maxFloorToEl = document.getElementById('maxFloorTo');
        if (maxFloorFromEl && maxFloorFromEl.value) params.set('building_floors_min', maxFloorFromEl.value);
        if (maxFloorToEl && maxFloorToEl.value) params.set('building_floors_max', maxFloorToEl.value);
        
        // Build year range
        const buildYearFromEl = document.getElementById('buildYearFrom');
        const buildYearToEl = document.getElementById('buildYearTo');
        if (buildYearFromEl && buildYearFromEl.value) params.set('build_year_min', buildYearFromEl.value);
        if (buildYearToEl && buildYearToEl.value) params.set('build_year_max', buildYearToEl.value);
        
        // Property type
        const propertyTypeRadio = document.querySelector('input[name="property_type"]:checked');
        if (propertyTypeRadio && propertyTypeRadio.value !== 'all') {
            params.set('property_type', propertyTypeRadio.value);
        }
        
        // ✅ КРИТИЧНО: Добавляем city_id для правильной фильтрации
        if (typeof window.currentCityId !== 'undefined' && window.currentCityId) {
            params.set('city_id', window.currentCityId);
        }
        
        // Вызываем API для подсчета
        const apiUrl = '/api/properties/count?' + params.toString();
        console.log('🔢 Fetching count:', apiUrl);
        
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.success && typeof data.count !== 'undefined') {
                    const count = data.count;
                    console.log('✅ Count received:', count);
                    
                    // ✅ ОБНОВЛЯЕМ ТЕКСТ КНОПКИ "Найти" с правильным склонением
                    if (typeof window.updateSearchButtonText === 'function') {
                        window.updateSearchButtonText(count);
                    }
                    
                    // Обновляем все счетчики
                    const counters = [
                        'filteredResultsCount',
                        'roomsFilteredCount',
                        'priceFilteredCount',
                        'developerFilteredCount'
                    ];
                    
                    counters.forEach(counterId => {
                        const counter = document.getElementById(counterId);
                        if (counter) {
                            counter.textContent = count;
                        }
                    });
                    
                    // Сохраняем глобально для других функций
                    window.currentFilteredCount = count;
                } else {
                    console.error('❌ Count API error:', data);
                }
            })
            .catch(error => {
                console.error('❌ Count fetch error:', error);
                // Восстанавливаем кнопку при ошибке
                if (typeof window.updateSearchButtonText === 'function') {
                    window.updateSearchButtonText(0);
                }
            })
            .finally(() => {
                // Убеждаемся что кнопка не застряла в "Загрузка..."
                const searchBtn = document.querySelector('#mainSearchButton, #applyFiltersButton');
                if (searchBtn && searchBtn.textContent.includes('Загрузка')) {
                    if (typeof window.updateSearchButtonText === 'function') {
                        window.updateSearchButtonText(0);
                    }
                }
            });
    }, 500);
}

// Экспортируем функцию глобально
window.updateFilteredCount = updateFilteredCount;

// ✅ КРИТИЧНО: Вызов счетчика СРАЗУ после определения (IMMEDIATE)
console.log('🎯 IMMEDIATE: Calling updateFilteredCount() NOW!');
if (typeof window.updateFilteredCount === 'function') {
    window.updateFilteredCount();
    console.log('✅ IMMEDIATE: updateFilteredCount() CALLED!');
} else {
    console.error('❌ IMMEDIATE: updateFilteredCount is NOT defined!');
}

// ✅ Initialize advanced filters button ("Еще" button)
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 DOM is ready! Initializing advanced filters button...');
    
    const advancedButton = document.getElementById('advancedFiltersToggle');
    const advancedPanel = document.getElementById('advancedFiltersPanel');
    const advancedArrow = document.getElementById('advancedFiltersArrow');
    
    if (advancedButton && advancedPanel) {
        advancedButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Close all dropdowns first
            document.querySelectorAll('.dropdown-menu.open').forEach(menu => {
                menu.classList.remove('open');
            });
            
            // Toggle advanced panel
            const isHidden = advancedPanel.classList.contains('hidden');
            advancedPanel.classList.toggle('hidden');
            
            // ✅ КРИТИЧНО: Обновляем счетчик сразу при открытии модального окна
            if (isHidden && typeof window.updateFilteredCount === 'function') {
                console.log('🔢 Updating count on modal open...');
                window.updateFilteredCount();
            }
            
            // На мобайле добавляем полноэкранный режим
            const isMobile = window.innerWidth <= 640;
            if (isMobile) {
                if (isHidden) {
                    // Открываем - добавляем класс
                    advancedPanel.classList.add('mobile-fullscreen');
                    document.body.style.overflow = 'hidden'; // Блокируем скролл body
                } else {
                    // Закрываем - убираем класс
                    advancedPanel.classList.remove('mobile-fullscreen');
                    document.body.style.overflow = ''; // Восстанавливаем скролл
                }
            }
            
            // Rotate arrow
            if (advancedArrow) {
                if (advancedPanel.classList.contains('hidden')) {
                    advancedArrow.style.transform = 'rotate(0deg)';
                } else {
                    advancedArrow.style.transform = 'rotate(180deg)';
                }
            }
            
            console.log('✅ Advanced filters panel toggled:', !advancedPanel.classList.contains('hidden'), 'Mobile fullscreen:', isMobile);
        });
        console.log('✅ "Еще" button handler registered successfully');
        
        // Обработчик кнопки закрытия расширенных фильтров
        const closeButton = document.getElementById('closeAdvancedFilters');
        if (closeButton && advancedPanel) {
            closeButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Закрываем панель
                advancedPanel.classList.add('hidden');
                
                // Убираем полноэкранный режим на мобайле
                const isMobile = window.innerWidth <= 640;
                if (isMobile) {
                    advancedPanel.classList.remove('mobile-fullscreen');
                    document.body.style.overflow = ''; // Восстанавливаем скролл
                }
                
                // Rotate arrow back
                if (advancedArrow) {
                    advancedArrow.style.transform = 'rotate(0deg)';
                }
                
                console.log('✅ Advanced filters closed via close button');
            });
            console.log('✅ Close button handler registered');
        }
    } else {
        console.error('❌ Advanced filter elements not found:', {advancedButton, advancedPanel, advancedArrow});
    }
    
    // Display active filters on page load (with delay to ensure DOM is ready)
    console.log('🏷️ Initializing active filters display...');
    setTimeout(() => {
        if (typeof window.displayActiveFilters === 'function') {
            window.displayActiveFilters();
            console.log('✅ Active filters displayed on page load');
        } else {
            console.log('⏳ displayActiveFilters function not yet available, will be loaded later');
        }
    }, 100);
    
    // Initialize search button text with total count on page load
    console.log('🔢 Initializing search button text...');
    setTimeout(() => {
        if (typeof window.updateFilteredCount === 'function') {
            window.updateFilteredCount();
            console.log('✅ Search button text initialized');
        }
    }, 200);
});

// ✅ КРИТИЧНО: Инициализация счетчика сразу после загрузки скрипта (на случай если DOMContentLoaded уже прошел)
console.log('📊 CHECKING DOCUMENT STATE:', document.readyState);

// НЕМЕДЛЕННАЯ инициализация если DOM уже готов
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    console.log('🔢 DOM already loaded - initializing search button immediately...');
    setTimeout(() => {
        if (typeof window.updateFilteredCount === 'function') {
            window.updateFilteredCount();
            console.log('✅ Search button initialized (immediate)');
        } else {
            console.error('❌ window.updateFilteredCount is not a function!');
        }
    }, 300);
} else {
    console.log('⏳ DOM not ready yet, waiting for DOMContentLoaded...');
}

// ГАРАНТИРОВАННЫЙ вызов через 1 секунду (если все предыдущие не сработали)
setTimeout(() => {
    console.log('🔄 FALLBACK: Initializing count after 1 second...');
    if (typeof window.updateFilteredCount === 'function') {
        console.log('🔢 Calling updateFilteredCount() - FALLBACK');
        window.updateFilteredCount();
    } else {
        console.error('❌ FALLBACK FAILED: updateFilteredCount is not defined!');
    }
}, 1000);

// Handle room filter changes - AJAX MODE
window.handleRoomFilterChange = function() {
    const checkedRooms = Array.from(document.querySelectorAll('input[data-filter-type="rooms"]:checked')).map(cb => cb.value);
    console.log('Room filters changed:', checkedRooms);
    
    // Map numeric values to display labels
    const roomLabels = {
        '0': 'Студия',
        '1': '1-комн',
        '2': '2-комн',
        '3': '3-комн',
        '4': '4-комн'
    };
    
    // Update button text
    const buttonText = document.getElementById('roomsFilterText');
    if (buttonText) {
        if (checkedRooms.length === 0) {
            buttonText.textContent = 'Комнат';
        } else if (checkedRooms.length === 1) {
            buttonText.textContent = roomLabels[checkedRooms[0]] || checkedRooms[0];
        } else {
            buttonText.textContent = `${checkedRooms.length} типов`;
        }
    }
    
    // ✅ КРИТИЧНО: Обновляем счетчик объявлений при изменении фильтра
    if (typeof window.updateFilteredCount === 'function') {
        window.updateFilteredCount();
    }
    
    // НЕ применяем полные фильтры автоматически - только обновляем счетчик
    // Пользователь должен нажать "Показать X объявлений" для применения
    // window.applyFilters(); // ❌ УБРАНО - применяем только при нажатии кнопки
};

// Apply Filters - AJAX Mode (как Домклик/Циан)
window.applyFilters = function() {
    console.log('🚀 applyFilters() CALLED - AJAX MODE');
    
    // Показываем loading indicator
    showLoadingIndicator();
    
    // Собираем параметры фильтров
    const params = new URLSearchParams();
    
    // ===== TEXT SEARCH =====
    
    // Search query (from both mobile and desktop inputs - they are synchronized)
    const mobileSearch = document.getElementById('property-search');
    const desktopSearch = document.getElementById('property-search-desktop');
    const searchValue = (mobileSearch && mobileSearch.value.trim()) || (desktopSearch && desktopSearch.value.trim());
    
    if (searchValue) {
        params.set('q', searchValue);
        console.log('🔍 Search query:', searchValue);
    }
    
    // ===== BASIC FILTERS =====
    
    // Room filter (from checkboxes with data-filter-type="rooms")
    const checkedRooms = Array.from(document.querySelectorAll('input[data-filter-type="rooms"]:checked')).map(cb => cb.value);
    if (checkedRooms.length > 0) {
        params.set('rooms', checkedRooms.join(','));
        console.log('📦 Rooms collected from checkboxes:', checkedRooms);
    }
    
    // Price filter (values already in millions, no conversion needed)
    const priceFromEl = document.getElementById('priceFrom') || document.getElementById('price-from');
    const priceToEl = document.getElementById('priceTo') || document.getElementById('price-to');
    if (priceFromEl && priceFromEl.value) params.set('price_min', priceFromEl.value);
    if (priceToEl && priceToEl.value) params.set('price_max', priceToEl.value);
    
    // Sort
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect && sortSelect.value) params.set('sort', sortSelect.value);
    
    // ===== ADVANCED FILTERS =====
    
    // Developers (checkboxes with data-filter-type="developer")
    const developers = Array.from(document.querySelectorAll('input[data-filter-type="developer"]:checked'))
        .map(cb => cb.value);
    if (developers.length > 0) {
        params.set('developers', developers.join(','));
    }
    
    // Districts (checkboxes with data-filter-type="district")
    const districts = Array.from(document.querySelectorAll('input[data-filter-type="district"]:checked'))
        .map(cb => cb.value);
    if (districts.length > 0) {
        params.set('districts', districts.join(','));
    }
    
    // Completion dates (checkboxes with data-filter-type="completion")
    const completion = Array.from(document.querySelectorAll('input[data-filter-type="completion"]:checked'))
        .map(cb => cb.value);
    if (completion.length > 0) {
        params.set('completion', completion.join(','));
    }
    
    // Object/Property class (checkboxes with data-filter-type="object_class")
    const objectClass = Array.from(document.querySelectorAll('input[data-filter-type="object_class"]:checked'))
        .map(cb => cb.value);
    if (objectClass.length > 0) {
        params.set('object_class', objectClass.join(','));
    }
    
    // Renovation (checkboxes with data-filter-type="renovation")
    const renovation = Array.from(document.querySelectorAll('input[data-filter-type="renovation"]:checked'))
        .map(cb => cb.value);
    if (renovation.length > 0) {
        params.set('renovation', renovation.join(','));
    }
    
    // Floor options (checkboxes with data-filter-type="floor_options")
    const floorOptions = Array.from(document.querySelectorAll('input[data-filter-type="floor_options"]:checked'))
        .map(cb => cb.value);
    if (floorOptions.length > 0) {
        params.set('floor_options', floorOptions.join(','));
    }
    
    // Features (checkboxes with data-filter-type="features")
    const features = Array.from(document.querySelectorAll('input[data-filter-type="features"]:checked'))
        .map(cb => cb.value);
    if (features.length > 0) {
        params.set('features', features.join(','));
    }
    
    // Building released (checkboxes with data-filter-type="building_released")
    const buildingReleased = Array.from(document.querySelectorAll('input[data-filter-type="building_released"]:checked'))
        .map(cb => cb.value);
    if (buildingReleased.length > 0) {
        params.set('building_released', buildingReleased.join(','));
    }
    
    // Area range (from areaFrom and areaTo inputs)
    const areaFromEl = document.getElementById('areaFrom');
    const areaToEl = document.getElementById('areaTo');
    if (areaFromEl && areaFromEl.value) params.set('area_min', areaFromEl.value);
    if (areaToEl && areaToEl.value) params.set('area_max', areaToEl.value);
    
    // Floor range (from floorFrom and floorTo inputs)
    const floorFromEl = document.getElementById('floorFrom');
    const floorToEl = document.getElementById('floorTo');
    if (floorFromEl && floorFromEl.value) params.set('floor_min', floorFromEl.value);
    if (floorToEl && floorToEl.value) params.set('floor_max', floorToEl.value);
    
    // Building floors range (from maxFloorFrom and maxFloorTo inputs)
    const maxFloorFromEl = document.getElementById('maxFloorFrom');
    const maxFloorToEl = document.getElementById('maxFloorTo');
    if (maxFloorFromEl && maxFloorFromEl.value) params.set('building_floors_min', maxFloorFromEl.value);
    if (maxFloorToEl && maxFloorToEl.value) params.set('building_floors_max', maxFloorToEl.value);
    
    // Build year range (from buildYearFrom and buildYearTo inputs)
    const buildYearFromEl = document.getElementById('buildYearFrom');
    const buildYearToEl = document.getElementById('buildYearTo');
    if (buildYearFromEl && buildYearFromEl.value) params.set('build_year_min', buildYearFromEl.value);
    if (buildYearToEl && buildYearToEl.value) params.set('build_year_max', buildYearToEl.value);
    
    // ✅ КРИТИЧНО: Добавляем city_id для правильной фильтрации
    if (typeof window.currentCityId !== 'undefined' && window.currentCityId) {
        params.set('city_id', window.currentCityId);
    }
    
    // Сбрасываем на первую страницу при изменении фильтров
    params.set('page', '1');
    
    // ✅ КРИТИЧНО: Отменяем предыдущий запрос если он еще выполняется
    if (currentFilterAbortController) {
        currentFilterAbortController.abort();
        console.log('🚫 Previous filter request aborted');
    }
    currentFilterAbortController = new AbortController();
    
    // ✅ ИСПРАВЛЕНИЕ: Разделяем параметры для fetch и History API
    // Для запроса используем с cache-busting
    const fetchParams = new URLSearchParams(params);
    fetchParams.set('v', Date.now());
    
    const apiUrl = '/api/properties/list?' + fetchParams.toString();
    console.log('📡 AJAX Fetching:', apiUrl);
    
    // AJAX запрос с AbortController
    fetch(apiUrl, { signal: currentFilterAbortController.signal })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('✅ API Response:', data);
            
            if (data.success && data.properties) {
                // Обновляем список объектов
                if (typeof window.updatePropertiesList === 'function') {
                    window.updatePropertiesList(data.properties);
                }
                
                // Обновляем пагинацию
                if (typeof window.updatePagination === 'function') {
                    window.updatePagination(data.pagination);
                }
                
                // ✅ КРИТИЧНО: Сбрасываем infinite scroll ДО применения view mode
                if (window.infiniteScrollManager && data.pagination) {
                    window.infiniteScrollManager.reset(data.pagination.page, data.pagination.has_next);
                    console.log('♾️ Infinite scroll reset after filtering to page', data.pagination.page);
                }
                
                // Применяем текущий режим отображения после AJAX обновления
                if (typeof window.currentViewMode !== 'undefined' && window.currentViewMode) {
                    if (window.currentViewMode === 'grid' && typeof window.switchToGridView === 'function') {
                        console.log('🔄 Applying GRID view after AJAX filter');
                        window.switchToGridView();
                    } else if (typeof window.switchToListView === 'function') {
                        console.log('🔄 Applying LIST view after AJAX filter');
                        window.switchToListView();
                    }
                } else {
                    // Default to list view if currentViewMode is not set
                    if (typeof window.switchToListView === 'function') {
                        console.log('🔄 Applying default LIST view after AJAX filter');
                        window.switchToListView();
                    }
                }
                
                // ✅ ИСПРАВЛЕНИЕ: Обновляем URL БЕЗ cache-busting параметра
                // params уже не содержит 'v', так как мы использовали fetchParams для запроса
                const newUrl = window.location.pathname + '?' + params.toString();
                window.history.pushState({}, '', newUrl);
                
                // Обновляем отображение активных фильтров
                if (typeof window.displayActiveFilters === 'function') {
                    setTimeout(() => window.displayActiveFilters(), 50);
                }
                
                // Скроллим наверх списка
                scrollToPropertiesList();
                
                console.log(`✅ Filtered ${data.properties.length} properties, total: ${data.pagination.total}`);
            } else {
                console.error('❌ API returned error:', data);
                alert('Ошибка при фильтрации. Пожалуйста, попробуйте еще раз.');
            }
            
            hideLoadingIndicator();
        })
        .catch(error => {
            // ✅ КРИТИЧНО: Игнорируем AbortError - это нормально при быстрой смене фильтров
            if (error.name === 'AbortError') {
                console.log('⚠️ Filter request aborted (user changed filters)');
                hideLoadingIndicator();
                return;
            }
            console.error('❌ Fetch error:', error);
            alert('Ошибка загрузки данных. Пожалуйста, перезагрузите страницу.');
            hideLoadingIndicator();
        })
        .finally(() => {
            // ✅ КРИТИЧНО: Очищаем контроллер после завершения запроса
            currentFilterAbortController = null;
        });
};

// Apply price filter - AJAX VERSION (для кнопки "Применить" в дропдауне цены)
window.applyPriceFilter = function() {
    const priceFrom = document.getElementById('priceFrom').value;
    const priceTo = document.getElementById('priceTo').value;
    
    console.log('💰 Price filter applied:', priceFrom, 'to', priceTo);
    
    // Update button text
    const buttonText = document.getElementById('priceFilterText');
    if (buttonText) {
        if (priceFrom || priceTo) {
            let text = 'Цена ';
            if (priceFrom) text += `от ${priceFrom}млн `;
            if (priceTo) text += `до ${priceTo}млн`;
            buttonText.textContent = text.trim();
        } else {
            buttonText.textContent = 'Цена';
        }
    }
    
    // Close dropdown
    const dropdown = document.getElementById('priceDropdown');
    if (dropdown) {
        dropdown.classList.remove('open');
    }
    
    // Apply all filters via AJAX (мгновенная фильтрация)
    window.applyFilters();
};

// Update advanced filters counter (ОБНОВЛЯЕТ ВСЕ БЕЙДЖИ: desktop, mobile и на карте)
window.updateAdvancedFiltersCounter = function() {
    const counterDesktop = document.getElementById('advancedFiltersCounter');
    const counterMobile = document.getElementById('advancedFiltersCounterMobile');
    const counterMap = document.getElementById('advancedFiltersCounterMap');
    
    let count = 0;
    
    // Count only REAL active filters (не пустые поля)
    // 1. Отмеченные чекбоксы
    const checkedCheckboxes = document.querySelectorAll('#advancedFiltersPanel input[type="checkbox"]:checked');
    count += checkedCheckboxes.length;
    
    // 2. Заполненные числовые поля (только с реальными значениями)
    const numberInputs = document.querySelectorAll('#advancedFiltersPanel input[type="number"]');
    numberInputs.forEach(input => {
        if (input.value && input.value.trim() !== '') {
            count++;
        }
    });
    
    // 3. Выбранные опции в селектах (только не пустые)
    const selects = document.querySelectorAll('#advancedFiltersPanel select');
    selects.forEach(select => {
        if (select.value && select.value !== '' && select.value !== 'all') {
            count++;
        }
    });
    
    // Update DESKTOP badge
    if (counterDesktop) {
        if (count > 0) {
            counterDesktop.textContent = count;
            counterDesktop.classList.remove('hidden');
        } else {
            counterDesktop.classList.add('hidden');
        }
    }
    
    // Update MOBILE badge
    if (counterMobile) {
        if (count > 0) {
            counterMobile.textContent = count;
            counterMobile.classList.remove('hidden');
        } else {
            counterMobile.classList.add('hidden');
        }
    }
    
    // Update MAP badge (на мобильной карте)
    if (counterMap) {
        if (count > 0) {
            counterMap.textContent = count;
            counterMap.classList.remove('hidden');
        } else {
            counterMap.classList.add('hidden');
        }
    }
    
    console.log(`📊 Advanced filters count: ${count} (checked: ${checkedCheckboxes.length}, updated desktop + mobile + map badges)`);
    
    // ✅ КРИТИЧНО: Обновляем счетчик объявлений при изменении фильтров
    if (typeof window.updateFilteredCount === 'function') {
        window.updateFilteredCount();
    }
};

console.log('✅ property-filters.js loaded successfully');
console.log('✅ Functions registered:', {
    applyFilters: typeof window.applyFilters,
    applyPriceFilter: typeof window.applyPriceFilter,
    handleRoomFilterChange: typeof window.handleRoomFilterChange,
    updateAdvancedFiltersCounter: typeof window.updateAdvancedFiltersCounter
});


// ======================
// FILTER REMOVAL FUNCTIONS
// ======================

// ✅ AJAX VERSION - мгновенное удаление фильтров
window.removeRoomFilter = function(roomValue) {
    const checkbox = document.querySelector(`input[data-filter-type="rooms"][value="${roomValue}"]`);
    if (checkbox) {
        checkbox.checked = false;
        handleRoomFilterChange(); // Вызовет applyFilters() внутри
    }
};

window.removeDeveloperFilter = function(developerValue) {
    const checkbox = document.querySelector(`input[data-filter-type="developer"][value="${developerValue}"]`);
    if (checkbox) {
        checkbox.checked = false;
        window.applyFilters(); // AJAX фильтрация
    }
};

window.removePriceFilter = function() {
    const priceFromEl = document.getElementById('priceFrom');
    const priceToEl = document.getElementById('priceTo');
    if (priceFromEl) priceFromEl.value = '';
    if (priceToEl) priceToEl.value = '';
    
    const buttonText = document.getElementById('priceFilterText');
    if (buttonText) buttonText.textContent = 'Цена от-до, ₽';
    
    window.applyFilters(); // AJAX фильтрация
};

window.removeCompletionFilter = function(completionValue) {
    const checkbox = document.querySelector(`input[data-filter-type="completion"][value="${completionValue}"]`);
    if (checkbox) {
        checkbox.checked = false;
        window.applyFilters(); // AJAX фильтрация
    }
};

window.removeObjectClassFilter = function(objectClassValue) {
    const checkbox = document.querySelector(`input[data-filter-type="object_class"][value="${objectClassValue}"]`);
    if (checkbox) {
        checkbox.checked = false;
        window.applyFilters(); // AJAX фильтрация
    }
};

window.removeAreaFilter = function() {
    const areaFromEl = document.getElementById('areaFrom');
    const areaToEl = document.getElementById('areaTo');
    if (areaFromEl) areaFromEl.value = '';
    if (areaToEl) areaToEl.value = '';
    window.applyFilters(); // AJAX фильтрация
};

window.removeFloorFilter = function() {
    const floorFromEl = document.getElementById('floorFrom');
    const floorToEl = document.getElementById('floorTo');
    if (floorFromEl) floorFromEl.value = '';
    if (floorToEl) floorToEl.value = '';
    window.applyFilters(); // AJAX фильтрация
};

window.removeBuildingFloorFilter = function() {
    const buildingFloorFromEl = document.getElementById('maxFloorFrom') || document.querySelector('input[name="max_floor_from"]');
    const buildingFloorToEl = document.getElementById('maxFloorTo') || document.querySelector('input[name="max_floor_to"]');
    if (buildingFloorFromEl) buildingFloorFromEl.value = '';
    if (buildingFloorToEl) buildingFloorToEl.value = '';
    window.applyFilters(); // AJAX фильтрация
};

window.removeRenovationFilter = function(renovationValue) {
    const checkbox = document.querySelector(`input[data-filter-type="renovation"][value="${renovationValue}"]`);
    if (checkbox) {
        checkbox.checked = false;
        window.applyFilters(); // AJAX фильтрация
    }
};

window.removeBuildingStatusFilter = function(statusValue) {
    const checkbox = document.querySelector(`input[data-filter-type="building_released"][value="${statusValue}"]`);
    if (checkbox) {
        checkbox.checked = false;
        window.applyFilters(); // AJAX фильтрация
    }
};

// ✅ DISPLAY ACTIVE FILTERS - показать все активные фильтры
window.displayActiveFilters = function() {
    const container = document.getElementById('active-filters-list');
    if (!container) {
        console.log('⚠️ Active filters container not found');
        return;
    }
    
    const parentContainer = document.getElementById('active-filters-container');
    if (!parentContainer) {
        console.log('⚠️ Parent active filters container not found');
        return;
    }
    
    const urlParams = new URLSearchParams(window.location.search);
    const filterTags = [];
    
    // Маппинг для человекочитаемых названий
    const filterLabels = {
        '0': 'Студия', '1': '1-комн', '2': '2-комн', '3': '3-комн', '4': '4-комн',
        'true': 'Сданный', 'false': 'В строительстве',
        'Бизнес': 'Класс: Бизнес', 'Комфорт': 'Класс: Комфорт', 'Премиум': 'Класс: Премиум',
        'no_renovation': 'Без отделки', 'with_renovation': 'Чистовая',
        'not_first': 'Не первый этаж', 'not_last': 'Не последний этаж'
    };
    
    // Rooms
    const rooms = urlParams.get('rooms');
    if (rooms) {
        rooms.split(',').forEach(room => {
            filterTags.push({ label: filterLabels[room] || `${room}-комн`, param: 'rooms', value: room });
        });
    }
    
    // Price (support both price_min/price_max and priceFrom/priceTo formats)
    const priceMin = urlParams.get('price_min') || urlParams.get('priceFrom');
    const priceMax = urlParams.get('price_max') || urlParams.get('priceTo');
    if (priceMin || priceMax) {
        let label = 'Цена: ';
        label += priceMin && priceMax ? `${priceMin}-${priceMax} млн ₽` : (priceMin ? `от ${priceMin} млн ₽` : `до ${priceMax} млн ₽`);
        filterTags.push({ label, param: 'price', value: null });
    }
    
    // Area
    const areaMin = urlParams.get('area_min');
    const areaMax = urlParams.get('area_max');
    if (areaMin || areaMax) {
        let label = 'Площадь: ';
        label += areaMin && areaMax ? `${areaMin}-${areaMax} м²` : (areaMin ? `от ${areaMin} м²` : `до ${areaMax} м²`);
        filterTags.push({ label, param: 'area', value: null });
    }
    
    // Floor
    const floorMin = urlParams.get('floor_min');
    const floorMax = urlParams.get('floor_max');
    if (floorMin || floorMax) {
        let label = 'Этаж: ';
        label += floorMin && floorMax ? `${floorMin}-${floorMax}` : (floorMin ? `от ${floorMin}` : `до ${floorMax}`);
        filterTags.push({ label, param: 'floor', value: null });
    }
    
    // Building floors
    const buildingFloorsMin = urlParams.get('building_floors_min');
    const buildingFloorsMax = urlParams.get('building_floors_max');
    if (buildingFloorsMin || buildingFloorsMax) {
        let label = 'Этажность: ';
        label += buildingFloorsMin && buildingFloorsMax ? `${buildingFloorsMin}-${buildingFloorsMax}` : (buildingFloorsMin ? `от ${buildingFloorsMin}` : `до ${buildingFloorsMax}`);
        filterTags.push({ label, param: 'building_floors', value: null });
    }
    
    // Build year
    const buildYearMin = urlParams.get('build_year_min');
    const buildYearMax = urlParams.get('build_year_max');
    if (buildYearMin || buildYearMax) {
        let label = 'Год сдачи: ';
        label += buildYearMin && buildYearMax ? `${buildYearMin}-${buildYearMax}` : (buildYearMin ? `от ${buildYearMin}` : `до ${buildYearMax}`);
        filterTags.push({ label, param: 'build_year', value: null });
    }
    
    // Developers - use ID → Name mapping
    const developers = urlParams.get('developers');
    if (developers) {
        console.log('🏗️ Developer IDs from URL:', developers);
        console.log('🗺️ Available developersMap:', window.developersMap);
        developers.split(',').forEach(dev => {
            // Try to get developer name from mapping (dev is now an ID)
            const developerName = window.developersMap && window.developersMap[dev] 
                ? window.developersMap[dev]
                : decodeURIComponent(dev); // Fallback for old URLs with names
            console.log(`🔍 Developer ID=${dev} → Name="${developerName}"`);
            filterTags.push({ label: developerName, param: 'developers', value: dev });
        });
    }
    
    // Districts
    const districts = urlParams.get('districts');
    if (districts) {
        districts.split(',').forEach(dist => {
            filterTags.push({ label: decodeURIComponent(dist), param: 'districts', value: dist });
        });
    }
    
    // Building released
    const buildingReleased = urlParams.get('building_released');
    if (buildingReleased) {
        buildingReleased.split(',').forEach(status => {
            filterTags.push({ label: filterLabels[status] || status, param: 'building_released', value: status });
        });
    }
    
    // Object class
    const objectClass = urlParams.get('object_class');
    if (objectClass) {
        objectClass.split(',').forEach(cls => {
            const decoded = decodeURIComponent(cls);
            filterTags.push({ label: filterLabels[decoded] || `Класс: ${decoded}`, param: 'object_class', value: cls });
        });
    }
    
    // Renovation
    const renovation = urlParams.get('renovation');
    if (renovation) {
        renovation.split(',').forEach(ren => {
            filterTags.push({ label: filterLabels[ren] || ren, param: 'renovation', value: ren });
        });
    }
    
    // Floor options
    const floorOptions = urlParams.get('floor_options');
    if (floorOptions) {
        floorOptions.split(',').forEach(opt => {
            filterTags.push({ label: filterLabels[opt] || opt, param: 'floor_options', value: opt });
        });
    }
    
    // Completion
    const completion = urlParams.get('completion');
    if (completion) {
        completion.split(',').forEach(year => {
            filterTags.push({ label: `Сдача: ${decodeURIComponent(year)}`, param: 'completion', value: year });
        });
    }
    
    // Cashback only
    if (urlParams.get('cashback_only') === 'true') {
        filterTags.push({ label: 'Только с кэшбеком', param: 'cashback_only', value: 'true' });
    }
    
    // Render с минималистичным дизайном (серые бейджи)
    if (filterTags.length > 0) {
        container.innerHTML = filterTags.map(tag => `
            <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-normal" style="background-color: #F3F4F6; color: #111827;">
                ${tag.label}
                <button onclick="removeFilter('${tag.param}', ${tag.value ? `'${tag.value}'` : 'null'})" 
                        class="text-gray-400 hover:text-gray-600 transition-colors text-base font-normal">×</button>
            </span>
        `).join('');
        parentContainer.classList.remove('hidden');
        console.log('✅ Displayed', filterTags.length, 'active filters');
    } else {
        parentContainer.classList.add('hidden');
        console.log('ℹ️ No active filters to display');
    }
};

// Remove individual filter - AJAX VERSION
window.removeFilter = function(param, value) {
    console.log('🗑️ Removing filter:', param, value);
    
    // Обновляем UI элементы (снимаем чекбоксы или очищаем поля)
    if (value === null) {
        // Для range фильтров (цена, площадь, этаж и т.д.)
        if (param === 'price') {
            const priceFromEl = document.getElementById('priceFrom');
            const priceToEl = document.getElementById('priceTo');
            if (priceFromEl) priceFromEl.value = '';
            if (priceToEl) priceToEl.value = '';
            const buttonText = document.getElementById('priceFilterText');
            if (buttonText) buttonText.textContent = 'Цена от-до, ₽';
        }
        else if (param === 'area') {
            const areaFromEl = document.getElementById('areaFrom');
            const areaToEl = document.getElementById('areaTo');
            if (areaFromEl) areaFromEl.value = '';
            if (areaToEl) areaToEl.value = '';
        }
        else if (param === 'floor') {
            const floorFromEl = document.getElementById('floorFrom');
            const floorToEl = document.getElementById('floorTo');
            if (floorFromEl) floorFromEl.value = '';
            if (floorToEl) floorToEl.value = '';
        }
        else if (param === 'building_floors') {
            const maxFloorFromEl = document.getElementById('maxFloorFrom');
            const maxFloorToEl = document.getElementById('maxFloorTo');
            if (maxFloorFromEl) maxFloorFromEl.value = '';
            if (maxFloorToEl) maxFloorToEl.value = '';
        }
        else if (param === 'build_year') {
            const buildYearFromEl = document.getElementById('buildYearFrom');
            const buildYearToEl = document.getElementById('buildYearTo');
            if (buildYearFromEl) buildYearFromEl.value = '';
            if (buildYearToEl) buildYearToEl.value = '';
        }
    } else {
        // Для чекбоксов
        const checkbox = document.querySelector(`input[data-filter-type="${param}"][value="${value}"]`);
        if (checkbox) {
            checkbox.checked = false;
        }
    }
    
    // Применяем фильтры через AJAX
    window.applyFilters();
};

console.log('✅ Active filters display functions loaded');

// ======================
// FILTERS MODAL FUNCTIONS
// ======================

// Сброс всех фильтров в модальном окне
window.resetModalFilters = function() {
    console.log('🔥 Resetting all modal filters...');
    
    // Очищаем все input поля в модальном окне
    const inputs = document.querySelectorAll('#filters-modal input[type="number"]');
    inputs.forEach(input => input.value = '');
    
    // Снимаем все чекбоксы в модальном окне
    const checkboxes = document.querySelectorAll('#filters-modal input[type="checkbox"]');
    checkboxes.forEach(checkbox => checkbox.checked = false);
    
    // Обновляем счетчик
    updateModalFilterCount();
    
    console.log('✅ Modal filters reset');
};

// Синхронизация значений из основных фильтров в модальное окно
window.syncFiltersToModal = function() {
    // Синхронизируем площадь
    const areaFrom = document.getElementById('areaFrom');
    const areaTo = document.getElementById('areaTo');
    const areaFromModal = document.getElementById('areaFromModal');
    const areaToModal = document.getElementById('areaToModal');
    if (areaFrom && areaFromModal) areaFromModal.value = areaFrom.value;
    if (areaTo && areaToModal) areaToModal.value = areaTo.value;
    
    // Синхронизируем этаж
    const floorFrom = document.getElementById('floorFrom');
    const floorTo = document.getElementById('floorTo');
    const floorFromModal = document.getElementById('floorFromModal');
    const floorToModal = document.getElementById('floorToModal');
    if (floorFrom && floorFromModal) floorFromModal.value = floorFrom.value;
    if (floorTo && floorToModal) floorToModal.value = floorTo.value;
    
    // Синхронизируем этажность
    const maxFloorFrom = document.getElementById('maxFloorFrom');
    const maxFloorTo = document.getElementById('maxFloorTo');
    const maxFloorFromModal = document.getElementById('maxFloorFromModal');
    const maxFloorToModal = document.getElementById('maxFloorToModal');
    if (maxFloorFrom && maxFloorFromModal) maxFloorFromModal.value = maxFloorFrom.value;
    if (maxFloorTo && maxFloorToModal) maxFloorToModal.value = maxFloorTo.value;
    
    // Синхронизируем чекбоксы из advancedFiltersPanel
    const mainCheckboxes = document.querySelectorAll('#advancedFiltersPanel input[type="checkbox"]');
    mainCheckboxes.forEach(mainCheckbox => {
        const filterType = mainCheckbox.getAttribute('data-filter-type');
        const value = mainCheckbox.value;
        const modalCheckbox = document.querySelector(`#filters-modal input[data-filter-type="${filterType}"][value="${value}"]`);
        if (modalCheckbox) {
            modalCheckbox.checked = mainCheckbox.checked;
        }
    });
    
    console.log('✅ Filters synced to modal');
};

// Синхронизация значений из модального окна обратно в основные фильтры
window.syncFiltersFromModal = function() {
    // Синхронизируем площадь
    const areaFrom = document.getElementById('areaFrom');
    const areaTo = document.getElementById('areaTo');
    const areaFromModal = document.getElementById('areaFromModal');
    const areaToModal = document.getElementById('areaToModal');
    if (areaFrom && areaFromModal) areaFrom.value = areaFromModal.value;
    if (areaTo && areaToModal) areaTo.value = areaToModal.value;
    
    // Синхронизируем этаж
    const floorFrom = document.getElementById('floorFrom');
    const floorTo = document.getElementById('floorTo');
    const floorFromModal = document.getElementById('floorFromModal');
    const floorToModal = document.getElementById('floorToModal');
    if (floorFrom && floorFromModal) floorFrom.value = floorFromModal.value;
    if (floorTo && floorToModal) floorTo.value = floorToModal.value;
    
    // Синхронизируем этажность
    const maxFloorFrom = document.getElementById('maxFloorFrom');
    const maxFloorTo = document.getElementById('maxFloorTo');
    const maxFloorFromModal = document.getElementById('maxFloorFromModal');
    const maxFloorToModal = document.getElementById('maxFloorToModal');
    if (maxFloorFrom && maxFloorFromModal) maxFloorFrom.value = maxFloorFromModal.value;
    if (maxFloorTo && maxFloorToModal) maxFloorTo.value = maxFloorToModal.value;
    
    // Синхронизируем чекбоксы обратно
    const modalCheckboxes = document.querySelectorAll('#filters-modal input[type="checkbox"]');
    modalCheckboxes.forEach(modalCheckbox => {
        const filterType = modalCheckbox.getAttribute('data-filter-type');
        const value = modalCheckbox.value;
        const mainCheckbox = document.querySelector(`#advancedFiltersPanel input[data-filter-type="${filterType}"][value="${value}"]`);
        if (mainCheckbox) {
            mainCheckbox.checked = modalCheckbox.checked;
        }
    });
    
    console.log('✅ Filters synced from modal');
};

// Открыть модальное окно фильтров
window.openFiltersModal = function() {
    console.log('🔥 Opening filters modal...');
    
    const modal = document.getElementById('filters-modal');
    
    if (!modal) {
        console.error('❌ Modal element not found');
        return;
    }
    
    // Показываем модальное окно
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Блокируем скролл body
    
    // Синхронизируем значения из основных фильтров в модальное окно
    syncFiltersToModal();
    
    // Обновляем счетчик в модальном окне
    updateModalFilterCount();
    
    console.log('✅ Filters modal opened');
};

// Закрыть модальное окно фильтров
window.closeFiltersModal = function() {
    console.log('🔥 Closing filters modal...');
    
    const modal = document.getElementById('filters-modal');
    if (!modal) {
        console.error('❌ Modal not found');
        return;
    }
    
    // Скрываем модальное окно
    modal.classList.add('hidden');
    document.body.style.overflow = ''; // Разблокируем скролл body
    
    console.log('✅ Filters modal closed');
};

// Применить фильтры из модального окна
window.applyModalFilters = function() {
    console.log('🔥 Applying filters from modal...');
    
    // Синхронизируем значения из модала обратно в основные фильтры
    syncFiltersFromModal();
    
    // Применяем фильтры
    if (typeof window.applyFilters === 'function') {
        window.applyFilters();
    }
    
    // Закрываем модальное окно
    window.closeFiltersModal();
    
    console.log('✅ Filters applied from modal');
};

// Обновить счетчик фильтрованных объявлений в модальном окне
window.updateModalFilterCount = function() {
    // Получаем текущий счетчик из основной кнопки поиска
    const mainCountText = document.getElementById('search-btn-text-desktop');
    const modalCount = document.getElementById('modal-filtered-count');
    const modalWord = document.getElementById('modal-filtered-word');
    
    if (!mainCountText || !modalCount) return;
    
    // Извлекаем число из текста кнопки (например, "Найти 307 квартир")
    const match = mainCountText.textContent.match(/(\d+)/);
    if (match) {
        const count = parseInt(match[1]);
        modalCount.textContent = count;
        
        // Обновляем правильное склонение
        if (modalWord && typeof window.pluralizeRussian === 'function') {
            modalWord.textContent = window.pluralizeRussian(count, 'новостройку', 'новостройки', 'новостроек');
        }
    }
};

// Обработчик ESC для закрытия модального окна
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const modal = document.getElementById('filters-modal');
        if (modal && !modal.classList.contains('hidden')) {
            window.closeFiltersModal();
        }
    }
});

// Слушаем изменения фильтров для обновления счетчика в модале
document.addEventListener('change', function(e) {
    const modal = document.getElementById('filters-modal');
    if (modal && !modal.classList.contains('hidden')) {
        // Если фильтр изменен в модальном окне
        if (e.target.matches('input[data-filter-type], select[data-filter-type]')) {
            // Обновляем счетчик с небольшой задержкой
            setTimeout(() => {
                if (typeof window.updateFilteredCount === 'function') {
                    window.updateFilteredCount();
                }
                // Обновляем счетчик в модальном окне
                setTimeout(() => window.updateModalFilterCount(), 100);
            }, 100);
        }
    }
});

// Слушаем изменения input полей (для полей "от-до")
document.addEventListener('input', function(e) {
    const modal = document.getElementById('filters-modal');
    if (modal && !modal.classList.contains('hidden')) {
        // Если input изменен в модальном окне
        if (e.target.matches('#areaFrom, #areaTo, #floorFrom, #floorTo, #maxFloorFrom, #maxFloorTo, #buildYearFrom, #buildYearTo')) {
            // Обновляем счетчик с небольшой задержкой
            if (typeof debounceApplyFilters === 'function') {
                debounceApplyFilters();
            }
            setTimeout(() => window.updateModalFilterCount(), 500);
        }
    }
});

console.log('✅ Filters modal functions loaded');
console.log('🚀🚀🚀 PROPERTY-FILTERS.JS - AJAX MODE ACTIVATED 🚀🚀🚀');
console.log('✅ Functions registered:', {
    applyFilters: typeof window.applyFilters,
    applyPriceFilter: typeof window.applyPriceFilter,
    handleRoomFilterChange: typeof window.handleRoomFilterChange,
    updateAdvancedFiltersCounter: typeof window.updateAdvancedFiltersCounter,
    removeFilter: typeof window.removeFilter,
    displayActiveFilters: typeof window.displayActiveFilters,
    debounceApplyFilters: typeof debounceApplyFilters,
    getFiltersState: typeof window.getFiltersState,
    serializeForAPI: typeof window.serializeForAPI,
    resetFilters: typeof window.resetFilters,
    switchFilterTab: typeof window.switchFilterTab,
    syncFiltersToModal: typeof window.syncFiltersToModal,
    syncFiltersFromModal: typeof window.syncFiltersFromModal,
    openFiltersModal: typeof window.openFiltersModal,
    closeFiltersModal: typeof window.closeFiltersModal,
    applyModalFilters: typeof window.applyModalFilters,
    updateModalFilterCount: typeof window.updateModalFilterCount
});
