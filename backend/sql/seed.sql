-- ============================================================
-- SD COMPUTERS — seed data
-- Categories, brands and a realistic starter catalog.
-- Safe to re-run (INSERT IGNORE): existing rows are kept.
-- ============================================================

-- ------------------------------------------------------------
-- CATEGORIES
-- ------------------------------------------------------------
INSERT IGNORE INTO categories (name, slug, description, image) VALUES
  ('Processors (CPU)', 'processors', 'Intel and AMD processors for everyday, gaming and creator builds. Compare cores, threads, clocks and sockets to match your motherboard.', '/products/processors.svg'),
  ('Motherboards', 'motherboards', 'ATX, Micro-ATX and Mini-ITX motherboards for Intel and AMD platforms, from entry-level to enthusiast RGB boards.', '/products/motherboards.svg'),
  ('Graphics Cards (GPU)', 'graphics-cards-gpu', 'NVIDIA and AMD graphics cards for 1080p esports to 4K gaming, rendering and AI workloads, with a range of VRAM options.', '/products/graphics-cards-gpu.svg'),
  ('RAM', 'ram', 'DDR4 and DDR5 memory kits from 8GB to 64GB, with speeds tuned for gaming, multitasking and content creation.', '/products/ram.svg'),
  ('Storage', 'storage', 'NVMe and SATA SSDs plus high-capacity HDDs for fast boot drives and bulk media storage.', '/products/storage.svg'),
  ('Power Supplies (PSU)', 'power-supplies', 'Reliable 80+ Bronze and Gold power supplies from 550W to 850W to keep your build stable under load.', '/products/power-supplies.svg'),
  ('Cooling', 'cooling', 'Air coolers and AIO liquid coolers with quiet fans and ARGB lighting options for any CPU.', '/products/cooling.svg'),
  ('PC Cases', 'pc-cases', 'Mid-tower and full-tower gaming cases with tempered glass panels, airflow-focused designs and clean cable management.', '/products/pc-cases.svg'),
  ('Monitors', 'monitors', 'IPS and VA monitors from 24 to 27 inches, including high-refresh gaming panels and budget productivity displays.', '/products/monitors.svg'),
  ('Peripherals', 'peripherals', 'Gaming mice, mechanical keyboards, headsets and speakers to complete your setup.', '/products/peripherals.svg');

-- ------------------------------------------------------------
-- BRANDS
-- ------------------------------------------------------------
INSERT IGNORE INTO brands (name, slug) VALUES
  ('Intel', 'intel'), ('AMD', 'amd'), ('NVIDIA', 'nvidia'), ('MSI', 'msi'),
  ('Gigabyte', 'gigabyte'), ('ASUS', 'asus'), ('Zotac', 'zotac'), ('Palit', 'palit'),
  ('Inno3D', 'inno3d'), ('Sapphire', 'sapphire'), ('ASRock', 'asrock'), ('Corsair', 'corsair'),
  ('Kingston', 'kingston'), ('Crucial', 'crucial'), ('G.Skill', 'gskill'), ('Samsung', 'samsung'),
  ('WD', 'wd'), ('Seagate', 'seagate'), ('Cooler Master', 'cooler-master'), ('Deepcool', 'deepcool'),
  ('Ant Esports', 'ant-esports'), ('NZXT', 'nzxt'), ('LG', 'lg'), ('Acer', 'acer'),
  ('Logitech', 'logitech'), ('Razer', 'razer'), ('Redragon', 'redragon');

-- ------------------------------------------------------------
-- PRODUCTS — Processors (CPU)
-- ------------------------------------------------------------
INSERT IGNORE INTO products
  (name, slug, brand, category, price, old_price, discount, image, description, specifications, facets, stock, rating, review_count, featured, popular)
VALUES
  ('Intel Core i5-12400F 6-Core Processor', 'intel-core-i5-12400f', 'Intel', 'Processors (CPU)', 13499.00, 15999.00, 16.00, '/products/processors.svg',
   'A six-core Alder Lake processor with excellent single-thread performance, ideal for 1080p gaming and everyday productivity builds.',
   '["6 Cores / 12 Threads","4.4 GHz Turbo","LGA 1700","65W TDP"]', JSON_OBJECT('chipset', 'Intel', 'socket', 'LGA 1700', 'cores', '6'), 14, 4.5, 128, 1, 1),
  ('Intel Core i5-13400F 10-Core Processor', 'intel-core-i5-13400f', 'Intel', 'Processors (CPU)', 17499.00, 19999.00, 13.00, '/products/processors.svg',
   'A hybrid 10-core Raptor Lake CPU that balances gaming performance and multi-threaded workloads at a sweet-spot price.',
   '["10 Cores / 16 Threads","4.6 GHz Turbo","LGA 1700","65W TDP"]', JSON_OBJECT('chipset', 'Intel', 'socket', 'LGA 1700', 'cores', '10'), 12, 4.6, 96, 1, 1),
  ('Intel Core i7-13700K 16-Core Processor', 'intel-core-i7-13700k', 'Intel', 'Processors (CPU)', 35999.00, 39999.00, 10.00, '/products/processors.svg',
   'A 16-core unlocked Raptor Lake flagship for high-refresh gaming and heavy productivity, ready for overclocking on Z790 boards.',
   '["16 Cores / 24 Threads","5.4 GHz Turbo","LGA 1700","125W TDP"]', JSON_OBJECT('chipset', 'Intel', 'socket', 'LGA 1700', 'cores', '16'), 9, 4.8, 154, 0, 1),
  ('Intel Core i9-14900K 24-Core Processor', 'intel-core-i9-14900k', 'Intel', 'Processors (CPU)', 52999.00, 56999.00, 7.00, '/products/processors.svg',
   'Intel''s top desktop CPU with 24 cores for uncompromised gaming, streaming and creative workloads.',
   '["24 Cores / 32 Threads","6.0 GHz Turbo","LGA 1700","125W TDP"]', JSON_OBJECT('chipset', 'Intel', 'socket', 'LGA 1700', 'cores', '24'), 6, 4.9, 87, 0, 1),
  ('AMD Ryzen 5 5600 6-Core Processor', 'amd-ryzen-5-5600', 'AMD', 'Processors (CPU)', 11999.00, 13499.00, 11.00, '/products/processors.svg',
   'A value champion on the AM4 platform, delivering strong 1080p gaming frames with low power draw.',
   '["6 Cores / 12 Threads","4.4 GHz Boost","AM4","65W TDP"]', JSON_OBJECT('chipset', 'AMD', 'socket', 'AM4', 'cores', '6'), 18, 4.6, 210, 1, 1),
  ('AMD Ryzen 5 7600 6-Core Processor', 'amd-ryzen-5-7600', 'AMD', 'Processors (CPU)', 19499.00, 22999.00, 15.00, '/products/processors.svg',
   'A Zen 4 six-core on the AM5 platform with fast DDR5 support and great all-round gaming performance.',
   '["6 Cores / 12 Threads","5.1 GHz Boost","AM5","65W TDP"]', JSON_OBJECT('chipset', 'AMD', 'socket', 'AM5', 'cores', '6'), 11, 4.7, 74, 0, 1),
  ('AMD Ryzen 7 7800X3D 8-Core Processor', 'amd-ryzen-7-7800x3d', 'AMD', 'Processors (CPU)', 42999.00, 46999.00, 9.00, '/products/processors.svg',
   'The 3D V-Cache gaming king — the fastest mainstream gaming CPU for simulation and esports titles.',
   '["8 Cores / 16 Threads","5.0 GHz Boost","AM5","120W TDP"]', JSON_OBJECT('chipset', 'AMD', 'socket', 'AM5', 'cores', '8'), 8, 4.9, 132, 1, 1),
  ('AMD Ryzen 9 7950X 16-Core Processor', 'amd-ryzen-9-7950x', 'AMD', 'Processors (CPU)', 54999.00, 59999.00, 8.00, '/products/processors.svg',
   'A 16-core Zen 4 flagship built for creators, rendering and heavy multi-threaded workloads.',
   '["16 Cores / 32 Threads","5.7 GHz Boost","AM5","170W TDP"]', JSON_OBJECT('chipset', 'AMD', 'socket', 'AM5', 'cores', '16'), 5, 4.8, 63, 0, 0);

