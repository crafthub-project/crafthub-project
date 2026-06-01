-- ============================================================
-- CraftHub Platform - MySQL Database Schema
-- ============================================================
-- Instructions: Paste this entire file into MySQL Workbench
-- and execute it to create the full CraftHub database.
-- ============================================================

CREATE DATABASE IF NOT EXISTS crafthub_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE crafthub_db;

-- ============================================================
-- 1. USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  first_name    VARCHAR(100)  NOT NULL,
  last_name     VARCHAR(100)  NOT NULL DEFAULT '',
  phone         VARCHAR(20)   UNIQUE NOT NULL,
  email         VARCHAR(255)  UNIQUE,
  password_hash VARCHAR(255)  NOT NULL,
  user_type     ENUM('caregiver','buyer','admin') NOT NULL DEFAULT 'caregiver',
  district      VARCHAR(100),
  num_children  TINYINT UNSIGNED DEFAULT 0,
  avatar_url    VARCHAR(500),
  locale        VARCHAR(10)   NOT NULL DEFAULT 'en',
  is_active     BOOLEAN       NOT NULL DEFAULT TRUE,
  is_verified   BOOLEAN       NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_login_at TIMESTAMP,
  INDEX idx_phone (phone),
  INDEX idx_user_type (user_type),
  INDEX idx_district (district)
) ENGINE=InnoDB;

-- ============================================================
-- 2. SKILL CATEGORIES
-- ============================================================
CREATE TABLE IF NOT EXISTS skill_categories (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL UNIQUE,
  slug       VARCHAR(100) NOT NULL UNIQUE,
  icon_emoji VARCHAR(10),
  sort_order TINYINT UNSIGNED DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO skill_categories (name, slug, icon_emoji, sort_order) VALUES
  ('Baking',         'baking',         '🍞', 1),
  ('Cooking',        'cooking',        '🍳', 2),
  ('Food Processing','food-processing','🥫', 3),
  ('Tailoring',      'tailoring',      '🧵', 4),
  ('Textiles',       'textiles',       '🎨', 5),
  ('Crafts',         'crafts',         '🧶', 6),
  ('Agriculture',    'agriculture',    '🌱', 7),
  ('Beauty',         'beauty',         '💄', 8),
  ('Services',       'services',       '🛠️', 9)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);

-- ============================================================
-- 3. SKILLS
-- ============================================================
CREATE TABLE IF NOT EXISTS skills (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  category_id  INT UNSIGNED NOT NULL,
  name         VARCHAR(150) NOT NULL,
  slug         VARCHAR(150) NOT NULL UNIQUE,
  emoji        VARCHAR(10),
  description  TEXT,
  difficulty   ENUM('Beginner','Intermediate','Advanced') NOT NULL DEFAULT 'Beginner',
  startup_cost VARCHAR(50),
  income_level VARCHAR(50),
  time_to_learn VARCHAR(50),
  lessons_count TINYINT UNSIGNED NOT NULL DEFAULT 0,
  has_video    BOOLEAN NOT NULL DEFAULT FALSE,
  has_pdf      BOOLEAN NOT NULL DEFAULT FALSE,
  is_active    BOOLEAN NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES skill_categories(id) ON DELETE RESTRICT,
  INDEX idx_category (category_id),
  INDEX idx_difficulty (difficulty),
  FULLTEXT idx_search (name, description)
) ENGINE=InnoDB;

