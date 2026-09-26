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
  ('Intel', 'intel'), ('AMD', 'amd'), ('MSI', 'msi'),
  ('Gigabyte', 'gigabyte'), ('ASUS', 'asus'), ('Sapphire', 'sapphire'), ('Corsair', 'corsair'),
  ('Kingston', 'kingston'), ('Crucial', 'crucial'), ('G.Skill', 'gskill'), ('Samsung', 'samsung'),
  ('Seagate', 'seagate'), ('Cooler Master', 'cooler-master'), ('Deepcool', 'deepcool'),
  ('Ant Esports', 'ant-esports'), ('NZXT', 'nzxt'), ('LG', 'lg'), ('Acer', 'acer'),
  ('Logitech', 'logitech'), ('Redragon', 'redragon');

-- ------------------------------------------------------------
-- PRODUCTS — Processors (CPU)
-- ------------------------------------------------------------
INSERT IGNORE INTO products
  (name, slug, brand, category, price, old_price, discount, image, description, specifications, facets, stock, rating, review_count, featured, popular)
VALUES
  ('Intel Core i5-12400F 6-Core Processor', 'intel-core-i5-12400f', 'Intel', 'Processors (CPU)', 13499.00, 15999.00, 16.00, '/products/intel-core-i5-12400f.jpg',
   'A six-core Alder Lake processor with excellent single-thread performance, ideal for 1080p gaming and everyday productivity builds.',
   '["6 Cores / 12 Threads","4.4 GHz Turbo","LGA 1700","65W TDP"]', JSON_OBJECT('chipset', 'Intel', 'socket', 'LGA 1700', 'cores', '6'), 14, 4.5, 128, 1, 1),
  ('Intel Core i7-13700K 16-Core Processor', 'intel-core-i7-13700k', 'Intel', 'Processors (CPU)', 35999.00, 39999.00, 10.00, '/products/intel-core-i7-13700k.jpg',
   'A 16-core unlocked Raptor Lake flagship for high-refresh gaming and heavy productivity, ready for overclocking on Z790 boards.',
   '["16 Cores / 24 Threads","5.4 GHz Turbo","LGA 1700","125W TDP"]', JSON_OBJECT('chipset', 'Intel', 'socket', 'LGA 1700', 'cores', '16'), 9, 4.8, 154, 0, 1),
  ('AMD Ryzen 5 5600 6-Core Processor', 'amd-ryzen-5-5600', 'AMD', 'Processors (CPU)', 11999.00, 13499.00, 11.00, '/products/amd-ryzen-5-5600.jpg',
   'A value champion on the AM4 platform, delivering strong 1080p gaming frames with low power draw.',
   '["6 Cores / 12 Threads","4.4 GHz Boost","AM4","65W TDP"]', JSON_OBJECT('chipset', 'AMD', 'socket', 'AM4', 'cores', '6'), 18, 4.6, 210, 1, 1),
  ('AMD Ryzen 7 7800X3D 8-Core Processor', 'amd-ryzen-7-7800x3d', 'AMD', 'Processors (CPU)', 42999.00, 46999.00, 9.00, '/products/amd-ryzen-7-7800x3d.jpg',
   'The 3D V-Cache gaming king — the fastest mainstream gaming CPU for simulation and esports titles.',
   '["8 Cores / 16 Threads","5.0 GHz Boost","AM5","120W TDP"]', JSON_OBJECT('chipset', 'AMD', 'socket', 'AM5', 'cores', '8'), 8, 4.9, 132, 1, 1)
  -- Additive heal: INSERT IGNORE leaves pre-existing rows untouched, so a
  -- row seeded by an older seed.sql keeps its empty description/facets for
  -- ever. These assignments only fill gaps — data an admin already set is
  -- never overwritten. Every product INSERT ends with the same clause.
  AS new ON DUPLICATE KEY UPDATE
    products.description = IF(COALESCE(products.description, '') = '', new.description, products.description),
    products.specifications = IF(products.specifications IS NULL OR products.specifications = '', new.specifications, products.specifications),
    products.facets = IF(products.facets IS NULL, new.facets, products.facets);

