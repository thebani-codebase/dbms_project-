-- ============================================================================
-- STAGE 1: SAMPLE DATA & SEED INSERTION
-- Government Scheme Eligibility & Enrollment System
-- ============================================================================

-- ============================================================================
-- 1. LOCATION HIERARCHY (Self-Referencing)
-- ============================================================================

-- States
INSERT INTO LOCATION VALUES (seq_location_id.NEXTVAL, 'Punjab', 'State', NULL, 31.1471, 74.8550, 27743000, 75.84, SYSDATE, SYSDATE);
INSERT INTO LOCATION VALUES (seq_location_id.NEXTVAL, 'Uttar Pradesh', 'State', NULL, 26.7509, 80.7855, 199812000, 69.72, SYSDATE, SYSDATE);
INSERT INTO LOCATION VALUES (seq_location_id.NEXTVAL, 'Maharashtra', 'State', NULL, 19.7515, 75.7139, 112972000, 82.91, SYSDATE, SYSDATE);
INSERT INTO LOCATION VALUES (seq_location_id.NEXTVAL, 'Delhi', 'State', NULL, 28.7041, 77.1025, 16753235, 86.34, SYSDATE, SYSDATE);

-- Districts (Punjab)
INSERT INTO LOCATION VALUES (seq_location_id.NEXTVAL, 'Amritsar', 'District', 1, 31.6340, 74.8723, 2414000, 75.60, SYSDATE, SYSDATE);
INSERT INTO LOCATION VALUES (seq_location_id.NEXTVAL, 'Ludhiana', 'District', 1, 30.9010, 75.8573, 5678000, 81.23, SYSDATE, SYSDATE);
INSERT INTO LOCATION VALUES (seq_location_id.NEXTVAL, 'Jalandhar', 'District', 1, 31.7268, 75.5762, 3299000, 76.45, SYSDATE, SYSDATE);

-- Blocks (Amritsar)
INSERT INTO LOCATION VALUES (seq_location_id.NEXTVAL, 'Amritsar City', 'Block', 5, 31.6340, 74.8723, 1200000, 82.30, SYSDATE, SYSDATE);
INSERT INTO LOCATION VALUES (seq_location_id.NEXTVAL, 'Amritsar Rural', 'Block', 5, 31.5900, 74.9000, 1214000, 69.00, SYSDATE, SYSDATE);

-- Villages (Amritsar)
INSERT INTO LOCATION VALUES (seq_location_id.NEXTVAL, 'Khera', 'Village', 8, 31.5500, 74.9200, 5000, 65.00, SYSDATE, SYSDATE);
INSERT INTO LOCATION VALUES (seq_location_id.NEXTVAL, 'Bharatpur', 'Village', 8, 31.5600, 74.9300, 3500, 62.00, SYSDATE, SYSDATE);
INSERT INTO LOCATION VALUES (seq_location_id.NEXTVAL, 'Rajpur', 'Village', 9, 31.6000, 74.8500, 4200, 68.00, SYSDATE, SYSDATE);

-- ============================================================================
-- 2. SCHEME DOMAINS (8 Domains)
-- ============================================================================

INSERT INTO SCHEME_DOMAIN VALUES (seq_domain_id.NEXTVAL, 'Health', 'Healthcare and medical schemes', 'Ministry of Health and Family Welfare', SYSDATE, SYSDATE);
INSERT INTO SCHEME_DOMAIN VALUES (seq_domain_id.NEXTVAL, 'Agriculture', 'Farm support and agricultural schemes', 'Ministry of Agriculture', SYSDATE, SYSDATE);
INSERT INTO SCHEME_DOMAIN VALUES (seq_domain_id.NEXTVAL, 'Social Security', 'Pensions and social welfare', 'Ministry of Social Justice', SYSDATE, SYSDATE);
INSERT INTO SCHEME_DOMAIN VALUES (seq_domain_id.NEXTVAL, 'Education', 'Scholarships and education support', 'Ministry of Education', SYSDATE, SYSDATE);
INSERT INTO SCHEME_DOMAIN VALUES (seq_domain_id.NEXTVAL, 'Women & Child', 'Women empowerment schemes', 'Ministry of Women and Child Development', SYSDATE, SYSDATE);
INSERT INTO SCHEME_DOMAIN VALUES (seq_domain_id.NEXTVAL, 'Employment', 'Job creation and training schemes', 'Ministry of Labour', SYSDATE, SYSDATE);
INSERT INTO SCHEME_DOMAIN VALUES (seq_domain_id.NEXTVAL, 'Housing', 'Home and housing schemes', 'Ministry of Housing', SYSDATE, SYSDATE);
INSERT INTO SCHEME_DOMAIN VALUES (seq_domain_id.NEXTVAL, 'Financial Inclusion', 'Banking and financial schemes', 'Ministry of Finance', SYSDATE, SYSDATE);

