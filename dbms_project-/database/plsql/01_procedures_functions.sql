-- ============================================================================
-- STAGE 2: PL/SQL BUSINESS LOGIC
-- Government Scheme Eligibility & Enrollment System
-- Procedures, Functions, and Triggers
-- ============================================================================

-- ============================================================================
-- FUNCTIONS (8+)
-- ============================================================================

-- ============================================================================
-- FUNCTION 1: Calculate Eligibility Score for a Beneficiary-Scheme Pair
-- ============================================================================
CREATE OR REPLACE FUNCTION calculate_eligibility_score(
    p_beneficiary_id NUMBER,
    p_scheme_id NUMBER
) RETURN NUMBER IS
    v_matched_count     NUMBER := 0;
    v_total_count       NUMBER := 0;
    v_score             NUMBER := 0;
    v_beneficiary_age   NUMBER;
    v_beneficiary_income NUMBER;
    v_beneficiary_gender VARCHAR2(1);
    v_beneficiary_occupation_id NUMBER;
    v_beneficiary_bpl   VARCHAR2(1);
    v_beneficiary_land  NUMBER;
    v_marital_status    VARCHAR2(20);
    v_disability_status VARCHAR2(1);
    
BEGIN
    -- Get beneficiary details
    SELECT 
        TRUNC((SYSDATE - date_of_birth) / 365.25),
        annual_income,
        gender,
        occupation_id,
        bpl_status,
        land_holding_acres,
        marital_status,
        disability_status
    INTO 
        v_beneficiary_age, v_beneficiary_income, v_beneficiary_gender,
        v_beneficiary_occupation_id, v_beneficiary_bpl, v_beneficiary_land,
        v_marital_status, v_disability_status
    FROM BENEFICIARY
    WHERE beneficiary_id = p_beneficiary_id;
    
    -- Get all criteria for the scheme
    FOR criteria_rec IN (
        SELECT criteria_id, criteria_type, min_value, max_value, condition_logic
        FROM ELIGIBILITY_CRITERIA
        WHERE scheme_id = p_scheme_id
    ) LOOP
        v_total_count := v_total_count + 1;
        
        -- Check each criterion
        CASE criteria_rec.criteria_type
            WHEN 'Age' THEN
                IF v_beneficiary_age >= TO_NUMBER(criteria_rec.min_value) 
                   AND v_beneficiary_age <= TO_NUMBER(criteria_rec.max_value) THEN
                    v_matched_count := v_matched_count + 1;
                END IF;
                
            WHEN 'Income' THEN
                IF v_beneficiary_income IS NOT NULL 
                   AND v_beneficiary_income <= TO_NUMBER(criteria_rec.max_value) THEN
                    v_matched_count := v_matched_count + 1;
                END IF;
                
            WHEN 'Gender' THEN
                IF criteria_rec.condition_logic LIKE '%' || v_beneficiary_gender || '%'
                   OR v_marital_status IN ('Widow', 'Widower') THEN
                    v_matched_count := v_matched_count + 1;
                END IF;
                
            WHEN 'Occupation' THEN
                IF v_beneficiary_occupation_id = TO_NUMBER(criteria_rec.min_value) THEN
                    v_matched_count := v_matched_count + 1;
                END IF;
                
            WHEN 'BPL' THEN
                IF v_beneficiary_bpl = 'Y' THEN
                    v_matched_count := v_matched_count + 1;
                END IF;
                
            WHEN 'Land' THEN
                IF v_beneficiary_land IS NOT NULL 
                   AND v_beneficiary_land <= TO_NUMBER(criteria_rec.max_value) THEN
                    v_matched_count := v_matched_count + 1;
                END IF;
                
            WHEN 'Disability' THEN
                IF v_disability_status = 'Y' THEN
                    v_matched_count := v_matched_count + 1;
                END IF;
        END CASE;
    END LOOP;
    
    -- Calculate score
    IF v_total_count > 0 THEN
        v_score := ROUND((v_matched_count / v_total_count) * 100, 2);
    END IF;
    
    RETURN v_score;
    
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RETURN 0;
    WHEN OTHERS THEN
        INSERT INTO AUDIT_LOG VALUES (seq_audit_id.NEXTVAL, 'ELIGIBILITY', 'ERROR', 
            p_beneficiary_id, NULL, SQLERRM, USER, SYSDATE);
        COMMIT;
        RETURN 0;