-- ------------------------------------------------------------
-- PRODUCTS — Graphics Cards (GPU)
-- ------------------------------------------------------------
INSERT IGNORE INTO products
  (name, slug, brand, category, price, old_price, discount, image, description, specifications, facets, stock, rating, review_count, featured, popular)
VALUES
  ('MSI GeForce RTX 4060 Ventus 2X 8GB GDDR6', 'msi-geforce-rtx-4060-ventus-2x', 'MSI', 'Graphics Cards (GPU)', 34999.00, 37999.00, 8.00, '/products/graphics-cards-gpu.svg',
   'A compact dual-fan RTX 4060 with DLSS 3 frame generation for smooth 1080p and 1440p gaming.',
   '["8GB GDDR6","128-bit","DLSS 3","2 Fans"]', JSON_OBJECT('chipset', 'NVIDIA', 'vram', '8GB'), 12, 4.5, 98, 1, 1),
  ('Gigabyte GeForce RTX 4060 Eagle 8GB GDDR6', 'gigabyte-rtx-4060-eagle', 'Gigabyte', 'Graphics Cards (GPU)', 33499.00, 36999.00, 9.00, '/products/graphics-cards-gpu.svg',
   'A great-value RTX 4060 with a robust triple-fan Windforce cooler.',
   '["8GB GDDR6","128-bit","DLSS 3","Windforce"]', JSON_OBJECT('chipset', 'NVIDIA', 'vram', '8GB'), 15, 4.4, 76, 1, 1),
  ('ASUS Dual GeForce RTX 4060 8GB GDDR6', 'asus-dual-rtx-4060', 'ASUS', 'Graphics Cards (GPU)', 34499.00, 38999.00, 11.00, '/products/graphics-cards-gpu.svg',
   'ASUS Dual RTX 4060 with Axial-tech fans and a low-profile design for most builds.',
   '["8GB GDDR6","128-bit","DLSS 3","2 Fans"]', JSON_OBJECT('chipset', 'NVIDIA', 'vram', '8GB'), 10, 4.5, 61, 0, 1),
  ('Zotac Gaming GeForce RTX 4060 Twin Edge 8GB', 'zotac-rtx-4060-twin-edge', 'Zotac', 'Graphics Cards (GPU)', 32999.00, 36499.00, 10.00, '/products/graphics-cards-gpu.svg',
   'A space-efficient dual-slot RTX 4060 ideal for small form factor gaming rigs.',
   '["8GB GDDR6","128-bit","DLSS 3","2 Fans"]', JSON_OBJECT('chipset', 'NVIDIA', 'vram', '8GB'), 9, 4.3, 44, 0, 1),
  ('Palit GeForce RTX 4060 Dual 8GB GDDR6', 'palit-rtx-4060-dual', 'Palit', 'Graphics Cards (GPU)', 32499.00, 35999.00, 10.00, '/products/graphics-cards-gpu.svg',
   'Reliable dual-fan RTX 4060 with DLSS 3 support at an aggressive price.',
   '["8GB GDDR6","128-bit","DLSS 3","2 Fans"]', JSON_OBJECT('chipset', 'NVIDIA', 'vram', '8GB'), 13, 4.4, 38, 0, 1),
  ('Inno3D GeForce RTX 4060 Twin X2 8GB GDDR6', 'inno3d-rtx-4060-twin-x2', 'Inno3D', 'Graphics Cards (GPU)', 31999.00, 35499.00, 10.00, '/products/graphics-cards-gpu.svg',
   'A no-frills dual-fan RTX 4060 that keeps 1080p esports and AAA gaming fast and cool.',
   '["8GB GDDR6","128-bit","DLSS 3","2 Fans"]', JSON_OBJECT('chipset', 'NVIDIA', 'vram', '8GB'), 11, 4.3, 29, 0, 0),
  ('ASUS TUF Gaming GeForce RTX 4060 8GB GDDR6', 'asus-tuf-rtx-4060', 'ASUS', 'Graphics Cards (GPU)', 36999.00, NULL, NULL, '/products/graphics-cards-gpu.svg',
   'Military-grade TUF design with triple fans for quieter, cooler RTX 4060 performance.',
   '["8GB GDDR6","128-bit","DLSS 3","3 Fans"]', JSON_OBJECT('chipset', 'NVIDIA', 'vram', '8GB'), 7, 4.6, 52, 0, 1),
  ('Gigabyte RTX 4060 Gaming OC 8GB GDDR6', 'gigabyte-rtx-4060-gaming-oc', 'Gigabyte', 'Graphics Cards (GPU)', 38499.00, 42999.00, 10.00, '/products/graphics-cards-gpu.svg',
   'Factory overclocked RTX 4060 with Windforce cooling and RGB Fusion lighting.',
   '["8GB GDDR6","128-bit","DLSS 3","RGB"]', JSON_OBJECT('chipset', 'NVIDIA', 'vram', '8GB'), 8, 4.5, 41, 0, 1),
  ('MSI GeForce RTX 4060 Ti Gaming X 8GB GDDR6', 'msi-rtx-4060-ti-gaming-x', 'MSI', 'Graphics Cards (GPU)', 44999.00, 48999.00, 8.00, '/products/graphics-cards-gpu.svg',
   'RTX 4060 Ti with a large Twin Frozr cooler for quiet high-refresh 1080p and smooth 1440p play.',
   '["8GB GDDR6","128-bit","DLSS 3","Twin Frozr"]', JSON_OBJECT('chipset', 'NVIDIA', 'vram', '8GB'), 9, 4.6, 71, 1, 1),
  ('MSI GeForce RTX 4070 Ventus 2X 12GB GDDR6', 'msi-rtx-4070-ventus-2x', 'MSI', 'Graphics Cards (GPU)', 59999.00, 64999.00, 8.00, '/products/graphics-cards-gpu.svg',
   'A 12GB RTX 4070 that crushes 1440p gaming with DLSS 3 and excellent efficiency.',
   '["12GB GDDR6","192-bit","DLSS 3"]', JSON_OBJECT('chipset', 'NVIDIA', 'vram', '12GB'), 6, 4.8, 88, 1, 1),
  ('Sapphire Pulse Radeon RX 7600 8GB GDDR6', 'sapphire-pulse-rx-7600', 'Sapphire', 'Graphics Cards (GPU)', 26999.00, 29999.00, 10.00, '/products/graphics-cards-gpu.svg',
   'AMD''s RX 7600 with dual fans delivers strong 1080p performance with a compact dual-slot build.',
   '["8GB GDDR6","128-bit","FSR 3","2 Fans"]', JSON_OBJECT('chipset', 'AMD', 'vram', '8GB'), 10, 4.4, 57, 0, 1),
  ('ASRock Radeon RX 7600 8GB GDDR6', 'asrock-rx-7600', 'ASRock', 'Graphics Cards (GPU)', 25999.00, 28499.00, 9.00, '/products/graphics-cards-gpu.svg',
   'A 1080p-focused Radeon RX 7600 with FSR 3 support and quiet dual fans.',
   '["8GB GDDR6","128-bit","FSR 3","2 Fans"]', JSON_OBJECT('chipset', 'AMD', 'vram', '8GB'), 12, 4.3, 33, 0, 0);