-- ============================================================================
-- 3. OCCUPATIONS
-- ============================================================================

INSERT INTO OCCUPATION VALUES (seq_occupation_id.NEXTVAL, 'Farmer', 'Agricultural', SYSDATE, SYSDATE);
INSERT INTO OCCUPATION VALUES (seq_occupation_id.NEXTVAL, 'Laborer', 'Agricultural', SYSDATE, SYSDATE);
INSERT INTO OCCUPATION VALUES (seq_occupation_id.NEXTVAL, 'Small Business Owner', 'Self-Employed', SYSDATE, SYSDATE);
INSERT INTO OCCUPATION VALUES (seq_occupation_id.NEXTVAL, 'Government Employee', 'Service', SYSDATE, SYSDATE);
INSERT INTO OCCUPATION VALUES (seq_occupation_id.NEXTVAL, 'Private Employee', 'Service', SYSDATE, SYSDATE);
INSERT INTO OCCUPATION VALUES (seq_occupation_id.NEXTVAL, 'Homemaker', 'Self-Employed', SYSDATE, SYSDATE);
INSERT INTO OCCUPATION VALUES (seq_occupation_id.NEXTVAL, 'Retired', 'Service', SYSDATE, SYSDATE);
INSERT INTO OCCUPATION VALUES (seq_occupation_id.NEXTVAL, 'Unemployed', 'Self-Employed', SYSDATE, SYSDATE);

-- ============================================================================
-- 4. POLICY SCHEMES (Sample 15+ schemes)
-- ============================================================================

-- Health Schemes
INSERT INTO POLICY_SCHEME VALUES (seq_scheme_id.NEXTVAL, 'PM-JAY', 'Ayushman Bharat - Prime Minister Jan Arogya Yojana', 1, 
    'Free healthcare up to 5 lakh per family per year', 2018, 500000000000, 0, 500000, 'Online', 'Active', SYSDATE, SYSDATE);

INSERT INTO POLICY_SCHEME VALUES (seq_scheme_id.NEXTVAL, 'NRHM', 'National Rural Health Mission', 1, 
    'Rural health support and medical services', 2005, 100000000000, 0, 10000, 'Both', 'Active', SYSDATE, SYSDATE);

INSERT INTO POLICY_SCHEME VALUES (seq_scheme_id.NEXTVAL, 'RBSK', 'Rashtriya Bal Swasthya Karyakram', 1, 
    'Child health and immunization program', 2013, 20000000000, 0, 5000, 'Both', 'Active', SYSDATE, SYSDATE);

-- Social Security Schemes
INSERT INTO POLICY_SCHEME VALUES (seq_scheme_id.NEXTVAL, 'IGNOAP', 'Indira Gandhi National Old Age Pension Scheme', 3, 
    'Monthly pension for senior citizens (60+)', 1995, 50000000000, 12000, 12000, 'Online', 'Active', SYSDATE, SYSDATE);

INSERT INTO POLICY_SCHEME VALUES (seq_scheme_id.NEXTVAL, 'IGNWPS', 'Indira Gandhi National Widow Pension Scheme', 3, 
    'Monthly pension for widows', 1995, 30000000000, 18000, 18000, 'Online', 'Active', SYSDATE, SYSDATE);

