// MongoDB initialization script
db = db.getSiblingDB('growth-diary');

// Create collections
db.createCollection('users');
db.createCollection('entries');

// Create indexes for better performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.entries.createIndex({ "userId": 1, "date": -1 });

print('Growth Diary database initialized successfully!'); 