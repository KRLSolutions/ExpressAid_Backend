// Simple in-memory database for development
class InMemoryDB {
  constructor() {
    this.users = new Map();
    this.nextUserId = 1;
  }

  // User operations
  async findUserByPhone(phoneNumber) {
    for (const [id, userData] of this.users) {
      if (userData.phoneNumber === phoneNumber) {
        return { ...userData, _id: id };
      }
    }
    return null;
  }

  async findUserByUserId(userId) {
    for (const [id, userData] of this.users) {
      if (userData.userId === userId) {
        return { ...userData, _id: id };
      }
    }
    return null;
  }

  async findUserById(id) {
    const userData = this.users.get(id);
    return userData ? { ...userData, _id: id } : null;
  }

  async createUser(userData) {
    const id = this.nextUserId++;
    const user = {
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(id, user);
    return { ...user, _id: id };
  }

  async updateUser(id, updates) {
    const userData = this.users.get(id);
    if (!userData) return null;
    
    const updatedUserData = {
      ...userData,
      ...updates,
      updatedAt: new Date()
    };
    this.users.set(id, updatedUserData);
    return { ...updatedUserData, _id: id };
  }

  async saveUser(user) {
    if (user._id) {
      return this.updateUser(user._id, user);
    } else {
      return this.createUser(user);
    }
  }
}

// Create a singleton instance
const db = new InMemoryDB();

module.exports = db; 