INSERT INTO POLICY_SCHEME VALUES (seq_scheme_id.NEXTVAL, 'IGNDS', 'Indira Gandhi National Disability Pension Scheme', 3, 
    'Monthly pension for disabled persons', 1995, 25000000000, 12000, 12000, 'Online', 'Active', SYSDATE, SYSDATE);

INSERT INTO POLICY_SCHEME VALUES (seq_scheme_id.NEXTVAL, 'NSAP', 'National Social Assistance Program', 3, 
    'Financial assistance for destitute persons', 1995, 15000000000, 8000, 8000, 'Offline', 'Active', SYSDATE, SYSDATE);

-- Agriculture Schemes
INSERT INTO POLICY_SCHEME VALUES (seq_scheme_id.NEXTVAL, 'PM-KISAN', 'Pradhan Mantri Kisan Samman Nidhi', 2, 
    'Direct income support for farmers: 6000/year in 3 installments', 2018, 750000000000, 6000, 6000, 'Online', 'Active', SYSDATE, SYSDATE);

INSERT INTO POLICY_SCHEME VALUES (seq_scheme_id.NEXTVAL, 'PMFBY', 'Pradhan Mantri Fasal Bima Yojana', 2, 
    'Crop insurance scheme for farmers', 2016, 500000000000, 5000, 50000, 'Online', 'Active', SYSDATE, SYSDATE);

INSERT INTO POLICY_SCHEME VALUES (seq_scheme_id.NEXTVAL, 'PMKMY', 'Pradhan Mantri Krishi Sinchai Yojana', 2, 
    'Micro-irrigation facilities for farmers', 2015, 50000000000, 45000, 45000, 'Both', 'Active', SYSDATE, SYSDATE);

INSERT INTO POLICY_SCHEME VALUES (seq_scheme_id.NEXTVAL, 'SOIL', 'Soil Health Card Scheme', 2, 
    'Soil testing and health card distribution', 2015, 30000000000, 2000, 2000, 'Both', 'Active', SYSDATE, SYSDATE);

-- Employment Schemes
INSERT INTO POLICY_SCHEME VALUES (seq_scheme_id.NEXTVAL, 'MNREGA', 'Mahatma Gandhi National Rural Employment Guarantee Act', 6, 
    'Guaranteed employment: 100 days/year at min wage', 2005, 600000000000, 15000, 18000, 'Offline', 'Active', SYSDATE, SYSDATE);

INSERT INTO POLICY_SCHEME VALUES (seq_scheme_id.NEXTVAL, 'PMEGP', 'Prime Minister Employment Generation Programme', 6, 
    'Self-employment support through subsidized loans', 2008, 25000000000, 0, 500000, 'Both', 'Active', SYSDATE, SYSDATE);

INSERT INTO POLICY_SCHEME VALUES (seq_scheme_id.NEXTVAL, 'PMGKY', 'Pradhan Mantri Garib Kalyan Yojana', 6, 
    'Skill training for rural youth', 2015, 15000000000, 8000, 8000, 'Both', 'Active', SYSDATE, SYSDATE);

-- Education Schemes
INSERT INTO POLICY_SCHEME VALUES (seq_scheme_id.NEXTVAL, 'PMSS', 'Prime Minister Scholarship Scheme', 4, 
    'Scholarships for top school students', 2006, 10000000000, 3000, 12000, 'Online', 'Active', SYSDATE, SYSDATE);

INSERT INTO POLICY_SCHEME VALUES (seq_scheme_id.NEXTVAL, 'NSP', 'National Scholarship Portal', 4, 
    'Central sector scholarships for higher education', 2012, 120000000000, 10000, 50000, 'Online', 'Active', SYSDATE, SYSDATE);

-- Women & Child Schemes
INSERT INTO POLICY_SCHEME VALUES (seq_scheme_id.NEXTVAL, 'MKUY', 'Mahila Kisan Udyam Yojana', 5, 
    'Support for women entrepreneurs in agriculture', 2022, 5000000000, 10000, 100000, 'Both', 'Active', SYSDATE, SYSDATE);

