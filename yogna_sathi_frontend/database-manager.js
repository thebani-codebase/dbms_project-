// ============================================================================
// DATABASE MANAGEMENT SYSTEM - Real-time Updates
// Automatically syncs database changes to frontend
// ============================================================================

class DatabaseManager {
    constructor() {
        this.dbVersion = 1;
        this.lastSync = null;
        this.autoSyncInterval = 5000; // 5 seconds
        this.isOnline = false;
        this.dbUrl = 'http://localhost:3000/api/v1';
        this.legacyUrl = 'http://127.0.0.1:5174/api/oracle';
        
        // Database state
        this.state = {
            beneficiaries: [],
            schemes: [],
            enrollments: [],
            campaigns: [],
            locations: [],
            occupations: [],
            domains: [],
            documents: [],
            familyMembers: [],
            eligibilityMatches: [],
            awarenessRecords: [],
            performanceMetrics: [],
            gapAnalysis: [],
            auditLog: []
        };
        
        this.init();
    }
    
    // Initialize database manager
    async init() {
        console.log('🗄️ Database Manager Initializing...');
        
        // Check backend availability
        await this.checkBackendStatus();
        
        // Load initial data
        await this.loadAllData();
        
        // Start auto-sync
        this.startAutoSync();
        
        // Setup event listeners
        this.setupEventListeners();
        
        console.log('✅ Database Manager Ready');
        this.showStatus();
    }
    
    // Check which backend is available
    async checkBackendStatus() {
        try {
            const response = await fetch(`${this.dbUrl}/health`);
            if (response.ok) {
                this.isOnline = true;
                this.currentBackend = 'DBMS';
                console.log('🟢 DBMS Donors Backend Connected');
                return true;
            }
        } catch (error) {
            console.log('🔴 DBMS Backend not available');
        }
        
        try {
            const response = await fetch(`${this.legacyUrl}/health`);
            if (response.ok) {
                this.isOnline = true;
                this.currentBackend = 'Legacy';
                console.log('🟡 Legacy Backend Connected');
                return true;
            }
        } catch (error) {
            console.log('🔴 No Backend Available - Using Local Data');
        }
        
        this.isOnline = false;
        this.currentBackend = 'Local';
        return false;
    }
    
    // Load all data from backend
    async loadAllData() {
        if (!this.isOnline) {
            this.loadLocalData();
            return;
        }
        
        console.log('📥 Loading Database Data...');
        
        try {
            // Load all tables
            await Promise.all([
                this.loadBeneficiaries(),
                this.loadSchemes(),
                this.loadEnrollments(),
                this.loadCampaigns(),
                this.loadLocations(),
                this.loadOccupations(),
                this.loadDomains(),
                this.loadDocuments(),
                this.loadFamilyMembers(),
                this.loadEligibilityMatches(),
                this.loadAwarenessRecords(),
                this.loadPerformanceMetrics(),
                this.loadGapAnalysis(),
                this.loadAuditLog()
            ]);
            
            this.lastSync = new Date();
            console.log('✅ All Data Loaded Successfully');
            
        } catch (error) {
            console.error('❌ Error loading data:', error);
            this.loadLocalData();
        }
    }
    
    // Load beneficiaries
    async loadBeneficiaries() {
        const url = this.currentBackend === 'DBMS' 
            ? `${this.dbUrl}/beneficiary/all`
            : `${this.legacyUrl}/beneficiaries`;
            
        const response = await fetch(url);
        const data = await response.json();
        this.state.beneficiaries = data.success ? data.data : [];
    }
    
    // Load schemes
    async loadSchemes() {
        const url = this.currentBackend === 'DBMS'
            ? `${this.dbUrl}/eligibility/schemes`
            : `${this.legacyUrl}/schemes`;
            
        const response = await fetch(url);
        const data = await response.json();
        this.state.schemes = data.success ? data.data : [];
    }
    
    // Load enrollments
    async loadEnrollments() {
        const url = this.currentBackend === 'DBMS'
            ? `${this.dbUrl}/enrollment/all`
            : `${this.legacyUrl}/enrollments`;
            
        const response = await fetch(url);
        const data = await response.json();
        this.state.enrollments = data.success ? data.data : [];
    }
    
