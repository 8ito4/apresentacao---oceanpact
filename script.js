class MobileSimulator {
    constructor() {
        this.currentUrl = '';
        
        this.init();
    }
    
    init() {
        this.cacheElements();
        this.bindEvents();
        this.updateTime();
        this.startTimeUpdate();
    }
    
    cacheElements() {
        // URL elements
        this.urlInput = document.getElementById('url-input');
        this.loadBtn = document.getElementById('load-btn');
        this.loadIcon = document.getElementById('load-icon');
        this.exampleBtns = document.querySelectorAll('.example-btn');
        
        // Device elements
        this.mobileFrame = document.getElementById('mobile-frame');
        this.placeholder = document.getElementById('placeholder');
        
        // Control elements
        this.refreshBtn = document.getElementById('refresh-btn');
        this.fullscreenBtn = document.getElementById('fullscreen-btn');
        
        // Status elements
        this.statusTime = document.getElementById('status-time');
    }
    
    bindEvents() {
        // Load URL button
        this.loadBtn.addEventListener('click', () => this.loadUrl());
        
        // Enter key in input
        this.urlInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.loadUrl();
            }
        });
        
        // Example buttons
        this.exampleBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.urlInput.value = btn.dataset.url;
                this.loadUrl();
            });
        });
        
        // Device controls
        this.refreshBtn.addEventListener('click', () => this.refreshPage());
        this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }
    
    loadUrl() {
        let url = this.urlInput.value.trim();
        
        if (!url) {
            this.showNotification('Digite uma URL válida', 'error');
            return;
        }
        
        // Normalize URL - add protocol if missing
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }
        
        // Validate URL
        if (!this.isValidUrl(url)) {
            this.showNotification('URL inválida. Tente: google.com ou https://google.com', 'error');
            return;
        }
        
        // Show loading state
        this.showLoading();
        
        // Load URL in iframe
        this.mobileFrame.src = url;
        this.currentUrl = url;
        
        // Hide placeholder and show iframe
        this.placeholder.style.display = 'none';
        this.mobileFrame.classList.add('active');
        
        // Handle iframe load
        this.mobileFrame.onload = () => {
            this.hideLoading();
            this.showNotification('Site carregado com sucesso!');
        };
        
        // Handle iframe error
        this.mobileFrame.onerror = () => {
            this.hideLoading();
            this.showNotification('Erro ao carregar o site. Verifique a URL.', 'error');
            this.showPlaceholder();
        };
        
        // Also handle load event for better compatibility
        this.mobileFrame.addEventListener('load', () => {
            this.hideLoading();
            this.showNotification('Site carregado com sucesso!');
        });
        
        // Handle errors
        this.mobileFrame.addEventListener('error', () => {
            this.hideLoading();
            this.showNotification('Erro ao carregar o site. Verifique a URL.', 'error');
            this.showPlaceholder();
        });
    }
    
    isValidUrl(string) {
        try {
            const url = new URL(string);
            // Accept http and https protocols
            return url.protocol === 'http:' || url.protocol === 'https:';
        } catch (_) {
            // If URL constructor fails, try a simple regex check
            const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
            return urlPattern.test(string);
        }
    }
    
    showLoading() {
        // Remove any existing animation classes
        this.loadIcon.classList.remove('bi-arrow-right');
        this.loadIcon.classList.add('bi-arrow-clockwise', 'animate-spin-slow');
    }
    
    hideLoading() {
        // Remove animation classes and restore original icon
        this.loadIcon.classList.remove('bi-arrow-clockwise', 'animate-spin-slow');
        this.loadIcon.classList.add('bi-arrow-right');
    }
    
    showPlaceholder() {
        this.placeholder.style.display = 'flex';
        this.mobileFrame.classList.remove('active');
    }
    
    refreshPage() {
        if (this.currentUrl) {
            this.mobileFrame.src = this.currentUrl;
            this.showNotification('Página atualizada!');
        } else {
            this.showNotification('Nenhuma URL carregada para atualizar', 'error');
        }
    }
    
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            this.fullscreenBtn.innerHTML = '<i class="bi bi-fullscreen-exit text-lg group-hover:scale-110 transition-transform text-accent-300 group-hover:text-white"></i><span class="font-medium">Sair</span>';
        } else {
            document.exitFullscreen();
            this.fullscreenBtn.innerHTML = '<i class="bi bi-arrows-fullscreen text-lg group-hover:scale-110 transition-transform text-accent-300 group-hover:text-white"></i><span class="font-medium">Fullscreen</span>';
        }
    }
    
    handleKeyboard(e) {
        switch(e.key) {
            case 'F5':
                e.preventDefault();
                this.refreshPage();
                break;
            case 'F11':
                e.preventDefault();
                this.toggleFullscreen();
                break;
        }
    }
    
    updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        if (this.statusTime) {
            this.statusTime.textContent = timeString;
        }
    }
    
    startTimeUpdate() {
        // Update time every minute
        setInterval(() => {
            this.updateTime();
        }, 60000);
    }
    
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = 'notification';
        if (type === 'error') {
            notification.classList.add('error');
        }
        notification.textContent = message;
        
        const container = document.getElementById('notification-container');
        container.appendChild(notification);
        
        // Animate in
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (container.contains(notification)) {
                    container.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Add spin animation
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    @keyframes spin-slow {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// Initialize the simulator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MobileSimulator();
    
    // Add smooth interactions
    const interactiveElements = document.querySelectorAll('button, .example-btn, .control-btn, .btn');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.style.transform = 'translateY(-1px)';
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translateY(0)';
        });
    });
});