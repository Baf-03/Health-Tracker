import db from './lib/db.js'; // Adjust path if needed

(async () => {
  try {
    console.log('Testing db.query...');
    const result = await db.query('SELECT 1 + 1 AS result');
    console.log('Query successful:', result.rows[0].result);
  } catch (error) {
    console.error('Error testing db.query:', error);
  }
})();
