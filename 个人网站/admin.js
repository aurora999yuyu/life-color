// ============================================
// 后台管理功能：上传照片、上传心情、背景切换
// ============================================

// 初始化本地存储的数据
function initData() {
    if (!localStorage.getItem('photosData')) {
        localStorage.setItem('photosData', JSON.stringify(photosData));
    }
    if (!localStorage.getItem('moodsData')) {
        localStorage.setItem('moodsData', JSON.stringify(moodsData));
    }
}

// 获取当前数据
function getPhotos() {
    return JSON.parse(localStorage.getItem('photosData')) || [];
}

function getMoods() {
    return JSON.parse(localStorage.getItem('moodsData')) || [];
}

// 保存数据
function savePhotos(photos) {
    localStorage.setItem('photosData', JSON.stringify(photos));
    window.photosData = photos;
}

function saveMoods(moods) {
    localStorage.setItem('moodsData', JSON.stringify(moods));
    window.moodsData = moods;
}

// 重新渲染页面
function refreshPage() {
    if (typeof renderPhotos === 'function') renderPhotos();
    if (typeof renderMoods === 'function') renderMoods();
}

// 上传照片
function bindUploadPhoto() {
    const form = document.getElementById('uploadPhotoForm');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const date = document.getElementById('photoDate').value;
        const file = document.getElementById('photoFile').files[0];
        const desc = document.getElementById('photoDesc').value;
        
        if (!date || !file) {
            alert('请填写日期并选择照片');
            return;
        }
        
        const ext = file.name.split('.').pop();
        const filename = `photo_${Date.now()}.${ext}`;
        const imagePath = `photos/${filename}`;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageData = e.target.result;
            localStorage.setItem(`img_${filename}`, imageData);
            
            const photos = getPhotos();
            photos.push({
                date: date,
                imagePath: imagePath,
                description: desc
            });
            photos.sort((a, b) => b.date.localeCompare(a.date));
            savePhotos(photos);
            
            document.getElementById('photoDate').value = '';
            document.getElementById('photoFile').value = '';
            document.getElementById('photoDesc').value = '';
            
            alert('照片上传成功！');
            refreshPage();
        };
        reader.readAsDataURL(file);
    });
}

// 上传心情
function bindUploadMood() {
    const form = document.getElementById('uploadMoodForm');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const date = document.getElementById('moodDate').value;
        const color = document.getElementById('moodColor').value;
        const text = document.getElementById('moodText').value;
        const file = document.getElementById('moodImage').files[0];
        
        if (!date || !color) {
            alert('请填写日期和心情颜色');
            return;
        }
        
        if (file) {
            const ext = file.name.split('.').pop();
            const filename = `mood_${Date.now()}.${ext}`;
            const imagePath = `moods/${filename}`;
            
            const reader = new FileReader();
            reader.onload = function(e) {
                const imageData = e.target.result;
                localStorage.setItem(`img_${filename}`, imageData);
                
                const moods = getMoods();
                moods.push({
                    date: date,
                    color: color,
                    text: text,
                    imagePath: imagePath
                });
                moods.sort((a, b) => b.date.localeCompare(a.date));
                saveMoods(moods);
                
                document.getElementById('moodDate').value = '';
                document.getElementById('moodColor').value = '#FFD966';
                document.getElementById('moodText').value = '';
                document.getElementById('moodImage').value = '';
                
                alert('心情记录成功！');
                refreshPage();
            };
            reader.readAsDataURL(file);
        } else {
            const moods = getMoods();
            moods.push({
                date: date,
                color: color,
                text: text,
                imagePath: ''
            });
            moods.sort((a, b) => b.date.localeCompare(a.date));
            saveMoods(moods);
            
            document.getElementById('moodDate').value = '';
            document.getElementById('moodColor').value = '#FFD966';
            document.getElementById('moodText').value = '';
            
            alert('心情记录成功！');
            refreshPage();
        }
    });
}