INSERT INTO POLICY_SCHEME VALUES (seq_scheme_id.NEXTVAL, 'UJJWALA', 'Pradhan Mantri Ujjwala Yojana', 5, 
    'Free LPG connections to BPL families', 2016, 80000000000, 0, 0, 'Both', 'Active', SYSDATE, SYSDATE);

INSERT INTO POLICY_SCHEME VALUES (seq_scheme_id.NEXTVAL, 'BETI BACHAO', 'Beti Bachao Beti Padhao', 5, 
    'Save daughter, educate daughter campaign', 2015, 20000000000, 5000, 5000, 'Both', 'Active', SYSDATE, SYSDATE);

-- Housing Schemes
INSERT INTO POLICY_SCHEME VALUES (seq_scheme_id.NEXTVAL, 'PMAYG', 'Pradhan Mantri Awas Yojana - Gramin', 7, 
    'Housing for rural poor', 2015, 150000000000, 120000, 120000, 'Both', 'Active', SYSDATE, SYSDATE);

INSERT INTO POLICY_SCHEME VALUES (seq_scheme_id.NEXTVAL, 'PMAYU', 'Pradhan Mantri Awas Yojana - Urban', 7, 
    'Housing for urban poor', 2015, 100000000000, 100000, 100000, 'Both', 'Active', SYSDATE, SYSDATE);

-- ============================================================================
-- 5. SCHEME BENEFITS
-- ============================================================================

INSERT INTO SCHEME_BENEFIT VALUES (seq_benefit_id.NEXTVAL, 1, 'Hospitalization Coverage', 'Insurance', 500000, 'One-time', 'Up to 5 lakh per hospitalization', SYSDATE);
INSERT INTO SCHEME_BENEFIT VALUES (seq_benefit_id.NEXTVAL, 3, 'Old Age Pension', 'Cash', 1000, 'Monthly', 'Direct cash transfer to bank account', SYSDATE);
INSERT INTO SCHEME_BENEFIT VALUES (seq_benefit_id.NEXTVAL, 4, 'Widow Pension', 'Cash', 1500, 'Monthly', 'For widows aged 18+', SYSDATE);
INSERT INTO SCHEME_BENEFIT VALUES (seq_benefit_id.NEXTVAL, 6, 'Direct Income Support', 'Cash', 6000, 'Annual', 'In 3 installments of 2000 each', SYSDATE);
INSERT INTO SCHEME_BENEFIT VALUES (seq_benefit_id.NEXTVAL, 8, 'Employment Guarantee', 'Service', 15000, 'Annual', '100 days of guaranteed work', SYSDATE);

-- ============================================================================
-- 6. ELIGIBILITY CRITERIA
-- ============================================================================

-- Criteria for Old Age Pension (scheme_id=3)
INSERT INTO ELIGIBILITY_CRITERIA VALUES (seq_criteria_id.NEXTVAL, 3, 'Age Requirement', 'Age', '60', '150', 'AGE >= 60', 'Y', SYSDATE);
INSERT INTO ELIGIBILITY_CRITERIA VALUES (seq_criteria_id.NEXTVAL, 3, 'Income Limit', 'Income', '0', '48000', 'ANNUAL_INCOME <= 48000', 'Y', SYSDATE);
INSERT INTO ELIGIBILITY_CRITERIA VALUES (seq_criteria_id.NEXTVAL, 3, 'Indian Citizen', 'Location', NULL, NULL, 'LOCATION IN INDIA', 'Y', SYSDATE);

-- Criteria for Widow Pension (scheme_id=4)
INSERT INTO ELIGIBILITY_CRITERIA VALUES (seq_criteria_id.NEXTVAL, 4, 'Marital Status', 'Gender', NULL, NULL, 'MARITAL_STATUS IN (''WIDOW'', ''WIDOWER'')', 'Y', SYSDATE);
INSERT INTO ELIGIBILITY_CRITERIA VALUES (seq_criteria_id.NEXTVAL, 4, 'Age Requirement', 'Age', '18', '150', 'AGE >= 18', 'Y', SYSDATE);
INSERT INTO ELIGIBILITY_CRITERIA VALUES (seq_criteria_id.NEXTVAL, 4, 'Income Limit', 'Income', '0', '48000', 'ANNUAL_INCOME <= 48000', 'Y', SYSDATE);

