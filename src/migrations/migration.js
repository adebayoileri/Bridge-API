const createUserTable = `
    DROP TABLE IF EXISTS users CASCADE;
    CREATE TABLE users(
    id SERIAL PRIMARY KEY UNIQUE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phonenumber VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    admin BOOLEAN NOT NULL DEFAULT FALSE,
    password VARCHAR(255) NOT NULL,
    createdat TIMESTAMP NOT NULL DEFAULT NOW(),
    updatedat TIMESTAMP NOT NULL DEFAULT NOW(),
    pro BOOLEAN NOT NULL DEFAULT FALSE,
    suspend_status BOOLEAN NOT NULL DEFAULT FALSE,
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    auth_provider VARCHAR(40) NULL,
    gender_id int NULL,
    FOREIGN KEY (gender_id) REFERENCES "genders" (id) ON UPDATE CASCADE ON DELETE CASCADE
    );
`;

const createTaskTable = `
  DROP TABLE IF EXISTS tasks CASCADE;
  CREATE TABLE tasks(
      id SERIAL NOT NULL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      bannerImg VARCHAR(255) NOT NULL,
      category VARCHAR(30) NOT NULL,
      description VARCHAR(255) NOT NULL,
      user_id int NOT NULL,
      category_id int NOT NULL,
      status VARCHAR(30) NOT NULL DEFAULT 'pending',
      location VARCHAR(255) NOT NULL DEFAULT 'remote',
      minbudget VARCHAR(20) NOT NULL DEFAULT '0',
      maxbudget VARCHAR(20) NOT NULL,
      createdat TIMESTAMP NOT NULL DEFAULT NOW(),
      updatedat TIMESTAMP NOT NULL DEFAULT NOW(),
      startdate DATE NOT NULL,
      enddate DATE NOT NULL,
      FOREIGN KEY (user_id) REFERENCES "users" (id) ON UPDATE CASCADE ON DELETE CASCADE,
      FOREIGN KEY (category_id) REFERENCES "categories" (id) ON UPDATE CASCADE ON DELETE CASCADE
    );
`;
const createGenderTable = `
DROP TABLE IF EXISTS genders CASCADE;
CREATE TABLE genders(
    id SERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(20) NOT NULL,
    createdat TIMESTAMP NOT NULL DEFAULT NOW(),
    updatedat TIMESTAMP NOT NULL DEFAULT NOW()
)
`;
const createCategoryTable = `
    DROP TABLE IF EXISTS categories CASCADE;
    CREATE TABLE categories(
        id SERIAL NOT NULL PRIMARY KEY,
        slug VARCHAR(50) NOT NULL,
        name VARCHAR(255) NOT NULL,
        createdat TIMESTAMP NOT NULL DEFAULT NOW(),
        updatedat TIMESTAMP NOT NULL DEFAULT NOW()
    )
`;
const createReviewTable = `
        DROP TABLE IF EXISTS reviews CASCADE;
        CREATE TABLE reviews(
            id SERIAL NOT NULL PRIMARY KEY,
            rating int NOT NULL,
            review VARCHAR(255) NULL,
            createdat TIMESTAMP NOT NULL DEFAULT NOW(),
            updatedat TIMESTAMP NOT NULL DEFAULT NOW()
        )
`;
const createTaskUsersTable =`
DROP TABLE IF EXISTS task_user CASCADE;
CREATE TABLE task_user (
        task_id int REFERENCES tasks (id) ON UPDATE CASCADE ON DELETE CASCADE,
        user_id int REFERENCES users (id) ON UPDATE CASCADE,
        applicant_id int NOT NULL,
        proposal VARCHAR(255) NULL,
        status VARCHAR(30) NOT NULL DEFAULT 'pending',
        FOREIGN KEY (applicant_id) REFERENCES "users" (id) ON UPDATE CASCADE ON DELETE CASCADE,
        CONSTRAINT task_user_pkey PRIMARY KEY (task_id, user_id) 
  );
`;

const migrate = async (pool) => {
    try {
      await pool.query(createGenderTable);
      await pool.query(createUserTable);
      await pool.query(createCategoryTable);
      await pool.query(createTaskTable);
      await pool.query(createReviewTable);
      await pool.query(createTaskUsersTable);
      return true;
    } catch (err) {
      throw err;
    }
  };
  
  export default migrate;