// 背景切换功能
function bindBackgroundSettings() {
    const bgModal = document.getElementById('bgModal');
    const settingsBtn = document.getElementById('settingsBtn');
    const closeBtn = document.querySelector('.close');
    
    if (!bgModal || !settingsBtn) return;
    
    settingsBtn.addEventListener('click', () => {
        bgModal.style.display = 'block';
        loadCustomBgPreview();
    });
    
    closeBtn?.addEventListener('click', () => {
        bgModal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === bgModal) {
            bgModal.style.display = 'none';
        }
    });
    
    // 默认背景选项
    document.querySelectorAll('.bg-option[data-bg="default"]').forEach(opt => {
        opt.addEventListener('click', () => {
            setBackground('default');
            bgModal.style.display = 'none';
        });
    });
    
    // 上传自定义背景
    const bgUpload = document.getElementById('bgUpload');
    document.querySelectorAll('.bg-option[data-bg="upload"]').forEach(opt => {
        opt.addEventListener('click', () => {
            bgUpload.click();
        });
    });
    
    bgUpload?.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(ev) {
                const imageData = ev.target.result;
                setBackground('custom', imageData);
                bgModal.style.display = 'none';
            };
            reader.readAsDataURL(file);
        }
    });
    
    // 清除自定义背景
    document.getElementById('clearCustomBg')?.addEventListener('click', () => {
        localStorage.removeItem('customBg');
        setBackground('default');
        loadCustomBgPreview();
    });
}

function setBackground(type, imageData = null) {
    const body = document.getElementById('app-body');
    if (type === 'default') {
        body.style.background = 'linear-gradient(135deg, #1A4D3E 0%, #2C6E4F 100%)';
        body.style.backgroundSize = 'cover';
        localStorage.removeItem('customBg');
    } else if (type === 'custom' && imageData) {
        body.style.background = `url(${imageData}) center/cover fixed`;
        localStorage.setItem('customBg', imageData);
    }
}

function loadCustomBgPreview() {
    const customBg = localStorage.getItem('customBg');
    const previewDiv = document.getElementById('customBgPreview');
    const previewImg = document.getElementById('customBgImg');
    
    if (customBg && previewDiv && previewImg) {
        previewImg.src = customBg;
        previewDiv.style.display = 'block';
    } else if (previewDiv) {
        previewDiv.style.display = 'none';
    }
}

function loadSavedBackground() {
    const customBg = localStorage.getItem('customBg');
    if (customBg) {
        document.getElementById('app-body').style.background = `url(${customBg}) center/cover fixed`;
    }
}

// ============================================
// 渲染函数（使用 localStorage 数据）
// ============================================

window.renderPhotos = function() {
    const photos = getPhotos();
    const timeline = document.getElementById('timeline');
    if (!timeline) return;
    
    if (!photos || photos.length === 0) {
        timeline.innerHTML = '<p class="empty">暂无照片，快去上传吧 🌱</p>';
        return;
    }
    
    const years = {};
    photos.forEach(photo => {
        const year = photo.date.substring(0, 4);
        if (!years[year]) years[year] = [];
        years[year].push(photo);
    });
    
    const sortedYears = Object.keys(years).sort((a, b) => b - a);
    
    let html = '';
    sortedYears.forEach(year => {
        const months = {};
        years[year].forEach(photo => {
            const month = photo.date.substring(5, 7);
            if (!months[month]) months[month] = [];
            months[month].push(photo);
        });
        
        const sortedMonths = Object.keys(months).sort((a, b) => b - a);
        
        html += `<div class="year-group">
                    <div class="year-header" data-year="${year}">
                        <span class="year-toggle">▶</span> ${year}年
                    </div>
                    <div class="year-content" style="display: none;">`;
        
        sortedMonths.forEach(month => {
            months[month].sort((a, b) => b.date.localeCompare(a.date));
            
            html += `<div class="month-group">
                        <div class="month-header" data-year="${year}" data-month="${month}">
                            <span class="month-toggle">▶</span> ${month}月
                        </div>
                        <div class="month-content" style="display: none;">`;
            
            months[month].forEach(photo => {
                const filename = photo.imagePath.split('/').pop();
                const storedImg = localStorage.getItem(`img_${filename}`);
                const imgSrc = storedImg || photo.imagePath;
                
                html += `<div class="photo-item">
                            <div class="photo-date">${photo.date}</div>
                            <img src="${imgSrc}" alt="${photo.description || '照片'}" class="photo-img" onclick="openImageModal(this.src)">
                            <div class="photo-desc">${photo.description || ''}</div>
                        </div>`;
            });
            
            html += `</div></div>`;
        });
        
        html += `</div></div>`;
    });
    
    timeline.innerHTML = html;
    
    // 绑定展开/折叠事件
    document.querySelectorAll('.year-header').forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const toggle = header.querySelector('.year-toggle');
            if (content.style.display === 'none') {
                content.style.display = 'block';
                toggle.textContent = '▼';
            } else {
                content.style.display = 'none';
                toggle.textContent = '▶';
            }
        });
    });
    
    document.querySelectorAll('.month-header').forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const toggle = header.querySelector('.month-toggle');
            if (content.style.display === 'none') {
                content.style.display = 'flex';
                toggle.textContent = '▼';
            } else {
                content.style.display = 'none';
                toggle.textContent = '▶';
            }
        });
    });
};

