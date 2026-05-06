-- ============================================================================
-- STAGE 1: DATABASE SCHEMA - 18 TABLES
-- Government Scheme Eligibility & Enrollment System
-- Oracle 21c Database
-- ============================================================================

-- DROP existing tables (for fresh install)
BEGIN
  FOR r IN (SELECT table_name FROM user_tables WHERE table_name LIKE '%') LOOP
    EXECUTE IMMEDIATE 'DROP TABLE ' || r.table_name || ' CASCADE CONSTRAINTS';
  END LOOP;
END;
/

-- ============================================================================
-- CORE MASTER TABLES (Dimensions)
-- ============================================================================

-- 1. LOCATION (Self-Referencing Hierarchy)
-- Supports: State → District → Block → Village
CREATE TABLE LOCATION (
    location_id        NUMBER PRIMARY KEY,
    location_name      VARCHAR2(100) NOT NULL,
    location_type      VARCHAR2(20) NOT NULL, -- 'State', 'District', 'Block', 'Village'
    parent_location_id NUMBER,
    latitude           NUMBER(10,8),
    longitude          NUMBER(11,8),
    population         NUMBER,
    literacy_rate      NUMBER(5,2),
    created_at         TIMESTAMP DEFAULT SYSDATE,
    updated_at         TIMESTAMP DEFAULT SYSDATE,
    CONSTRAINT fk_location_parent FOREIGN KEY (parent_location_id) REFERENCES LOCATION(location_id)
);

-- 2. SCHEME_DOMAIN (8 Domains: Health, Agriculture, Pension, etc.)
CREATE TABLE SCHEME_DOMAIN (
    domain_id          NUMBER PRIMARY KEY,
    domain_name        VARCHAR2(50) NOT NULL UNIQUE, -- Health, Agriculture, Pension, Education, Social Security, etc.
    description        VARCHAR2(500),
    ministry_name      VARCHAR2(100),
    created_at         TIMESTAMP DEFAULT SYSDATE,
    updated_at         TIMESTAMP DEFAULT SYSDATE
);

-- 3. OCCUPATION (Job Categories for Eligibility)
CREATE TABLE OCCUPATION (
    occupation_id      NUMBER PRIMARY KEY,
    occupation_name    VARCHAR2(100) NOT NULL UNIQUE,
    occupation_category VARCHAR2(50), -- 'Agricultural', 'Industrial', 'Service', 'Self-Employed'
    created_at         TIMESTAMP DEFAULT SYSDATE,
    updated_at         TIMESTAMP DEFAULT SYSDATE
);

-- 4. POLICY_SCHEME (1000+ Government Schemes)
CREATE TABLE POLICY_SCHEME (
    scheme_id          NUMBER PRIMARY KEY,
    scheme_code        VARCHAR2(20) NOT NULL UNIQUE,
    scheme_name        VARCHAR2(200) NOT NULL,
    domain_id          NUMBER NOT NULL,
    description        VARCHAR2(1000),
    launch_year        NUMBER,
    budget_allocation  NUMBER(15,2), -- in INR
    min_annual_benefit NUMBER(15,2),
    max_annual_benefit NUMBER(15,2),
    application_method VARCHAR2(100), -- 'Online', 'Offline', 'Both'
    status             VARCHAR2(20) DEFAULT 'Active', -- 'Active', 'Inactive', 'Suspended'
    created_at         TIMESTAMP DEFAULT SYSDATE,
    updated_at         TIMESTAMP DEFAULT SYSDATE,
    CONSTRAINT fk_scheme_domain FOREIGN KEY (domain_id) REFERENCES SCHEME_DOMAIN(domain_id)
);

