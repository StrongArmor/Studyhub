CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'tutor', 'admin')),
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  avatar TEXT
);

CREATE TABLE IF NOT EXISTS tutors (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT,
  name TEXT NOT NULL,
  initials TEXT NOT NULL,
  subjects_json TEXT NOT NULL,
  rating REAL NOT NULL,
  reviews INTEGER NOT NULL,
  price INTEGER NOT NULL,
  sessions INTEGER NOT NULL,
  status TEXT NOT NULL,
  bio TEXT NOT NULL,
  "desc" TEXT,
  color TEXT,
  time_slot TEXT,
  available_slots_json TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  skills_json TEXT NOT NULL DEFAULT '[]',
  cover_image TEXT NOT NULL DEFAULT '',
  total_hours INTEGER NOT NULL DEFAULT 0,
  total_students INTEGER NOT NULL DEFAULT 0,
  schedule_slots_json TEXT NOT NULL DEFAULT '[]',
  selected_slots_json TEXT NOT NULL DEFAULT '[]',
  decline_count INTEGER NOT NULL DEFAULT 0
);

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'uq_tutors_user') THEN
    ALTER TABLE tutors ADD CONSTRAINT uq_tutors_user UNIQUE (user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_tutors_user') THEN
    ALTER TABLE tutors ADD CONSTRAINT fk_tutors_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS bookings (
  id BIGSERIAL PRIMARY KEY,
  tutor_id BIGINT,
  student_id BIGINT,
  tutor_name TEXT,
  tutor_initials TEXT,
  tutor_color TEXT,
  subject TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  duration INTEGER NOT NULL,
  price INTEGER NOT NULL,
  status TEXT NOT NULL,
  review_json TEXT,
  meet_link TEXT,
  created_at TEXT NOT NULL
);

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_bookings_tutor') THEN
    ALTER TABLE bookings ADD CONSTRAINT fk_bookings_tutor FOREIGN KEY (tutor_id) REFERENCES users(id) ON DELETE SET NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_bookings_student') THEN
    ALTER TABLE bookings ADD CONSTRAINT fk_bookings_student FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE SET NULL;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS applications (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subjects_json TEXT NOT NULL,
  education TEXT,
  experience TEXT,
  price TEXT,
  bio TEXT,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL
);

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_applications_user') THEN
    ALTER TABLE applications ADD CONSTRAINT fk_applications_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS activities (
  id BIGSERIAL PRIMARY KEY,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  detail TEXT NOT NULL,
  time TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS reports (
  id BIGSERIAL PRIMARY KEY,
  booking_id INTEGER NOT NULL,
  tutor_id BIGINT,
  student_id BIGINT,
  tutor_name TEXT,
  student_name TEXT,
  issue TEXT NOT NULL,
  detail TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL
);

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_reports_tutor') THEN
    ALTER TABLE reports ADD CONSTRAINT fk_reports_tutor FOREIGN KEY (tutor_id) REFERENCES users(id) ON DELETE SET NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_reports_student') THEN
    ALTER TABLE reports ADD CONSTRAINT fk_reports_student FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE SET NULL;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS wallet (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL UNIQUE,
  balance INTEGER NOT NULL DEFAULT 0,
  banks_json TEXT NOT NULL DEFAULT '[]'
);

CREATE TABLE IF NOT EXISTS wallet_transactions (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT,
  label TEXT NOT NULL,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('in', 'out')),
  time TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS tutor_certificates (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT,
  name TEXT NOT NULL,
  url TEXT,
  issued_at TEXT NOT NULL
);

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_tutor_cert_user') THEN
    ALTER TABLE tutor_certificates ADD CONSTRAINT fk_tutor_cert_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS tutor_documents (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT,
  name TEXT NOT NULL,
  url TEXT,
  uploaded_at TEXT NOT NULL
);

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_tutor_doc_user') THEN
    ALTER TABLE tutor_documents ADD CONSTRAINT fk_tutor_doc_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS tutor_reviews (
  id BIGSERIAL PRIMARY KEY,
  tutor_user_id BIGINT NOT NULL,
  student_id BIGINT,
  booking_id BIGINT,
  rating INTEGER NOT NULL,
  comment TEXT,
  created_at TEXT NOT NULL
);

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_tutor_reviews_tutor') THEN
    ALTER TABLE tutor_reviews ADD CONSTRAINT fk_tutor_reviews_tutor FOREIGN KEY (tutor_user_id) REFERENCES users(id) ON DELETE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_tutor_reviews_student') THEN
    ALTER TABLE tutor_reviews ADD CONSTRAINT fk_tutor_reviews_student FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE SET NULL;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS otp_sessions (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL,
  expires_at BIGINT NOT NULL,
  created_at TEXT NOT NULL
);
