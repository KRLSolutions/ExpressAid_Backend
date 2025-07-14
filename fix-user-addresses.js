const mongoose = require('mongoose');
const User = require('./models/User');
const config = require('./config');

// Connect to MongoDB
mongoose.connect(config.mongodb.uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function fixAddresses() {
  try {
    const users = await User.model.find({});
    let updatedCount = 0;
    for (const user of users) {
      let changed = false;
      if (Array.isArray(user.addresses)) {
        user.addresses = user.addresses.map((addr, idx) => {
          if (!addr.name) {
            changed = true;
            return { ...addr, name: `My Address ${idx + 1}` };
          }
          return addr;
        });
      }
      if (changed) {
        await user.save();
        updatedCount++;
        console.log(`Updated addresses for user ${user._id}`);
      }
    }
    console.log(`Done. Updated ${updatedCount} users.`);
    process.exit(0);
  } catch (err) {
    console.error('Error fixing addresses:', err);
    process.exit(1);
  }
}

fixAddresses(); 