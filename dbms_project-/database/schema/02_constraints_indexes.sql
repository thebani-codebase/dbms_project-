-- ============================================================================
-- STAGE 1: CONSTRAINTS, CHECKS, & INDEXES
-- Government Scheme Eligibility & Enrollment System
-- ============================================================================

-- ============================================================================
-- CHECK CONSTRAINTS
-- ============================================================================

ALTER TABLE BENEFICIARY 
ADD CONSTRAINT chk_beneficiary_age 
CHECK (TRUNC((SYSDATE - date_of_birth) / 365.25) BETWEEN 0 AND 150);

ALTER TABLE BENEFICIARY 
ADD CONSTRAINT chk_beneficiary_gender 
CHECK (gender IN ('M', 'F', 'O'));

ALTER TABLE BENEFICIARY 
ADD CONSTRAINT chk_beneficiary_income 
CHECK (annual_income >= 0 OR annual_income IS NULL);

ALTER TABLE BENEFICIARY 
ADD CONSTRAINT chk_disability_status 
CHECK (disability_status IN ('Y', 'N'));

ALTER TABLE BENEFICIARY 
ADD CONSTRAINT chk_bpl_status 
CHECK (bpl_status IN ('Y', 'N'));

ALTER TABLE LOCATION 
ADD CONSTRAINT chk_location_type 
CHECK (location_type IN ('State', 'District', 'Block', 'Village'));

ALTER TABLE POLICY_SCHEME 
ADD CONSTRAINT chk_scheme_status 
CHECK (status IN ('Active', 'Inactive', 'Suspended'));

ALTER TABLE POLICY_SCHEME 
ADD CONSTRAINT chk_scheme_benefit 
CHECK (min_annual_benefit <= max_annual_benefit OR min_annual_benefit IS NULL);

ALTER TABLE BENEFICIARY_ENROLLMENT 
ADD CONSTRAINT chk_enrollment_status 
CHECK (status IN ('Applied', 'Approved', 'Rejected', 'Active', 'Inactive', 'Completed'));

ALTER TABLE ELIGIBILITY_MATCH 
ADD CONSTRAINT chk_eligibility_score 
CHECK (eligibility_score BETWEEN 0 AND 100);

ALTER TABLE ELIGIBILITY_MATCH 
ADD CONSTRAINT chk_eligible_flag 
CHECK (is_eligible IN ('Y', 'N'));

ALTER TABLE BENEFICIARY_ENROLLMENT 
ADD CONSTRAINT chk_doc_submitted 
CHECK (documents_submitted IN ('Y', 'N'));

ALTER TABLE SCHEME_BENEFIT 
ADD CONSTRAINT chk_benefit_amount 
CHECK (benefit_amount > 0 OR benefit_amount IS NULL);

ALTER TABLE AWARENESS_CAMPAIGN 
ADD CONSTRAINT chk_campaign_dates 
CHECK (start_date <= end_date OR end_date IS NULL);

ALTER TABLE AWARENESS_CAMPAIGN 
ADD CONSTRAINT chk_campaign_status 
CHECK (status IN ('Planned', 'Ongoing', 'Completed'));

ALTER TABLE BENEFICIARY_AWARENESS 
ADD CONSTRAINT chk_awareness_status 
CHECK (awareness_status IN ('Unaware', 'Aware', 'Interested', 'Applied', 'Enrolled'));

ALTER TABLE AWARENESS_BARRIER 
ADD CONSTRAINT chk_barrier_status 
CHECK (resolution_status IN ('Open', 'In-Progress', 'Resolved'));

ALTER TABLE AUDIT_LOG 
ADD CONSTRAINT chk_audit_operation 
CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE'));

-- ============================================================================
-- UNIQUE CONSTRAINTS
-- ============================================================================