-- ------------------------------------------------------------
-- PRODUCTS — Motherboards
-- ------------------------------------------------------------
INSERT IGNORE INTO products
  (name, slug, brand, category, price, old_price, discount, image, description, specifications, facets, stock, rating, review_count, featured, popular)
VALUES
  ('MSI PRO B760M-A WiFi DDR4 Motherboard', 'msi-pro-b760m-a-wifi', 'MSI', 'Motherboards', 15999.00, 17999.00, 11.00, '/products/motherboards.svg',
   'Micro-ATX board for 12th/13th/14th gen Intel with built-in WiFi 6 and DDR4 support.',
   '["LGA 1700","DDR4","WiFi 6","Micro ATX"]', JSON_OBJECT('chipset', 'Intel', 'socket', 'LGA 1700', 'dimm', 'DDR4', 'form_factor', 'Micro ATX'), 10, 4.5, 49, 1, 1),
  ('ASUS TUF Gaming B760-Plus WiFi D4 Motherboard', 'asus-tuf-b760-plus-wifi', 'ASUS', 'Motherboards', 19999.00, 22499.00, 11.00, '/products/motherboards.svg',
   'ATX TUF board with military-grade durability, WiFi 6 and robust VRM cooling.',
   '["LGA 1700","DDR4","WiFi 6","ATX"]', JSON_OBJECT('chipset', 'Intel', 'socket', 'LGA 1700', 'dimm', 'DDR4', 'form_factor', 'ATX'), 8, 4.6, 42, 1, 1),
  ('Gigabyte B760M DS3H AX Motherboard', 'gigabyte-b760m-ds3h-ax', 'Gigabyte', 'Motherboards', 14499.00, 16499.00, 12.00, '/products/motherboards.svg',
   'Affordable Micro-ATX board for Intel LGA 1700 with DDR5 support and WiFi.',
   '["LGA 1700","DDR5","WiFi","Micro ATX"]', JSON_OBJECT('chipset', 'Intel', 'socket', 'LGA 1700', 'dimm', 'DDR5', 'form_factor', 'Micro ATX'), 13, 4.4, 37, 0, 1),
  ('MSI MAG B650 Tomahawk WiFi Motherboard', 'msi-mag-b650-tomahawk-wifi', 'MSI', 'Motherboards', 24999.00, 27999.00, 11.00, '/products/motherboards.svg',
   'Enthusiast AMD AM5 board with PCIe 5.0, DDR5 and premium audio for Ryzen 7000 builds.',
   '["AM5","DDR5","PCIe 5.0","ATX"]', JSON_OBJECT('chipset', 'AMD', 'socket', 'AM5', 'dimm', 'DDR5', 'form_factor', 'ATX'), 7, 4.7, 58, 1, 1),
  ('ASUS ROG Strix B650E-F Gaming WiFi Motherboard', 'asus-rog-strix-b650e-f', 'ASUS', 'Motherboards', 28999.00, 32999.00, 12.00, '/products/motherboards.svg',
   'ROG Strix AM5 board with PCIe 5.0, powerful power delivery and comprehensive connectivity.',
   '["AM5","DDR5","PCIe 5.0","ATX"]', JSON_OBJECT('chipset', 'AMD', 'socket', 'AM5', 'dimm', 'DDR5', 'form_factor', 'ATX'), 6, 4.8, 46, 0, 1),
  ('Gigabyte B550M Aorus Elite Motherboard', 'gigabyte-b550m-aorus-elite', 'Gigabyte', 'Motherboards', 12499.00, 13999.00, 11.00, '/products/motherboards.svg',
   'Reliable Micro-ATX B550 board for AMD Ryzen 5000 with PCIe 4.0 support.',
   '["AM4","DDR4","PCIe 4.0","Micro ATX"]', JSON_OBJECT('chipset', 'AMD', 'socket', 'AM4', 'dimm', 'DDR4', 'form_factor', 'Micro ATX'), 11, 4.5, 63, 0, 1),
  ('ASRock B450M Pro4 Motherboard', 'asrock-b450m-pro4', 'ASRock', 'Motherboards', 7499.00, 8499.00, 12.00, '/products/motherboards.svg',
   'Budget Micro-ATX board for AM4 Ryzen CPUs with two M.2 slots and solid I/O.',
   '["AM4","DDR4","M.2 x2","Micro ATX"]', JSON_OBJECT('chipset', 'AMD', 'socket', 'AM4', 'dimm', 'DDR4', 'form_factor', 'Micro ATX'), 16, 4.3, 84, 0, 1),
  ('MSI PRO Z790-P WiFi Motherboard', 'msi-pro-z790-p-wifi', 'MSI', 'Motherboards', 26999.00, 29999.00, 10.00, '/products/motherboards.svg',
   'Full-size ATX Z790 board for unlocked Intel CPUs with DDR5 and PCIe 5.0 readiness.',
   '["LGA 1700","DDR5","PCIe 5.0","ATX"]', JSON_OBJECT('chipset', 'Intel', 'socket', 'LGA 1700', 'dimm', 'DDR5', 'form_factor', 'ATX'), 8, 4.6, 39, 0, 1);

