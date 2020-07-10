import { hashSync } from "bcryptjs";

const userpassword = hashSync(process.env.DEFAULT_KEY, 10);
const adminpassword = hashSync(process.env.DEFAULT_KEY, 16);


const seedUserTable = `
INSERT INTO users (email, first_name, last_name, phonenumber, admin, password)
VALUES ("adeilerioluwa@gmail.com", "adebayo", "ilerioluwa", "08082466922", FALSE, ${userpassword});
INSERT INTO users (email, first_name, last_name, phonenumber, admin, password)
VALUES ("tobianani@gmail.com", "Tobiloba", "Anani", "08083466922", FALSE, ${userpassword});
`;

const seedAdminTable =`
INSERT INTO users (email, first_name, last_name, phonenumber, admin, password)
VALUES ("adebayorilerioluwa@gmail.com", "adebayo", "ilerioluwa", "08082466922", TRUE, ${adminpassword})
INSERT INTO users (email, first_name, last_name, phonenumber, admin, password)
VALUES ("tobianani@gmail.com", "Tobiloba", "Anani", "08083466922", FALSE, ${adminpassword});
`;

const seedCategorytable =`
INSERT INTO categories (slug, name) VALUES("graphicsdesign", "Graphics Design");
INSERT INTO categories (slug, name) VALUES("webdevelopment", "Web Development");
INSERT INTO categories (slug, name) VALUES("errands", "City Errands");
INSERT INTO categories (slug, name) VALUES("laundry", "Cleaning and laundry");
INSERT INTO categories (slug, name) VALUES("electrician", "Electrician");
INSERT INTO categories (slug, name) VALUES("plumbing", "Plumbing");
INSERT INTO categories (slug, name) VALUES("tutoring", "Tutoring");
INSERT INTO categories (slug, name) VALUES("shopping", "Grocery shopping");
`;

const seedGenderTable =`
    INSERT INTO genders (name) VALUES ("male");
    INSERT INTO genders (name) VALUES ("female");
    INSERT INTO genders (name) VALUES ("others");
`

const seed = async (pool) =>{
    await pool.query(seedUserTable);
    await pool.query(seedAdminTable);
    await pool.query(seedCategorytable);
    await pool.query(seedGenderTable);
}

export default seed;