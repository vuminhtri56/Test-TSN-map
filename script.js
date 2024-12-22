// Cấu hình Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBwa9SZPRVkq3iBD1BifxT6tT34EnyRIhQ",
  authDomain: "test-tsn-map.firebaseapp.com",
  databaseURL: "https://test-tsn-map-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "test-tsn-map",
  storageBucket: "test-tsn-map.firebasestorage.app",
  messagingSenderId: "828454384113",
  appId: "1:828454384113:web:4eb7d1f1bb3f9894845450",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Khai báo quyền người dùng
let role = 'Admin'; // Thay đổi thành 'Editor' hoặc 'Viewer' để kiểm tra quyền

// Khởi tạo bản đồ tại Tân Sơn Nhất
const map = new google.maps.Map(document.getElementById('map'), {
  center: { lat: 10.818462, lng: 106.658349 },
  zoom: 15
});


// Thêm tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Tạo một lớp cho các marker
const markersLayer = L.layerGroup().addTo(map);

// Tải marker từ Firebase
firebase.database().ref('markers').on('value', snapshot => {
  markersLayer.clearLayers();
  snapshot.forEach(childSnapshot => {
    const data = childSnapshot.val();
    const marker = L.marker([data.lat, data.lng]).addTo(markersLayer)
      .bindPopup(data.popup || 'Không có ghi chú');
  });
});

// Sự kiện click trên bản đồ
map.on('click', function (e) {
  if (role === 'Admin' || role === 'Editer') {
    const { lat, lng } = e.latlng;
    const popupContent = `
      <div>
        <b>Marker mới</b><br>
        Tọa độ: ${lat}, ${lng}<br>
        <button onclick="deleteMarker(this)">Xóa Marker</button>
      </div>
    `;

    const newMarker = L.marker([lat, lng]).addTo(markersLayer)
      .bindPopup(popupContent).openPopup();

    // Lưu dữ liệu vào Firebase
    saveMarkerToFirebase(lat, lng, popupContent);
  }
});

// Lưu Marker vào Firebase
function saveMarkerToFirebase(lat, lng, popupContent) {
  firebase.database().ref('markers').push({
    lat: lat,
    lng: lng,
    popup: popupContent
  });
}

// Hàm xóa Marker
function deleteMarker(button) {
  const popup = button.closest('.leaflet-popup-content');
  const marker = markersLayer.getLayers().find(m => m.getPopup().getContent() === popup.innerHTML);
  if (marker) {
    markersLayer.removeLayer(marker);
    alert('Marker đã được xóa!');
  }
}

let polylinePoints = [];
const polylineLayer = L.layerGroup().addTo(map);

map.on('click', function (e) {
  if (role === 'Admin' || role === 'Editer') {
    const { lat, lng } = e.latlng;
    polylinePoints.push([lat, lng]);

    // Vẽ đường tạm thời trên bản đồ
    L.polyline(polylinePoints, { color: 'red' }).addTo(polylineLayer);
  }
});

// Nút lưu polyline
function savePolyline() {
  if (polylinePoints.length > 1) {
    firebase.database().ref('polylines').push(polylinePoints);
    alert('Polyline đã được lưu!');
    polylinePoints = []; // Reset điểm
  } else {
    alert('Cần ít nhất 2 điểm để vẽ đường.');
  }
}

firebase.database().ref('polylines').on('value', snapshot => {
  polylineLayer.clearLayers();
  snapshot.forEach(childSnapshot => {
    const points = childSnapshot.val();
    L.polyline(points, { color: 'blue' }).addTo(polylineLayer);
  });
});

const users = {
  admin: { password: 'admin123', role: 'Admin' },
  editor: { password: 'editor123', role: 'Editer' },
  viewer: { password: 'viewer123', role: 'Viewer' }
};

function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  if (users[username] && users[username].password === password) {
    role = users[username].role;
    alert(`Đăng nhập thành công với quyền: ${role}`);
    document.getElementById('login').style.display = 'none'; // Ẩn form đăng nhập
  } else {
    alert('Sai tên đăng nhập hoặc mật khẩu.');
  }
}