-- ------------------------------------------------------------
-- PRODUCTS — Graphics Cards (GPU)
-- ------------------------------------------------------------
INSERT IGNORE INTO products
  (name, slug, brand, category, price, old_price, discount, image, description, specifications, facets, stock, rating, review_count, featured, popular)
VALUES
  ('MSI GeForce RTX 4060 Ventus 2X 8GB GDDR6', 'msi-geforce-rtx-4060-ventus-2x', 'MSI', 'Graphics Cards (GPU)', 34999.00, 37999.00, 8.00, '/products/msi-geforce-rtx-4060-ventus-2x.jpg',
   'A compact dual-fan RTX 4060 with DLSS 3 frame generation for smooth 1080p and 1440p gaming.',
   '["8GB GDDR6","128-bit","DLSS 3","2 Fans"]', JSON_OBJECT('chipset', 'NVIDIA', 'vram', '8GB'), 12, 4.5, 98, 1, 1),
  ('ASUS TUF Gaming GeForce RTX 4060 8GB GDDR6', 'asus-tuf-rtx-4060', 'ASUS', 'Graphics Cards (GPU)', 36999.00, NULL, NULL, '/products/asus-tuf-rtx-4060.jpg',
   'Military-grade TUF design with triple fans for quieter, cooler RTX 4060 performance.',
   '["8GB GDDR6","128-bit","DLSS 3","3 Fans"]', JSON_OBJECT('chipset', 'NVIDIA', 'vram', '8GB'), 7, 4.6, 52, 0, 1),
  ('MSI GeForce RTX 4060 Ti Gaming X 8GB GDDR6', 'msi-rtx-4060-ti-gaming-x', 'MSI', 'Graphics Cards (GPU)', 44999.00, 48999.00, 8.00, '/products/msi-rtx-4060-ti-gaming-x.jpg',
   'RTX 4060 Ti with a large Twin Frozr cooler for quiet high-refresh 1080p and smooth 1440p play.',
   '["8GB GDDR6","128-bit","DLSS 3","Twin Frozr"]', JSON_OBJECT('chipset', 'NVIDIA', 'vram', '8GB'), 9, 4.6, 71, 1, 1),
  ('MSI GeForce RTX 4070 Ventus 2X 12GB GDDR6', 'msi-rtx-4070-ventus-2x', 'MSI', 'Graphics Cards (GPU)', 59999.00, 64999.00, 8.00, '/products/msi-rtx-4070-ventus-2x.jpg',
   'A 12GB RTX 4070 that crushes 1440p gaming with DLSS 3 and excellent efficiency.',
   '["12GB GDDR6","192-bit","DLSS 3"]', JSON_OBJECT('chipset', 'NVIDIA', 'vram', '12GB'), 6, 4.8, 88, 1, 1),
  ('Sapphire Pulse Radeon RX 7600 8GB GDDR6', 'sapphire-pulse-rx-7600', 'Sapphire', 'Graphics Cards (GPU)', 26999.00, 29999.00, 10.00, '/products/sapphire-pulse-rx-7600.jpg',
   'AMD''s RX 7600 with dual fans delivers strong 1080p performance with a compact dual-slot build.',
   '["8GB GDDR6","128-bit","FSR 3","2 Fans"]', JSON_OBJECT('chipset', 'AMD', 'vram', '8GB'), 10, 4.4, 57, 0, 1)
  AS new ON DUPLICATE KEY UPDATE
    products.description = IF(COALESCE(products.description, '') = '', new.description, products.description),
    products.specifications = IF(products.specifications IS NULL OR products.specifications = '', new.specifications, products.specifications),
    products.facets = IF(products.facets IS NULL, new.facets, products.facets);

-- ------------------------------------------------------------
-- PRODUCTS — Motherboards
-- ------------------------------------------------------------
INSERT IGNORE INTO products
  (name, slug, brand, category, price, old_price, discount, image, description, specifications, facets, stock, rating, review_count, featured, popular)