-- 5. SCHEME_BENEFIT (Detailed Benefits per Scheme)
CREATE TABLE SCHEME_BENEFIT (
    benefit_id         NUMBER PRIMARY KEY,
    scheme_id          NUMBER NOT NULL,
    benefit_name       VARCHAR2(200) NOT NULL,
    benefit_type       VARCHAR2(50), -- 'Cash', 'Insurance', 'Service', 'Goods'
    benefit_amount     NUMBER(15,2),
    frequency          VARCHAR2(20), -- 'Monthly', 'Annual', 'One-time'
    description        VARCHAR2(500),
    created_at         TIMESTAMP DEFAULT SYSDATE,
    CONSTRAINT fk_benefit_scheme FOREIGN KEY (scheme_id) REFERENCES POLICY_SCHEME(scheme_id)
);

-- 6. DOCUMENT (Document Requirements for Schemes)
CREATE TABLE DOCUMENT (
    document_id        NUMBER PRIMARY KEY,
    scheme_id          NUMBER NOT NULL,
    document_type      VARCHAR2(100) NOT NULL, -- 'Aadhaar', 'PAN', 'BankAccount', 'Certificate', etc.
    document_name      VARCHAR2(200) NOT NULL,
    is_mandatory       VARCHAR2(1) DEFAULT 'Y', -- 'Y' or 'N'
    description        VARCHAR2(500),
    created_at         TIMESTAMP DEFAULT SYSDATE,
    CONSTRAINT fk_doc_scheme FOREIGN KEY (scheme_id) REFERENCES POLICY_SCHEME(scheme_id)
);

-- ============================================================================
-- BENEFICIARY MASTER TABLE
-- ============================================================================

-- 7. BENEFICIARY (Citizen/Person Data)
CREATE TABLE BENEFICIARY (
    beneficiary_id     NUMBER PRIMARY KEY,
    aadhaar_number     VARCHAR2(12) NOT NULL UNIQUE,
    first_name         VARCHAR2(50) NOT NULL,
    middle_name        VARCHAR2(50),
    last_name          VARCHAR2(50) NOT NULL,
    date_of_birth      DATE NOT NULL,
    gender             VARCHAR2(1), -- 'M', 'F', 'O'
    marital_status     VARCHAR2(20), -- 'Single', 'Married', 'Widow', 'Divorced', 'Widower'
    annual_income      NUMBER(15,2),
    occupation_id      NUMBER,
    caste_category     VARCHAR2(30), -- 'General', 'OBC', 'SC', 'ST'
    disability_status  VARCHAR2(1) DEFAULT 'N', -- 'Y' or 'N'
    disability_type    VARCHAR2(50),
    bpl_status         VARCHAR2(1) DEFAULT 'N', -- 'Y' or 'N' (Below Poverty Line)
    land_holding_acres NUMBER(10,3),
    location_id        NUMBER NOT NULL,
    phone_number       VARCHAR2(15),
    email              VARCHAR2(100),
    registration_date  DATE DEFAULT SYSDATE,
    last_updated       TIMESTAMP DEFAULT SYSDATE,
    CONSTRAINT fk_benef_occupation FOREIGN KEY (occupation_id) REFERENCES OCCUPATION(occupation_id),
    CONSTRAINT fk_benef_location FOREIGN KEY (location_id) REFERENCES LOCATION(location_id)
);

-- 8. FAMILY_MEMBER (Dependents of Beneficiary)
CREATE TABLE FAMILY_MEMBER (
    family_member_id   NUMBER PRIMARY KEY,
    beneficiary_id     NUMBER NOT NULL,
    member_name        VARCHAR2(100) NOT NULL,
    relation_type      VARCHAR2(50), -- 'Spouse', 'Child', 'Parent', 'Sibling'
    date_of_birth      DATE,
    gender             VARCHAR2(1),
    occupation_id      NUMBER,
    created_at         TIMESTAMP DEFAULT SYSDATE,
    CONSTRAINT fk_member_beneficiary FOREIGN KEY (beneficiary_id) REFERENCES BENEFICIARY(beneficiary_id),
    CONSTRAINT fk_member_occupation FOREIGN KEY (occupation_id) REFERENCES OCCUPATION(occupation_id)
);