END calculate_eligibility_score;
/

-- ============================================================================
-- FUNCTION 2: Get Enrollment Rate for a Scheme
-- ============================================================================
CREATE OR REPLACE FUNCTION get_enrollment_rate(p_scheme_id NUMBER) RETURN NUMBER IS
    v_eligible_count    NUMBER;
    v_enrolled_count    NUMBER;
    v_enrollment_rate   NUMBER := 0;
BEGIN
    SELECT COUNT(*) INTO v_eligible_count
    FROM ELIGIBILITY_MATCH
    WHERE scheme_id = p_scheme_id AND is_eligible = 'Y';
    
    SELECT COUNT(*) INTO v_enrolled_count
    FROM BENEFICIARY_ENROLLMENT
    WHERE scheme_id = p_scheme_id AND status IN ('Active', 'Approved');
    
    IF v_eligible_count > 0 THEN
        v_enrollment_rate := ROUND((v_enrolled_count / v_eligible_count) * 100, 2);
    END IF;
    
    RETURN v_enrollment_rate;
EXCEPTION
    WHEN OTHERS THEN
        RETURN 0;
END get_enrollment_rate;
/

-- ============================================================================
-- FUNCTION 3: Check Document Completeness
-- ============================================================================
CREATE OR REPLACE FUNCTION check_document_completeness(
    p_beneficiary_id NUMBER,
    p_scheme_id NUMBER
) RETURN VARCHAR2 IS
    v_required_docs     NUMBER;
    v_submitted_docs    NUMBER;
    v_is_complete       VARCHAR2(1) := 'N';
BEGIN
    -- Count mandatory documents for scheme
    SELECT COUNT(*) INTO v_required_docs
    FROM DOCUMENT
    WHERE scheme_id = p_scheme_id AND is_mandatory = 'Y';
    
    -- For this implementation, assume submission is tracked elsewhere
    -- In real system, would check BENEFICIARY_DOCUMENTS table
    SELECT COUNT(*) INTO v_submitted_docs
    FROM DOCUMENT
    WHERE scheme_id = p_scheme_id AND is_mandatory = 'Y'
    AND document_type IN ('Aadhaar', 'Bank Account'); -- Simplified check
    
    IF v_required_docs > 0 AND v_submitted_docs >= v_required_docs THEN
        v_is_complete := 'Y';
    END IF;
    
    RETURN v_is_complete;
EXCEPTION
    WHEN OTHERS THEN
        RETURN 'N';
END check_document_completeness;
/

-- ============================================================================
-- FUNCTION 4: Get Awareness Level
-- ============================================================================
CREATE OR REPLACE FUNCTION get_awareness_level(
    p_beneficiary_id NUMBER,
    p_scheme_id NUMBER
) RETURN VARCHAR2 IS
    v_awareness_status VARCHAR2(20) := 'UNAWARE';
BEGIN
    SELECT awareness_status INTO v_awareness_status
    FROM BENEFICIARY_AWARENESS
    WHERE beneficiary_id = p_beneficiary_id AND scheme_id = p_scheme_id;
    
    RETURN v_awareness_status;
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RETURN 'UNAWARE';
    WHEN OTHERS THEN
        RETURN 'UNAWARE';
END get_awareness_level;
/

