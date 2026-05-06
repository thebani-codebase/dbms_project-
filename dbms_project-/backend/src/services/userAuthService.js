// ============================================================================
// USER AUTHENTICATION SERVICE - Login, Registration & Document Processing
// Handles user authentication with database and local storage fallback
// ============================================================================

class UserAuthService {
    constructor() {
        this.users = new Map();
        this.documents = new Map();
        this.loadFromStorage();
    }

    // Load data from local storage
    loadFromStorage() {
        try {
            const users = localStorage.getItem('users');
            const documents = localStorage.getItem('documents');
            
            if (users) {
                const usersArray = JSON.parse(users);
                usersArray.forEach(user => {
                    this.users.set(user.aadhaarNumber, user);
                });
            }
            
            if (documents) {
                const documentsArray = JSON.parse(documents);
                documentsArray.forEach(doc => {
                    this.documents.set(doc.documentId, doc);
                });
            }
            
            console.log(`Loaded ${this.users.size} users and ${this.documents.size} documents from storage`);
        } catch (error) {
            console.error('Error loading from storage:', error);
        }
    }

    // Save data to local storage
    saveToStorage() {
        try {
            const usersArray = Array.from(this.users.values());
            const documentsArray = Array.from(this.documents.values());
            
            localStorage.setItem('users', JSON.stringify(usersArray));
            localStorage.setItem('documents', JSON.stringify(documentsArray));
            
            console.log(`Saved ${usersArray.length} users and ${documentsArray.length} documents to storage`);
        } catch (error) {
            console.error('Error saving to storage:', error);
        }
    }

    // Generate unique ID
    generateId() {
        return Date.now() + Math.random().toString(36).substr(2, 9);
    }