-- ============================================================================
-- ELIGIBILITY & ENROLLMENT TRANSACTION TABLES
-- ============================================================================

-- 9. ELIGIBILITY_CRITERIA (Scheme-Specific Eligibility Rules)
CREATE TABLE ELIGIBILITY_CRITERIA (
    criteria_id        NUMBER PRIMARY KEY,
    scheme_id          NUMBER NOT NULL,
    criteria_name      VARCHAR2(200) NOT NULL,
    criteria_type      VARCHAR2(50), -- 'Age', 'Income', 'Gender', 'Location', 'Occupation', 'Caste', 'BPL'
    min_value          VARCHAR2(50),
    max_value          VARCHAR2(50),
    condition_logic    VARCHAR2(500), -- SQL condition (e.g., "AGE BETWEEN 60 AND 120")
    is_mandatory       VARCHAR2(1) DEFAULT 'Y',
    created_at         TIMESTAMP DEFAULT SYSDATE,
    CONSTRAINT fk_criteria_scheme FOREIGN KEY (scheme_id) REFERENCES POLICY_SCHEME(scheme_id)
);

-- 10. ELIGIBILITY_MATCH (Many-to-Many: Beneficiary ↔ Scheme)
CREATE TABLE ELIGIBILITY_MATCH (
    eligibility_id     NUMBER PRIMARY KEY,
    beneficiary_id     NUMBER NOT NULL,
    scheme_id          NUMBER NOT NULL,
    is_eligible        VARCHAR2(1) DEFAULT 'N', -- 'Y' or 'N'
    eligibility_score  NUMBER(5,2), -- 0-100 (percentage of matched criteria)
    matched_criteria   NUMBER, -- count of matched criteria
    total_criteria     NUMBER, -- total criteria for scheme
    calculated_date    TIMESTAMP DEFAULT SYSDATE,
    last_recalculated  TIMESTAMP,
    CONSTRAINT fk_elig_beneficiary FOREIGN KEY (beneficiary_id) REFERENCES BENEFICIARY(beneficiary_id),
    CONSTRAINT fk_elig_scheme FOREIGN KEY (scheme_id) REFERENCES POLICY_SCHEME(scheme_id),
    CONSTRAINT uk_elig_benef_scheme UNIQUE (beneficiary_id, scheme_id)
);

-- 11. BENEFICIARY_ENROLLMENT (Actual Enrollments)
CREATE TABLE BENEFICIARY_ENROLLMENT (
    enrollment_id      NUMBER PRIMARY KEY,
    beneficiary_id     NUMBER NOT NULL,
    scheme_id          NUMBER NOT NULL,
    enrollment_date    DATE NOT NULL DEFAULT SYSDATE,
    status             VARCHAR2(30) DEFAULT 'Applied', -- 'Applied', 'Approved', 'Rejected', 'Active', 'Inactive', 'Completed'
    documents_submitted VARCHAR2(1) DEFAULT 'N', -- 'Y' or 'N'
    approval_date      DATE,
    rejection_reason   VARCHAR2(500),
    annual_benefit_received NUMBER(15,2),
    activation_date    DATE,
    deactivation_date  DATE,
    last_updated       TIMESTAMP DEFAULT SYSDATE,
    CONSTRAINT fk_enroll_beneficiary FOREIGN KEY (beneficiary_id) REFERENCES BENEFICIARY(beneficiary_id),
    CONSTRAINT fk_enroll_scheme FOREIGN KEY (scheme_id) REFERENCES POLICY_SCHEME(scheme_id)
);

-- ============================================================================
-- AWARENESS & CAMPAIGN TABLES
-- ============================================================================