-- ============================================================================
-- FUNCTION 5: Calculate Priority Score for Targeted Outreach
-- ============================================================================
CREATE OR REPLACE FUNCTION calculate_priority_score(p_beneficiary_id NUMBER) RETURN NUMBER IS
    v_gap_count             NUMBER := 0;
    v_potential_benefit     NUMBER := 0;
    v_priority_score        NUMBER := 0;
BEGIN
    SELECT 
        COUNT(DISTINCT eg.scheme_id),
        NVL(SUM(ps.max_annual_benefit), 0)
    INTO v_gap_count, v_potential_benefit
    FROM ELIGIBILITY_MATCH em
    JOIN POLICY_SCHEME ps ON em.scheme_id = ps.scheme_id
    LEFT JOIN BENEFICIARY_ENROLLMENT be ON em.beneficiary_id = be.beneficiary_id 
        AND em.scheme_id = be.scheme_id 
        AND be.status IN ('Active', 'Approved')
    WHERE em.beneficiary_id = p_beneficiary_id 
    AND em.is_eligible = 'Y'
    AND be.enrollment_id IS NULL;
    
    -- Priority = gap count * potential benefit / 1000
    v_priority_score := ROUND((v_gap_count * GREATEST(v_potential_benefit, 1)) / 1000, 2);
    
    RETURN LEAST(v_priority_score, 100); -- Cap at 100
EXCEPTION
    WHEN OTHERS THEN
        RETURN 0;
END calculate_priority_score;
/

-- ============================================================================
-- FUNCTION 6: Get Eligibility Status Summary
-- ============================================================================
CREATE OR REPLACE FUNCTION get_eligibility_summary(p_beneficiary_id NUMBER) 
RETURN VARCHAR2 IS
    v_total_schemes     NUMBER := 0;
    v_eligible_schemes  NUMBER := 0;
    v_aware_schemes     NUMBER := 0;
    v_enrolled_schemes  NUMBER := 0;
    v_summary           VARCHAR2(500);
BEGIN
    SELECT 
        COUNT(DISTINCT ps.scheme_id),
        COUNT(DISTINCT CASE WHEN em.is_eligible = 'Y' THEN em.scheme_id END),
        COUNT(DISTINCT CASE WHEN ba.awareness_status IN ('Aware', 'Applied', 'Enrolled') THEN ba.scheme_id END),
        COUNT(DISTINCT CASE WHEN be.status = 'Active' THEN be.scheme_id END)
    INTO v_total_schemes, v_eligible_schemes, v_aware_schemes, v_enrolled_schemes
    FROM POLICY_SCHEME ps
    LEFT JOIN ELIGIBILITY_MATCH em ON ps.scheme_id = em.scheme_id AND em.beneficiary_id = p_beneficiary_id
    LEFT JOIN BENEFICIARY_AWARENESS ba ON ps.scheme_id = ba.scheme_id AND ba.beneficiary_id = p_beneficiary_id
    LEFT JOIN BENEFICIARY_ENROLLMENT be ON ps.scheme_id = be.scheme_id AND be.beneficiary_id = p_beneficiary_id
    WHERE ps.status = 'Active';
    
    v_summary := 'Total:' || v_total_schemes || ',Eligible:' || v_eligible_schemes || 
                 ',Aware:' || v_aware_schemes || ',Enrolled:' || v_enrolled_schemes;
    
    RETURN v_summary;
EXCEPTION
    WHEN OTHERS THEN
        RETURN 'Error';
END get_eligibility_summary;
/

-- ============================================================================
-- PROCEDURES (8+)
-- ============================================================================

-- ============================================================================
-- PROCEDURE 1: Calculate Beneficiary Eligibility (Main Procedure)
-- ============================================================================
CREATE OR REPLACE PROCEDURE calculate_beneficiary_eligibility(
    p_beneficiary_id NUMBER
) IS
    v_cursor_scheme     NUMBER;
    v_score             NUMBER;
    v_is_eligible       VARCHAR2(1);
    v_matched_criteria  NUMBER := 0;
    v_total_criteria    NUMBER := 0;
    
    CURSOR scheme_cursor IS
        SELECT scheme_id FROM POLICY_SCHEME WHERE status = 'Active';
    