    // Load campaigns
    async loadCampaigns() {
        const url = this.currentBackend === 'DBMS'
            ? `${this.dbUrl}/campaign/all`
            : `${this.legacyUrl}/campaigns`;
            
        const response = await fetch(url);
        const data = await response.json();
        this.state.campaigns = data.success ? data.data : [];
    }
    
    // Load locations
    async loadLocations() {
        const url = this.currentBackend === 'DBMS'
            ? `${this.dbUrl}/location/all`
            : `${this.legacyUrl}/locations`;
            
        const response = await fetch(url);
        const data = await response.json();
        this.state.locations = data.success ? data.data : [];
    }
    
    // Load occupations
    async loadOccupations() {
        const url = this.currentBackend === 'DBMS'
            ? `${this.dbUrl}/occupation/all`
            : `${this.legacyUrl}/occupations`;
            
        const response = await fetch(url);
        const data = await response.json();
        this.state.occupations = data.success ? data.data : [];
    }
    
    // Load domains
    async loadDomains() {
        const url = this.currentBackend === 'DBMS'
            ? `${this.dbUrl}/domain/all`
            : `${this.legacyUrl}/domains`;
            
        const response = await fetch(url);
        const data = await response.json();
        this.state.domains = data.success ? data.data : [];
    }
    
    // Load documents
    async loadDocuments() {
        const url = this.currentBackend === 'DBMS'
            ? `${this.dbUrl}/document/all`
            : `${this.legacyUrl}/documents`;
            
        const response = await fetch(url);
        const data = await response.json();
        this.state.documents = data.success ? data.data : [];
    }
    
    // Load family members
    async loadFamilyMembers() {
        const url = this.currentBackend === 'DBMS'
            ? `${this.dbUrl}/family/all`
            : `${this.legacyUrl}/family-members`;
            
        const response = await fetch(url);
        const data = await response.json();
        this.state.familyMembers = data.success ? data.data : [];
    }
    
    // Load eligibility matches
    async loadEligibilityMatches() {
        const url = this.currentBackend === 'DBMS'
            ? `${this.dbUrl}/eligibility/matches`
            : `${this.legacyUrl}/eligibility-matches`;
            
        const response = await fetch(url);
        const data = await response.json();
        this.state.eligibilityMatches = data.success ? data.data : [];
    }
    
    // Load awareness records
    async loadAwarenessRecords() {
        const url = this.currentBackend === 'DBMS'
            ? `${this.dbUrl}/awareness/all`
            : `${this.legacyUrl}/awareness`;
            
        const response = await fetch(url);
        const data = await response.json();
        this.state.awarenessRecords = data.success ? data.data : [];
    }
    
    // Load performance metrics
    async loadPerformanceMetrics() {
        const url = this.currentBackend === 'DBMS'
            ? `${this.dbUrl}/analytics/performance`
            : `${this.legacyUrl}/performance-metrics`;
            
        const response = await fetch(url);
        const data = await response.json();
        this.state.performanceMetrics = data.success ? data.data : [];
    }
    
    // Load gap analysis
    async loadGapAnalysis() {
        const url = this.currentBackend === 'DBMS'
            ? `${this.dbUrl}/analytics/gap-analysis`
            : `${this.legacyUrl}/gap-analysis`;
            
        const response = await fetch(url);
        const data = await response.json();
        this.state.gapAnalysis = data.success ? data.data : [];
    }
    
    // Load audit log
    async loadAuditLog() {
        const url = this.currentBackend === 'DBMS'
            ? `${this.dbUrl}/audit/all`
            : `${this.legacyUrl}/audit-log`;
            
        const response = await fetch(url);
        const data = await response.json();
        this.state.auditLog = data.success ? data.data : [];
    }
    
    // Load local fallback data
    loadLocalData() {
        console.log('📦 Loading Local Fallback Data...');
        
        // This would load from localStorage or embedded data
        const localData = localStorage.getItem('dbms_local_data');
        if (localData) {
            this.state = JSON.parse(localData);
        } else {
            // Initialize with demo data
            this.initializeDemoData();
        }
    }
    
