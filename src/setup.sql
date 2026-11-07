CREATE TABLE IF NOT EXISTS organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');

CREATE TABLE IF NOT EXISTS service_project (
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(200) NOT NULL,
    project_date DATE NOT NULL,
    FOREIGN KEY (organization_id) REFERENCES organization (organization_id)
);

INSERT INTO service_project (organization_id, title, description, location, project_date) VALUES
-- BrightFuture Builders (1)
(1, 'Community Playground Build', 'Volunteers build a new playground for neighborhood children.', 'Harare Central Park', '2026-12-05'),
(1, 'Home Repair Day', 'Repairing roofs and doors for elderly residents.', 'Mbare', '2026-12-12'),
(1, 'School Classroom Painting', 'Painting and repairing classrooms at a local primary school.', 'Chitungwiza', '2027-01-16'),
(1, 'Footbridge Construction', 'Building a safe footbridge over a seasonal stream.', 'Borrowdale', '2027-02-06'),
(1, 'Community Hall Renovation', 'Renovating the community hall roof and floors.', 'Highfield', '2027-03-13'),
-- GreenHarvest Growers (2)
(2, 'Urban Garden Planting', 'Planting vegetables in a shared neighborhood garden.', 'Glen Norah', '2026-12-08'),
(2, 'Composting Workshop', 'Teaching families how to compost kitchen waste.', 'Avondale', '2026-12-19'),
(2, 'School Garden Setup', 'Building raised garden beds with students.', 'Mabelreign', '2027-01-23'),
(2, 'Harvest Festival', 'Community harvest sharing and food donation drive.', 'Harare Gardens', '2027-02-20'),
(2, 'Seed Swap Day', 'Neighbors exchange seeds and gardening tips.', 'Waterfalls', '2027-03-20'),
-- UnityServe Volunteers (3)
(3, 'Food Bank Sorting', 'Sorting and packing donations for local families.', 'Eastlea', '2026-12-10'),
(3, 'Neighborhood Clean-Up', 'Collecting litter along streets and public spaces.', 'Epworth', '2026-12-20'),
(3, 'Winter Clothing Drive', 'Collecting and distributing blankets and warm clothes.', 'Hatfield', '2027-01-30'),
(3, 'Charity Fun Run', 'Fundraising run supporting local charities.', 'Sam Nujoma Street', '2027-02-27'),
(3, 'Volunteer Orientation Day', 'Training new volunteers and matching them with projects.', 'Harare CBD', '2027-03-06');

CREATE TABLE IF NOT EXISTS category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS project_category (
    project_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    PRIMARY KEY (project_id, category_id),
    FOREIGN KEY (project_id) REFERENCES service_project (project_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES category (category_id) ON DELETE CASCADE
);

INSERT INTO category (name) VALUES
('Environmental'),
('Education'),
('Community Support'),
('Infrastructure');

-- 1 Environmental, 2 Education, 3 Community Support, 4 Infrastructure
INSERT INTO project_category (project_id, category_id) VALUES
(1, 4), (1, 3),
(2, 4), (2, 3),
(3, 2), (3, 4),
(4, 4), (4, 1),
(5, 4),
(6, 1), (6, 3),
(7, 1), (7, 2),
(8, 2), (8, 1),
(9, 3),
(10, 1),
(11, 3),
(12, 1), (12, 3),
(13, 3),
(14, 3),
(15, 2), (15, 3);