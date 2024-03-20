import mongoose from 'mongoose';

// MongoDB connection URL
const url = 'mongodb://127.0.0.1:27017/milkharborDB'; // Replace 'mydatabase' with your database name

// Connect to MongoDB
export async function main() {
mongoose.connect(url)
  .then(() => {
    console.log('Connected to MongoDB');
    // Perform actions that depend on the connection here
  })
  .catch((error: any) => {
    console.error('Error connecting to MongoDB:', error);
  });
}
