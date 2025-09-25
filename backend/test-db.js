import { Pool } from "pg";

const pool = new Pool({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "aahhmmeedd",
  database: "dbcollab",
});

async function test() {
  try {
    console.log("Checking database schema...");
    const schemaResult = await pool.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'documents'
      ORDER BY ordinal_position;
    `);

    console.log("Documents table structure:");
    schemaResult.rows.forEach((row) => {
      console.log(
        `${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`
      );
    });

    console.log("\nTesting UPDATE query...");
    const testContent = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Hello world",
            },
          ],
        },
      ],
    };

    const updateResult = await pool.query(
      "UPDATE documents SET title = $1, content = $2, updated_at = NOW() WHERE id = $3 RETURNING *",
      ["Test Title", JSON.stringify(testContent), 7]
    );

    console.log("Update successful!");
    console.log("Updated document:", updateResult.rows[0]);
  } catch (err) {
    console.error("Error details:");
    console.error("Message:", err.message);
    console.error("Code:", err.code);
    console.error("Detail:", err.detail);
    console.error("Position:", err.position);
  }

  await pool.end();
}

test();