-- ------------------------------------------------------------
-- PRODUCTS — RAM
-- ------------------------------------------------------------
INSERT IGNORE INTO products
  (name, slug, brand, category, price, old_price, discount, image, description, specifications, facets, stock, rating, review_count, featured, popular)
VALUES
  ('Corsair Vengeance LPX 8GB DDR4 3200MHz', 'corsair-vengeance-lpx-8gb-ddr4', 'Corsair', 'RAM', 2899.00, 3199.00, 9.00, '/products/ram.svg',
   'A reliable single-stick 8GB DDR4 kit for budget builds and memory upgrades.',
   '["8GB","DDR4","3200MHz","CL16"]', JSON_OBJECT('dimm', 'DDR4', 'capacity', '8GB', 'speed', '3200MHz'), 24, 4.4, 96, 0, 1),
  ('Corsair Vengeance LPX 16GB DDR4 3200MHz', 'corsair-vengeance-lpx-16gb-ddr4', 'Corsair', 'RAM', 5299.00, 5999.00, 12.00, '/products/ram.svg',
   'The classic 16GB DDR4 kit — proven performance for gaming and multitasking.',
   '["16GB","DDR4","3200MHz","CL16"]', JSON_OBJECT('dimm', 'DDR4', 'capacity', '16GB', 'speed', '3200MHz'), 20, 4.6, 118, 1, 1),
  ('G.Skill Ripjaws V 16GB DDR4 3600MHz', 'gskill-ripjaws-v-16gb-ddr4', 'G.Skill', 'RAM', 5499.00, 6299.00, 13.00, '/products/ram.svg',
   'High-frequency DDR4 tuned for AMD and Intel platforms with tight CL18 timings.',
   '["16GB","DDR4","3600MHz","CL18"]', JSON_OBJECT('dimm', 'DDR4', 'capacity', '16GB', 'speed', '3600MHz'), 14, 4.7, 71, 0, 1),
  ('Kingston Fury Beast 16GB DDR5 5600MHz', 'kingston-fury-beast-16gb-ddr5', 'Kingston', 'RAM', 5899.00, 6499.00, 9.00, '/products/ram.svg',
   'Entry DDR5 kit for AM5 and Intel LGA 1700 platforms with plug-and-play 5600MHz.',
   '["16GB","DDR5","5600MHz","Plug-n-Play"]', JSON_OBJECT('dimm', 'DDR5', 'capacity', '16GB', 'speed', '5600MHz'), 18, 4.5, 52, 1, 1),
  ('Kingston Fury Beast 32GB DDR5 6000MHz', 'kingston-fury-beast-32gb-ddr5', 'Kingston', 'RAM', 11499.00, 12999.00, 12.00, '/products/ram.svg',
   'Fast 32GB DDR5 kit with XMP 3.0 profiles for high-refresh gaming and creative work.',
   '["32GB","DDR5","6000MHz","XMP 3.0"]', JSON_OBJECT('dimm', 'DDR5', 'capacity', '32GB', 'speed', '6000MHz'), 12, 4.7, 68, 1, 1),
  ('Corsair Vengeance RGB 32GB DDR5 6000MHz', 'corsair-vengeance-rgb-32gb-ddr5', 'Corsair', 'RAM', 13499.00, 15499.00, 13.00, '/products/ram.svg',
   'RGB-lit DDR5 kit with dynamic iCUE lighting and 6000MHz performance.',
   '["32GB","DDR5","6000MHz","RGB"]', JSON_OBJECT('dimm', 'DDR5', 'capacity', '32GB', 'speed', '6000MHz', 'rgb', 1), 10, 4.8, 74, 0, 1),
  ('Crucial 16GB DDR4 3200MHz', 'crucial-16gb-ddr4', 'Crucial', 'RAM', 4999.00, 5699.00, 12.00, '/products/ram.svg',
   'Dependable micron-made DDR4 for office and gaming builds alike.',
   '["16GB","DDR4","3200MHz","CL22"]', JSON_OBJECT('dimm', 'DDR4', 'capacity', '16GB', 'speed', '3200MHz'), 22, 4.4, 57, 0, 0),
  ('G.Skill Trident Z5 RGB 32GB DDR5 6400MHz', 'gskill-trident-z5-rgb-32gb-ddr5', 'G.Skill', 'RAM', 16999.00, 19499.00, 13.00, '/products/ram.svg',
   'Enthusiast 6400MHz DDR5 with striking RGB for top-tier AM5 builds.',
   '["32GB","DDR5","6400MHz","RGB"]', JSON_OBJECT('dimm', 'DDR5', 'capacity', '32GB', 'speed', '6400MHz', 'rgb', 1), 7, 4.8, 46, 0, 1);

-- ------------------------------------------------------------
-- PRODUCTS — Storage
-- ------------------------------------------------------------
INSERT IGNORE INTO products
  (name, slug, brand, category, price, old_price, discount, image, description, specifications, facets, stock, rating, review_count, featured, popular)
