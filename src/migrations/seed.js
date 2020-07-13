import { hashSync } from 'bcryptjs';

const userpassword = hashSync(process.env.DEFAULT_KEY, 10);
const adminpassword = hashSync(process.env.DEFAULT_KEY, 16);


const seedUserTable = `
INSERT INTO users (first_name,last_name,email,phonenumber,admin,password)
VALUES ('frryy','tytrt','ggtr@gmail.com','08082466922',false,'${userpassword}');
`;

const seedAdminTable =`
INSERT INTO users (first_name,last_name,email,phonenumber,admin,password)
VALUES ('ilerioluwa','adebayo','adebayorilerioluwa@gmail.com','08082466922',true,'${adminpassword}');
`;

const seedCategorytable =`
INSERT INTO categories (slug, name) VALUES('graphicsdesign', 'Graphics Design');
INSERT INTO categories (slug, name) VALUES('webdevelopment', 'Web Development');
INSERT INTO categories (slug, name) VALUES('errands', 'City Errands');
INSERT INTO categories (slug, name) VALUES('laundry', 'Cleaning and laundry');
INSERT INTO categories (slug, name) VALUES('electrician', 'Electrician');
INSERT INTO categories (slug, name) VALUES('plumbing', 'Plumbing');
INSERT INTO categories (slug, name) VALUES('tutoring', 'Tutoring');
INSERT INTO categories (slug, name) VALUES('shopping', 'Grocery shopping');
`;

const seedGenderTable =`
    INSERT INTO genders (name) VALUES ('male');
    INSERT INTO genders (name) VALUES ('female');
    INSERT INTO genders (name) VALUES ('others');
`;

const seed = async (pool) =>{
    try {
        await pool.query(seedUserTable);
        await pool.query(seedAdminTable);
        await pool.query(seedCategorytable);
        await pool.query(seedGenderTable);
        return true
    } catch (error) {
     throw error   
    }
}

export default seed;