    // Initialize demo data
    initializeDemoData() {
        this.state = {
            beneficiaries: [
                {
                    id: 1,
                    aadhaarNumber: "123456789012",
                    firstName: "Ramesh",
                    lastName: "Sharma",
                    dateOfBirth: "1956-03-15",
                    gender: "M",
                    maritalStatus: "Married",
                    annualIncome: 35000,
                    occupation: "Retired",
                    casteCategory: "General",
                    isBpl: false,
                    location: "Amritsar, Punjab"
                },
                {
                    id: 2,
                    aadhaarNumber: "223456789012",
                    firstName: "Priya",
                    lastName: "Singh",
                    dateOfBirth: "1960-07-22",
                    gender: "F",
                    maritalStatus: "Widow",
                    annualIncome: 25000,
                    occupation: "Homemaker",
                    casteCategory: "SC",
                    isBpl: true,
                    location: "Ludhiana, Punjab"
                },
                {
                    id: 3,
                    aadhaarNumber: "323456789012",
                    firstName: "Jitendra",
                    lastName: "Verma",
                    dateOfBirth: "1985-11-30",
                    gender: "M",
                    maritalStatus: "Married",
                    annualIncome: 120000,
                    occupation: "Farmer",
                    casteCategory: "OBC",
                    isBpl: false,
                    location: "Jalandhar, Punjab"
                }
            ],
            schemes: [
                {
                    id: 1,
                    name: "Ayushman Bharat - Prime Minister Jan Arogya Yojana",
                    domain: "Healthcare",
                    benefit: "Rs 5,00,000 cover",
                    minAge: 0,
                    maxAge: 120,
                    gender: "Any",
                    incomeMax: 150000,
                    bpl: true
                },
                {
                    id: 2,
                    name: "Indira Gandhi National Old Age Pension Scheme",
                    domain: "Social Security",
                    benefit: "Rs 12,000/year",
                    minAge: 60,
                    maxAge: 120,
                    gender: "Any",
                    incomeMax: 48000
                },
                {
                    id: 3,
                    name: "Pradhan Mantri Kisan Samman Nidhi",
                    domain: "Agriculture",
                    benefit: "Rs 6,000/year",
                    minAge: 18,
                    maxAge: 120,
                    gender: "Any",
                    occupation: "Farmer",
                    incomeMax: 120000
                }
            ],
            enrollments: [
                {
                    id: 1,
                    beneficiaryId: 1,
                    schemeId: 2,
                    status: "Active",
                    applicationDate: "2024-06-01",
                    approvalDate: "2024-06-15",
                    annualBenefitAmount: 12000
                },
                {
                    id: 2,
                    beneficiaryId: 2,
                    schemeId: 1,
                    status: "Active",
                    applicationDate: "2024-07-01",
                    approvalDate: "2024-07-10",
                    annualBenefitAmount: 0
                }
            ],
            locations: [],
            occupations: [],
            domains: [],
            documents: [],
            familyMembers: [],
            eligibilityMatches: [],
            awarenessRecords: [],
            performanceMetrics: [],
            gapAnalysis: [],
            auditLog: []
        };
    }
    
    // Start auto-sync
    startAutoSync() {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
        }
        
        this.syncInterval = setInterval(async () => {
            await this.syncData();
        }, this.autoSyncInterval);
        
