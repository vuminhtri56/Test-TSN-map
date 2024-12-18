// Khởi tạo bản đồ tại Tân Sơn Nhất
const map = L.map('map').setView([10.818462, 106.658349], 15); // Tọa độ Tân Sơn Nhất

// Thêm tile layer (nền bản đồ)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Định nghĩa vai trò (giả lập)
let role = 'Admin'; // Thay đổi thành 'Admin' hoặc 'Editer' để kiểm tra quyền

// Kiểm tra quyền và thông báo
if (role === 'Admin') {
  console.log('Bạn là Admin. Có quyền chỉnh sửa toàn bộ.');
} else if (role === 'Editer') {
  console.log('Bạn là Editor. Có thể thêm/chỉnh sửa một số nội dung.');
} else {
  console.log('Bạn chỉ có quyền xem.');
}
if (role === 'Admin' || role === 'Editer') {
  map.on('click', function (e) {
    const { lat, lng } = e.latlng;

    // Chỉ Admin và Editor mới có thể tạo marker
    const newMarker = L.marker([lat, lng]).addTo(markersLayer)
    marker1.bindPopup(`
      <div style="width: 250px; font-family: Arial, sans-serif;">
        <h3>Ghi chú</h3>
        <textarea placeholder="Nhập ghi chú tại đây..." style="width: 100%; height: 60px;"></textarea><br>
        <label><input type="checkbox"> Tùy chọn 1</label><br>
        <label><input type="checkbox"> Tùy chọn 2</label><br><br>
        <input type="file" accept="image/*" style="margin-bottom: 10px;"><br>
        <button onclick="alert('Ghi chú đã được lưu!')" style="padding: 5px 10px; background-color: #007BFF; color: white; border: none; border-radius: 4px;">Lưu</button>
      </div>
    `);
        
  });
}

if (role === 'Admin' || role === 'Editer') {
  map.on('click', function (e) {
    const { lat, lng } = e.latlng;
    const newMarker = L.marker([lat, lng]).addTo(markersLayer)
      .bindPopup('Marker mới: Nhập ghi chú ở đây').openPopup();
    saveMarkersToLocalStorage(); // Lưu lại khi tạo marker
  });
}


// Ví dụ tạo một marker
const marker = L.marker([10.818462, 106.658349]).addTo(map)
  .bindPopup('Sân bay Tân Sơn Nhất')
  .openPopup();

  // Tạo một lớp cho các marker
const markersLayer = L.layerGroup().addTo(map);

// Tạo một marker và thêm vào lớp
const marker1 = L.marker([10.8205, 106.6603]).addTo(markersLayer)
marker1.bindPopup(`
  <div style="width: 250px; font-family: Arial, sans-serif;">
    <h3>Ghi chú</h3>
    <textarea placeholder="Nhập ghi chú tại đây..." style="width: 100%; height: 60px;"></textarea><br>
    <label><input type="checkbox"> Tùy chọn 1</label><br>
    <label><input type="checkbox"> Tùy chọn 2</label><br><br>
    <input type="file" accept="image/*" style="margin-bottom: 10px;"><br>
    <button onclick="alert('Ghi chú đã được lưu!')" style="padding: 5px 10px; background-color: #007BFF; color: white; border: none; border-radius: 4px;">Lưu</button>
  </div>
`);


  // Thêm lớp quản lý layer vào bản đồ
const toggleLayerButton = L.control({ position: 'topright' });
toggleLayerButton.onAdd = function () {
  const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
  div.innerHTML = '<button style="background: white; padding: 10px; cursor: pointer;">Bật/Tắt Lớp</button>';
  div.onclick = function () {
    if (map.hasLayer(markersLayer)) {
      map.removeLayer(markersLayer); // Tắt lớp
      console.log('Lớp đã bị tắt.');
    } else {
      map.addLayer(markersLayer); // Bật lớp
      console.log('Lớp đã được bật.');
    }
  };
  return div;
};
toggleLayerButton.addTo(map);


  // Tạo một polyline
const polyline = L.polyline([
    [10.818462, 106.658349],
    [10.8205, 106.6603]
  ], { color: 'blue' }).addTo(markersLayer);
  
  // Kiểm tra nếu trình duyệt hỗ trợ GPS
if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
      position => {
        const { latitude, longitude } = position.coords;
  
        // Thêm một marker để đánh dấu vị trí người dùng
        const userMarker = L.marker([latitude, longitude], {
          icon: L.icon({
            iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
            iconSize: [25, 41], // Kích thước icon
            iconAnchor: [12, 41], // Điểm neo
          })
        }).addTo(map).bindPopup('Bạn đang ở đây!').openPopup();
  
        // Zoom vào vị trí người dùng
        map.setView([latitude, longitude], 15);
      },
      error => {
        alert('Không thể lấy vị trí: ' + error.message);
      }
    );
  } else {
    alert('Trình duyệt của bạn không hỗ trợ GPS.');
  }
  
  // Kiểm tra nếu trình duyệt hỗ trợ GPS
if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    position => {
      const { latitude, longitude } = position.coords;

      // Thêm một marker để đánh dấu vị trí người dùng
      const userMarker = L.marker([latitude, longitude], {
        icon: L.icon({
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          iconSize: [25, 41], // Kích thước icon
          iconAnchor: [12, 41], // Điểm neo
        })
      }).addTo(map).bindPopup('Bạn đang ở đây!').openPopup();

      // Zoom vào vị trí người dùng
      map.setView([latitude, longitude], 15);
    },
    error => {
      alert('Không thể lấy vị trí: ' + error.message);
    }
  );
} else {
  alert('Trình duyệt của bạn không hỗ trợ GPS.');
}

// Hàm lưu marker vào Local Storage
function saveMarkersToLocalStorage() {
  const markersData = [];
  markersLayer.eachLayer(marker => {
    if (marker instanceof L.Marker) {
      markersData.push({
        lat: marker.getLatLng().lat,
        lng: marker.getLatLng().lng,
        popupContent: marker.getPopup() ? marker.getPopup().getContent() : ''
      });
    }
  });
  localStorage.setItem('markers', JSON.stringify(markersData));
  alert('Markers đã được lưu!');
}

// Hàm tải marker từ Local Storage
function loadMarkersFromLocalStorage() {
  const markersData = JSON.parse(localStorage.getItem('markers') || '[]');
  markersData.forEach(data => {
    const marker = L.marker([data.lat, data.lng]).addTo(markersLayer)
      .bindPopup(data.popupContent || '');
  });
}

// Gọi hàm tải dữ liệu khi tải trang
loadMarkersFromLocalStorage();

map.on('click', function (e) {
  if (role === 'Admin' || role === 'Editer') {
    const { lat, lng } = e.latlng;
    const newMarker = L.marker([lat, lng]).addTo(markersLayer)
      .bindPopup(`
        <div>
          <b>Marker mới</b><br>
          Tọa độ: ${lat}, ${lng}<br>
          <button onclick="deleteMarker(this)">Xóa Marker</button>
        </div>
      `).openPopup();
    saveMarkersToLocalStorage();
  }
});

// Hàm xóa marker
function deleteMarker(button) {
  const popup = button.closest('.leaflet-popup-content');
  const marker = markersLayer.getLayers().find(m => m.getPopup().getContent() === popup.innerHTML);
  if (marker) {
    markersLayer.removeLayer(marker);
    saveMarkersToLocalStorage();
    alert('Marker đã được xóa!');
  }
}