BEGIN
    DBMS_OUTPUT.PUT_LINE('Starting eligibility calculation for beneficiary: ' || p_beneficiary_id);
    
    -- Process each active scheme
    FOR scheme_rec IN scheme_cursor LOOP
        v_score := calculate_eligibility_score(p_beneficiary_id, scheme_rec.scheme_id);
        
        IF v_score >= 80 THEN
            v_is_eligible := 'Y';
        ELSE
            v_is_eligible := 'N';
        END IF;
        
        -- MERGE into ELIGIBILITY_MATCH table
        MERGE INTO ELIGIBILITY_MATCH em
        USING DUAL
        ON (em.beneficiary_id = p_beneficiary_id AND em.scheme_id = scheme_rec.scheme_id)
        WHEN MATCHED THEN
            UPDATE SET 
                is_eligible = v_is_eligible,
                eligibility_score = v_score,
                last_recalculated = SYSDATE
        WHEN NOT MATCHED THEN
            INSERT (eligibility_id, beneficiary_id, scheme_id, is_eligible, eligibility_score, calculated_date)
            VALUES (seq_eligibility_id.NEXTVAL, p_beneficiary_id, scheme_rec.scheme_id, v_is_eligible, v_score, SYSDATE);
    END LOOP;
    
    COMMIT;
    DBMS_OUTPUT.PUT_LINE('Eligibility calculation completed');
    
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        INSERT INTO AUDIT_LOG VALUES (seq_audit_id.NEXTVAL, 'BENEFICIARY', 'ERROR', 
            p_beneficiary_id, NULL, SQLERRM, USER, SYSDATE);
        COMMIT;
        DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
END calculate_beneficiary_eligibility;
/

-- ============================================================================
-- PROCEDURE 2: Update Gap Analysis
-- ============================================================================
CREATE OR REPLACE PROCEDURE update_gap_analysis(p_beneficiary_id NUMBER) IS
    v_eligible_count    NUMBER := 0;
    v_enrolled_count    NUMBER := 0;
    v_gap_count         NUMBER := 0;
    v_potential_benefit NUMBER := 0;
    v_priority_score    NUMBER := 0;
BEGIN
    -- Count eligible schemes
    SELECT COUNT(*) INTO v_eligible_count
    FROM ELIGIBILITY_MATCH
    WHERE beneficiary_id = p_beneficiary_id AND is_eligible = 'Y';
    
    -- Count enrolled schemes
    SELECT COUNT(*) INTO v_enrolled_count
    FROM BENEFICIARY_ENROLLMENT
    WHERE beneficiary_id = p_beneficiary_id AND status IN ('Active', 'Approved');
    
    -- Calculate gap
    v_gap_count := v_eligible_count - v_enrolled_count;
    
    -- Calculate potential benefit
    SELECT COALESCE(SUM(ps.max_annual_benefit), 0) INTO v_potential_benefit
    FROM ELIGIBILITY_MATCH em
    JOIN POLICY_SCHEME ps ON em.scheme_id = ps.scheme_id
    WHERE em.beneficiary_id = p_beneficiary_id 
    AND em.is_eligible = 'Y'
    AND NOT EXISTS (
        SELECT 1 FROM BENEFICIARY_ENROLLMENT be
        WHERE be.beneficiary_id = em.beneficiary_id 
        AND be.scheme_id = em.scheme_id 
        AND be.status IN ('Active', 'Approved')
    );
    
    -- Calculate priority score
    v_priority_score := calculate_priority_score(p_beneficiary_id);
    
    -- MERGE into GAP_ANALYSIS table
    MERGE INTO ENROLLMENT_GAP_ANALYSIS ega
    USING DUAL
    ON (ega.beneficiary_id = p_beneficiary_id)
    WHEN MATCHED THEN
        UPDATE SET 
            total_eligible_schemes = v_eligible_count,
            total_enrolled_schemes = v_enrolled_count,
            gap_count = v_gap_count,
            potential_annual_benefit_missed = v_potential_benefit,
            priority_score = v_priority_score,
            calculated_date = SYSDATE
    WHEN NOT MATCHED THEN
        INSERT (gap_id, beneficiary_id, total_eligible_schemes, total_enrolled_schemes, 
                gap_count, potential_annual_benefit_missed, priority_score, calculated_date)
        VALUES (seq_gap_id.NEXTVAL, p_beneficiary_id, v_eligible_count, v_enrolled_count, 
                v_gap_count, v_potential_benefit, v_priority_score, SYSDATE);
    
    COMMIT;
    
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        INSERT INTO AUDIT_LOG VALUES (seq_audit_id.NEXTVAL, 'ENROLLMENT_GAP_ANALYSIS', 'ERROR', 
            p_beneficiary_id, NULL, SQLERRM, USER, SYSDATE);
        COMMIT;