-- Criteria for PM-KISAN (scheme_id=6)
INSERT INTO ELIGIBILITY_CRITERIA VALUES (seq_criteria_id.NEXTVAL, 6, 'Farmer Status', 'Occupation', NULL, NULL, 'OCCUPATION_ID = 1', 'Y', SYSDATE);
INSERT INTO ELIGIBILITY_CRITERIA VALUES (seq_criteria_id.NEXTVAL, 6, 'Land Holding', 'Land', '0', '5', 'LAND_HOLDING_ACRES <= 5', 'Y', SYSDATE);

-- Criteria for Ayushman Bharat (scheme_id=1)
INSERT INTO ELIGIBILITY_CRITERIA VALUES (seq_criteria_id.NEXTVAL, 1, 'BPL Status', 'BPL', NULL, NULL, 'BPL_STATUS = ''Y'' OR ANNUAL_INCOME <= 100000', 'Y', SYSDATE);

-- ============================================================================
-- 7. BENEFICIARIES (Sample 5 beneficiaries)
-- ============================================================================

-- Beneficiary 1: Elderly Male (eligible for Old Age Pension)
INSERT INTO BENEFICIARY VALUES (seq_beneficiary_id.NEXTVAL, '123456789012', 'Ramesh', 'Kumar', 'Sharma', 
    TO_DATE('1956-03-15', 'YYYY-MM-DD'), 'M', 'Married', 35000, 7, 'General', 'N', NULL, 'Y', 2.5,
    10, '9876543210', 'ramesh@email.com', SYSDATE, SYSDATE);

-- Beneficiary 2: Widow Female (eligible for Widow Pension)
INSERT INTO BENEFICIARY VALUES (seq_beneficiary_id.NEXTVAL, '223456789012', 'Priya', NULL, 'Singh', 
    TO_DATE('1960-07-22', 'YYYY-MM-DD'), 'F', 'Widow', 25000, 6, 'SC', 'N', NULL, 'Y', 1.0,
    10, '9876543211', 'priya@email.com', SYSDATE, SYSDATE);

-- Beneficiary 3: Young Farmer (eligible for PM-KISAN)
INSERT INTO BENEFICIARY VALUES (seq_beneficiary_id.NEXTVAL, '323456789012', 'Jitendra', 'Singh', 'Verma', 
    TO_DATE('1985-11-30', 'YYYY-MM-DD'), 'M', 'Married', 120000, 1, 'OBC', 'N', NULL, 'Y', 3.5,
    10, '9876543212', 'jitendra@email.com', SYSDATE, SYSDATE);

-- Beneficiary 4: Disabled Person (eligible for Disability Pension)
INSERT INTO BENEFICIARY VALUES (seq_beneficiary_id.NEXTVAL, '423456789012', 'Sunita', NULL, 'Patel', 
    TO_DATE('1975-01-10', 'YYYY-MM-DD'), 'F', 'Single', 15000, 8, 'General', 'Y', 'Hearing Impaired', 'Y', 0.5,
    10, '9876543213', 'sunita@email.com', SYSDATE, SYSDATE);

-- Beneficiary 5: Young Woman (potential for women schemes)
INSERT INTO BENEFICIARY VALUES (seq_beneficiary_id.NEXTVAL, '523456789012', 'Anita', 'Dev', 'Kumar', 
    TO_DATE('1992-05-18', 'YYYY-MM-DD'), 'F', 'Single', 80000, 3, 'ST', 'N', NULL, 'N', 0.0,
    10, '9876543214', 'anita@email.com', SYSDATE, SYSDATE);

-- Beneficiary 6: BPL Family (eligible for multiple schemes)
INSERT INTO BENEFICIARY VALUES (seq_beneficiary_id.NEXTVAL, '678901234567', 'Rajesh', 'Kumar', 'Yadav', 
    TO_DATE('1978-09-10', 'YYYY-MM-DD'), 'M', 'Married', 28000, 1, 'OBC', 'N', NULL, 'Y', 2.0,
    8, '9876543215', 'rajesh@email.com', SYSDATE, SYSDATE);