VALUES
  ('Samsung 980 500GB NVMe M.2 SSD', 'samsung-980-500gb', 'Samsung', 'Storage', 4499.00, 4999.00, 10.00, '/products/storage.svg',
   'Fast PCIe 3.0 NVMe SSD with 3,500 MB/s reads — a great boot drive.',
   '["500GB","NVMe PCIe 3.0","3500 MB/s"]', JSON_OBJECT('storage_type', 'SSD', 'capacity', '500GB', 'form_factor', 'M.2 NVMe'), 16, 4.6, 88, 1, 1),
  ('Samsung 980 1TB NVMe M.2 SSD', 'samsung-980-1tb', 'Samsung', 'Storage', 7999.00, 8999.00, 11.00, '/products/storage.svg',
   '1TB NVMe storage for games, apps and OS with excellent sustained performance.',
   '["1TB","NVMe PCIe 3.0","3500 MB/s"]', JSON_OBJECT('storage_type', 'SSD', 'capacity', '1TB', 'form_factor', 'M.2 NVMe'), 14, 4.7, 121, 1, 1),
  ('WD Blue SN570 500GB NVMe SSD', 'wd-blue-sn570-500gb', 'WD', 'Storage', 3999.00, 4499.00, 11.00, '/products/storage.svg',
   'Budget-friendly NVMe with 3,500 MB/s reads from Western Digital.',
   '["500GB","NVMe PCIe 3.0","3500 MB/s"]', JSON_OBJECT('storage_type', 'SSD', 'capacity', '500GB', 'form_factor', 'M.2 NVMe'), 19, 4.5, 74, 0, 1),
  ('WD Blue SN570 1TB NVMe SSD', 'wd-blue-sn570-1tb', 'WD', 'Storage', 6999.00, 7999.00, 13.00, '/products/storage.svg',
   'A reliable 1TB NVMe drive that balances price and daily performance.',
   '["1TB","NVMe PCIe 3.0","3500 MB/s"]', JSON_OBJECT('storage_type', 'SSD', 'capacity', '1TB', 'form_factor', 'M.2 NVMe'), 15, 4.6, 92, 1, 1),
  ('Crucial P3 Plus 1TB NVMe PCIe 4.0 SSD', 'crucial-p3-plus-1tb', 'Crucial', 'Storage', 7499.00, 8499.00, 12.00, '/products/storage.svg',
   'PCIe 4.0 NVMe with up to 5,000 MB/s — a speed bump for modern mainboards.',
   '["1TB","NVMe PCIe 4.0","5000 MB/s"]', JSON_OBJECT('storage_type', 'SSD', 'capacity', '1TB', 'form_factor', 'M.2 NVMe'), 13, 4.6, 85, 0, 1),
  ('Kingston NV2 1TB NVMe SSD', 'kingston-nv2-1tb', 'Kingston', 'Storage', 6499.00, 7299.00, 11.00, '/products/storage.svg',
   'An affordable single-sided NVMe drive ideal for laptops and desktops.',
   '["1TB","NVMe PCIe 4.0","3500 MB/s"]', JSON_OBJECT('storage_type', 'SSD', 'capacity', '1TB', 'form_factor', 'M.2 NVMe'), 21, 4.4, 66, 0, 1),
  ('Crucial BX500 1TB SATA SSD', 'crucial-bx500-1tb', 'Crucial', 'Storage', 5999.00, 6999.00, 14.00, '/products/storage.svg',
   'A dependable 2.5-inch SATA SSD for older systems and bulk storage.',
   '["1TB","SATA III","540 MB/s"]', JSON_OBJECT('storage_type', 'SSD', 'capacity', '1TB', 'form_factor', '2.5" SATA'), 17, 4.4, 59, 0, 0),
  ('WD Blue 1TB HDD', 'wd-blue-1tb-hdd', 'WD', 'Storage', 4299.00, 4899.00, 12.00, '/products/storage.svg',
   'Classic 7,200 RPM hard drive for media and backup storage.',
   '["1TB","7200 RPM","SATA III"]', JSON_OBJECT('storage_type', 'HDD', 'capacity', '1TB', 'form_factor', '3.5" HDD'), 23, 4.2, 48, 0, 0),
  ('Seagate Barracuda 1TB HDD', 'seagate-barracuda-1tb', 'Seagate', 'Storage', 3999.00, 4499.00, 11.00, '/products/storage.svg',
   'The dependable Barracuda 1TB for everyday storage needs.',
   '["1TB","7200 RPM","SATA III"]', JSON_OBJECT('storage_type', 'HDD', 'capacity', '1TB', 'form_factor', '3.5" HDD'), 26, 4.3, 54, 0, 0),
  ('Seagate Barracuda 2TB HDD', 'seagate-barracuda-2tb', 'Seagate', 'Storage', 5999.00, 6799.00, 12.00, '/products/storage.svg',
   '2TB of reliable spinning storage perfect for games and archives.',
   '["2TB","7200 RPM","SATA III"]', JSON_OBJECT('storage_type', 'HDD', 'capacity', '2TB', 'form_factor', '3.5" HDD'), 18, 4.4, 61, 0, 1);

-- ------------------------------------------------------------
-- PRODUCTS — Power Supplies (PSU)
-- ------------------------------------------------------------
INSERT IGNORE INTO products
  (name, slug, brand, category, price, old_price, discount, image, description, specifications, facets, stock, rating, review_count, featured, popular)
