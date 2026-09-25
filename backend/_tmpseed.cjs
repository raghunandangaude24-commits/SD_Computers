const mysql = require("mysql2/promise");
(async () => {
  const c = await mysql.createConnection({ host: "localhost", port: 3306, user: "root", password: "root" });
  await c.query(`CREATE TEMPORARY TABLE _seedtest (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    facets JSON NULL,
    UNIQUE KEY uq (name),
    PRIMARY KEY (id)
  )`);
  // First insert (fresh row).
  await c.query(`INSERT IGNORE INTO _seedtest (name, description, facets) VALUES ('A', 'first', JSON_OBJECT('x', 1))`);
  // Simulates a legacy row with an empty description + NULL facets.
  await c.query(`INSERT IGNORE INTO _seedtest (name, description, facets) VALUES ('B', '', NULL)`);
  // Same statement re-run against existing rows: must fill gaps only.
  const sql = `INSERT IGNORE INTO _seedtest (name, description, facets)
    VALUES ('A', 'seeded-A', JSON_OBJECT('x', 9)), ('B', 'seeded-B', JSON_OBJECT('y', 2))
    AS new ON DUPLICATE KEY UPDATE
      description = IF(COALESCE(description, '') = '', new.description, description),
      facets = IF(facets IS NULL, new.facets, facets)`;
  const [r] = await c.query(sql);
  const [rows] = await c.query("SELECT name, description, facets FROM _seedtest ORDER BY name");
  console.log("affectedRows:", r.affectedRows, "warnings:", r.warningStatus);
  console.log(rows);
  await c.end();
})().catch((e) => console.log("ERR", e.message));
