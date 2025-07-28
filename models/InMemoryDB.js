// Simple in-memory database for development
class InMemoryDB {
  constructor() {
    this.users = new Map();
    this.healthMetrics = new Map();
    this.nextUserId = 1;
    this.nextHealthMetricsId = 1;
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

  // Health Metrics operations
  async findHealthMetricsByUserId(userId) {
    for (const [id, healthData] of this.healthMetrics) {
      if (healthData.userId === userId) {
        return { ...healthData, _id: id };
      }
    }
    return null;
  }

  async findHealthMetricsById(id) {
    const healthData = this.healthMetrics.get(id);
    return healthData ? { ...healthData, _id: id } : null;
  }

  async createHealthMetrics(healthData) {
    const id = this.nextHealthMetricsId++;
    const healthMetrics = {
      ...healthData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.healthMetrics.set(id, healthMetrics);
    return { ...healthMetrics, _id: id };
  }

  async updateHealthMetrics(id, updates) {
    const healthData = this.healthMetrics.get(id);
    if (!healthData) return null;
    
    const updatedHealthData = {
      ...healthData,
      ...updates,
      updatedAt: new Date()
    };
    this.healthMetrics.set(id, updatedHealthData);
    return { ...updatedHealthData, _id: id };
  }

  async saveHealthMetrics(healthMetrics) {
    if (healthMetrics._id) {
      return this.updateHealthMetrics(healthMetrics._id, healthMetrics);
    } else {
      return this.createHealthMetrics(healthMetrics);
    }
  }
}

// Create a singleton instance
const db = new InMemoryDB();

module.exports = db; 