VALUES
  ('MSI PRO B760M-A WiFi DDR4 Motherboard', 'msi-pro-b760m-a-wifi', 'MSI', 'Motherboards', 15999.00, 17999.00, 11.00, '/products/msi-pro-b760m-a-wifi.jpg',
   'Micro-ATX board for 12th/13th/14th gen Intel with built-in WiFi 6 and DDR4 support.',
   '["LGA 1700","DDR4","WiFi 6","Micro ATX"]', JSON_OBJECT('chipset', 'Intel', 'socket', 'LGA 1700', 'dimm', 'DDR4', 'form_factor', 'Micro ATX'), 10, 4.5, 49, 1, 1),
  ('ASUS TUF Gaming B760-Plus WiFi D4 Motherboard', 'asus-tuf-b760-plus-wifi', 'ASUS', 'Motherboards', 19999.00, 22499.00, 11.00, '/products/asus-tuf-b760-plus-wifi.jpg',
   'ATX TUF board with military-grade durability, WiFi 6 and robust VRM cooling.',
   '["LGA 1700","DDR4","WiFi 6","ATX"]', JSON_OBJECT('chipset', 'Intel', 'socket', 'LGA 1700', 'dimm', 'DDR4', 'form_factor', 'ATX'), 8, 4.6, 42, 1, 1),
  ('MSI MAG B650 Tomahawk WiFi Motherboard', 'msi-mag-b650-tomahawk-wifi', 'MSI', 'Motherboards', 24999.00, 27999.00, 11.00, '/products/msi-mag-b650-tomahawk-wifi.jpg',
   'Enthusiast AMD AM5 board with PCIe 5.0, DDR5 and premium audio for Ryzen 7000 builds.',
   '["AM5","DDR5","PCIe 5.0","ATX"]', JSON_OBJECT('chipset', 'AMD', 'socket', 'AM5', 'dimm', 'DDR5', 'form_factor', 'ATX'), 7, 4.7, 58, 1, 1),
  ('Gigabyte B550M Aorus Elite Motherboard', 'gigabyte-b550m-aorus-elite', 'Gigabyte', 'Motherboards', 12499.00, 13999.00, 11.00, '/products/gigabyte-b550m-aorus-elite.jpg',
   'Reliable Micro-ATX B550 board for AMD Ryzen 5000 with PCIe 4.0 support.',
   '["AM4","DDR4","PCIe 4.0","Micro ATX"]', JSON_OBJECT('chipset', 'AMD', 'socket', 'AM4', 'dimm', 'DDR4', 'form_factor', 'Micro ATX'), 11, 4.5, 63, 0, 1)
  AS new ON DUPLICATE KEY UPDATE
    products.description = IF(COALESCE(products.description, '') = '', new.description, products.description),
    products.specifications = IF(products.specifications IS NULL OR products.specifications = '', new.specifications, products.specifications),
    products.facets = IF(products.facets IS NULL, new.facets, products.facets);

-- ------------------------------------------------------------
-- PRODUCTS — RAM
-- ------------------------------------------------------------
INSERT IGNORE INTO products
  (name, slug, brand, category, price, old_price, discount, image, description, specifications, facets, stock, rating, review_count, featured, popular)