VALUES
  ('Corsair CV550 550W 80+ Bronze PSU', 'corsair-cv550', 'Corsair', 'Power Supplies (PSU)', 3999.00, 4499.00, 11.00, '/products/power-supplies.svg',
   'A quiet 550W 80+ Bronze unit with 120mm fan, ideal for mainstream builds.',
   '["550W","80+ Bronze","120mm Fan"]', JSON_OBJECT('wattage', '550W', 'certification', '80+ Bronze'), 15, 4.5, 77, 1, 1),
  ('Corsair CV650 650W 80+ Bronze PSU', 'corsair-cv650', 'Corsair', 'Power Supplies (PSU)', 4799.00, 5499.00, 13.00, '/products/power-supplies.svg',
   '650W of reliable 80+ Bronze power with room for mid-range GPU upgrades.',
   '["650W","80+ Bronze","120mm Fan"]', JSON_OBJECT('wattage', '650W', 'certification', '80+ Bronze'), 12, 4.5, 69, 1, 1),
  ('Cooler Master MWE 650 V2 80+ Bronze PSU', 'cooler-master-mwe-650-v2', 'Cooler Master', 'Power Supplies (PSU)', 5299.00, 5999.00, 12.00, '/products/power-supplies.svg',
   'A proven 650W Bronze PSU with a 120mm HDB fan for quiet operation.',
   '["650W","80+ Bronze","120mm Fan"]', JSON_OBJECT('wattage', '650W', 'certification', '80+ Bronze'), 14, 4.5, 63, 0, 1),
  ('Cooler Master MWE 750 V2 80+ Bronze PSU', 'cooler-master-mwe-750-v2', 'Cooler Master', 'Power Supplies (PSU)', 5999.00, 6799.00, 12.00, '/products/power-supplies.svg',
   '750W Bronze power suitable for RTX 4070-class GPUs and gaming rigs.',
   '["750W","80+ Bronze","120mm Fan"]', JSON_OBJECT('wattage', '750W', 'certification', '80+ Bronze'), 10, 4.6, 71, 1, 1),
  ('MSI MAG A550BN 550W PSU', 'msi-mag-a550bn', 'MSI', 'Power Supplies (PSU)', 3699.00, 4199.00, 12.00, '/products/power-supplies.svg',
   'Compact and quiet 550W Bronze PSU from MSI for everyday builds.',
   '["550W","80+ Bronze","120mm Fan"]', JSON_OBJECT('wattage', '550W', 'certification', '80+ Bronze'), 16, 4.4, 47, 0, 1),
  ('MSI MPG A650GF 650W 80+ Gold PSU', 'msi-mpg-a650gf', 'MSI', 'Power Supplies (PSU)', 8999.00, 10499.00, 14.00, '/products/power-supplies.svg',
   'Fully modular 650W Gold PSU with premium all-Japanese capacitors.',
   '["650W","80+ Gold","Modular"]', JSON_OBJECT('wattage', '650W', 'certification', '80+ Gold', 'modular', 1), 9, 4.7, 55, 1, 1),
  ('Ant Esports VS600L 600W PSU', 'ant-esports-vs600l', 'Ant Esports', 'Power Supplies (PSU)', 2499.00, 2899.00, 14.00, '/products/power-supplies.svg',
   'An entry-level 600W unit for budget office and gaming systems.',
   '["600W","Standard","120mm Fan"]', JSON_OBJECT('wattage', '600W'), 22, 4.1, 38, 0, 0),
  ('Corsair RM750x 750W 80+ Gold PSU', 'corsair-rm750x', 'Corsair', 'Power Supplies (PSU)', 12999.00, 14999.00, 13.00, '/products/power-supplies.svg',
   'Fully modular, zero-RPM 750W Gold PSU — a premium choice for high-end builds.',
   '["750W","80+ Gold","Modular","Zero RPM"]', JSON_OBJECT('wattage', '750W', 'certification', '80+ Gold', 'modular', 1), 8, 4.8, 92, 1, 1);

-- ------------------------------------------------------------
-- PRODUCTS — Cooling
-- ------------------------------------------------------------
INSERT IGNORE INTO products
  (name, slug, brand, category, price, old_price, discount, image, description, specifications, facets, stock, rating, review_count, featured, popular)
VALUES
  ('Deepcool AK400 Air Cooler', 'deepcool-ak400', 'Deepcool', 'Cooling', 2499.00, 2899.00, 14.00, '/products/cooling.svg',
   'A single-tower 120mm air cooler handling up to 220W TDP quietly.',
   '["120mm","Air Cooler","220W TDP"]', JSON_OBJECT('type', 'Air Cooler', 'size', '120mm', 'rgb', 0), 18, 4.6, 84, 1, 1),
  ('Deepcool AG400 ARGB Air Cooler', 'deepcool-ag400-argb', 'Deepcool', 'Cooling', 2899.00, 3399.00, 15.00, '/products/cooling.svg',
   '120mm ARGB tower cooler with great value and a bright RGB fan.',
   '["120mm","Air Cooler","ARGB"]', JSON_OBJECT('type', 'Air Cooler', 'size', '120mm', 'rgb', 1), 16, 4.6, 73, 0, 1),
  ('Cooler Master Hyper 212 Black Edition', 'cooler-master-hyper-212-black', 'Cooler Master', 'Cooling', 3499.00, 3999.00, 13.00, '/products/cooling.svg',
   'The legendary Hyper 212 tower cooler in an all-black finish.',
   '["120mm","Air Cooler","4 Heatpipes"]', JSON_OBJECT('type', 'Air Cooler', 'size', '120mm', 'rgb', 0), 14, 4.5, 91, 1, 1),
  ('Ant Esports ICE-C612 Air Cooler', 'ant-esports-ice-c612', 'Ant Esports', 'Cooling', 1999.00, 2399.00, 17.00, '/products/cooling.svg',
   'A budget 120mm tower cooler with heatpipes for entry gaming builds.',
   '["120mm","Air Cooler","4 Heatpipes"]', JSON_OBJECT('type', 'Air Cooler', 'size', '120mm', 'rgb', 0), 20, 4.3, 41, 0, 0),
  ('Deepcool LE500 240mm AIO Liquid Cooler', 'deepcool-le500-240mm', 'Deepcool', 'Cooling', 6499.00, 7499.00, 13.00, '/products/cooling.svg',
   'A 240mm all-in-one liquid cooler with ARGB fans and a clean white design.',
   '["240mm","AIO","ARGB"]', JSON_OBJECT('type', 'AIO', 'size', '240mm', 'rgb', 1), 12, 4.6, 62, 1, 1),
  ('Corsair iCUE H100i Elite 240mm AIO', 'corsair-icue-h100i-elite-240mm', 'Corsair', 'Cooling', 13499.00, 15999.00, 16.00, '/products/cooling.svg',
   'A premium 240mm AIO with iCUE-controlled RGB pump and fans.',
   '["240mm","AIO","iCUE RGB"]', JSON_OBJECT('type', 'AIO', 'size', '240mm', 'rgb', 1), 9, 4.8, 69, 1, 1),
  ('NZXT Kraken 360 RGB 360mm AIO', 'nzxt-kraken-360', 'NZXT', 'Cooling', 17999.00, 20999.00, 14.00, '/products/cooling.svg',
   'Flagship 360mm AIO with a customisable LCD display for enthusiast rigs.',
   '["360mm","AIO","LCD Display"]', JSON_OBJECT('type', 'AIO', 'size', '360mm', 'rgb', 1), 6, 4.9, 47, 0, 1),
  ('Ant Esports ICE-C620 120mm Cooler', 'ant-esports-ice-c620', 'Ant Esports', 'Cooling', 1499.00, 1799.00, 17.00, '/products/cooling.svg',
   'A compact 120mm cooler for basic office and light gaming builds.',
   '["120mm","Air Cooler","3 Heatpipes"]', JSON_OBJECT('type', 'Air Cooler', 'size', '120mm', 'rgb', 0), 19, 4.2, 33, 0, 0);

-- ------------------------------------------------------------
-- PRODUCTS — PC Cases
-- ------------------------------------------------------------
INSERT IGNORE INTO products
  (name, slug, brand, category, price, old_price, discount, image, description, specifications, facets, stock, rating, review_count, featured, popular)