-- ============================================================
-- 4. SKILL TOOLS & MATERIALS (junction)
-- ============================================================
CREATE TABLE IF NOT EXISTS skill_tools (
  id       INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  skill_id INT UNSIGNED NOT NULL,
  name     VARCHAR(150) NOT NULL,
  FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS skill_materials (
  id       INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  skill_id INT UNSIGNED NOT NULL,
  name     VARCHAR(150) NOT NULL,
  FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- 5. SKILL LESSONS
-- ============================================================
CREATE TABLE IF NOT EXISTS lessons (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  skill_id    INT UNSIGNED NOT NULL,
  title       VARCHAR(200) NOT NULL,
  description TEXT,
  step_number TINYINT UNSIGNED NOT NULL,
  duration    VARCHAR(50),
  content_url VARCHAR(500),
  content_type ENUM('text','video','pdf','quiz') NOT NULL DEFAULT 'text',
  is_free     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
  UNIQUE KEY uq_skill_step (skill_id, step_number),
  INDEX idx_skill (skill_id)
) ENGINE=InnoDB;

-- ============================================================
-- 6. USER SKILL ENROLMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS user_enrolments (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id      INT UNSIGNED NOT NULL,
  skill_id     INT UNSIGNED NOT NULL,
  enrolled_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  progress_pct TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '0-100',
  status       ENUM('enrolled','in_progress','completed') NOT NULL DEFAULT 'enrolled',
  completed_at TIMESTAMP,
  FOREIGN KEY (user_id)  REFERENCES users(id)  ON DELETE CASCADE,
  FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
  UNIQUE KEY uq_user_skill (user_id, skill_id),
  INDEX idx_user   (user_id),
  INDEX idx_skill  (skill_id),
  INDEX idx_status (status)
) ENGINE=InnoDB;

-- ============================================================
-- 7. LESSON PROGRESS
-- ============================================================
CREATE TABLE IF NOT EXISTS lesson_progress (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id      INT UNSIGNED NOT NULL,
  lesson_id    INT UNSIGNED NOT NULL,
  is_completed BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at TIMESTAMP,
  FOREIGN KEY (user_id)   REFERENCES users(id)   ON DELETE CASCADE,
  FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
  UNIQUE KEY uq_user_lesson (user_id, lesson_id)
) ENGINE=InnoDB;

-- ============================================================
-- 8. CERTIFICATES
-- ============================================================
CREATE TABLE IF NOT EXISTS certificates (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id         INT UNSIGNED NOT NULL,
  skill_id        INT UNSIGNED NOT NULL,
  certificate_uid VARCHAR(64)  NOT NULL UNIQUE COMMENT 'public verification code',
  issued_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)  REFERENCES users(id)  ON DELETE CASCADE,
  FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
  UNIQUE KEY uq_user_skill_cert (user_id, skill_id),
  INDEX idx_user  (user_id),
  INDEX idx_skill (skill_id)
) ENGINE=InnoDB;

-- ============================================================
-- 9. BADGES
-- ============================================================
CREATE TABLE IF NOT EXISTS badges (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id    INT UNSIGNED NOT NULL,
  skill_id   INT UNSIGNED NOT NULL,
  level      ENUM('bronze','silver','gold') NOT NULL DEFAULT 'bronze',
  earned_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)  REFERENCES users(id)  ON DELETE CASCADE,
  FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
  UNIQUE KEY uq_user_skill_badge (user_id, skill_id),
  INDEX idx_user  (user_id),
  INDEX idx_level (level)
) ENGINE=InnoDB;

-- ============================================================
-- 10. PRODUCTS (Marketplace)
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  seller_id     INT UNSIGNED NOT NULL,
  category_id   INT UNSIGNED,
  name          VARCHAR(200) NOT NULL,
  description   TEXT,
  price_ugx     INT UNSIGNED NOT NULL,
  image_url     VARCHAR(500),
  image_emoji   VARCHAR(10),
  location      VARCHAR(100),
  stock_qty     SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  is_featured   BOOLEAN NOT NULL DEFAULT FALSE,
  rating_avg    DECIMAL(3,2) NOT NULL DEFAULT 0.00,
  review_count  SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (seller_id)   REFERENCES users(id)             ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES skill_categories(id)  ON DELETE SET NULL,
  INDEX idx_seller   (seller_id),
  INDEX idx_category (category_id),
  INDEX idx_featured (is_featured),
  INDEX idx_active   (is_active),
  FULLTEXT idx_search (name, description)
) ENGINE=InnoDB;

-- ============================================================
-- 11. ORDERS
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  buyer_id       INT UNSIGNED NOT NULL,
  total_ugx      INT UNSIGNED NOT NULL DEFAULT 0,
  status         ENUM('pending','confirmed','processing','shipped','delivered','cancelled','refunded')
                 NOT NULL DEFAULT 'pending',
  delivery_address TEXT,
  notes          TEXT,
  placed_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE RESTRICT,
  INDEX idx_buyer  (buyer_id),
  INDEX idx_status (status)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS order_items (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id     INT UNSIGNED NOT NULL,
  product_id   INT UNSIGNED NOT NULL,
  seller_id    INT UNSIGNED NOT NULL,
  quantity     TINYINT UNSIGNED NOT NULL DEFAULT 1,
  unit_price   INT UNSIGNED NOT NULL,
  total_price  INT UNSIGNED NOT NULL,
  FOREIGN KEY (order_id)   REFERENCES orders(id)   ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
  FOREIGN KEY (seller_id)  REFERENCES users(id)    ON DELETE RESTRICT,
  INDEX idx_order   (order_id),
  INDEX idx_product (product_id),
  INDEX idx_seller  (seller_id)
) ENGINE=InnoDB;