ALTER TABLE BENEFICIARY ADD CONSTRAINT uk_beneficiary_aadhaar UNIQUE (aadhaar_number);
ALTER TABLE POLICY_SCHEME ADD CONSTRAINT uk_scheme_code UNIQUE (scheme_code);
ALTER TABLE SCHEME_DOMAIN ADD CONSTRAINT uk_domain_name UNIQUE (domain_name);
ALTER TABLE OCCUPATION ADD CONSTRAINT uk_occupation_name UNIQUE (occupation_name);

-- ============================================================================
-- COMPOSITE INDEXES FOR PERFORMANCE
-- ============================================================================

-- Index for Eligibility Matching (most frequently queried)
CREATE INDEX idx_eligibility_beneficiary ON ELIGIBILITY_MATCH(beneficiary_id, is_eligible);
CREATE INDEX idx_eligibility_scheme ON ELIGIBILITY_MATCH(scheme_id, is_eligible);

-- Index for Enrollment Queries
CREATE INDEX idx_enrollment_beneficiary ON BENEFICIARY_ENROLLMENT(beneficiary_id, status);
CREATE INDEX idx_enrollment_scheme ON BENEFICIARY_ENROLLMENT(scheme_id, status);
CREATE INDEX idx_enrollment_date ON BENEFICIARY_ENROLLMENT(enrollment_date);

-- Index for Location Hierarchy Queries
CREATE INDEX idx_location_parent ON LOCATION(parent_location_id);
CREATE INDEX idx_location_type ON LOCATION(location_type);

-- Index for Beneficiary Queries
CREATE INDEX idx_beneficiary_location ON BENEFICIARY(location_id);
CREATE INDEX idx_beneficiary_dob ON BENEFICIARY(date_of_birth);
CREATE INDEX idx_beneficiary_income ON BENEFICIARY(annual_income);
CREATE INDEX idx_beneficiary_occupation ON BENEFICIARY(occupation_id);

-- Index for Scheme Queries
CREATE INDEX idx_scheme_domain ON POLICY_SCHEME(domain_id, status);
CREATE INDEX idx_scheme_status ON POLICY_SCHEME(status);

-- Index for Awareness Queries
CREATE INDEX idx_awareness_beneficiary ON BENEFICIARY_AWARENESS(beneficiary_id);
CREATE INDEX idx_awareness_scheme ON BENEFICIARY_AWARENESS(scheme_id);
CREATE INDEX idx_awareness_status ON BENEFICIARY_AWARENESS(awareness_status);

-- Index for Campaign Queries
CREATE INDEX idx_campaign_location ON AWARENESS_CAMPAIGN(target_location_id, status);
CREATE INDEX idx_campaign_date ON AWARENESS_CAMPAIGN(start_date, end_date);

-- Index for Gap Analysis Queries
CREATE INDEX idx_gap_priority ON ENROLLMENT_GAP_ANALYSIS(priority_score);
CREATE INDEX idx_gap_beneficiary ON ENROLLMENT_GAP_ANALYSIS(beneficiary_id);

-- Index for Performance Metrics
CREATE INDEX idx_metric_scheme ON SCHEME_PERFORMANCE_METRICS(scheme_id);
CREATE INDEX idx_metric_enrollment_rate ON SCHEME_PERFORMANCE_METRICS(enrollment_rate);

-- Index for Coverage Analysis
CREATE INDEX idx_coverage_location ON DOMAIN_COVERAGE_ANALYSIS(location_id);
CREATE INDEX idx_coverage_domain ON DOMAIN_COVERAGE_ANALYSIS(domain_id);

-- Full-text search indexes (if needed for scheme names)
CREATE INDEX idx_scheme_name ON POLICY_SCHEME(scheme_name);

-- ============================================================================
-- PARTITIONING (Optional - for very large tables)
-- Can be added later based on performance requirements
-- ============================================================================

-- For BENEFICIARY_ENROLLMENT (partition by enrollment_date for archive/history)
-- For ELIGIBILITY_MATCH (partition by scheme_id for reporting)

-- ============================================================================
-- COMMIT
-- ============================================================================

COMMIT;

PROMPT ============================================================================
PROMPT Constraints and Indexes Created Successfully!
PROMPT ============================================================================
