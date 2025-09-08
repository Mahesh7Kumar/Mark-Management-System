import pool from "./db.js";

async function createTables() {
  try {
    // Drop tables if they already exist
    await pool.query(`DROP TABLE IF EXISTS comments`);
    await pool.query(`DROP TABLE IF EXISTS students`);

    // Create students table
    await pool.query(`
      CREATE TABLE students (
        id SERIAL PRIMARY KEY,
        class INT NOT NULL,
        name VARCHAR(100) NOT NULL,
        physics INT CHECK (physics >= 0 AND physics <= 100),
        chemistry INT CHECK (chemistry >= 0 AND chemistry <= 100),
        english INT CHECK (english >= 0 AND english <= 100),
        tamil INT CHECK (tamil >= 0 AND tamil <= 100)
      )
    `);

    // Create comments table
    await pool.query(`
      CREATE TABLE comments (
        id SERIAL PRIMARY KEY,
        student_id INT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
        comment TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Seed student data
    await pool.query(`
      INSERT INTO students (name, class, physics, chemistry, english, tamil) VALUES
      ('Ram', 10, 95, 92, 91, 89),
      ('Anu', 10, 85, 78, 82, 80),
      ('Sita', 10, 70, 75, 80, 65),
      ('Ravi', 10, 82, 76, 88, 90),
              ('Ram', 10, 95, 92, 91, 89),
('Anu', 10, 85, 78, 82, 80),
('Sita', 10, 70, 75, 80, 65),
('Ravi', 10, 82, 76, 88, 90),
('Latha', 10, 72, 74, 78, 76),
('Deepa', 10, 80, 82, 84, 86),
('Hari', 10, 49, 51, 53, 55),
('Gopi', 10, 94, 96, 93, 95),
('Maya', 10, 57, 59, 61, 63),
('Sanjay', 10, 88, 84, 82, 86),
('Pooja', 10, 61, 63, 65, 67),
('Divakar', 10, 84, 86, 88, 90),
('Lalitha', 10, 56, 58, 60, 62),
('Rakesh', 10, 60, 62, 64, 66),
('Vijayalakshmi', 10, 55, 57, 59, 61),
('Mohan', 10, 85, 87, 89, 91),
('Anitha', 10, 54, 56, 58, 60),
('Radha', 10, 58, 60, 62, 64),
('Ajay', 10, 88, 84, 82, 86),
('Suma', 10, 83, 85, 87, 89),
('Bhavani', 10, 43, 45, 47, 49),
('Vasanth', 10, 87, 85, 88, 90),
('Ritu', 10, 87, 89, 91, 93),
('Gowtham', 10, 47, 49, 51, 53),
('Nisha', 10, 60, 62, 58, 64),

-- Class 11
('Kumar', 11, 78, 81, 85, 88),
('Sneha', 11, 45, 50, 55, 60),
('Priya', 11, 55, 60, 65, 70),
('Ramesh', 11, 83, 80, 85, 88),
('Anitha', 11, 66, 68, 70, 72),
('Vikram', 11, 92, 90, 94, 93),
('Arun', 11, 92, 90, 94, 93),
('Preethi', 11, 74, 76, 78, 80),
('Sujith', 11, 63, 65, 67, 69),
('Rohit', 11, 76, 78, 80, 82),
('Kavitha', 11, 95, 97, 96, 94),
('Ajitha', 11, 54, 56, 58, 60),
('Nandini', 11, 69, 71, 73, 75),
('Vimal', 11, 65, 67, 69, 71),
('Shalini', 11, 79, 81, 83, 85),
('Rashmi', 11, 66, 68, 70, 72),
('Anu', 11, 75, 77, 79, 81),
('Vasanthi', 11, 78, 80, 82, 84),
('Karthika', 11, 73, 75, 77, 79),
('Priya', 11, 45, 50, 55, 60),
('Mani', 11, 81, 79, 84, 82),
('Lakshmi', 11, 55, 60, 65, 70),
('Dinesh', 11, 59, 61, 63, 65),
('Nitin', 11, 68, 70, 72, 74),
('Arjun', 11, 80, 82, 84, 86),

-- Class 12
('Divya', 12, 96, 94, 92, 91),
('Ajay', 12, 89, 85, 87, 90),
('Nisha', 12, 47, 52, 49, 51),
('Karthik', 12, 91, 89, 90, 92),
('Deepa', 12, 47, 52, 49, 51),
('Swathi', 12, 44, 46, 48, 50),
('Ashok', 12, 93, 95, 94, 92),
('Anjali', 12, 91, 93, 92, 90),
('Ajith', 12, 88, 90, 89, 87),
('Raju', 12, 90, 92, 91, 89),
('Vijay', 12, 89, 85, 87, 90),
('Latha', 12, 73, 75, 77, 79),
('Meena', 12, 60, 62, 58, 64),
('Mani', 12, 81, 79, 84, 82),
('Pavan', 12, 91, 93, 92, 90),
('Kalyan', 12, 46, 48, 50, 52),
('Vijaya', 12, 89, 91, 90, 88),
('Kiranmai', 12, 44, 46, 48, 50),
('Hari', 12, 49, 51, 53, 55),
('Divya', 12, 88, 84, 82, 86),
('Rashmi', 12, 92, 94, 93, 91),
('Ajay', 12, 49, 51, 53, 55),
('Lakshmi', 12, 55, 60, 65, 70),
('Meera', 12, 67, 69, 71, 73),
('Lalitha', 12, 56, 58, 60, 62),`)

    console.log("✅ Tables created and data seeded successfully!");
  } catch (err) {
    console.error("❌ Error creating tables:", err);
  } finally {
    pool.end(); // close DB connection
  }
}

createTables();