-- Beneficiary 7: SC Student (eligible for education schemes)
INSERT INTO BENEFICIARY VALUES (seq_beneficiary_id.NEXTVAL, '789012345678', 'Amit', 'Kumar', 'Sharma', 
    TO_DATE('2005-03-15', 'YYYY-MM-DD'), 'M', 'Single', 0, 2, 'SC', 'N', NULL, 'Y', 0.0,
    10, '9876543216', 'amit@email.com', SYSDATE, SYSDATE);

-- Beneficiary 8: Disabled Farmer (eligible for disability and agriculture schemes)
INSERT INTO BENEFICIARY VALUES (seq_beneficiary_id.NEXTVAL, '890123456789', 'Dhanraj', 'Singh', 'Patel', 
    TO_DATE('1980-12-25', 'YYYY-MM-DD'), 'M', 'Married', 45000, 1, 'General', 'N', NULL, 'Y', 4.0,
    10, '9876543217', 'dhanraj@email.com', SYSDATE, SYSDATE);

-- Beneficiary 9: Urban Poor Woman (eligible for housing and women schemes)
INSERT INTO BENEFICIARY VALUES (seq_beneficiary_id.NEXTVAL, '901234567890', 'Sunita', 'Devi', 'Sharma', 
    TO_DATE('1988-07-12', 'YYYY-MM-DD'), 'F', 'Married', 22000, 4, 'General', 'N', NULL, 'N', 0.0,
    10, '9876543218', 'sunita@email.com', SYSDATE, SYSDATE);

-- ============================================================================
-- 8. DOCUMENTS REQUIRED
-- ============================================================================

INSERT INTO DOCUMENT VALUES (seq_document_id.NEXTVAL, 1, 'Aadhaar', 'Aadhaar Card', 'Y', 'Identity proof', SYSDATE);
INSERT INTO DOCUMENT VALUES (seq_document_id.NEXTVAL, 1, 'Income Certificate', 'Income Certificate', 'Y', 'Income proof', SYSDATE);
INSERT INTO DOCUMENT VALUES (seq_document_id.NEXTVAL, 3, 'Aadhaar', 'Aadhaar Card', 'Y', 'Identity proof', SYSDATE);
INSERT INTO DOCUMENT VALUES (seq_document_id.NEXTVAL, 3, 'Birth Certificate', 'Birth Certificate', 'N', 'Age proof', SYSDATE);
INSERT INTO DOCUMENT VALUES (seq_document_id.NEXTVAL, 6, 'Aadhaar', 'Aadhaar Card', 'Y', 'Identity proof', SYSDATE);
INSERT INTO DOCUMENT VALUES (seq_document_id.NEXTVAL, 6, 'Land Certificate', 'Land Holding Certificate', 'Y', 'Land proof', SYSDATE);
INSERT INTO DOCUMENT VALUES (seq_document_id.NEXTVAL, 6, 'Bank Account', 'Bank Account Details', 'Y', 'For direct transfer', SYSDATE);

-- ============================================================================
-- 9. FAMILY MEMBERS
-- ============================================================================

INSERT INTO FAMILY_MEMBER VALUES (seq_family_member_id.NEXTVAL, 1, 'Urmila Sharma', 'Spouse', TO_DATE('1958-05-20', 'YYYY-MM-DD'), 'F', NULL, SYSDATE);
INSERT INTO FAMILY_MEMBER VALUES (seq_family_member_id.NEXTVAL, 1, 'Rahul Sharma', 'Child', TO_DATE('1982-10-15', 'YYYY-MM-DD'), 'M', 5, SYSDATE);
INSERT INTO FAMILY_MEMBER VALUES (seq_family_member_id.NEXTVAL, 3, 'Arvind Verma', 'Child', TO_DATE('2008-03-22', 'YYYY-MM-DD'), 'M', NULL, SYSDATE);
INSERT INTO FAMILY_MEMBER VALUES (seq_family_member_id.NEXTVAL, 3, 'Neha Verma', 'Child', TO_DATE('2010-07-18', 'YYYY-MM-DD'), 'F', NULL, SYSDATE);