-- 12. AWARENESS_CAMPAIGN (Awareness Programs)
CREATE TABLE AWARENESS_CAMPAIGN (
    campaign_id        NUMBER PRIMARY KEY,
    campaign_name      VARCHAR2(200) NOT NULL,
    campaign_type      VARCHAR2(50), -- 'TV', 'Radio', 'Digital', 'Ground', 'WhatsApp'
    target_location_id NUMBER NOT NULL,
    start_date         DATE NOT NULL,
    end_date           DATE,
    budget_allocated   NUMBER(15,2),
    budget_spent       NUMBER(15,2),
    target_beneficiaries NUMBER,
    status             VARCHAR2(20) DEFAULT 'Planned', -- 'Planned', 'Ongoing', 'Completed'
    created_at         TIMESTAMP DEFAULT SYSDATE,
    CONSTRAINT fk_campaign_location FOREIGN KEY (target_location_id) REFERENCES LOCATION(location_id)
);

-- 13. CAMPAIGN_IMPACT (Campaign Performance Metrics)
CREATE TABLE CAMPAIGN_IMPACT (
    impact_id          NUMBER PRIMARY KEY,
    campaign_id        NUMBER NOT NULL,
    metric_name        VARCHAR2(100), -- 'Reach', 'Awareness', 'Enrollments', 'Applications'
    baseline_value     NUMBER(15,2), -- value before campaign
    post_campaign_value NUMBER(15,2), -- value after campaign
    improvement_percent NUMBER(7,2),
    measurement_date   DATE,
    notes              VARCHAR2(500),
    CONSTRAINT fk_impact_campaign FOREIGN KEY (campaign_id) REFERENCES AWARENESS_CAMPAIGN(campaign_id)
);

-- 14. BENEFICIARY_AWARENESS (Awareness Status per Beneficiary)
CREATE TABLE BENEFICIARY_AWARENESS (
    awareness_id       NUMBER PRIMARY KEY,
    beneficiary_id     NUMBER NOT NULL,
    scheme_id          NUMBER NOT NULL,
    awareness_status   VARCHAR2(20) DEFAULT 'Unaware', -- 'Unaware', 'Aware', 'Interested', 'Applied', 'Enrolled'
    awareness_source   VARCHAR2(100), -- 'TV', 'Radio', 'Digital', 'Community Meeting', 'Family', 'Self'
    awareness_date     DATE DEFAULT SYSDATE,
    last_updated       TIMESTAMP DEFAULT SYSDATE,
    CONSTRAINT fk_aware_beneficiary FOREIGN KEY (beneficiary_id) REFERENCES BENEFICIARY(beneficiary_id),
    CONSTRAINT fk_aware_scheme FOREIGN KEY (scheme_id) REFERENCES POLICY_SCHEME(scheme_id)
);

-- 15. AWARENESS_BARRIER (Reasons for Non-Enrollment)
CREATE TABLE AWARENESS_BARRIER (
    barrier_id         NUMBER PRIMARY KEY,
    beneficiary_id     NUMBER NOT NULL,
    scheme_id          NUMBER NOT NULL,
    barrier_type       VARCHAR2(100), -- 'Document', 'Awareness', 'Eligibility', 'Process', 'Trust', 'Other'
    barrier_description VARCHAR2(500),
    reported_date      DATE DEFAULT SYSDATE,
    resolution_status  VARCHAR2(20) DEFAULT 'Open', -- 'Open', 'In-Progress', 'Resolved'
    resolution_notes   VARCHAR2(500),
    CONSTRAINT fk_barrier_beneficiary FOREIGN KEY (beneficiary_id) REFERENCES BENEFICIARY(beneficiary_id),
    CONSTRAINT fk_barrier_scheme FOREIGN KEY (scheme_id) REFERENCES POLICY_SCHEME(scheme_id)
);

-- ============================================================================
-- ANALYTICS TABLES (Aggregated Data for Reporting)
-- ============================================================================