VALUES
  ('Corsair Vengeance LPX 16GB DDR4 3200MHz', 'corsair-vengeance-lpx-16gb-ddr4', 'Corsair', 'RAM', 5299.00, 5999.00, 12.00, '/products/corsair-vengeance-lpx-16gb-ddr4.jpg',
   'The classic 16GB DDR4 kit — proven performance for gaming and multitasking.',
   '["16GB","DDR4","3200MHz","CL16"]', JSON_OBJECT('dimm', 'DDR4', 'capacity', '16GB', 'speed', '3200MHz'), 20, 4.6, 118, 1, 1),
  ('G.Skill Ripjaws V 16GB DDR4 3600MHz', 'gskill-ripjaws-v-16gb-ddr4', 'G.Skill', 'RAM', 5499.00, 6299.00, 13.00, '/products/gskill-ripjaws-v-16gb-ddr4.jpg',
   'High-frequency DDR4 tuned for AMD and Intel platforms with tight CL18 timings.',
   '["16GB","DDR4","3600MHz","CL18"]', JSON_OBJECT('dimm', 'DDR4', 'capacity', '16GB', 'speed', '3600MHz'), 14, 4.7, 71, 0, 1),
  ('Kingston Fury Beast 16GB DDR5 5600MHz', 'kingston-fury-beast-16gb-ddr5', 'Kingston', 'RAM', 5899.00, 6499.00, 9.00, '/products/kingston-fury-beast-16gb-ddr5.jpg',
   'Entry DDR5 kit for AM5 and Intel LGA 1700 platforms with plug-and-play 5600MHz.',
   '["16GB","DDR5","5600MHz","Plug-n-Play"]', JSON_OBJECT('dimm', 'DDR5', 'capacity', '16GB', 'speed', '5600MHz'), 18, 4.5, 52, 1, 1),
  ('Corsair Vengeance RGB 32GB DDR5 6000MHz', 'corsair-vengeance-rgb-32gb-ddr5', 'Corsair', 'RAM', 13499.00, 15499.00, 13.00, '/products/corsair-vengeance-rgb-32gb-ddr5.jpg',
   'RGB-lit DDR5 kit with dynamic iCUE lighting and 6000MHz performance.',
   '["32GB","DDR5","6000MHz","RGB"]', JSON_OBJECT('dimm', 'DDR5', 'capacity', '32GB', 'speed', '6000MHz', 'rgb', 1), 10, 4.8, 74, 0, 1)
  AS new ON DUPLICATE KEY UPDATE
    products.description = IF(COALESCE(products.description, '') = '', new.description, products.description),
    products.specifications = IF(products.specifications IS NULL OR products.specifications = '', new.specifications, products.specifications),
    products.facets = IF(products.facets IS NULL, new.facets, products.facets);

-- ------------------------------------------------------------
-- PRODUCTS — Storage
-- ------------------------------------------------------------
INSERT IGNORE INTO products
  (name, slug, brand, category, price, old_price, discount, image, description, specifications, facets, stock, rating, review_count, featured, popular)
VALUES
  ('Samsung 980 1TB NVMe M.2 SSD', 'samsung-980-1tb', 'Samsung', 'Storage', 7999.00, 8999.00, 11.00, '/products/samsung-980-1tb.jpg',
   '1TB NVMe storage for games, apps and OS with excellent sustained performance.',
   '["1TB","NVMe PCIe 3.0","3500 MB/s"]', JSON_OBJECT('storage_type', 'SSD', 'capacity', '1TB', 'form_factor', 'M.2 NVMe'), 14, 4.7, 121, 1, 1),
  ('Crucial P3 Plus 1TB NVMe PCIe 4.0 SSD', 'crucial-p3-plus-1tb', 'Crucial', 'Storage', 7499.00, 8499.00, 12.00, '/products/crucial-p3-plus-1tb.jpg',
   'PCIe 4.0 NVMe with up to 5,000 MB/s — a speed bump for modern mainboards.',
   '["1TB","NVMe PCIe 4.0","5000 MB/s"]', JSON_OBJECT('storage_type', 'SSD', 'capacity', '1TB', 'form_factor', 'M.2 NVMe'), 13, 4.6, 85, 0, 1),
  ('Crucial BX500 1TB SATA SSD', 'crucial-bx500-1tb', 'Crucial', 'Storage', 5999.00, 6999.00, 14.00, '/products/crucial-bx500-1tb.jpg',
   'A dependable 2.5-inch SATA SSD for older systems and bulk storage.',
   '["1TB","SATA III","540 MB/s"]', JSON_OBJECT('storage_type', 'SSD', 'capacity', '1TB', 'form_factor', '2.5" SATA'), 17, 4.4, 59, 0, 0),
  ('Seagate Barracuda 2TB HDD', 'seagate-barracuda-2tb', 'Seagate', 'Storage', 5999.00, 6799.00, 12.00, '/products/seagate-barracuda-2tb.jpg',
   '2TB of reliable spinning storage perfect for games and archives.',
   '["2TB","7200 RPM","SATA III"]', JSON_OBJECT('storage_type', 'HDD', 'capacity', '2TB', 'form_factor', '3.5" HDD'), 18, 4.4, 61, 0, 1)
  AS new ON DUPLICATE KEY UPDATE
    products.description = IF(COALESCE(products.description, '') = '', new.description, products.description),
    products.specifications = IF(products.specifications IS NULL OR products.specifications = '', new.specifications, products.specifications),
    products.facets = IF(products.facets IS NULL, new.facets, products.facets);