VALUES
  ('NZXT H5 Flow Mid Tower Case', 'nzxt-h5-flow', 'NZXT', 'PC Cases', 8499.00, 9999.00, 15.00, '/products/pc-cases.svg',
   'A clean mid-tower with an angled airflow intake and tempered glass side panel.',
   '["Mid Tower","Tempered Glass","ATX"]', JSON_OBJECT('form_factor', 'Mid Tower', 'side_panel', 'Tempered Glass'), 10, 4.7, 66, 1, 1),
  ('Corsair 4000D Airflow Mid Tower Case', 'corsair-4000d-airflow', 'Corsair', 'PC Cases', 9499.00, 10999.00, 14.00, '/products/pc-cases.svg',
   'The classic airflow-focused mid tower with superb build quality.',
   '["Mid Tower","Mesh Front","ATX"]', JSON_OBJECT('form_factor', 'Mid Tower', 'side_panel', 'Tempered Glass'), 9, 4.8, 97, 1, 1),
  ('Cooler Master MasterBox MB311 ARGB', 'cooler-master-mb311-argb', 'Cooler Master', 'PC Cases', 5499.00, 6299.00, 13.00, '/products/pc-cases.svg',
   'A compact Micro-ATX case with dual ARGB fans and a glass side panel.',
   '["Micro ATX","ARGB","Tempered Glass"]', JSON_OBJECT('form_factor', 'Micro ATX', 'side_panel', 'Tempered Glass', 'rgb', 1), 14, 4.5, 58, 1, 1),
  ('Cooler Master MasterBox K501L', 'cooler-master-k501l', 'Cooler Master', 'PC Cases', 4299.00, 4999.00, 14.00, '/products/pc-cases.svg',
   'A budget mid tower with RGB front intake and mesh airflow.',
   '["Mid Tower","RGB Front","ATX"]', JSON_OBJECT('form_factor', 'Mid Tower', 'side_panel', 'Tempered Glass', 'rgb', 1), 13, 4.4, 71, 0, 1),
  ('Ant Esports ICE-311MT Mid Tower Case', 'ant-esports-ice-311mt', 'Ant Esports', 'PC Cases', 2499.00, 2999.00, 17.00, '/products/pc-cases.svg',
   'An affordable gaming tower with RGB strips and a tempered glass panel.',
   '["Mid Tower","RGB","Tempered Glass"]', JSON_OBJECT('form_factor', 'Mid Tower', 'side_panel', 'Tempered Glass', 'rgb', 1), 17, 4.3, 52, 0, 0),
  ('Ant Esports ICE-4100 Mid Tower Case', 'ant-esports-ice-4100', 'Ant Esports', 'PC Cases', 3999.00, 4699.00, 15.00, '/products/pc-cases.svg',
   'A spacious mid tower with excellent fan support for high-airflow builds.',
   '["Mid Tower","7 Fans Support","ATX"]', JSON_OBJECT('form_factor', 'Mid Tower', 'side_panel', 'Tempered Glass'), 15, 4.4, 47, 0, 0),
  ('Corsair 5000D Airflow Mid Tower Case', 'corsair-5000d-airflow', 'Corsair', 'PC Cases', 11999.00, 13999.00, 14.00, '/products/pc-cases.svg',
   'A roomy airflow mid tower with tool-free panels and superb cooling.',
   '["Mid Tower","Mesh Front","ATX / E-ATX"]', JSON_OBJECT('form_factor', 'Mid Tower', 'side_panel', 'Tempered Glass'), 8, 4.8, 63, 0, 1),
  ('NZXT H7 Flow Mid Tower Case', 'nzxt-h7-flow', 'NZXT', 'PC Cases', 11499.00, 13499.00, 15.00, '/products/pc-cases.svg',
   'A larger H5 Flow with front mesh, great cable management and support for big AIOs.',
   '["Mid Tower","Mesh Front","ATX"]', JSON_OBJECT('form_factor', 'Mid Tower', 'side_panel', 'Tempered Glass'), 7, 4.7, 54, 0, 1);

-- ------------------------------------------------------------
-- PRODUCTS — Monitors
-- ------------------------------------------------------------
INSERT IGNORE INTO products
  (name, slug, brand, category, price, old_price, discount, image, description, specifications, facets, stock, rating, review_count, featured, popular)
VALUES
  ('LG 24MP400 24" IPS Monitor', 'lg-24mp400', 'LG', 'Monitors', 7499.00, 8499.00, 12.00, '/products/monitors.svg',
   'A 24-inch FHD IPS display with wide viewing angles for work and study.',
   '["24-inch","IPS","1920x1080","75Hz"]', JSON_OBJECT('size', '24"', 'panel', 'IPS', 'refresh', '75Hz'), 13, 4.4, 59, 0, 1),
  ('Acer KA240Y 24" IPS Monitor', 'acer-ka240y', 'Acer', 'Monitors', 6999.00, 7999.00, 13.00, '/products/monitors.svg',
   'A slim 100Hz IPS panel with zero-frame design for budget setups.',
   '["24-inch","IPS","1920x1080","100Hz"]', JSON_OBJECT('size', '24"', 'panel', 'IPS', 'refresh', '100Hz'), 15, 4.4, 63, 1, 1),
  ('LG 27MP60G 27" IPS Monitor', 'lg-27mp60g', 'LG', 'Monitors', 10999.00, 12499.00, 12.00, '/products/monitors.svg',
   'A crisp 27-inch FHD IPS monitor with a 3-side ultra-slim bezel.',
   '["27-inch","IPS","1920x1080","75Hz"]', JSON_OBJECT('size', '27"', 'panel', 'IPS', 'refresh', '75Hz'), 11, 4.5, 49, 1, 1),
  ('Acer VG240Y 24" 165Hz Gaming Monitor', 'acer-vg240y', 'Acer', 'Monitors', 14999.00, 17499.00, 14.00, '/products/monitors.svg',
   'A fast 165Hz IPS gaming panel with AMD FreeSync for competitive play.',
   '["24-inch","IPS","1920x1080","165Hz"]', JSON_OBJECT('size', '24"', 'panel', 'IPS', 'refresh', '165Hz'), 10, 4.7, 84, 1, 1),
  ('Acer Nitro VG271 27" 144Hz Monitor', 'acer-nitro-vg271', 'Acer', 'Monitors', 17999.00, 20499.00, 12.00, '/products/monitors.svg',
   'A 27-inch 144Hz IPS gaming monitor with great colour reproduction.',
   '["27-inch","IPS","1920x1080","144Hz"]', JSON_OBJECT('size', '27"', 'panel', 'IPS', 'refresh', '144Hz'), 9, 4.6, 71, 0, 1),
  ('LG UltraGear 27GN800 27" QHD 144Hz', 'lg-ultragear-27gn800', 'LG', 'Monitors', 27999.00, 32999.00, 15.00, '/products/monitors.svg',
   'A QHD Nano IPS gaming monitor with 144Hz, HDR10 and G-Sync compatibility.',
   '["27-inch","Nano IPS","2560x1440","144Hz"]', JSON_OBJECT('size', '27"', 'panel', 'Nano IPS', 'refresh', '144Hz'), 7, 4.8, 77, 1, 1),
  ('Samsung 24" T350F FHD Monitor', 'samsung-t350f', 'Samsung', 'Monitors', 8499.00, 9799.00, 13.00, '/products/monitors.svg',
   'A modern 24-inch IPS monitor with a super-slim bezel and 75Hz refresh.',
   '["24-inch","IPS","1920x1080","75Hz"]', JSON_OBJECT('size', '24"', 'panel', 'IPS', 'refresh', '75Hz'), 12, 4.4, 44, 0, 0),
  ('LG UltraGear 24GN600 24" 144Hz', 'lg-ultragear-24gn600', 'LG', 'Monitors', 14499.00, 16499.00, 12.00, '/products/monitors.svg',
   'A 144Hz IPS gaming monitor with a sharp FHD panel and FreeSync Premium.',
   '["24-inch","IPS","1920x1080","144Hz"]', JSON_OBJECT('size', '24"', 'panel', 'IPS', 'refresh', '144Hz'), 10, 4.6, 66, 0, 1);

