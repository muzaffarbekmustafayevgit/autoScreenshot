const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Kamerani ishga tushirish
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
        startCapturing();
    })
    .catch(err => console.error('Kameraga ruxsat berilmadi:', err));

function startCapturing() {
    setInterval(captureImages, 1000); // Har 1 soniyada ishlaydi
}

async function captureImages() {
    if (!canvas || !video) return;

    const images = [];

    for (let i = 0; i < 5; i++) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg'));
        images.push(new File([imageBlob], `image_${Date.now()}.jpg`, { type: 'image/jpeg' }));
    }

    // Rasmlarni serverga yuborish
    const formData = new FormData();
    images.forEach(img => formData.append('images', img));

    fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => console.log('Yuborildi:', data))
    .catch(err => console.error('Xatolik:', err));
}