END update_gap_analysis;
/

-- ============================================================================
-- PROCEDURE 3: Generate Campaign Report
-- ============================================================================
CREATE OR REPLACE PROCEDURE generate_campaign_report(
    p_campaign_id NUMBER
) IS
    v_campaign_budget   NUMBER;
    v_beneficiaries_pre NUMBER := 0;
    v_beneficiaries_post NUMBER := 0;
    v_enrollment_pre    NUMBER := 0;
    v_enrollment_post   NUMBER := 0;
    v_roi               NUMBER := 0;
BEGIN
    -- Get campaign budget
    SELECT budget_allocated INTO v_campaign_budget
    FROM AWARENESS_CAMPAIGN
    WHERE campaign_id = p_campaign_id;
    
    -- Get pre-campaign metrics (placeholder - in real system would use historical data)
    v_beneficiaries_pre := 1000;
    v_enrollment_pre := 500;
    
    -- Get post-campaign metrics
    SELECT COUNT(DISTINCT beneficiary_id), COUNT(*)
    INTO v_beneficiaries_post, v_enrollment_post
    FROM BENEFICIARY_AWARENESS
    WHERE awareness_date >= (SELECT start_date FROM AWARENESS_CAMPAIGN WHERE campaign_id = p_campaign_id)
    AND awareness_status IN ('Aware', 'Applied', 'Enrolled');
    
    -- Calculate ROI
    IF v_campaign_budget > 0 THEN
        v_roi := ROUND(((v_enrollment_post - v_enrollment_pre) / v_campaign_budget) * 100, 2);
    END IF;
    
    -- Insert into CAMPAIGN_IMPACT
    INSERT INTO CAMPAIGN_IMPACT VALUES (
        seq_impact_id.NEXTVAL,
        p_campaign_id,
        'Enrollment_Increase',
        v_enrollment_pre,
        v_enrollment_post,
        ROUND(((v_enrollment_post - v_enrollment_pre) / v_enrollment_pre * 100), 2),
        SYSDATE,
        'ROI: ' || v_roi || '%'
    );
    
    COMMIT;
    DBMS_OUTPUT.PUT_LINE('Campaign Report Generated. New Enrollments: ' || (v_enrollment_post - v_enrollment_pre));
    
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
        ROLLBACK;
END generate_campaign_report;
/

-- ============================================================================
-- PROCEDURE 4: Bulk Eligibility Processor (Performance Optimized)
-- ============================================================================
CREATE OR REPLACE PROCEDURE bulk_eligibility_processor(
    p_batch_size NUMBER DEFAULT 1000
) IS
    TYPE t_beneficiary_table IS TABLE OF NUMBER;
    v_beneficiaries t_beneficiary_table;
    v_processed     NUMBER := 0;
    v_start_time    TIMESTAMP := SYSDATE;