-- ------------------------------------------------------------
-- PRODUCTS — Peripherals
-- ------------------------------------------------------------
INSERT IGNORE INTO products
  (name, slug, brand, category, price, old_price, discount, image, description, specifications, facets, stock, rating, review_count, featured, popular)
VALUES
  ('Logitech G102 Lightsync Gaming Mouse', 'logitech-g102-lightsync', 'Logitech', 'Peripherals', 1799.00, 2099.00, 14.00, '/products/peripherals.svg',
   'An 8,000 DPI gaming mouse with LIGHTSYNC RGB — the esports standard.',
   '["8,000 DPI","RGB","Wired"]', JSON_OBJECT('type', 'Mouse', 'rgb', 1, 'connection', 'Wired'), 24, 4.6, 132, 1, 1),
  ('Logitech G304 Lightspeed Wireless Mouse', 'logitech-g304-lightspeed', 'Logitech', 'Peripherals', 3499.00, 3999.00, 13.00, '/products/peripherals.svg',
   'A lag-free LIGHTSPEED wireless mouse with a 12,000 DPI HERO sensor.',
   '["12,000 DPI","Wireless","HERO Sensor"]', JSON_OBJECT('type', 'Mouse', 'rgb', 0, 'connection', 'Wireless'), 18, 4.7, 88, 1, 1),
  ('Redragon K552 Mechanical Keyboard', 'redragon-k552', 'Redragon', 'Peripherals', 2999.00, 3599.00, 17.00, '/products/peripherals.svg',
   'A compact TKL mechanical keyboard with RGB backlighting and blue switches.',
   '["TKL","Mechanical","RGB","Blue Switches"]', JSON_OBJECT('type', 'Keyboard', 'switch', 'Mechanical', 'rgb', 1), 21, 4.5, 104, 1, 1),
  ('Logitech K120 Wired Keyboard', 'logitech-k120', 'Logitech', 'Peripherals', 899.00, 1099.00, 18.00, '/products/peripherals.svg',
   'A durable, spill-resistant full-size keyboard for home and office.',
   '["Full Size","Membrane","Spill Resistant"]', JSON_OBJECT('type', 'Keyboard', 'switch', 'Membrane'), 35, 4.3, 76, 0, 0),
  ('Logitech G431 Gaming Headset', 'logitech-g431', 'Logitech', 'Peripherals', 5499.00, 6299.00, 13.00, '/products/peripherals.svg',
   '50mm drivers, DTS Headphone:X surround and a flip-to-mute mic.',
   '["50mm Drivers","Surround","USB"]', JSON_OBJECT('type', 'Headset', 'connection', 'Wired'), 12, 4.5, 61, 0, 1),
  ('Razer Kraken X USB Gaming Headset', 'razer-kraken-x-usb', 'Razer', 'Peripherals', 4999.00, 5999.00, 17.00, '/products/peripherals.svg',
   'A lightweight 7.1 surround headset with a bendable cardioid mic.',
   '["7.1 Surround","50mm Drivers","USB"]', JSON_OBJECT('type', 'Headset', 'connection', 'Wired'), 11, 4.4, 53, 0, 1),
  ('Redragon M711 FPS Gaming Mouse', 'redragon-m711-fps', 'Redragon', 'Peripherals', 1499.00, 1799.00, 17.00, '/products/peripherals.svg',
   'A 10,000 DPI wired mouse with honeycomb shell and RGB lighting.',
   '["10,000 DPI","RGB","Wired"]', JSON_OBJECT('type', 'Mouse', 'rgb', 1, 'connection', 'Wired'), 22, 4.4, 69, 0, 0),
  ('Razer DeathAdder Essential Mouse', 'razer-deathadder-essential', 'Razer', 'Peripherals', 2899.00, 3399.00, 15.00, '/products/peripherals.svg',
   'The legendary ergonomic gaming mouse with a 6,400 DPI optical sensor.',
   '["6,400 DPI","Ergonomic","Wired"]', JSON_OBJECT('type', 'Mouse', 'rgb', 1, 'connection', 'Wired'), 17, 4.6, 83, 0, 1),
  ('Redragon S101 Keyboard + Mouse Combo', 'redragon-s101-combo', 'Redragon', 'Peripherals', 2499.00, 2999.00, 17.00, '/products/peripherals.svg',
   'A complete RGB keyboard and mouse combo to start a gaming setup on a budget.',
   '["Keyboard + Mouse","RGB","Wired"]', JSON_OBJECT('type', 'Combo', 'rgb', 1, 'connection', 'Wired'), 19, 4.3, 58, 0, 0),
  ('Logitech Z150 Speakers', 'logitech-z150', 'Logitech', 'Peripherals', 1999.00, 2399.00, 17.00, '/products/peripherals.svg',
   'Compact stereo speakers with a built-in headphone jack for desks.',
   '["2.0","Stereo","3.5mm"]', JSON_OBJECT('type', 'Speakers', 'connection', 'Wired'), 20, 4.2, 45, 0, 0);