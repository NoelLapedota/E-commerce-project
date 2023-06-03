import connection from "../db/db.js";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

// A single function that creates tables  export default  async function tabels() {

export default async function tabels() {
  try {
    // Check if the 'accounts' table already exists
    const tableExists = await connection.schema.hasTable("accounts");

    if (!tableExists) {
      // If the table doesn't exist, create it with the corresponding columns
      await connection.schema.createTable("accounts", (table) => {
        table.increments("id").primary(); // Auto-incrementing ID column
        table.string("name", 255).notNullable(); // Name column
        table.string("surname", 255).notNullable(); // Name column
        table.string("username", 255).notNullable().unique(); // Unique username column
        table.string("role").notNullable(); // Role column
        table.string("password").notNullable(); // Password column
        table.string("email", 255).notNullable().unique(); // Unique email column
      });
      console.log("Table 'accounts' created successfully!");
    } else {
      console.log("The 'accounts' table already exists.");
    }
    //-----------------------------------------------------------------------------------------------------------
    // Check the count of admin users
    const adminCount = await connection("accounts")
      .where("role", "admin")
      .count("* as count")
      .first();

    // Check the count of user users
    const userCount = await connection("accounts")
      .where("role", "user")
      .count("* as count")
      .first();

    if (adminCount.count < 2) {
      // Hash the password
      const hashedPassword = await bcrypt.hash("admin123", 8);

      // Insert two admin users if there are fewer than 2
      await connection("accounts").insert([
        {
          name: "Admin 1",
          username: "admin1",
          surname: "chano",
          role: "admin",
          password: hashedPassword,
          email: "admin1@example.com",
        },
        {
          name: "Admin 2",
          username: "admin2",
          surname: "flori",
          role: "admin",
          password: hashedPassword,
          email: "admin2@example.com",
        },
      ]);
      console.log("Two admin users inserted successfully!");
    }

    if (userCount.count < 2) {
      // Hash the password
      const hashedPassword = await bcrypt.hash("user123", 8);

      // Insert two user users if there are fewer than 2
      await connection("accounts").insert([
        {
          name: "User 1",
          username: "user1",
          surname: "flori",
          role: "user",
          password: hashedPassword,
          email: "user1@example.com",
        },
        {
          name: "User 2",
          username: "user2",
          surname: "chano",
          role: "user",
          password: hashedPassword,
          email: "user2@example.com",
        },
      ]);
      console.log("Two user users inserted successfully!");
    }
  } catch (error) {
    console.error("Error creating 'accounts' table:", error);
  }

  //--------------------------------------------------------------------------------------------------------

  //  export async function createTableSaucesAndUploadImagesFromFolder() {
  try {
    // Check if "sauces" table exists
    const tableExists = await connection.schema.hasTable("sauces");
    if (!tableExists) {
      // Create "sauces" table if it doesn't exist
      await connection.schema.createTable("sauces", (table) => {
        table.increments("id").primary();
        table.string("name", 255);
        table.binary("image");
        table.string("description", 255);
        table.string("price");
      });

      console.log('Table "sauces" created successfully!');
    }

    // Define folder path
    const folderPath = "./pubblic";

    // Read files in the folder
    const files = await fs.promises.readdir(folderPath);
    for (const file of files) {
      const imagePath = path.join(folderPath, file);
      try {
        // Read the image file
        const data = await fs.promises.readFile(imagePath);

        // Check if the file already exists in the database
        const existingImage = await connection("sauces")
          .where("name", file)
          .first();

        if (existingImage) {
          console.log(
            `The file ${file} already exists in the database. Skipping insertion.`
          );
          continue;
        }

        // Insert the image into the "sauces" table

        if (file === "Crema pistacchi 270gr..jpg") {
          await connection("sauces").insert({
            image: data,
            name: file,
            description:
              "La salsa di pistacchi è un saporito pesto dal gusto fresco.",
            price: "12",
          });
        } else if (file === "Salsa cigliegino D.O.P  320.gr..jpeg") {
          await connection("sauces").insert({
            image: data,
            name: file,
            description: "Salsa cigliegino D.O.P fresca e leggera",
            price: "8",
          });
        } else if (file === "Salsa di olive nere 530gr..jpg") {
          await connection("sauces").insert({
            image: data,
            name: file,
            description:
              "La salsa di olive è ricca di sapore e si abbina perfettamente a molti piatti.",
            price: "10",
          });
        }
        console.log(`Image ${file} saved in the database.`);
      } catch (err) {
        console.error("Error while processing image file:", err);
      }
    }
  } catch (err) {
    console.error("Error while reading folder:", err);
  }

  try {
    const tableExists = await connection.schema.hasTable("shopping");
    if (!tableExists) {
      // Create "shopping" table if it doesn't exist
      await connection.schema.createTable("shopping", (table) => {
        table.increments("id").primary();
        table.string("username").notNullable();
        table.string("product", 255).notNullable().comment("product_id");
        table.binary("image").notNullable();
        table.integer("quantity").defaultTo(1);
        table.float("product_price").notNullable().defaultTo(0.0);
      });

      console.log('Table "shopping" created successfully!');
    }

    // Check if the 'address' table already exists
    const tableAddressExists = await connection.schema.hasTable("address");

    if (!tableAddressExists) {
      // If the table doesn't exist, create it with the corresponding columns
      await connection.schema.createTable("address", (table) => {
        table.increments("idAddress").primary(); // Auto-incrementing ID column
        table.integer("id").unsigned().references("id").inTable("accounts");
        table.string("address", 255).notNullable();
        table.integer("code").notNullable();
        table.string("city", 255).notNullable();
        table.string("country", 255).notNullable();
        table.integer("phone");
      });

      console.log("Table 'address' address successfully!");
    } else {
      console.log("The 'address' table already exists.");
    } 


    const tablePaymentExists = await connection.schema.hasTable("payment");

    if (!tablePaymentExists) {
      // If the table doesn't exist, create it with the corresponding columns
      await connection.schema.createTable("payment", (table) => {
        table.increments("idAddress").primary(); // Auto-incrementing ID column
        table.integer("id").unsigned().references("id").inTable("accounts");
        table.string("amount", 255).notNullable();
        table.date("date").notNullable();
        table.json("products", 255).notNullable();
      });

      console.log("Table 'payment' address successfully!");
    } else {
      console.log("The 'payment' table already exists.");
    } 
  } catch (err) {
    console.error("Error while reading folder:", err);
  }
}
