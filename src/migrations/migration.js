const createUserTable = `
DROP TABLE IF EXISTS users CASCADE;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    CREATE TABLE IF NOT EXISTS 
    users(
    id UUID PRIMARY KEY NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    profileimg VARCHAR(225) NULL,
    phonenumber VARCHAR(50) NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    admin BOOLEAN NOT NULL DEFAULT false,
    password VARCHAR(255) NOT NULL,
    createdat TIMESTAMP NOT NULL DEFAULT NOW(),
    updatedat TIMESTAMP NOT NULL DEFAULT NOW(),
    pro BOOLEAN NOT NULL DEFAULT false,
    suspend_status BOOLEAN NOT NULL DEFAULT false,
    email_verified BOOLEAN NOT NULL DEFAULT false,
    auth_id int NULL, 
    auth_provider VARCHAR(40) NULL,
    gender_id int NULL,
    reset_password_token VARCHAR(250) NULL,
    FOREIGN KEY (gender_id) REFERENCES "genders" (id) ON UPDATE CASCADE ON DELETE CASCADE
    );
    `;
// auth_id int NULL, remember to add this in new migrated DB

// category_id int NOT NULL,
const createTaskTable = `
DROP TABLE IF EXISTS tasks CASCADE;
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    CREATE TABLE IF NOT EXISTS 
    tasks(
      id UUID PRIMARY KEY NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
      title VARCHAR(255) NOT NULL,
      bannerImg VARCHAR(255) NOT NULL,
      category VARCHAR(30) NOT NULL,
      description VARCHAR(1000) NOT NULL,
      user_id UUID NOT NULL,
      status VARCHAR(30) NOT NULL DEFAULT 'pending',
      location VARCHAR(255) NOT NULL DEFAULT 'remote',
      jobtype VARCHAR(20) NOT NULL DEFAULT 'part-time',
      pricetype VARCHAR(20) NOT NULL,
      fixedprice VARCHAR(20) NULL,
      minbudget VARCHAR(20) DEFAULT '0',
      maxbudget VARCHAR(20) NULL,
      createdat TIMESTAMP NOT NULL DEFAULT NOW(),
      updatedat TIMESTAMP NOT NULL DEFAULT NOW(),
      startdate DATE NOT NULL,
      enddate DATE NOT NULL,
      FOREIGN KEY (user_id) REFERENCES "users" (id) ON UPDATE CASCADE ON DELETE CASCADE
      );
`;
// FOREIGN KEY (category_id) REFERENCES "categories" (id) ON UPDATE CASCADE ON DELETE CASCADE

const createGenderTable = `
DROP TABLE IF EXISTS genders CASCADE;
CREATE TABLE IF NOT EXISTS 
genders(
    id SERIAL PRIMARY KEY NOT NULL UNIQUE,
    name VARCHAR(20) NOT NULL,
    createdat TIMESTAMP NOT NULL DEFAULT NOW(),
    updatedat TIMESTAMP NOT NULL DEFAULT NOW()
)
`;

const createCategoryTable = `
DROP TABLE IF EXISTS categories CASCADE;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE IF NOT EXISTS 
categories(
        id UUID PRIMARY KEY NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
        slug VARCHAR(50) NOT NULL,
        name VARCHAR(255) NOT NULL,
        createdat TIMESTAMP NOT NULL DEFAULT NOW(),
        updatedat TIMESTAMP NOT NULL DEFAULT NOW()
    );
`;

const createReviewTable = `
DROP TABLE IF EXISTS reviews CASCADE;
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    CREATE TABLE IF NOT EXISTS reviews(
           id UUID PRIMARY KEY NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
            rating int NOT NULL,
            review VARCHAR(255) NULL,
            reviewer UUID NOT NULL,
            reviewee UUID NOT NULL,
            createdat TIMESTAMP NOT NULL DEFAULT NOW(),
            updatedat TIMESTAMP NOT NULL DEFAULT NOW(),
            FOREIGN KEY (reviewer) REFERENCES "users" (id) ON UPDATE CASCADE ON DELETE CASCADE,
            FOREIGN KEY (reviewee) REFERENCES "users" (id) ON UPDATE CASCADE ON DELETE CASCADE
        );
`;

// ,FOREIGN KEY (reviwee) REFERENCES "users" (id) ON UPDATE CASCADE ON DELETE CASCADE

const createTaskUsersTable = `
DROP TABLE IF EXISTS task_user CASCADE;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE IF NOT EXISTS task_user (
        task_id UUID REFERENCES tasks (id) ON UPDATE CASCADE ON DELETE CASCADE,
        user_id UUID REFERENCES users (id) ON UPDATE CASCADE,
        applicant_id UUID NULL,
        proposal VARCHAR(255) NULL,
        status VARCHAR(30) NOT NULL DEFAULT 'pending',
        FOREIGN KEY (applicant_id) REFERENCES "users" (id) ON UPDATE CASCADE ON DELETE CASCADE,
        CONSTRAINT task_user_pkey PRIMARY KEY (task_id, user_id) 
  );
`;

const migrate = async pool => {
  try {
    await pool.query(createGenderTable);
    console.log('user gender table migrated');
    await pool.query(createUserTable);
    console.log('user  table migrated');
    await pool.query(createCategoryTable);
    console.log('category table migrated');
    await pool.query(createTaskTable);
    console.log('tasks table migrated');
    await pool.query(createReviewTable);
    console.log('user review table migrated');
    await pool.query(createTaskUsersTable);
    console.log('task_user table migrated');

    return true;
  } catch (err) {
    throw err;
  }
};

export default migrate;