-- ------------------------------------------------------------
-- PRODUCTS — Power Supplies (PSU)
-- ------------------------------------------------------------
INSERT IGNORE INTO products
  (name, slug, brand, category, price, old_price, discount, image, description, specifications, facets, stock, rating, review_count, featured, popular)
VALUES
  ('Corsair CV550 550W 80+ Bronze PSU', 'corsair-cv550', 'Corsair', 'Power Supplies (PSU)', 3999.00, 4499.00, 11.00, '/products/corsair-cv550.jpg',
   'A quiet 550W 80+ Bronze unit with 120mm fan, ideal for mainstream builds.',
   '["550W","80+ Bronze","120mm Fan"]', JSON_OBJECT('wattage', '550W', 'certification', '80+ Bronze'), 15, 4.5, 77, 1, 1),
  ('Cooler Master MWE 650 V2 80+ Bronze PSU', 'cooler-master-mwe-650-v2', 'Cooler Master', 'Power Supplies (PSU)', 5299.00, 5999.00, 12.00, '/products/cooler-master-mwe-650-v2.jpg',
   'A proven 650W Bronze PSU with a 120mm HDB fan for quiet operation.',
   '["650W","80+ Bronze","120mm Fan"]', JSON_OBJECT('wattage', '650W', 'certification', '80+ Bronze'), 14, 4.5, 63, 0, 1),
  ('MSI MPG A650GF 650W 80+ Gold PSU', 'msi-mpg-a650gf', 'MSI', 'Power Supplies (PSU)', 8999.00, 10499.00, 14.00, '/products/msi-mpg-a650gf.jpg',
   'Fully modular 650W Gold PSU with premium all-Japanese capacitors.',
   '["650W","80+ Gold","Modular"]', JSON_OBJECT('wattage', '650W', 'certification', '80+ Gold', 'modular', 1), 9, 4.7, 55, 1, 1),
  ('Corsair RM750x 750W 80+ Gold PSU', 'corsair-rm750x', 'Corsair', 'Power Supplies (PSU)', 12999.00, 14999.00, 13.00, '/products/corsair-rm750x.jpg',
   'Fully modular, zero-RPM 750W Gold PSU — a premium choice for high-end builds.',
   '["750W","80+ Gold","Modular","Zero RPM"]', JSON_OBJECT('wattage', '750W', 'certification', '80+ Gold', 'modular', 1), 8, 4.8, 92, 1, 1)
  AS new ON DUPLICATE KEY UPDATE
    products.description = IF(COALESCE(products.description, '') = '', new.description, products.description),
    products.specifications = IF(products.specifications IS NULL OR products.specifications = '', new.specifications, products.specifications),
    products.facets = IF(products.facets IS NULL, new.facets, products.facets);

-- ------------------------------------------------------------
-- PRODUCTS — Cooling
-- ------------------------------------------------------------
INSERT IGNORE INTO products
  (name, slug, brand, category, price, old_price, discount, image, description, specifications, facets, stock, rating, review_count, featured, popular)
VALUES
  ('Deepcool AK400 Air Cooler', 'deepcool-ak400', 'Deepcool', 'Cooling', 2499.00, 2899.00, 14.00, '/products/deepcool-ak400.jpg',
   'A single-tower 120mm air cooler handling up to 220W TDP quietly.',
   '["120mm","Air Cooler","220W TDP"]', JSON_OBJECT('type', 'Air Cooler', 'size', '120mm', 'rgb', 0), 18, 4.6, 84, 1, 1),
  ('Cooler Master Hyper 212 Black Edition', 'cooler-master-hyper-212-black', 'Cooler Master', 'Cooling', 3499.00, 3999.00, 13.00, '/products/cooler-master-hyper-212-black.jpg',
   'The legendary Hyper 212 tower cooler in an all-black finish.',
   '["120mm","Air Cooler","4 Heatpipes"]', JSON_OBJECT('type', 'Air Cooler', 'size', '120mm', 'rgb', 0), 14, 4.5, 91, 1, 1),
  ('Deepcool LE500 240mm AIO Liquid Cooler', 'deepcool-le500-240mm', 'Deepcool', 'Cooling', 6499.00, 7499.00, 13.00, '/products/deepcool-le500-240mm.jpg',
   'A 240mm all-in-one liquid cooler with ARGB fans and a clean white design.',
   '["240mm","AIO","ARGB"]', JSON_OBJECT('type', 'AIO', 'size', '240mm', 'rgb', 1), 12, 4.6, 62, 1, 1),
  ('NZXT Kraken 360 RGB 360mm AIO', 'nzxt-kraken-360', 'NZXT', 'Cooling', 17999.00, 20999.00, 14.00, '/products/nzxt-kraken-360.jpg',
   'Flagship 360mm AIO with a customisable LCD display for enthusiast rigs.',
   '["360mm","AIO","LCD Display"]', JSON_OBJECT('type', 'AIO', 'size', '360mm', 'rgb', 1), 6, 4.9, 47, 0, 1)
  AS new ON DUPLICATE KEY UPDATE
    products.description = IF(COALESCE(products.description, '') = '', new.description, products.description),
    products.specifications = IF(products.specifications IS NULL OR products.specifications = '', new.specifications, products.specifications),
    products.facets = IF(products.facets IS NULL, new.facets, products.facets);