        console.log(`🔄 Auto-sync started (every ${this.autoSyncInterval/1000} seconds)`);
    }
    
    // Sync data with backend
    async syncData() {
        if (!this.isOnline) {
            await this.checkBackendStatus();
            if (!this.isOnline) return;
        }
        
        try {
            // Check for updates by comparing versions
            const currentVersion = await this.getDatabaseVersion();
            
            if (currentVersion > this.dbVersion) {
                console.log('🔄 Database version changed, syncing...');
                await this.loadAllData();
                this.dbVersion = currentVersion;
                this.notifyDataUpdate();
            }
        } catch (error) {
            console.error('❌ Sync error:', error);
        }
    }
    
    // Get database version
    async getDatabaseVersion() {
        const url = this.currentBackend === 'DBMS'
            ? `${this.dbUrl}/health`
            : `${this.legacyUrl}/health`;
            
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data.version || this.dbVersion;
        } catch (error) {
            return this.dbVersion;
        }
    }
    
    // Notify frontend of data updates
    notifyDataUpdate() {
        this.lastSync = new Date();
        
        // Save to localStorage
        localStorage.setItem('dbms_local_data', JSON.stringify(this.state));
        
        // Trigger custom event
        window.dispatchEvent(new CustomEvent('databaseUpdate', {
            detail: {
                type: 'sync',
                timestamp: this.lastSync,
                data: this.state
            }
        }));
        
        console.log('📢 Database update notified');
        this.showStatus();
    }
    
    // Add new beneficiary
    async addBeneficiary(beneficiaryData) {
        try {
            const url = this.currentBackend === 'DBMS'
                ? `${this.dbUrl}/beneficiary/register`
                : `${this.legacyUrl}/beneficiaries`;
                
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(beneficiaryData)
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Add to local state
                this.state.beneficiaries.push({
                    ...beneficiaryData,
                    id: result.data.id || Date.now()
                });
                
                // Notify update
                this.notifyDataUpdate();
                
                console.log('✅ Beneficiary added successfully');
                return { success: true, data: result.data };
            } else {
                throw new Error(result.message || 'Failed to add beneficiary');
            }
        } catch (error) {
            console.error('❌ Error adding beneficiary:', error);
            return { success: false, error: error.message };
        }
    }
    
    // Add new enrollment
    async addEnrollment(enrollmentData) {
        try {
            const url = this.currentBackend === 'DBMS'
                ? `${this.dbUrl}/enrollment/add`
                : `${this.legacyUrl}/enrollments`;
                
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(enrollmentData)
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Add to local state
                this.state.enrollments.push({
                    ...enrollmentData,
                    id: result.data.id || Date.now()
                });
                
                // Notify update
                this.notifyDataUpdate();
                
                console.log('✅ Enrollment added successfully');
                return { success: true, data: result.data };
            } else {
                throw new Error(result.message || 'Failed to add enrollment');
            }
        } catch (error) {
            console.error('❌ Error adding enrollment:', error);
            return { success: false, error: error.message };
        }
    }
    
    // Update beneficiary
    async updateBeneficiary(id, updateData) {
        try {
            const url = this.currentBackend === 'DBMS'
                ? `${this.dbUrl}/beneficiary/${id}`
                : `${this.legacyUrl}/beneficiaries/${id}`;
                
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData)
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Update local state
                const index = this.state.beneficiaries.findIndex(b => b.id === id);
                if (index !== -1) {
                    this.state.beneficiaries[index] = {
                        ...this.state.beneficiaries[index],
                        ...updateData
                    };
                }
                
                // Notify update
                this.notifyDataUpdate();
                
                console.log('✅ Beneficiary updated successfully');
                return { success: true, data: result.data };
            } else {
                throw new Error(result.message || 'Failed to update beneficiary');
            }
        } catch (error) {
            console.error('❌ Error updating beneficiary:', error);
            return { success: false, error: error.message };
        }
    }
    
    // Delete beneficiary
    async deleteBeneficiary(id) {
        try {
            const url = this.currentBackend === 'DBMS'
                ? `${this.dbUrl}/beneficiary/${id}`
                : `${this.legacyUrl}/beneficiaries/${id}`;
                
            const response = await fetch(url, {
                method: 'DELETE'
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Remove from local state
                this.state.beneficiaries = this.state.beneficiaries.filter(b => b.id !== id);
                
                // Notify update
                this.notifyDataUpdate();
                
                console.log('✅ Beneficiary deleted successfully');
                return { success: true };
            } else {
                throw new Error(result.message || 'Failed to delete beneficiary');
            }
        } catch (error) {
            console.error('❌ Error deleting beneficiary:', error);
            return { success: false, error: error.message };
        }
    }
    
    // Setup event listeners
    setupEventListeners() {
        // Listen for database updates
        window.addEventListener('databaseUpdate', (event) => {
            console.log('📢 Database update received:', event.detail);
            this.updateUI();
        });
        
        // Listen for online/offline status
        window.addEventListener('online', () => {
            console.log('🌐 Back online - syncing...');
            this.checkBackendStatus();
        });
        
        window.addEventListener('offline', () => {
            console.log('📴 Offline - using local data');
            this.isOnline = false;
            this.currentBackend = 'Local';
        });
    }
    
    // Update UI components
    updateUI() {
        // Update beneficiary count
        const beneficiaryCount = document.querySelector('.beneficiary-count');
        if (beneficiaryCount) {
            beneficiaryCount.textContent = this.state.beneficiaries.length;
        }
        
        // Update scheme count
        const schemeCount = document.querySelector('.scheme-count');
        if (schemeCount) {
            schemeCount.textContent = this.state.schemes.length;
        }
        
        // Update enrollment count
        const enrollmentCount = document.querySelector('.enrollment-count');
        if (enrollmentCount) {
            enrollmentCount.textContent = this.state.enrollments.length;
        }
        
        // Update last sync time
        const lastSync = document.querySelector('.last-sync');
        if (lastSync) {
            lastSync.textContent = this.lastSync ? this.lastSync.toLocaleTimeString() : 'Never';
        }
        
        // Update connection status
        const connectionStatus = document.querySelector('.connection-status');
        if (connectionStatus) {
            connectionStatus.textContent = this.currentBackend;
            connectionStatus.className = `connection-status ${this.isOnline ? 'online' : 'offline'}`;
        }
    }
    
    // Show current status
    showStatus() {
        console.log('📊 Database Status:');
        console.log(`  - Backend: ${this.currentBackend}`);
        console.log(`  - Online: ${this.isOnline}`);
        console.log(`  - Beneficiaries: ${this.state.beneficiaries.length}`);
        console.log(`  - Schemes: ${this.state.schemes.length}`);
        console.log(`  - Enrollments: ${this.state.enrollments.length}`);
        console.log(`  - Last Sync: ${this.lastSync ? this.lastSync.toLocaleTimeString() : 'Never'}`);
    }
    
    // Get statistics
    getStatistics() {
        return {
            totalBeneficiaries: this.state.beneficiaries.length,
            totalSchemes: this.state.schemes.length,
            totalEnrollments: this.state.enrollments.length,
            activeEnrollments: this.state.enrollments.filter(e => e.status === 'Active').length,
            pendingEnrollments: this.state.enrollments.filter(e => e.status === 'Applied').length,
            lastSync: this.lastSync,
            backend: this.currentBackend,
            isOnline: this.isOnline
        };
    }
    
    // Search beneficiaries
    searchBeneficiaries(query) {
        const lowerQuery = query.toLowerCase();
        return this.state.beneficiaries.filter(b => 
            b.firstName.toLowerCase().includes(lowerQuery) ||
            b.lastName.toLowerCase().includes(lowerQuery) ||
            b.aadhaarNumber.includes(query) ||
            b.location.toLowerCase().includes(lowerQuery)
        );
    }
    
    // Get beneficiary by ID
    getBeneficiary(id) {
        return this.state.beneficiaries.find(b => b.id === id);
    }
    
    // Get schemes for beneficiary
    getEligibleSchemes(beneficiaryId) {
        const beneficiary = this.getBeneficiary(beneficiaryId);
        if (!beneficiary) return [];
        
        return this.state.schemes.filter(scheme => {
            // Check age
            const age = new Date().getFullYear() - new Date(beneficiary.dateOfBirth).getFullYear();
            if (scheme.minAge && age < scheme.minAge) return false;
            if (scheme.maxAge && age > scheme.maxAge) return false;
            
            // Check gender
            if (scheme.gender && scheme.gender !== 'Any' && scheme.gender !== beneficiary.gender) return false;
            
            // Check income
            if (scheme.incomeMax && beneficiary.annualIncome > scheme.incomeMax) return false;
            
            // Check occupation
            if (scheme.occupation && scheme.occupation !== beneficiary.occupation) return false;
            
            // Check BPL
            if (scheme.bpl && !beneficiary.isBpl) return false;
            
            return true;
        });
    }
}

// Initialize database manager when page loads
let databaseManager;

document.addEventListener('DOMContentLoaded', () => {
    databaseManager = new DatabaseManager();
});

// Export for global access
window.DatabaseManager = DatabaseManager;
window.databaseManager = databaseManager;