-- 16. ENROLLMENT_GAP_ANALYSIS (Gap between Eligible vs Enrolled)
CREATE TABLE ENROLLMENT_GAP_ANALYSIS (
    gap_id             NUMBER PRIMARY KEY,
    beneficiary_id     NUMBER NOT NULL,
    total_eligible_schemes NUMBER,
    total_enrolled_schemes NUMBER,
    gap_count          NUMBER, -- eligible - enrolled
    potential_annual_benefit_missed NUMBER(15,2),
    priority_score     NUMBER(5,2), -- for targeted outreach (1-100)
    calculated_date    TIMESTAMP DEFAULT SYSDATE,
    CONSTRAINT fk_gap_beneficiary FOREIGN KEY (beneficiary_id) REFERENCES BENEFICIARY(beneficiary_id)
);

-- 17. SCHEME_PERFORMANCE_METRICS (KPIs per Scheme)
CREATE TABLE SCHEME_PERFORMANCE_METRICS (
    metric_id          NUMBER PRIMARY KEY,
    scheme_id          NUMBER NOT NULL,
    total_eligible     NUMBER,
    total_enrolled     NUMBER,
    enrollment_rate    NUMBER(5,2), -- enrolled / eligible * 100
    total_benefit_disbursed NUMBER(15,2),
    avg_time_to_approval NUMBER(5,2), -- days
    document_completion_rate NUMBER(5,2),
    satisfaction_score NUMBER(5,2),
    calculated_date    TIMESTAMP DEFAULT SYSDATE,
    CONSTRAINT fk_metric_scheme FOREIGN KEY (scheme_id) REFERENCES POLICY_SCHEME(scheme_id)
);

-- 18. DOMAIN_COVERAGE_ANALYSIS (Domain-wise Statistics)
CREATE TABLE DOMAIN_COVERAGE_ANALYSIS (
    coverage_id        NUMBER PRIMARY KEY,
    location_id        NUMBER NOT NULL,
    domain_id          NUMBER NOT NULL,
    total_schemes      NUMBER,
    total_eligible_beneficiaries NUMBER,
    total_enrolled_beneficiaries NUMBER,
    coverage_percent   NUMBER(5,2), -- enrolled / eligible * 100
    awareness_percent  NUMBER(5,2),
    calculated_date    TIMESTAMP DEFAULT SYSDATE,
    CONSTRAINT fk_coverage_location FOREIGN KEY (location_id) REFERENCES LOCATION(location_id),
    CONSTRAINT fk_coverage_domain FOREIGN KEY (domain_id) REFERENCES SCHEME_DOMAIN(domain_id)
);

-- ============================================================================
-- SEQUENCES FOR PRIMARY KEY GENERATION
-- ============================================================================

CREATE SEQUENCE seq_location_id START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_domain_id START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_occupation_id START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_scheme_id START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_benefit_id START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_document_id START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_beneficiary_id START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_family_member_id START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_criteria_id START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_eligibility_id START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_enrollment_id START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_campaign_id START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_impact_id START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_awareness_id START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_barrier_id START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_gap_id START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_metric_id START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_coverage_id START WITH 1 INCREMENT BY 1;

-- ============================================================================
-- AUDIT TABLE (For Tracking All Changes)
-- ============================================================================

CREATE TABLE AUDIT_LOG (
    audit_id           NUMBER PRIMARY KEY,
    table_name         VARCHAR2(50),
    operation          VARCHAR2(10), -- 'INSERT', 'UPDATE', 'DELETE'
    record_id          NUMBER,
    old_values         VARCHAR2(4000),
    new_values         VARCHAR2(4000),
    changed_by         VARCHAR2(100),
    changed_at         TIMESTAMP DEFAULT SYSDATE
);

CREATE SEQUENCE seq_audit_id START WITH 1 INCREMENT BY 1;

-- ============================================================================
-- COMMIT CHANGES
-- ============================================================================

COMMIT;

PROMPT ============================================================================
PROMPT Database Schema Created Successfully!
PROMPT 18 Tables + 18 Sequences + Audit Table
PROMPT ============================================================================
