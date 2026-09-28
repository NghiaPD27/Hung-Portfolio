// Bounds include EVERY non-transparent pixel in each original 1920 × 1080 PNG.
// The viewer only removes transparent margins in CSS; the artwork is unmodified.
const entries = [
  ['1', 'Nexit', 'Construction Ltd.', 'Doanh nghiệp', '#f0e4d7', '#191916', [631, 255, 657, 589], 'tall'],
  ['2', 'Pemela', 'Learning Centre', 'Giáo dục', '#e1e9f0', '#191916', [468, 408, 984, 252], 'wide'],
  ['3', 'Zinal', 'Logistics Ltd.', 'Doanh nghiệp', '#edf0e3', '#191916', [551, 400, 825, 284], 'wide'],
  ['4', 'Firm Foundation', 'Academy', 'Giáo dục', '#f5efdf', '#191916', [363, 294, 1253, 498], 'wide'],
  ['5', 'Youngstars', 'Football Club', 'Thể thao', '#e2e9c9', '#191916', [496, 196, 930, 709], 'tall'],
  ['6', 'Bakers Kitchen', 'Tasty and nutritious', 'Ẩm thực', '#372e27', '#faf6ed', [554, 203, 854, 691], 'tall'],
  ['7', 'Aunty Didi’s', 'Kitchen', 'Ẩm thực', '#394437', '#faf6ed', [509, 222, 901, 632], 'tall'],
  ['8', 'Ipetex Studios', 'Studio', 'Sáng tạo', '#5742aa', '#faf6ed', [696, 309, 531, 449], 'tall'],
  ['9', 'Limelight News', 'News', 'Truyền thông', '#223b60', '#faf6ed', [520, 377, 926, 298], 'wide'],
  ['10', 'StarTimes', 'Media', 'Truyền thông', '#b44435', '#faf6ed', [609, 321, 706, 410], 'square'],
  ['12', 'Extron', 'The future is today', 'Doanh nghiệp', '#d5e5ea', '#191916', [336, 364, 1248, 337], 'wide'],
  ['13', 'Ezoc', 'Logistic Company', 'Doanh nghiệp', '#dbe3f0', '#191916', [577, 233, 767, 622], 'tall'],
  ['14', 'Studio 57', 'Studio', 'Sáng tạo', '#f0dbd6', '#191916', [512, 256, 896, 605], 'square'],
  ['nexita', 'Nexita', 'Company Limited', 'Doanh nghiệp', '#e7e0f3', '#191916', [743, 341, 439, 395], 'tall'],
]

export const logoCatalog = entries.map(([id, name, subtitle, category, background, color, bounds, shape], index) => ({
  id, name, subtitle, category, background, color, bounds, shape,
  number: String(index + 1).padStart(2, '0'),
  src: `/assets/logo/${id}.png`,
  sourceFile: id === 'nexita' ? 'Thiết kế chưa có tên.png' : `${id}.png`,
}))

export const logoCategories = ['Tất cả', ...new Set(logoCatalog.map(logo => logo.category))]
