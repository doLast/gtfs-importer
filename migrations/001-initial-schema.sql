PRAGMA foreign_keys = false;

-- ----------------------------
--  Table structure for "calendar"
-- ----------------------------
DROP TABLE IF EXISTS "calendar";
CREATE TABLE "calendar" (
	 "service_id" text NOT NULL,
	 "monday" integer(1,0) NOT NULL,
	 "tuesday" integer(1,0) NOT NULL,
	 "wednesday" integer(1,0) NOT NULL,
	 "thursday" integer(1,0) NOT NULL,
	 "friday" integer(1,0) NOT NULL,
	 "saturday" integer(1,0) NOT NULL,
	 "sunday" integer(1,0) NOT NULL,
	 "start_date" integer NOT NULL,
	 "end_date" integer NOT NULL,
	PRIMARY KEY("service_id")
);

-- ----------------------------
--  Table structure for "calendar_dates"
-- ----------------------------
DROP TABLE IF EXISTS "calendar_dates";
CREATE TABLE "calendar_dates" (
	 "service_id" text NOT NULL,
	 "date" integer NOT NULL,
	 "exception_type" integer NOT NULL,
	 PRIMARY KEY("service_id","date")
);

-- ----------------------------
--  Table structure for "routes"
-- ----------------------------
DROP TABLE IF EXISTS "routes";
CREATE TABLE "routes" (
	 "route_id" integer NOT NULL,
	 "route_short_name" text NOT NULL,
	 "route_long_name" text NOT NULL,
	 "route_desc" text,
	 "route_type" integer NOT NULL,
	 "route_url" text,
	 "route_color" text,
	 "route_text_color" text,
	PRIMARY KEY("route_id")
);

-- ----------------------------
--  Table structure for "shapes"
-- ----------------------------
DROP TABLE IF EXISTS "shapes";
CREATE TABLE "shapes" (
	 "shape_id" integer NOT NULL,
	 "shape_pt_lat" real NOT NULL,
	 "shape_pt_lon" real NOT NULL,
	 "shape_pt_sequence" integer NOT NULL,
	 "shape_dist_traveled" real,
	PRIMARY KEY("shape_id","shape_pt_sequence")
);

-- ----------------------------
--  Table structure for "stop_times"
-- ----------------------------
DROP TABLE IF EXISTS "stop_times";
CREATE TABLE "stop_times" (
	 "trip_id" integer NOT NULL,
	 "arrival_time" integer NOT NULL,
	 "departure_time" integer NOT NULL,
	 "stop_id" integer NOT NULL,
	 "stop_sequence" integer NOT NULL,
	 "stop_headsign" text,
	 "pickup_type" integer,
	 "drop_off_type" integer,
	 "shape_dist_traveled" real,
	 "timepoint" integer,
	PRIMARY KEY("trip_id","stop_sequence"),
	FOREIGN KEY ("trip_id") REFERENCES "trips" ("trip_id") ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY ("stop_id") REFERENCES "stops" ("stop_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- ----------------------------
--  Table structure for "stops"
-- ----------------------------
DROP TABLE IF EXISTS "stops";
CREATE TABLE "stops" (
	 "stop_id" integer NOT NULL,
	 "stop_code" text,
	 "stop_name" text NOT NULL,
	 "stop_desc" text,
	 "stop_lat" real NOT NULL,
	 "stop_lon" real NOT NULL,
	 "zone_id" text,
	 "stop_url" text,
	 "location_type" integer,
	 "parent_station" integer,
	 "stop_timezone" text,
	 "wheelchair_boarding" integer,
	PRIMARY KEY("stop_id")
);

-- ----------------------------
--  Table structure for "trips"
-- ----------------------------
DROP TABLE IF EXISTS "trips";
CREATE TABLE "trips" (
	 "route_id" integer NOT NULL,
	 "service_id" text NOT NULL,
	 "trip_id" integer NOT NULL,
	 "trip_headsign" text,
	 "trip_short_name" text,
	 "direction_id" integer,
	 "block_id" integer,
	 "shape_id" integer,
	 "wheelchair_accessible" integer,
	 "bikes_allowed" integer,
	PRIMARY KEY("trip_id"),
	FOREIGN KEY ("route_id") REFERENCES "routes" ("route_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- ----------------------------
--  Indexes structure for table "routes"
-- ----------------------------
CREATE INDEX "routes_id" ON routes (route_id);

-- ----------------------------
--  Indexes structure for table "stop_times"
-- ----------------------------
CREATE INDEX "stop_times_stop_id" ON stop_times (stop_id);
CREATE INDEX "stop_times_trip_id" ON stop_times (trip_id);

-- ----------------------------
--  Indexes structure for table "stops"
-- ----------------------------
CREATE INDEX "stop_id" ON stops (stop_id);

-- ----------------------------
--  Indexes structure for table "trips"
-- ----------------------------
CREATE INDEX "trips_route_id" ON trips (route_id);
CREATE INDEX "trips_service_id" ON trips (service_id);

PRAGMA foreign_keys = true;
