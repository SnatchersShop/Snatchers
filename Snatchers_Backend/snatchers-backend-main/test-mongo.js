const mongoose = require('mongoose');

console.log('Testing MongoDB connection with new password...');

const uri = "mongodb+srv://snatchersshop:snatchersshop@snatchers.shwusoa.mongodb.net/snatchers?retryWrites=true&w=majority";

mongoose.connect(uri)
.then(() => {
    console.log('✅ SUCCESS: MongoDB connected!');
    process.exit(0);
})
.catch((error) => {
    console.log('❌ FAILED: MongoDB connection error:');
    console.log('Error message:', error.message);
    process.exit(1);
});