-- ============================================================================
-- 10. AWARENESS CAMPAIGNS
-- ============================================================================

INSERT INTO AWARENESS_CAMPAIGN VALUES (seq_campaign_id.NEXTVAL, 'Senior Citizen Pension Drive - Amritsar', 'Ground', 5, 
    TO_DATE('2025-01-15', 'YYYY-MM-DD'), TO_DATE('2025-03-15', 'YYYY-MM-DD'), 500000, 450000, 5000, 'Completed', SYSDATE);

INSERT INTO AWARENESS_CAMPAIGN VALUES (seq_campaign_id.NEXTVAL, 'PM-KISAN Digital Campaign - Punjab', 'Digital', 1, 
    TO_DATE('2025-02-01', 'YYYY-MM-DD'), TO_DATE('2025-04-30', 'YYYY-MM-DD'), 1000000, 850000, 10000, 'Ongoing', SYSDATE);

INSERT INTO AWARENESS_CAMPAIGN VALUES (seq_campaign_id.NEXTVAL, 'Women Empowerment Campaign - Ludhiana', 'Digital', 2, 
    TO_DATE('2025-03-01', 'YYYY-MM-DD'), TO_DATE('2025-05-31', 'YYYY-MM-DD'), 750000, 680000, 8000, 'Ongoing', SYSDATE);

INSERT INTO AWARENESS_CAMPAIGN VALUES (seq_campaign_id.NEXTVAL, 'Education Scholarship Drive - Jalandhar', 'Ground', 3, 
    TO_DATE('2025-04-01', 'YYYY-MM-DD'), TO_DATE('2025-06-30', 'YYYY-MM-DD'), 300000, 280000, 4500, 'Completed', SYSDATE);

-- ============================================================================
-- 11. BENEFICIARY ENROLLMENTS (Sample enrollments)
-- ============================================================================

-- Enrollments for existing beneficiaries
INSERT INTO BENEFICIARY_ENROLLMENT VALUES (seq_enrollment_id.NEXTVAL, 1, 3, 'Old Age Pension', 
    TO_DATE('2024-06-01', 'YYYY-MM-DD'), 'Active', 'Y', TO_DATE('2024-06-15', 'YYYY-MM-DD'), NULL, NULL, 12000, TO_DATE('2024-06-01', 'YYYY-MM-DD'), NULL, SYSDATE);

INSERT INTO BENEFICIARY_ENROLLMENT VALUES (seq_enrollment_id.NEXTVAL, 2, 4, 'Widow Pension', 
    TO_DATE('2024-07-01', 'YYYY-MM-DD'), 'Active', 'Y', TO_DATE('2024-07-10', 'YYYY-MM-DD'), NULL, NULL, 18000, TO_DATE('2024-07-01', 'YYYY-MM-DD'), NULL, SYSDATE);

INSERT INTO BENEFICIARY_ENROLLMENT VALUES (seq_enrollment_id.NEXTVAL, 3, 6, 'PM-KISAN', 
    TO_DATE('2024-08-01', 'YYYY-MM-DD'), 'Active', 'Y', TO_DATE('2024-08-05', 'YYYY-MM-DD'), NULL, NULL, 6000, TO_DATE('2024-08-01', 'YYYY-MM-DD'), NULL, SYSDATE);

INSERT INTO BENEFICIARY_ENROLLMENT VALUES (seq_enrollment_id.NEXTVAL, 4, 1, 'Ayushman Bharat', 
    TO_DATE('2024-05-01', 'YYYY-MM-DD'), 'Active', 'Y', TO_DATE('2024-05-10', 'YYYY-MM-DD'), NULL, NULL, 0, TO_DATE('2024-05-01', 'YYYY-MM-DD'), NULL, SYSDATE);

INSERT INTO BENEFICIARY_ENROLLMENT VALUES (seq_enrollment_id.NEXTVAL, 5, 1, 'Ayushman Bharat', 
    TO_DATE('2024-09-01', 'YYYY-MM-DD'), 'Applied', 'Y', TO_DATE('2024-09-01', 'YYYY-MM-DD'), NULL, NULL, 0, TO_DATE('2024-09-01', 'YYYY-MM-DD'), NULL, SYSDATE);