-- ============================================================
-- 12. REVIEWS
-- ============================================================
CREATE TABLE IF NOT EXISTS reviews (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  product_id  INT UNSIGNED NOT NULL,
  reviewer_id INT UNSIGNED NOT NULL,
  rating      TINYINT UNSIGNED NOT NULL COMMENT '1-5',
  comment     TEXT,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id)  REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewer_id) REFERENCES users(id)    ON DELETE CASCADE,
  UNIQUE KEY uq_product_reviewer (product_id, reviewer_id),
  INDEX idx_product (product_id),
  CHECK (rating BETWEEN 1 AND 5)
) ENGINE=InnoDB;

-- ============================================================
-- 13. MESSAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS messages (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  sender_id   INT UNSIGNED NOT NULL,
  receiver_id INT UNSIGNED NOT NULL,
  content     TEXT NOT NULL,
  is_read     BOOLEAN NOT NULL DEFAULT FALSE,
  sent_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id)   REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_sender   (sender_id),
  INDEX idx_receiver (receiver_id),
  INDEX idx_is_read  (is_read)
) ENGINE=InnoDB;

-- ============================================================
-- 14. NOTIFICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id    INT UNSIGNED NOT NULL,
  type       VARCHAR(50)  NOT NULL COMMENT 'e.g. order_placed, certificate_earned, badge_earned',
  title      VARCHAR(200) NOT NULL,
  body       TEXT,
  is_read    BOOLEAN NOT NULL DEFAULT FALSE,
  data_json  JSON,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user    (user_id),
  INDEX idx_is_read (is_read)
) ENGINE=InnoDB;

