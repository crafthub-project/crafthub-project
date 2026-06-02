-- =============================================================
-- CraftHub Vocational Platform — MySQL Database Schema
-- Paste this entire file into MySQL Workbench and execute.
-- =============================================================

CREATE DATABASE IF NOT EXISTS crafthub_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE crafthub_db;

-- -------------------------------------------------------------
-- 1. USERS
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id            INT UNSIGNED     NOT NULL AUTO_INCREMENT,
  first_name    VARCHAR(100)     NOT NULL,
  phone         VARCHAR(20)      NOT NULL UNIQUE,
  password_hash VARCHAR(255)     NOT NULL,
  district      VARCHAR(100)         NULL,
  user_type     ENUM('caregiver','buyer','admin') NOT NULL DEFAULT 'caregiver',
  locale        VARCHAR(10)      NOT NULL DEFAULT 'en',
  avatar_url    VARCHAR(500)         NULL,
  is_active     TINYINT(1)       NOT NULL DEFAULT 1,
  created_at    DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_phone (phone),
  INDEX idx_user_type (user_type)
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- 2. SKILL CATEGORIES
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS skill_categories (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name       VARCHAR(100) NOT NULL UNIQUE,
  emoji      VARCHAR(10)      NULL,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

INSERT IGNORE INTO skill_categories (name, emoji) VALUES
  ('Baking',          '🍞'),
  ('Cooking',         '🍲'),
  ('Food Processing', '🍍'),
  ('Tailoring',       '🧵'),
  ('Textiles',        '🎨'),
  ('Crafts',          '🧺'),
  ('Agriculture',     '🌿'),
  ('Beauty',          '💄'),
  ('Services',        '🛠️');

-- -------------------------------------------------------------
-- 3. SKILLS
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS skills (
  id              INT UNSIGNED     NOT NULL AUTO_INCREMENT,
  category_id     INT UNSIGNED     NOT NULL,
  name            VARCHAR(200)     NOT NULL,
  emoji           VARCHAR(10)          NULL,
  description     TEXT                 NULL,
  difficulty      ENUM('Beginner','Intermediate','Advanced') NOT NULL DEFAULT 'Beginner',
  startup_cost    ENUM('Very Low','Low','Medium','High')     NOT NULL DEFAULT 'Low',
  income_level    ENUM('Low','Medium','High')                NOT NULL DEFAULT 'Medium',
  lessons_count   TINYINT UNSIGNED NOT NULL DEFAULT 8,
  time_to_learn   VARCHAR(50)          NULL,
  has_video       TINYINT(1)       NOT NULL DEFAULT 0,
  has_pdf         TINYINT(1)       NOT NULL DEFAULT 1,
  is_featured     TINYINT(1)       NOT NULL DEFAULT 0,
  created_at      DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_skills_category FOREIGN KEY (category_id) REFERENCES skill_categories(id) ON DELETE RESTRICT,
  INDEX idx_category (category_id),
  INDEX idx_difficulty (difficulty)
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- 4. SKILL LESSONS
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS skill_lessons (
  id           INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  skill_id     INT UNSIGNED  NOT NULL,
  lesson_order TINYINT UNSIGNED NOT NULL DEFAULT 1,
  title        VARCHAR(300)  NOT NULL,
  content_type ENUM('video','pdf','text') NOT NULL DEFAULT 'text',
  content_url  VARCHAR(500)      NULL,
  duration_min TINYINT UNSIGNED  NULL,
  created_at   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_lessons_skill FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
  UNIQUE KEY uq_skill_order (skill_id, lesson_order)
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- 5. USER SKILL PROGRESS
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_skill_progress (
  id                INT UNSIGNED      NOT NULL AUTO_INCREMENT,
  user_id           INT UNSIGNED      NOT NULL,
  skill_id          INT UNSIGNED      NOT NULL,
  lessons_completed TINYINT UNSIGNED  NOT NULL DEFAULT 0,
  is_completed      TINYINT(1)        NOT NULL DEFAULT 0,
  started_at        DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at      DATETIME              NULL,
  updated_at        DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_progress_user  FOREIGN KEY (user_id)  REFERENCES users(id)  ON DELETE CASCADE,
  CONSTRAINT fk_progress_skill FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
  UNIQUE KEY uq_user_skill (user_id, skill_id),
  INDEX idx_user (user_id),
  INDEX idx_skill (skill_id)
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- 6. CERTIFICATES
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS certificates (
  id              INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id         INT UNSIGNED NOT NULL,
  skill_id        INT UNSIGNED NOT NULL,
  certificate_uid VARCHAR(100) NOT NULL UNIQUE COMMENT 'UUID for public verification',
  issued_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_cert_user  FOREIGN KEY (user_id)  REFERENCES users(id)  ON DELETE CASCADE,
  CONSTRAINT fk_cert_skill FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
  UNIQUE KEY uq_user_skill_cert (user_id, skill_id),
  INDEX idx_user (user_id)
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- 7. BADGES
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS badges (
  id          INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  user_id     INT UNSIGNED  NOT NULL,
  skill_id    INT UNSIGNED  NOT NULL,
  level       ENUM('bronze','silver','gold') NOT NULL DEFAULT 'bronze',
  earned_at   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_badge_user  FOREIGN KEY (user_id)  REFERENCES users(id)  ON DELETE CASCADE,
  CONSTRAINT fk_badge_skill FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
  UNIQUE KEY uq_user_skill_badge (user_id, skill_id),
  INDEX idx_user (user_id)
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- 8. PRODUCTS (Marketplace)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
  id          INT UNSIGNED     NOT NULL AUTO_INCREMENT,
  seller_id   INT UNSIGNED     NOT NULL,
  skill_id    INT UNSIGNED         NULL COMMENT 'Skill this product is based on',
  name        VARCHAR(300)     NOT NULL,
  description TEXT                 NULL,
  price_ugx   DECIMAL(12,2)    NOT NULL,
  emoji       VARCHAR(10)          NULL,
  image_url   VARCHAR(500)         NULL,
  category    VARCHAR(100)     NOT NULL,
  location    VARCHAR(200)         NULL,
  stock       SMALLINT UNSIGNED NOT NULL DEFAULT 10,
  is_active   TINYINT(1)       NOT NULL DEFAULT 1,
  created_at  DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_product_seller FOREIGN KEY (seller_id) REFERENCES users(id)   ON DELETE CASCADE,
  CONSTRAINT fk_product_skill  FOREIGN KEY (skill_id)  REFERENCES skills(id)  ON DELETE SET NULL,
  INDEX idx_seller   (seller_id),
  INDEX idx_category (category),
  INDEX idx_active   (is_active)
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- 9. PRODUCT REVIEWS
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS product_reviews (
  id         INT UNSIGNED     NOT NULL AUTO_INCREMENT,
  product_id INT UNSIGNED     NOT NULL,
  buyer_id   INT UNSIGNED     NOT NULL,
  rating     TINYINT UNSIGNED NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment    TEXT                 NULL,
  created_at DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_review_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  CONSTRAINT fk_review_buyer   FOREIGN KEY (buyer_id)   REFERENCES users(id)    ON DELETE CASCADE,
  UNIQUE KEY uq_buyer_product (buyer_id, product_id),
  INDEX idx_product (product_id)
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- 10. ORDERS
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
  id           INT UNSIGNED   NOT NULL AUTO_INCREMENT,
  buyer_id     INT UNSIGNED   NOT NULL,
  total_ugx    DECIMAL(12,2)  NOT NULL,
  status       ENUM('pending','confirmed','shipped','delivered','cancelled') NOT NULL DEFAULT 'pending',
  delivery_address VARCHAR(500)   NULL,
  notes        TEXT               NULL,
  created_at   DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_order_buyer FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE RESTRICT,
  INDEX idx_buyer  (buyer_id),
  INDEX idx_status (status)
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- 11. ORDER ITEMS
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS order_items (
  id          INT UNSIGNED   NOT NULL AUTO_INCREMENT,
  order_id    INT UNSIGNED   NOT NULL,
  product_id  INT UNSIGNED   NOT NULL,
  quantity    SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  unit_price  DECIMAL(12,2)  NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_item_order   FOREIGN KEY (order_id)   REFERENCES orders(id)   ON DELETE CASCADE,
  CONSTRAINT fk_item_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
  INDEX idx_order (order_id)
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- 12. MESSAGES
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS messages (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  sender_id   INT UNSIGNED NOT NULL,
  receiver_id INT UNSIGNED NOT NULL,
  content     TEXT         NOT NULL,
  is_read     TINYINT(1)   NOT NULL DEFAULT 0,
  sent_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_msg_sender   FOREIGN KEY (sender_id)   REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_msg_receiver FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_receiver (receiver_id),
  INDEX idx_sender   (sender_id)
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- 13. NOTIFICATIONS
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS notifications (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id    INT UNSIGNED NOT NULL,
  type       VARCHAR(50)  NOT NULL COMMENT 'order_placed, lesson_completed, certificate_issued, etc.',
  title      VARCHAR(300) NOT NULL,
  body       TEXT             NULL,
  is_read    TINYINT(1)   NOT NULL DEFAULT 0,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_notif_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user   (user_id),
  INDEX idx_unread (user_id, is_read)
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- 14. BABY HEALTH RECORDS
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS baby_health_records (
  id             INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id        INT UNSIGNED NOT NULL,
  baby_name      VARCHAR(100)     NULL,
  birth_date     DATE             NULL,
  weight_kg      DECIMAL(5,3)     NULL,
  height_cm      DECIMAL(5,1)     NULL,
  anc_visit_no   TINYINT UNSIGNED NULL,
  visit_date     DATE             NULL,
  notes          TEXT             NULL,
  recorded_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_baby_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user (user_id)
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- 15. ANALYTICS EVENTS (lightweight event log)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS analytics_events (
  id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id    INT UNSIGNED        NULL,
  event_type VARCHAR(100)    NOT NULL COMMENT 'page_view, lesson_start, product_view, etc.',
  entity_id  INT UNSIGNED        NULL COMMENT 'skill_id / product_id depending on event',
  metadata   JSON                NULL,
  created_at DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_user  (user_id),
  INDEX idx_event (event_type),
  INDEX idx_date  (created_at)
) ENGINE=InnoDB;

-- =============================================================
-- USEFUL VIEWS
-- =============================================================

-- Seller dashboard summary
CREATE OR REPLACE VIEW v_seller_summary AS
SELECT
  u.id                            AS seller_id,
  u.first_name                    AS seller_name,
  COUNT(DISTINCT p.id)            AS total_products,
  COALESCE(SUM(oi.quantity * oi.unit_price), 0) AS total_revenue_ugx,
  COALESCE(AVG(pr.rating), 0)     AS avg_rating,
  COUNT(DISTINCT pr.id)           AS review_count
FROM users u
LEFT JOIN products p          ON p.seller_id = u.id AND p.is_active = 1
LEFT JOIN order_items oi      ON oi.product_id = p.id
LEFT JOIN product_reviews pr  ON pr.product_id = p.id
WHERE u.user_type = 'caregiver'
GROUP BY u.id, u.first_name;

-- Learner progress summary
CREATE OR REPLACE VIEW v_learner_progress AS
SELECT
  u.id                          AS user_id,
  u.first_name,
  COUNT(DISTINCT usp.skill_id)  AS skills_started,
  SUM(usp.is_completed)         AS skills_completed,
  COUNT(DISTINCT c.id)          AS certificates_earned,
  COUNT(DISTINCT b.id)          AS badges_earned
FROM users u
LEFT JOIN user_skill_progress usp ON usp.user_id = u.id
LEFT JOIN certificates c          ON c.user_id = u.id
LEFT JOIN badges b                ON b.user_id = u.id
GROUP BY u.id, u.first_name;

-- =============================================================
-- SEED: Demo admin user (password = 'root' — bcrypt in production)
-- =============================================================
INSERT IGNORE INTO users (id, first_name, phone, password_hash, district, user_type, locale)
VALUES (1, 'Admin', '+256700000000', '$2b$12$placeholder_hash_change_me', 'Kampala', 'admin', 'en');

-- =============================================================
-- END OF SCHEMA
-- =============================================================