-- ------------------------------------------------------------
-- PRODUCTS — PC Cases
-- ------------------------------------------------------------
INSERT IGNORE INTO products
  (name, slug, brand, category, price, old_price, discount, image, description, specifications, facets, stock, rating, review_count, featured, popular)
VALUES
  ('NZXT H5 Flow Mid Tower Case', 'nzxt-h5-flow', 'NZXT', 'PC Cases', 8499.00, 9999.00, 15.00, '/products/nzxt-h5-flow.jpg',
   'A clean mid-tower with an angled airflow intake and tempered glass side panel.',
   '["Mid Tower","Tempered Glass","ATX"]', JSON_OBJECT('form_factor', 'Mid Tower', 'side_panel', 'Tempered Glass'), 10, 4.7, 66, 1, 1),
  ('Corsair 4000D Airflow Mid Tower Case', 'corsair-4000d-airflow', 'Corsair', 'PC Cases', 9499.00, 10999.00, 14.00, '/products/corsair-4000d-airflow.jpg',
   'The classic airflow-focused mid tower with superb build quality.',
   '["Mid Tower","Mesh Front","ATX"]', JSON_OBJECT('form_factor', 'Mid Tower', 'side_panel', 'Tempered Glass'), 9, 4.8, 97, 1, 1),
  ('Ant Esports ICE-311MT Mid Tower Case', 'ant-esports-ice-311mt', 'Ant Esports', 'PC Cases', 2499.00, 2999.00, 17.00, '/products/ant-esports-ice-311mt.jpg',
   'An affordable gaming tower with RGB strips and a tempered glass panel.',
   '["Mid Tower","RGB","Tempered Glass"]', JSON_OBJECT('form_factor', 'Mid Tower', 'side_panel', 'Tempered Glass', 'rgb', 1), 17, 4.3, 52, 0, 0)
  AS new ON DUPLICATE KEY UPDATE
    products.description = IF(COALESCE(products.description, '') = '', new.description, products.description),
    products.specifications = IF(products.specifications IS NULL OR products.specifications = '', new.specifications, products.specifications),
    products.facets = IF(products.facets IS NULL, new.facets, products.facets);

-- ------------------------------------------------------------
-- PRODUCTS — Monitors
-- ------------------------------------------------------------
INSERT IGNORE INTO products
  (name, slug, brand, category, price, old_price, discount, image, description, specifications, facets, stock, rating, review_count, featured, popular)