window.renderMoods = function() {
    const moods = getMoods();
    const moodsList = document.getElementById('moods-list');
    if (!moodsList) return;
    
    if (!moods || moods.length === 0) {
        moodsList.innerHTML = '<p class="empty">暂无心情记录，来记录今天的颜色吧 🌈</p>';
        return;
    }
    
    const sortedMoods = [...moods].sort((a, b) => b.date.localeCompare(a.date));
    
    let html = '';
    sortedMoods.forEach(mood => {
        let imgHtml = '';
        if (mood.imagePath) {
            const filename = mood.imagePath.split('/').pop();
            const storedImg = localStorage.getItem(`img_${filename}`);
            const imgSrc = storedImg || mood.imagePath;
            imgHtml = `<img src="${imgSrc}" alt="心情配图" class="mood-img" onclick="openImageModal(this.src)">`;
        }
        
        html += `<div class="mood-card">
                    <div class="mood-date">🌿 ${mood.date}</div>
                    <div class="mood-color-bar" style="background-color: ${mood.color};"></div>
                    <div class="mood-text">${mood.text || ''}</div>
                    ${imgHtml}
                </div>`;
    });
    
    moodsList.innerHTML = html;
};

// 图片放大功能
window.openImageModal = function(src) {
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0,0,0,0.9)';
    modal.style.zIndex = '9999';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.cursor = 'pointer';
    
    const img = document.createElement('img');
    img.src = src;
    img.style.maxWidth = '90%';
    img.style.maxHeight = '90%';
    img.style.objectFit = 'contain';
    
    modal.appendChild(img);
    modal.addEventListener('click', () => modal.remove());
    document.body.appendChild(modal);
};

// ============================================
// 标签页切换功能（修复版）
// ============================================

function initTabs() {
    const tabBtns = document.querySelectorAll('.nav-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    if (!tabBtns.length || !tabContents.length) return;
    
    function handleTabClick(e) {
        const btn = e.currentTarget;
        const tabId = btn.getAttribute('data-tab');
        
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        tabContents.forEach(content => {
            content.classList.remove('active');
        });
        
        const activeTab = document.getElementById(`${tabId}-tab`);
        if (activeTab) {
            activeTab.classList.add('active');
        }
    }
    
    tabBtns.forEach(btn => {
        btn.removeEventListener('click', handleTabClick);
        btn.addEventListener('click', handleTabClick);
    });
}

// ============================================
// 初始化
// ============================================

function init() {
    initData();
    loadSavedBackground();
    initTabs();
    bindUploadPhoto();
    bindUploadMood();
    bindBackgroundSettings();
    refreshPage();
}

// 确保在页面完全加载后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}