INSERT INTO BENEFICIARY_ENROLLMENT VALUES (seq_enrollment_id.NEXTVAL, 6, 6, 'PM-KISAN', 
    TO_DATE('2024-10-01', 'YYYY-MM-DD'), 'Applied', 'Y', TO_DATE('2024-10-01', 'YYYY-MM-DD'), NULL, NULL, 6000, TO_DATE('2024-10-01', 'YYYY-MM-DD'), NULL, SYSDATE);

-- ============================================================================
-- 12. ENROLLMENT GAP ANALYSIS
-- ============================================================================

INSERT INTO ENROLLMENT_GAP_ANALYSIS VALUES (seq_gap_id.NEXTVAL, 1, 3, 1, 2, 24000, 85.5, SYSDATE);

INSERT INTO ENROLLMENT_GAP_ANALYSIS VALUES (seq_gap_id.NEXTVAL, 2, 4, 1, 3, 36000, 75.0, SYSDATE);

INSERT INTO ENROLLMENT_GAP_ANALYSIS VALUES (seq_gap_id.NEXTVAL, 3, 6, 1, 5, 30000, 83.3, SYSDATE);

INSERT INTO ENROLLMENT_GAP_ANALYSIS VALUES (seq_gap_id.NEXTVAL, 4, 1, 2, 2, 120000, 50.0, SYSDATE);

INSERT INTO ENROLLMENT_GAP_ANALYSIS VALUES (seq_gap_id.NEXTVAL, 5, 1, 1, 0, 500000, 0.0, SYSDATE);

-- ============================================================================
-- 13. SCHEME PERFORMANCE METRICS
-- ============================================================================

INSERT INTO SCHEME_PERFORMANCE_METRICS VALUES (seq_metric_id.NEXTVAL, 1, 2500, 1800, 72.0, 21600000, 15.5, 85.0, 4.2, SYSDATE);

INSERT INTO SCHEME_PERFORMANCE_METRICS VALUES (seq_metric_id.NEXTVAL, 3, 1500, 1200, 80.0, 21600000, 18.0, 90.0, 4.5, SYSDATE);

INSERT INTO SCHEME_PERFORMANCE_METRICS VALUES (seq_metric_id.NEXTVAL, 6, 5000, 3500, 70.0, 21000000, 25.0, 75.0, 5.2, SYSDATE);

-- ============================================================================
-- 14. DOMAIN COVERAGE ANALYSIS
-- ============================================================================

INSERT INTO DOMAIN_COVERAGE_ANALYSIS VALUES (seq_coverage_id.NEXTVAL, 5, 1, 11, 2500, 1800, 72.0, 68.0, SYSDATE);

INSERT INTO DOMAIN_COVERAGE_ANALYSIS VALUES (seq_coverage_id.NEXTVAL, 5, 3, 8, 5000, 3500, 70.0, 65.0, SYSDATE);

INSERT INTO DOMAIN_COVERAGE_ANALYSIS VALUES (seq_coverage_id.NEXTVAL, 5, 2, 15, 3000, 2400, 80.0, 75.0, SYSDATE);

INSERT INTO DOMAIN_COVERAGE_ANALYSIS VALUES (seq_coverage_id.NEXTVAL, 5, 4, 9, 1500, 1200, 80.0, 70.0, SYSDATE);

-- ============================================================================
-- 11. COMMIT
-- ============================================================================

COMMIT;

PROMPT ============================================================================
PROMPT Sample Data Inserted Successfully!
PROMPT 4 States + 3 Districts + 2 Blocks + 3 Villages
PROMPT 8 Domains + 17 Schemes + 8 Occupations
PROMPT 9 Beneficiaries + 4 Family Members
PROMPT 4 Awareness Campaigns
PROMPT 6 Enrollments + 5 Gap Analysis
PROMPT 3 Performance Metrics + 4 Coverage Analysis
PROMPT ============================================================================