BEGIN
    DBMS_OUTPUT.PUT_LINE('Starting bulk eligibility processing...');
    
    -- BULK COLLECT all beneficiary IDs
    SELECT beneficiary_id BULK COLLECT INTO v_beneficiaries
    FROM BENEFICIARY
    WHERE beneficiary_id NOT IN (
        SELECT DISTINCT beneficiary_id FROM ELIGIBILITY_MATCH
        WHERE last_recalculated >= TRUNC(SYSDATE)
    )
    ROWNUM <= p_batch_size;
    
    -- FORALL to process in batch
    FORALL i IN 1..v_beneficiaries.COUNT LOOP
        calculate_beneficiary_eligibility(v_beneficiaries(i));
        update_gap_analysis(v_beneficiaries(i));
    END LOOP;
    
    v_processed := v_beneficiaries.COUNT;
    
    DBMS_OUTPUT.PUT_LINE('Bulk processing completed: ' || v_processed || ' beneficiaries');
    DBMS_OUTPUT.PUT_LINE('Time taken: ' || (SYSDATE - v_start_time) * 24 * 60 || ' minutes');
    
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error in bulk processing: ' || SQLERRM);
        ROLLBACK;
END bulk_eligibility_processor;
/

-- ============================================================================
-- PROCEDURE 5: Update Scheme Performance Metrics
-- ============================================================================
CREATE OR REPLACE PROCEDURE update_scheme_metrics(p_scheme_id NUMBER) IS
    v_eligible      NUMBER;
    v_enrolled      NUMBER;
    v_rate          NUMBER;
    v_benefit_total NUMBER;
    v_avg_approval  NUMBER;
BEGIN
    SELECT 
        COUNT(DISTINCT em.beneficiary_id),
        COUNT(DISTINCT be.beneficiary_id),
        COALESCE(SUM(be.annual_benefit_received), 0),
        ROUND(AVG(CAST(be.approval_date - be.enrollment_date AS NUMBER)), 2)
    INTO v_eligible, v_enrolled, v_benefit_total, v_avg_approval
    FROM ELIGIBILITY_MATCH em
    LEFT JOIN BENEFICIARY_ENROLLMENT be ON em.beneficiary_id = be.beneficiary_id 
        AND em.scheme_id = be.scheme_id AND be.status = 'Active'
    WHERE em.scheme_id = p_scheme_id AND em.is_eligible = 'Y';
    
    v_rate := CASE WHEN v_eligible > 0 THEN (v_enrolled / v_eligible) * 100 ELSE 0 END;
    
    MERGE INTO SCHEME_PERFORMANCE_METRICS spm
    USING DUAL
    ON (spm.scheme_id = p_scheme_id)
    WHEN MATCHED THEN
        UPDATE SET 
            total_eligible = v_eligible,
            total_enrolled = v_enrolled,
            enrollment_rate = v_rate,
            total_benefit_disbursed = v_benefit_total,
            avg_time_to_approval = v_avg_approval,
            calculated_date = SYSDATE
    WHEN NOT MATCHED THEN
        INSERT (metric_id, scheme_id, total_eligible, total_enrolled, enrollment_rate, 
                total_benefit_disbursed, avg_time_to_approval, calculated_date)
        VALUES (seq_metric_id.NEXTVAL, p_scheme_id, v_eligible, v_enrolled, v_rate, 
                v_benefit_total, v_avg_approval, SYSDATE);
    
    COMMIT;
    
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error updating metrics for scheme ' || p_scheme_id || ': ' || SQLERRM);
END update_scheme_metrics;
/

-- Continue in next part...

COMMIT;
PROMPT ============================================================================
PROMPT PL/SQL Functions and Procedures (Part 1) Created Successfully!
PROMPT ============================================================================