VALUES
  ('LG 24MP400 24" IPS Monitor', 'lg-24mp400', 'LG', 'Monitors', 7499.00, 8499.00, 12.00, '/products/lg-24mp400.jpg',
   'A 24-inch FHD IPS display with wide viewing angles for work and study.',
   '["24-inch","IPS","1920x1080","75Hz"]', JSON_OBJECT('size', '24"', 'panel', 'IPS', 'refresh', '75Hz'), 13, 4.4, 59, 0, 1),
  ('LG 27MP60G 27" IPS Monitor', 'lg-27mp60g', 'LG', 'Monitors', 10999.00, 12499.00, 12.00, '/products/lg-27mp60g.jpg',
   'A crisp 27-inch FHD IPS monitor with a 3-side ultra-slim bezel.',
   '["27-inch","IPS","1920x1080","75Hz"]', JSON_OBJECT('size', '27"', 'panel', 'IPS', 'refresh', '75Hz'), 11, 4.5, 49, 1, 1),
  ('Acer VG240Y 24" 165Hz Gaming Monitor', 'acer-vg240y', 'Acer', 'Monitors', 14999.00, 17499.00, 14.00, '/products/acer-vg240y.jpg',
   'A fast 165Hz IPS gaming panel with AMD FreeSync for competitive play.',
   '["24-inch","IPS","1920x1080","165Hz"]', JSON_OBJECT('size', '24"', 'panel', 'IPS', 'refresh', '165Hz'), 10, 4.7, 84, 1, 1),
  ('LG UltraGear 27GN800 27" QHD 144Hz', 'lg-ultragear-27gn800', 'LG', 'Monitors', 27999.00, 32999.00, 15.00, '/products/lg-ultragear-27gn800.jpg',
   'A QHD Nano IPS gaming monitor with 144Hz, HDR10 and G-Sync compatibility.',
   '["27-inch","Nano IPS","2560x1440","144Hz"]', JSON_OBJECT('size', '27"', 'panel', 'Nano IPS', 'refresh', '144Hz'), 7, 4.8, 77, 1, 1)
  AS new ON DUPLICATE KEY UPDATE
    products.description = IF(COALESCE(products.description, '') = '', new.description, products.description),
    products.specifications = IF(products.specifications IS NULL OR products.specifications = '', new.specifications, products.specifications),
    products.facets = IF(products.facets IS NULL, new.facets, products.facets);

-- ------------------------------------------------------------
-- PRODUCTS — Peripherals
-- ------------------------------------------------------------
INSERT IGNORE INTO products
  (name, slug, brand, category, price, old_price, discount, image, description, specifications, facets, stock, rating, review_count, featured, popular)
VALUES
  ('Logitech G102 Lightsync Gaming Mouse', 'logitech-g102-lightsync', 'Logitech', 'Peripherals', 1799.00, 2099.00, 14.00, '/products/logitech-g102-lightsync.jpg',
   'An 8,000 DPI gaming mouse with LIGHTSYNC RGB — the esports standard.',
   '["8,000 DPI","RGB","Wired"]', JSON_OBJECT('type', 'Mouse', 'rgb', 1, 'connection', 'Wired'), 24, 4.6, 132, 1, 1),
  ('Redragon K552 Mechanical Keyboard', 'redragon-k552', 'Redragon', 'Peripherals', 2999.00, 3599.00, 17.00, '/products/redragon-k552.jpg',
   'A compact TKL mechanical keyboard with RGB backlighting and blue switches.',
   '["TKL","Mechanical","RGB","Blue Switches"]', JSON_OBJECT('type', 'Keyboard', 'switch', 'Mechanical', 'rgb', 1), 21, 4.5, 104, 1, 1),
  ('Logitech G431 Gaming Headset', 'logitech-g431', 'Logitech', 'Peripherals', 5499.00, 6299.00, 13.00, '/products/logitech-g431.jpg',
   '50mm drivers, DTS Headphone:X surround and a flip-to-mute mic.',
   '["50mm Drivers","Surround","USB"]', JSON_OBJECT('type', 'Headset', 'connection', 'Wired'), 12, 4.5, 61, 0, 1),
  ('Logitech Z150 Speakers', 'logitech-z150', 'Logitech', 'Peripherals', 1999.00, 2399.00, 17.00, '/products/logitech-z150.jpg',
   'Compact stereo speakers with a built-in headphone jack for desks.',
   '["2.0","Stereo","3.5mm"]', JSON_OBJECT('type', 'Speakers', 'connection', 'Wired'), 20, 4.2, 45, 0, 0)
  AS new ON DUPLICATE KEY UPDATE
    products.description = IF(COALESCE(products.description, '') = '', new.description, products.description),
    products.specifications = IF(products.specifications IS NULL OR products.specifications = '', new.specifications, products.specifications),
    products.facets = IF(products.facets IS NULL, new.facets, products.facets);