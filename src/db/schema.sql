CREATE DATABASE mediflow;

CREATE TABLE
	users (
		id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
		name VARCHAR(50) NOT NULL,
		surname VARCHAR(50) NOT NULL,
		email VARCHAR(100) UNIQUE NOT NULL,
		password VARCHAR(255) NOT NULL,
		phone VARCHAR(20),
		role VARCHAR(10) NOT NULL DEFAULT 'patient' CHECK (role IN ('patient', 'admin')),
		created_at TIMESTAMP DEFAULT now ()
	);

CREATE TABLE
	specializations (
		id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
		specialization_name VARCHAR(100) UNIQUE NOT NULL
	);

CREATE TABLE
	doctors (
		id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
		name VARCHAR(50) NOT NULL,
		surname VARCHAR(50) NOT NULL,
		phone VARCHAR(20),
		specialization_id UUID REFERENCES specializations (id) ON DELETE SET NULL,
		category VARCHAR(10) NOT NULL CHECK (category IN ('first', 'second', 'highest')),
		bio TEXT,
		created_at TIMESTAMP DEFAULT now ()
	);

CREATE TABLE
	schedules (
		id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
		doctor_id UUID REFERENCES doctors (id) ON DELETE CASCADE,
		day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 1 AND 7),
		time_start TIME NOT NULL,
		time_end TIME NOT NULL,
		slot_duration_minutes INTEGER NOT NULL DEFAULT 60
	);

CREATE TABLE
	appointments (
		id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
		user_id UUID REFERENCES users (id) ON DELETE CASCADE,
		doctor_id UUID REFERENCES doctors (id) ON DELETE CASCADE,
		date DATE NOT NULL,
		time TIME NOT NULL,
		status VARCHAR(15) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
		created_at TIMESTAMP DEFAULT now (),
		UNIQUE (doctor_id, date, time)
	);