-- ============================================================
-- 15. BABY HEALTH RECORDS
-- ============================================================
CREATE TABLE IF NOT EXISTS baby_profiles (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id    INT UNSIGNED NOT NULL,
  baby_name  VARCHAR(100),
  dob        DATE,
  gender     ENUM('male','female','other'),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user (user_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS anc_visits (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id    INT UNSIGNED NOT NULL,
  visit_num  TINYINT UNSIGNED NOT NULL COMMENT '1-4 standard ANC visits',
  visit_date DATE NOT NULL,
  notes      TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY uq_user_visit (user_id, visit_num),
  INDEX idx_user (user_id)
) ENGINE=InnoDB;

-- ============================================================
-- 16. INCOME TRACKER
-- ============================================================
CREATE TABLE IF NOT EXISTS income_records (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id     INT UNSIGNED NOT NULL,
  amount_ugx  INT UNSIGNED NOT NULL,
  source      VARCHAR(150) COMMENT 'e.g. product sale, service',
  description TEXT,
  recorded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user (user_id),
  INDEX idx_date (recorded_at)
) ENGINE=InnoDB;

-- ============================================================
-- 17. SESSIONS (auth tokens)
-- ============================================================
CREATE TABLE IF NOT EXISTS user_sessions (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id    INT UNSIGNED NOT NULL,
  token_hash VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user       (user_id),
  INDEX idx_token_hash (token_hash),
  INDEX idx_expires    (expires_at)
) ENGINE=InnoDB;

-- ============================================================
-- 18. SAMPLE DATA (for testing / development)
-- ============================================================

-- Sample admin user (password: root)
INSERT IGNORE INTO users (first_name, last_name, phone, email, password_hash, user_type, district, locale) VALUES
  ('Admin', 'CraftHub', '+256700000001', 'admin@crafthub.ug',
   '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMeSSqAzQ7pPr7sNKmHCOZoV0e',
   'admin', 'Kampala', 'en');

-- Sample caregiver users
INSERT IGNORE INTO users (first_name, last_name, phone, email, password_hash, user_type, district, num_children, locale) VALUES
  ('Grace',  'Namutebi', '+256701000001', 'grace@crafthub.ug',  '$2b$12$sample1', 'caregiver', 'Mukono',  2, 'lg'),
  ('Sarah',  'Nakato',   '+256701000002', 'sarah@crafthub.ug',  '$2b$12$sample2', 'caregiver', 'Kampala', 1, 'en'),
  ('Mary',   'Akello',   '+256701000003', 'mary@crafthub.ug',   '$2b$12$sample3', 'caregiver', 'Wakiso',  3, 'ac'),
  ('Joy',    'Atim',     '+256701000004', 'joy@crafthub.ug',    '$2b$12$sample4', 'caregiver', 'Jinja',   0, 'teo'),
  ('Ruth',   'Auma',     '+256701000005', 'ruth@crafthub.ug',   '$2b$12$sample5', 'caregiver', 'Mukono',  2, 'en');

-- Sample buyer user
INSERT IGNORE INTO users (first_name, last_name, phone, email, password_hash, user_type, district, locale) VALUES
  ('Joshua', 'Odaga',    '+256702000001', 'joshua@crafthub.ug', '$2b$12$sample6', 'buyer',     'Kampala', 'en');

-- ============================================================
-- VIEWS (convenience queries)
-- ============================================================

CREATE OR REPLACE VIEW v_user_stats AS
SELECT
  u.id,
  u.first_name,
  u.district,
  COUNT(DISTINCT ue.skill_id)                                         AS skills_enrolled,
  COUNT(DISTINCT CASE WHEN ue.status = 'completed' THEN ue.skill_id END) AS skills_completed,
  COUNT(DISTINCT c.id)                                                AS certificates,
  COUNT(DISTINCT b.id)                                                AS badges,
  COALESCE(SUM(ir.amount_ugx), 0)                                     AS total_income_ugx
FROM users u
LEFT JOIN user_enrolments ue ON ue.user_id = u.id
LEFT JOIN certificates     c  ON c.user_id  = u.id
LEFT JOIN badges           b  ON b.user_id  = u.id
LEFT JOIN income_records   ir ON ir.user_id = u.id
GROUP BY u.id;

CREATE OR REPLACE VIEW v_product_listing AS
SELECT
  p.id,
  p.name,
  p.price_ugx,
  p.image_emoji,
  p.location,
  p.rating_avg,
  p.review_count,
  p.is_featured,
  u.first_name  AS seller_name,
  u.district    AS seller_district,
  sc.name       AS category
FROM products p
JOIN users u            ON u.id  = p.seller_id
LEFT JOIN skill_categories sc ON sc.id = p.category_id
WHERE p.is_active = TRUE;

CREATE OR REPLACE VIEW v_leaderboard AS
SELECT
  u.id,
  u.first_name,
  u.district,
  COUNT(DISTINCT c.id)           AS certificates_earned,
  COALESCE(SUM(ir.amount_ugx),0) AS total_income_ugx,
  COUNT(DISTINCT b.id)           AS badges_earned
FROM users u
LEFT JOIN certificates  c  ON c.user_id  = u.id
LEFT JOIN income_records ir ON ir.user_id = u.id
LEFT JOIN badges         b  ON b.user_id  = u.id
WHERE u.user_type = 'caregiver'
GROUP BY u.id
ORDER BY certificates_earned DESC, total_income_ugx DESC;

-- ============================================================
-- STORED PROCEDURES
-- ============================================================

DELIMITER $$

-- Procedure: Complete a course and award certificate + badge
CREATE PROCEDURE IF NOT EXISTS sp_complete_course(
  IN p_user_id  INT UNSIGNED,
  IN p_skill_id INT UNSIGNED
)
BEGIN
  DECLARE v_uid VARCHAR(64);
  DECLARE v_difficulty VARCHAR(20);
  DECLARE v_level ENUM('bronze','silver','gold');

  -- Generate unique certificate ID
  SET v_uid = REPLACE(UUID(), '-', '');

  -- Get skill difficulty
  SELECT difficulty INTO v_difficulty FROM skills WHERE id = p_skill_id;

  SET v_level = CASE v_difficulty
    WHEN 'Beginner'     THEN 'bronze'
    WHEN 'Intermediate' THEN 'silver'
    WHEN 'Advanced'     THEN 'gold'
    ELSE 'bronze'
  END;

  -- Mark enrolment complete
  UPDATE user_enrolments
  SET status = 'completed', progress_pct = 100, completed_at = NOW()
  WHERE user_id = p_user_id AND skill_id = p_skill_id;

  -- Award certificate (ignore if already exists)
  INSERT IGNORE INTO certificates (user_id, skill_id, certificate_uid)
  VALUES (p_user_id, p_skill_id, v_uid);

  -- Award badge (ignore if already exists)
  INSERT IGNORE INTO badges (user_id, skill_id, level)
  VALUES (p_user_id, p_skill_id, v_level);

  -- Create notification
  INSERT INTO notifications (user_id, type, title, body, data_json)
  SELECT p_user_id,
         'certificate_earned',
         CONCAT('Certificate Earned: ', s.name),
         CONCAT('Congratulations! You have earned a ', v_level, ' badge for completing ', s.name),
         JSON_OBJECT('skill_id', p_skill_id, 'badge_level', v_level, 'cert_uid', v_uid)
  FROM skills s WHERE s.id = p_skill_id;

  SELECT v_uid AS certificate_uid, v_level AS badge_level;
END$$

DELIMITER ;

-- ============================================================
-- END OF SCHEMA
-- ============================================================