    // Register new user
    async registerUser(userData) {
        try {
            // Check if user already exists
            if (this.users.has(userData.aadhaarNumber)) {
                return {
                    success: false,
                    message: 'User with this Aadhaar number already exists'
                };
            }

            // Validate Aadhaar number (12 digits)
            if (!/^\d{12}$/.test(userData.aadhaarNumber)) {
                return {
                    success: false,
                    message: 'Invalid Aadhaar number. Must be 12 digits.'
                };
            }

            // Create new user
            const newUser = {
                beneficiaryId: this.generateId(),
                firstName: userData.firstName,
                lastName: userData.lastName,
                aadhaarNumber: userData.aadhaarNumber,
                dateOfBirth: userData.dateOfBirth,
                gender: userData.gender,
                maritalStatus: userData.maritalStatus,
                annualIncome: userData.annualIncome,
                occupation: userData.occupation,
                casteCategory: userData.casteCategory,
                isBPL: userData.isBPL,
                locationId: userData.locationId,
                password: userData.password,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            // Save to memory
            this.users.set(userData.aadhaarNumber, newUser);
            this.saveToStorage();

            console.log('User registered successfully:', newUser);

            return {
                success: true,
                message: 'User registered successfully',
                data: {
                    beneficiaryId: newUser.beneficiaryId,
                    firstName: newUser.firstName,
                    lastName: newUser.lastName,
                    aadhaarNumber: newUser.aadhaarNumber
                }
            };
        } catch (error) {
            console.error('Registration error:', error);
            return {
                success: false,
                message: 'Registration failed: ' + error.message
            };
        }
    }

    // Authenticate user
    async authenticateUser(aadhaarNumber, password) {
        try {
            // Validate inputs
            if (!aadhaarNumber || !password) {
                return {
                    success: false,
                    message: 'Aadhaar number and password are required'
                };
            }

            // Find user
            const user = this.users.get(aadhaarNumber);
            
            if (!user) {
                return {
                    success: false,
                    message: 'User not found with this Aadhaar number'
                };
            }

            // Check password
            if (user.password !== password) {
                return {
                    success: false,
                    message: 'Invalid password'
                };
            }

            // Remove password from response
            const { password: _, ...userWithoutPassword } = user;

            console.log('User authenticated successfully:', userWithoutPassword.firstName);

            return {
                success: true,
                message: 'Login successful',
                data: userWithoutPassword
            };
        } catch (error) {
            console.error('Authentication error:', error);
            return {
                success: false,
                message: 'Authentication failed: ' + error.message
            };
        }
    }

    // Upload document
    async uploadDocument(aadhaarNumber, documentType, file) {
        try {
            // Validate user exists
            const user = this.users.get(aadhaarNumber);
            if (!user) {
                return {
                    success: false,
                    message: 'User not found with this Aadhaar number'
                };
            }

            // Create document record
            const newDocument = {
                documentId: this.generateId(),
                beneficiaryId: user.beneficiaryId,
                aadhaarNumber: aadhaarNumber,
                documentType: documentType,
                fileName: file.name,
                fileSize: file.size,
                fileType: file.type,
                uploadedAt: new Date().toISOString(),
                isVerified: 'N',
                verificationDate: null
            };

            // Save to memory
            this.documents.set(newDocument.documentId, newDocument);
            this.saveToStorage();

            console.log('Document uploaded successfully:', newDocument);

            return {
                success: true,
                message: 'Document uploaded successfully',
                data: newDocument
            };
        } catch (error) {
            console.error('Document upload error:', error);
            return {
                success: false,
                message: 'Document upload failed: ' + error.message
            };
        }
    }

    // Get user by Aadhaar number
    getUserByAadhaar(aadhaarNumber) {
        return this.users.get(aadhaarNumber) || null;
    }

    // Get documents by Aadhaar number
    getDocumentsByAadhaar(aadhaarNumber) {
        const user = this.users.get(aadhaarNumber);
        if (!user) return [];

        return Array.from(this.documents.values())
            .filter(doc => doc.aadhaarNumber === aadhaarNumber)
            .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
    }

    // Get user statistics
    getUserStatistics() {
        const totalUsers = this.users.size;
        const totalDocuments = this.documents.size;
        
        const usersByGender = {};
        const usersByCaste = {};
        const usersByLocation = {};
        const bplUsers = 0;

        this.users.forEach(user => {
            // Gender statistics
            usersByGender[user.gender] = (usersByGender[user.gender] || 0) + 1;
            
            // Caste statistics
            usersByCaste[user.casteCategory] = (usersByCaste[user.casteCategory] || 0) + 1;
            
            // Location statistics
            usersByLocation[user.locationId] = (usersByLocation[user.locationId] || 0) + 1;
            
            // BPL count
            if (user.isBPL === 'Y') bplUsers++;
        });

        return {
            totalUsers,
            totalDocuments,
            usersByGender,
            usersByCaste,
            usersByLocation,
            bplUsers,
            bplPercentage: totalUsers > 0 ? ((bplUsers / totalUsers) * 100).toFixed(2) : 0
        };
    }

    // Get all users (for admin)
    getAllUsers() {
        return Array.from(this.users.values())
            .map(user => {
                const { password: _, ...userWithoutPassword } = user;
                return userWithoutPassword;
            });
    }

    // Get all documents (for admin)
    getAllDocuments() {
        return Array.from(this.documents.values());
    }

    // Update user profile
    async updateUserProfile(aadhaarNumber, updateData) {
        try {
            const user = this.users.get(aadhaarNumber);
            if (!user) {
                return {
                    success: false,
                    message: 'User not found'
                };
            }

            // Update user data
            const updatedUser = {
                ...user,
                ...updateData,
                updatedAt: new Date().toISOString()
            };

            this.users.set(aadhaarNumber, updatedUser);
            this.saveToStorage();

            console.log('User profile updated successfully:', updatedUser);

            return {
                success: true,
                message: 'Profile updated successfully',
                data: updatedUser
            };
        } catch (error) {
            console.error('Profile update error:', error);
            return {
                success: false,
                message: 'Profile update failed: ' + error.message
            };
        }
    }

    // Delete user (admin function)
    async deleteUser(aadhaarNumber) {
        try {
            const user = this.users.get(aadhaarNumber);
            if (!user) {
                return {
                    success: false,
                    message: 'User not found'
                };
            }

            // Delete user
            this.users.delete(aadhaarNumber);
            
            // Delete user's documents
            const userDocuments = Array.from(this.documents.values())
                .filter(doc => doc.aadhaarNumber === aadhaarNumber);
            
            userDocuments.forEach(doc => {
                this.documents.delete(doc.documentId);
            });

            this.saveToStorage();

            console.log('User deleted successfully:', aadhaarNumber);

            return {
                success: true,
                message: 'User deleted successfully'
            };
        } catch (error) {
            console.error('User deletion error:', error);
            return {
                success: false,
                message: 'User deletion failed: ' + error.message
            };
        }
    }

    // Verify document
    async verifyDocument(documentId, isVerified) {
        try {
            const document = this.documents.get(documentId);
            if (!document) {
                return {
                    success: false,
                    message: 'Document not found'
                };
            }

            // Update verification status
            const updatedDocument = {
                ...document,
                isVerified: isVerified ? 'Y' : 'N',
                verificationDate: new Date().toISOString()
            };

            this.documents.set(documentId, updatedDocument);
            this.saveToStorage();

            console.log('Document verification updated:', updatedDocument);

            return {
                success: true,
                message: `Document ${isVerified ? 'verified' : 'unverified'} successfully`,
                data: updatedDocument
            };
        } catch (error) {
            console.error('Document verification error:', error);
            return {
                success: false,
                message: 'Document verification failed: ' + error.message
            };
        }
    }

    // Search users
    searchUsers(query) {
        const lowerQuery = query.toLowerCase();
        
        return Array.from(this.users.values())
            .filter(user => {
                const { password: _, ...userWithoutPassword } = user;
                const searchString = `${userWithoutPassword.firstName} ${userWithoutPassword.lastName} ${userWithoutPassword.aadhaarNumber} ${userWithoutPassword.occupation}`.toLowerCase();
                return searchString.includes(lowerQuery);
            })
            .map(user => {
                const { password: _, ...userWithoutPassword } = user;
                return userWithoutPassword;
            });
    }

    // Export data
    exportData() {
        const data = {
            users: Array.from(this.users.values()).map(user => {
                const { password: _, ...userWithoutPassword } = user;
                return userWithoutPassword;
            }),
            documents: Array.from(this.documents.values()),
            exportedAt: new Date().toISOString(),
            statistics: this.getUserStatistics()
        };

        return data;
    }

    // Import data
    async importData(data) {
        try {
            if (!data.users || !data.documents) {
                return {
                    success: false,
                    message: 'Invalid data format'
                };
            }

            // Clear existing data
            this.users.clear();
            this.documents.clear();

            // Import users
            data.users.forEach(user => {
                this.users.set(user.aadhaarNumber, user);
            });

            // Import documents
            data.documents.forEach(doc => {
}

// Get all users (for admin)
getAllUsers() {
    return Array.from(this.users.values())
        .map(user => {
            const { password: _, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });
}

// Get all documents (for admin)
getAllDocuments() {
    return Array.from(this.documents.values());
}

// Update user profile
async updateUserProfile(aadhaarNumber, updateData) {
    try {
        const user = this.users.get(aadhaarNumber);
        if (!user) {
            return {
                success: false,
                message: 'User not found'
            };
        }

        // Update user data
        const updatedUser = {
            ...user,
            ...updateData,
            updatedAt: new Date().toISOString()
        };

        this.users.set(aadhaarNumber, updatedUser);
        this.saveToStorage();

        console.log('User profile updated successfully:', updatedUser);

        return {
            success: true,
            message: 'Profile updated successfully',
            data: updatedUser
        };
    } catch (error) {
        console.error('Profile update error:', error);
        return {
            success: false,
            message: 'Profile update failed: ' + error.message
        };
    }
}

// Delete user (admin function)
async deleteUser(aadhaarNumber) {
    try {
        const user = this.users.get(aadhaarNumber);
        if (!user) {
            return {
                success: false,
                message: 'User not found'
            };
        }

        // Delete user
        this.users.delete(aadhaarNumber);
        
        // Delete user's documents
        const userDocuments = Array.from(this.documents.values())
            .filter(doc => doc.aadhaarNumber === aadhaarNumber);
        
        userDocuments.forEach(doc => {
            this.documents.delete(doc.documentId);
        });

        this.saveToStorage();

        console.log('User deleted successfully:', aadhaarNumber);

        return {
            success: true,
            message: 'User deleted successfully'
        };
    } catch (error) {
        console.error('User deletion error:', error);
        return {
            success: false,
            message: 'User deletion failed: ' + error.message
        };
    }
}

// Verify document
async verifyDocument(documentId, isVerified) {
    try {
        const document = this.documents.get(documentId);
        if (!document) {
            return {
                success: false,
                message: 'Document not found'
            };
        }

        // Update verification status
        const updatedDocument = {
            ...document,
            isVerified: isVerified ? 'Y' : 'N',
            verificationDate: new Date().toISOString()
        };

        this.documents.set(documentId, updatedDocument);
        this.saveToStorage();

        console.log('Document verification updated:', updatedDocument);

        return {
            success: true,
            message: `Document ${isVerified ? 'verified' : 'unverified'} successfully`,
            data: updatedDocument
        };
    } catch (error) {
        console.error('Document verification error:', error);
        return {
            success: false,
            message: 'Document verification failed: ' + error.message
        };
    }
}

// Search users
searchUsers(query) {
    const lowerQuery = query.toLowerCase();
    
    return Array.from(this.users.values())
        .filter(user => {
            const { password: _, ...userWithoutPassword } = user;
            const searchString = `${userWithoutPassword.firstName} ${userWithoutPassword.lastName} ${userWithoutPassword.aadhaarNumber} ${userWithoutPassword.occupation}`.toLowerCase();
            return searchString.includes(lowerQuery);
        })
        .map(user => {
            const { password: _, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });
}

// Export data
exportData() {
    const data = {
        users: Array.from(this.users.values()).map(user => {
            const { password: _, ...userWithoutPassword } = user;
            return userWithoutPassword;
        }),
        documents: Array.from(this.documents.values()),
        exportedAt: new Date().toISOString(),
        statistics: this.getUserStatistics()
    };

    return data;
}

// Import data
async importData(data) {
    try {
        if (!data.users || !data.documents) {
            return {
                success: false,
                message: 'Invalid data format'
            };
        }

        // Clear existing data
        this.users.clear();
        this.documents.clear();

        // Import users
        data.users.forEach(user => {
            this.users.set(user.aadhaarNumber, user);
        });

        // Import documents
        data.documents.forEach(doc => {
            this.documents.set(doc.documentId, doc);
        });

        this.saveToStorage();

        console.log(`Imported ${data.users.length} users and ${data.documents.length} documents`);

        return {
            success: true,
            message: `Imported ${data.users.length} users and ${data.documents.length} documents`
        };
    } catch (error) {
        console.error('Import error:', error);
        return {
            success: false,
            message: error.message
        };
    }
}

// Update user features
async updateUserFeatures(aadhaarNumber, extractedFeatures) {
    try {
        const user = this.users.get(aadhaarNumber);
        
        if (!user) {
            return {
                success: false,
                message: 'User not found'
            };
        }

        // Update user with extracted features
        user.extractedFeatures = user.extractedFeatures || [];
        user.extractedFeatures.push({
            features: extractedFeatures,
            updatedAt: new Date().toISOString()
        });

        // Update user in storage
        this.users.set(aadhaarNumber, user);
        this.saveToStorage();

        return {
            success: true,
            message: 'Features updated successfully',
            data: user
        };
    } catch (error) {
        console.error('Update features error:', error);
        return {
            success: false,
            message: error.message
        };
    }
}
}

module.exports = UserAuthService;
