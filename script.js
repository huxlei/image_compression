document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.getElementById('uploadArea');
    const imageInput = document.getElementById('imageInput');
    const uploadBtn = document.querySelector('.upload-btn');
    const previewContainer = document.getElementById('previewContainer');
    const originalPreview = document.getElementById('originalPreview');
    const compressedPreview = document.getElementById('compressedPreview');
    const originalSize = document.getElementById('originalSize');
    const compressedSize = document.getElementById('compressedSize');
    const qualitySlider = document.getElementById('qualitySlider');
    const qualityValue = document.getElementById('qualityValue');
    const downloadBtn = document.getElementById('downloadBtn');

    let originalImage = null;

    // 上传按钮点击事件
    uploadBtn.addEventListener('click', () => {
        imageInput.click();
    });

    // 拖拽上传
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleImageUpload(file);
        }
    });

    // 文件选择处理
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            handleImageUpload(file);
        }
    });

    // 质量滑块变化事件
    qualitySlider.addEventListener('input', (e) => {
        qualityValue.textContent = `${e.target.value}%`;
        if (originalImage) {
            compressImage(originalImage, e.target.value / 100);
        }
    });

    // 处理图片上传
    function handleImageUpload(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            originalImage = new Image();
            originalImage.src = e.target.result;
            originalImage.onload = () => {
                originalPreview.src = e.target.result;
                originalSize.textContent = formatFileSize(file.size);
                compressImage(originalImage, qualitySlider.value / 100);
                previewContainer.style.display = 'block';
            };
        };
        reader.readAsDataURL(file);
    }

    // 压缩图片
    function compressImage(img, quality) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = img.width;
        canvas.height = img.height;
        
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        compressedPreview.src = compressedDataUrl;
        
        // 计算压缩后的文件大小
        const compressedSize = Math.round((compressedDataUrl.length - 22) * 3 / 4);
        document.getElementById('compressedSize').textContent = formatFileSize(compressedSize);
    }

    // 下载按钮点击事件
    downloadBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'compressed-image.jpg';
        link.href = compressedPreview.src;
        link.click();
    });

    // 格式化文件大小
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}); 